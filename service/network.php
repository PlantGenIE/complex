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

function get_network($network_ids, $active_id, $gene_names, $threshold) {
  global $db;

  $network_name_query = 'SELECT id, name FROM network WHERE id IN ('.prepare_in('network', $network_ids).')';
  $stmt = $db->prepare($network_name_query);
  $stmt->execute(build_in_array('network', $network_ids));
  $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $networks = array();
  foreach ($res as $n) {
    $networks[$n['id']] = $n['name'];
  }

  $gene_query = 'SELECT id, name FROM gene WHERE name IN ('.prepare_in('gene', $gene_names).')';
  $stmt = $db->prepare($gene_query);
  $stmt->execute(build_in_array('gene', $gene_names));
  $genes = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $gene_ids = array_map(function($x) { return $x['id']; }, $genes);

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
        'classes' => 'network-node active',
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
      )
    );
  }, $active_edges);

  // Get orthologs in the other selected networks
  foreach ($network_ids as $id) {
    if ($id == $active_id) {
      continue;
    }
    $species_query = 'SELECT species_id FROM network WHERE id = :network_id';
    $stmt = $db->prepare($species_query);
    $stmt->execute(array(':network_id' => $id));
    $species_id = $stmt->fetch(PDO::FETCH_COLUMN);
    
    $gene_query = 'SELECT gene_id2 AS gene_id, g2.name AS gene_name
      FROM orthology
      LEFT OUTER JOIN gene AS g2
        ON g2.id = gene_id2
      WHERE gene_id1 IN ('.prepare_in('gene', $gene_ids).')
        AND g2.species_id = :species_id';

    $params = array_merge(
      array(':species_id' => $species_id),
      build_in_array('gene', $gene_ids)
    );
    
    $stmt = $db->prepare($gene_query);
    $stmt->execute($params);
    $ortho_genes1 = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $gene_query2 = 'SELECT gene_id1 AS gene_id, g1.name AS gene_name
      FROM orthology
      LEFT OUTER JOIN gene AS g1
        ON g1.id = gene_id1
      WHERE gene_id2 IN ('.prepare_in('gene', $gene_ids).')
        AND g1.species_id = :species_id';

    $stmt = $db->prepare($gene_query);
    $stmt->execute($params);
    $ortho_genes2 = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $ortho_genes = array();
    foreach ($ortho_genes1 as $g) {
      $ortho_genes[$g['gene_id']] = array('gene_name' => $g['gene_name'], 'gene_id' => $g['gene_id']);
    }
    foreach ($ortho_genes2 as $g) {
      $ortho_genes[$g['gene_id']] = array('gene_name' => $g['gene_name'], 'gene_id' => $g['gene_id']);
    }
    $ortho_gene_ids = array_keys($ortho_genes);

    // Get the edges among these genes
    $edge_query = 'SELECT gene_id1, gene_id2, score
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
          'classes' => 'network-node',
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

          )
        );
      }, $ortho_edges)
    );
  }

  echo json_encode(array('nodes' => $nodes, 'edges' => $edges));
}

function expand() {

}

switch ($method) {
  case 'get_network':
    get_network($network_ids, $active_network, $gene_names, $threshold);
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
