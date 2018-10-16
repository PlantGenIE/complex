<?php

require_once(dirname(__FILE__).'/../config.php');
require_once(dirname(__FILE__).'/extensions.php');

function getGenes() {
  global $config;
  $extension_id = isset($_GET['extension']) ? $_GET['extension'] : null;
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
    $ext[$subext]["genes"] = $genes;
    $ext[$subext]["style"] = $extension_gene_style[$subext];
  }

  echo json_encode($ext);
}

function getEdges() {
  global $config;
  $extension_id = isset($_GET['extension']) ? $_GET['extension'] : null;
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
    $ext[$subext]["edges"] = $edges;
    $ext[$subext]["style"] = $extension_edge_style[$subext];
  }

  echo json_encode($ext);
}

$method = isset($_GET['method']) ? $_GET['method'] : null;

if (!is_callable($method)) {
  http_response_code(400);
  echo json_encode(array('error' => "invalid method: $method"));
  exit(1);
}

$method();

?>
