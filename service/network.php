<?php

require_once('../db.php');
require_once('utils.php');

$method = get_post('method', 'get_network');
$network_ids = get_post('network_ids', null);
$active_network = get_post('active_network', null);
$gene_ids = get_post('genes_ids', null);
$gene_names = get_post('gene_names', null);
$threshold = get_post('threshold', null);

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
} else {
  $threshold = floatval($threshold);
}

function get_network($network_ids, $active_id, $gene_names, $gene_ids, $threshold) {
  global $db;

  array_splice(
    $network_ids,
    array_search($active_id, $network_ids),
    1
  );

  // Get the reference network
  $reference_network_query = 'SELECT
      network.id AS network_id,
      network.name AS network_name,
      species.id AS species_id,
      species.sciname AS species_name,
      species.shortname AS species_shortname
    FROM network
    LEFT OUTER JOIN species
      ON species.id = network.species_id
    WHERE network.id = :reference_id';

  $stmt = $db->prepare($reference_network_query);
  $stmt->bindParam(':reference_id', $active_id);
  $stmt->execute();
  $reference_network = $stmt->fetch(PDO::FETCH_ASSOC);

  $return_array = array(
    $reference_network['species_id'] => array(
      'speciesId' => (int) $reference_network['species_id'],
      'speciesName' => $reference_network['species_name'],
      'speciesShort' => $reference_network['species_shortname'],
      'networks' => array(
        $reference_network['network_id'] => array(
          'name' => $reference_network['network_name'],
          'isReference' => true
        )
      )
    )
  );

  // Get the genes in the reference network
  $reference_gene_query = 'SELECT
      id, name
    FROM gene
    WHERE name IN ('.prepare_in('gene', $gene_names).')';
  $stmt = $db->prepare($reference_gene_query);
  $stmt->execute(build_in_array('gene', $gene_names));
  $reference_genes = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $reference_gene_ids = array_map(function($x) { return $x['id']; },
    $reference_genes);

  $reference_nodes = array();
  foreach ($reference_genes as $gene) {
    $reference_nodes[$gene['id']] = array(
      'name' => $gene['name'],
      'orthologs' => array()
    );
  }

  $return_array[$reference_network['species_id']]
    ['networks'][$active_id]['nodes'] = $reference_nodes;

  if (count($network_ids) > 0) {
    // Get the orthologs of the reference genes in the other
    // requested networks.
    $ortholog_query = 'SELECT
        c.gene_id1,
        c.gene_id2,
        g2.name AS gene2_name,
        c.network_id1,
        c.network_id2,
        n.species_id,
        n.name AS network2_name,
        CONCAT(COALESCE(o1.type, ""), COALESCE(o2.type, "")) AS support,
        c.pvalue
      FROM conservation AS c
      INNER JOIN gene AS g2
        ON g2.id = c.gene_id2
      INNER JOIN network AS n
        ON c.network_id2 = n.id
      LEFT OUTER JOIN orthology AS o1
        ON o1.gene_id1 = c.gene_id1 AND o1.gene_id2 = c.gene_id2 
      LEFT OUTER JOIN orthology AS o2
        ON o2.gene_id1 = c.gene_id2 AND o2.gene_id2 = c.gene_id1
      WHERE network_id1 = :reference_network
        AND network_id2 IN ('.
          prepare_in('network', $network_ids).')
        AND c.gene_id1 IN ('.
          prepare_in('gene', $reference_gene_ids).')';

    $stmt = $db->prepare($ortholog_query);
    $stmt->execute(array_merge(
      array(':reference_network' => $active_id),
      build_in_array('network', $network_ids),
      build_in_array('gene', $reference_gene_ids)
    ));
    $orthologs = $stmt->fetchAll(PDO::FETCH_ASSOC);
  } else {
    $orthologs = array();
  }

  // Add the orthologs and collect conservation statistics.
  $ortholog_conservation = array();
  foreach ($orthologs as $o) {
    $return_array[$reference_network['species_id']]
      ['networks'][$active_id]['nodes'][$o['gene_id1']]
      ['orthologs'][$o['gene_id2']] = array(
        'speciesId' => (int) $o['species_id'],
        'conservation' => array(),
        'methods' => explode(',', $o['support'])
      );
    $ortholog_conservation[$o['gene_id1']][$o['gene_id2']][$o['network_id2']] = (double) $o['pvalue'];
  }

  // Add the conservation statistics
  foreach ($ortholog_conservation as $refgene => $oarr) {
    foreach ($oarr as $ogene => $ostats) {
      foreach ($ostats as $network => $pvalue) {
        $return_array[$reference_network['species_id']]
          ['networks'][$active_id]['nodes'][$refgene]
          ['orthologs'][$ogene]['conservation'][] = array(
            'networkId' => (int) $network,
            'pvalue' => (double) $pvalue
          );
      }
    }
  }

  // Get the edges in the reference network.
  $reference_edges_query = 'SELECT
      gene_id1,
      gene_id2,
      score
    FROM network_score
    WHERE network_id = :reference_network
      AND score > :coexpression_threshold
      AND gene_id1 IN ('.prepare_in('gene', $reference_gene_ids).')
      AND gene_id2 IN ('.prepare_in('gene', $reference_gene_ids).')';

  $stmt = $db->prepare($reference_edges_query);
  $stmt->execute(array_merge(
    array(
      ':reference_network' => $active_id,
      ':coexpression_threshold' => $threshold),
    build_in_array('gene', $reference_gene_ids)
  ));
  $reference_edges = $stmt->fetchAll(PDO::FETCH_ASSOC);

  foreach ($reference_edges as $edge) {
    $return_array[$reference_network['species_id']]
      ['networks'][$active_id]['edges'][] = array(
        'source' => (int) $edge['gene_id1'],
        'target' => (int) $edge['gene_id2'],
        'score' => (double) $edge['score'],
        'directed' => false // Placeholder for potential future use
      );
  }

  // Set up the nodes in the other networks.
  // First get the species
  if (count($network_ids) > 0) {
    $network_query = 'SELECT
        species.id AS species_id,
        species.sciname,
        species.shortname
      FROM network
      INNER JOIN species
        ON network.species_id = species.id
      WHERE network.id IN ('.prepare_in('network', $network_ids).')';

    $stmt = $db->prepare($network_query);
    $stmt->execute(build_in_array('network', $network_ids));
    $species = $stmt->fetchAll(PDO::FETCH_ASSOC);
  } else {
    $species = array();
  }

  foreach ($species as $s) {
    $return_array[$s['species_id']] = array(
      'speciesId' => (int) $s['species_id'],
      'speciesName' => $s['sciname'],
      'speciesShort' => $s['shortname'],
      'networks' => array()
    );
  }

  $species_ortholog = array();
  foreach ($orthologs as $o) {
    // Basic network info
    if (!array_key_exists($o['network_id2'],
        $return_array[$o['species_id']]['networks'])) {
      $return_array[$o['species_id']]['networks'][$o['network_id2']] = array(
        'name' => $o['network2_name'],
        'isReference' => false
      );
    }
    // Network nodes
    $return_array[$o['species_id']]['networks']
      [$o['network_id2']]['nodes'][$o['gene_id2']] = array(
        'name' => $o['gene2_name']
      );
    $species_ortholog[$o['species_id']][$o['network_id2']][] = (int) $o['gene_id2'];
  }

  // Get edges within the ortholog networks
  foreach ($species_ortholog as $sid => $network_ortholog) {
    foreach ($network_ortholog as $nid => $orthologs) {
      $ortholog_edge_query = 'SELECT
          gene_id1 AS source,
          gene_id2 AS target,
          score AS score,
          0 AS directed
        FROM network_score
        WHERE network_id = :network_id
          AND score > :coexpression_threshold
          AND gene_id1 IN ('.prepare_in('gene', $orthologs).')
          AND gene_id2 IN ('.prepare_in('gene', $orthologs).')';
      $stmt = $db->prepare($ortholog_edge_query);
      $stmt->execute(array_merge(
        array(':network_id' => $nid, ':coexpression_threshold' => $threshold),
        build_in_array('gene', $orthologs)
      ));
      $ortholog_edges = $stmt->fetchAll(PDO::FETCH_ASSOC);
      foreach ($ortholog_edges as $edge) {
        $return_array[$sid]['networks'][$nid]['edges'][] = array(
          'source' => (int) $edge['source'],
          'target' => (int) $edge['target'],
          'score' => (double) $edge['score'],
          'directed' => (bool) $edge['directed']
        );
      }
    }
  }

  echo json_encode(array_values($return_array), JSON_PRETTY_PRINT);
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
