<?php

require_once('../db.php');

$method = isset($_POST['method']) ? $_POST['method'] : 'get_network';
$network_ids = isset($_POST['network_ids']) ? $_POST['network_ids'] : null;
$active_network = isset($_POST['active_network']) ? $_POST['active_network'] : null;
$gene_ids = isset($_POST['gene_ids']) ? $_POST['gene_ids'] : null;
$gene_names = isset($_POST['gene_names']) ? $_POST['gene_names'] : null;
$threshold = isset($_POST['threshold']) ? floatval($_POST['threshold']) : null;

if (is_null($network_ids)) {
  http_response_code(400);
  echo json_encode(array('error' => 'no network id given'));
  exit(1);
}

if (is_null($active_network)) {
  http_response_code(400);
  echo json_encode(array('error' => 'there is no active network'));
  exit(1);
}

if (is_null($gene_ids) && is_null($gene_names)) {
  http_response_code(400);
  echo json_encode(array('error' => 'no gene ids or names given'));
  exit(1);
}

if (is_null($threshold)) {
  http_response_code(400);
  echo json_encode(array('error' => 'no threshold specified'));
  exit(1);
}

function get_network($network_ids, $active_id, $gene_names, $gene_ids, $threshold) {
  global $db;

  $network_name_query = 'SELECT id, name FROM network WHERE id IN ('.prepare_in('network', $network_ids).')';
  $stmt = $db->prepare($network_name_query);
  $stmt->execute(build_in_array('network', $network_ids));
  $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $networks = array();
  foreach ($res as $n) {
    $networks[$n['id']] = $n['name'];
  }

  if (is_null($gene_ids)) {
    $gene_query = 'SELECT id, name FROM gene WHERE name IN ('.prepare_in('gene', $gene_names).')';
    $stmt = $db->prepare($gene_query);
    $stmt->execute(build_in_array('gene', $gene_names));
  } else {
    $gene_query = 'SELECT id, name FROM gene WHERE id IN ('.prepare_in('gene_id', $gene_ids).')';
    $stmt = $db->prepare($gene_query);
    $stmt->execute(build_in_array('gene_id', $gene_ids));
  }
  $genes = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $gene_ids = array_map(function($x) { return $x['id']; }, $genes);

  // Get the orthologs in the other networks
  $network_orthologs = array();
  $ortholog_edges = array();
  foreach ($network_ids as $id) {
    if ($id === $active_id) {
      continue;
    }

    $ortho_query = 'SELECT
        c.gene_id1 AS g1,
        c.gene_id2 AS g2,
        g2.name AS g2_name,
        c.pvalue AS pvalue,
        CONCAT(COALESCE(o1.type, ""), COALESCE(o2.type, "")) AS support
      FROM conservation AS c
      LEFT OUTER JOIN gene AS g2
        ON g2.id = c.gene_id2
      LEFT OUTER JOIN orthology AS o1
        ON o1.gene_id1 = c.gene_id1 AND o1.gene_id2 = c.gene_id2
      LEFT OUTER JOIN orthology AS o2
        ON o2.gene_id1 = c.gene_id2 AND o2.gene_id2 = c.gene_id1
      WHERE c.network_id2 = :network_id
        AND c.network_id1 = :active_network_id
        AND c.gene_id1 IN ('.prepare_in('gene', $gene_ids).')';

    $params = array_merge(
      array(':network_id' => $id, ':active_network_id' => $active_id),
      build_in_array('gene', $gene_ids)
    );

    $stmt = $db->prepare($ortho_query);
    $stmt->execute($params);
    $ortho_res = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($ortho_res as $or) {
      $network_orthologs[$id][$or['g2']] = array(
        'gene_id' => $or['g2'],
        'gene_name' => $or['g2_name']
      );
      $ortho_methods = explode(',', $or['support']);
      foreach ($ortho_methods as $om) {
        $ortholog_edges[] = array(
          'group' => 'edges',
          'data' => array(
            'source' => $or['g1'],
            'target' => $or['g2'],
            'conservation_pvalue' => $or['pvalue'],
            'support' => $om
          ),
          'classes' => 'orthology'
        );
      }
    }
  }

  $params = array_merge(
    array(':network_id' => $active_id, ':threshold' => $threshold),
    build_in_array('gene', $gene_ids)
  );

  $query = 'SELECT gene_id1, g1.name AS gene1, gene_id2, g2.name AS gene2, score
    FROM network_score
    LEFT OUTER JOIN gene AS g1
      ON g1.id = gene_id1
    LEFT OUTER JOIN gene AS g2
      ON g2.id = gene_id2
    WHERE network_id = :network_id
      AND gene_id1 IN ('.prepare_in('gene', $gene_ids).')
      AND gene_id2 IN ('.prepare_in('gene', $gene_ids).')
      AND score > :threshold';

  $stmt = $db->prepare($query);
  $stmt->execute($params);
  $active_edges = $stmt->fetchAll(PDO::FETCH_ASSOC);

  $nodes = array_merge(
    array(
      array(
        'group' => 'nodes',
        'data' => array(
          'id' => 'network'.$active_id,
          'label' => $networks[$active_id]
        ),
        'classes' => 'network active',
        'selectable' => false
      )
    ),
    array_map(function($x) use (&$active_id) {
      return array(
        'group' => 'nodes',
        'data' => array(
          'id' => intval($x['id']),
          'label' => $x['name'],
          'parent' => 'network'.$active_id
        ),
        'classes' => 'gene'
      );
    }, $genes)
  );

  $edges = array_map(function($x) {
    return array(
      'group' => 'edges',
      'data' => array(
        'source' => intval($x['gene_id1']),
        'target' => intval($x['gene_id2']),
        'weight' => floatval($x['score'])
      ),
      'classes' => 'co-expression'
    );
  }, $active_edges);

  // Get the edges among the orthologs in the other selected networks
  foreach ($network_orthologs as $id => $ortho_genes) {
    if ($id == $active_id) {
      continue;
    }

    $ortho_gene_ids = array_keys($ortho_genes);

    $edge_query = 'SELECT
        gene_id1,
        gene_id2,
        score
      FROM network_score
      WHERE network_id = :network_id
        AND gene_id1 IN ('.prepare_in('gene', $ortho_gene_ids).')
        AND gene_id2 IN ('.prepare_in('gene', $ortho_gene_ids).')
        AND score > :threshold';

    $params = array_merge(
      array(':network_id' => $id, ':threshold' => $threshold),
      build_in_array('gene', $ortho_gene_ids)
    );

    $stmt = $db->prepare($edge_query);
    $stmt->execute($params);
    $ortho_edges = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $nodes = array_merge(
      $nodes,
      array(
        array(
          'group' => 'nodes',
          'data' => array(
            'id' => 'network'.$id,
            'label' => $networks[$id]
          ),
          'classes' => 'network',
          'selectable' => false
        )
      ), array_map(function($x) use (&$id) {
        return array(
          'group' => 'nodes',
          'data' => array(
            'id' => intval($x['gene_id']),
            'label' => $x['gene_name'],
            'parent' => 'network'.$id
          ),
          'classes' => 'gene'
        );
      }, $ortho_genes)
    );

    $edges = array_merge(
      $edges,
      array_map(function($x) {
        return array(
          'group' => 'edges',
          'data' => array(
            'source' => intval($x['gene_id1']),
            'target' => intval($x['gene_id2']),
            'weight' => floatval($x['score'])
          ),
          'classes' => 'co-expression'
        );
      }, $ortho_edges)
    );
  }

  echo json_encode(array('nodes' => $nodes, 'edges' => array_merge($edges, $ortholog_edges)));
}

function expand() {

}

switch ($method) {
  case 'get_network':
    get_network($network_ids, $active_network, $gene_names, $gene_ids, $threshold);
    break;
  case 'expand':
    expand();
    break;
  default:
    http_response_code(400);
    echo json_encode(array('error' => 'invalid method '.$method));
    exit(1);
    break;
}

?>
