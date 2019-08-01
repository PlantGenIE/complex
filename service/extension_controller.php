<?php

require_once(dirname(__FILE__).'/../config.php');
require_once(dirname(__FILE__).'/extensions.php');

/**
 * Get extension nodes
 *
 * Get nodes associated with an extension. The GET variable `extension` must
 * be set, and the `genes` GET variable can be optionally set. If it is,
 * the resulting nodes will be the intersection of this subset of genes.
 */
function getGenes() {
  global $config;
  $extension_id = isset($_POST['extension']) ? $_POST['extension'] : null;
  $gene_subset = isset($_POST['genes']) ? $_POST['genes'] : null;
  if (is_null($extension_id)) {
    http_response_code(400);
    echo json_encode(array('error' => 'no extension given'));
    exit(1);
  }

  $extension = Extension::from_id($extension_id);

  $extension_genes = $extension->get_genes();
  $extension_gene_style = $extension->get_gene_style();

  $ext = array();
  foreach ($extension_genes as $subext => $genes) {
    if (!is_null($gene_subset)) {
      $ext[$subext]['genes'] = array_values(array_intersect($genes, $gene_subset));
    } else {
      $ext[$subext]['genes'] = $genes;
    }
    $ext[$subext]['style'] = $extension_gene_style[$subext];
  }

  echo json_encode($ext);
}

/**
 * Get extension edges
 *
 * Get edges associated with an extension. The GET variable `extension` must
 * be set, and the `genes` GET variable can be optionally set. If it is,
 * the resulting edges will be a subset of edges that can be found among
 * that set of genes.
 */
function getEdges() {
  global $config;
  $extension_id = isset($_POST['extension']) ? $_POST['extension'] : null;
  $gene_subset = isset($_POST['genes']) ? $_POST['genes'] : null;
  if (is_null($extension_id)) {
    http_response_code(400);
    echo json_encode(array('error' => 'no extension given'));
    exit(1);
  }

  $extension = Extension::from_id($extension_id);

  $extension_edges = $extension->get_edges();
  $extension_edge_style = $extension->get_edge_style();

  $ext = array();
  foreach ($extension_edges as $subext => $edges) {
    if (!is_null($gene_subset)) {
      foreach ($edges as $e) {
        if (in_array($e[0], $gene_subset) && in_array($e[1], $gene_subset)) {
          $ext[$subext]['edges'][] = $e;
        }
      }
    } else {
      $ext[$subext]['edges'] = $edges;
    }
    $ext[$subext]['style'] = $extension_edge_style[$subext];
  }

  echo json_encode($ext);
}

$method = isset($_POST['method']) ? $_POST['method'] : null;

if (!is_callable($method)) {
  http_response_code(400);
  echo json_encode(array('error' => "invalid method: $method"));
  exit(1);
}

$method();

?>
