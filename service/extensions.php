<?php
header('Content-Type: text/html');

require_once(dirname(__FILE__).'/../db.php');

/**
 * Extension for Complex
 *
 */
class Extension {

  public $name;
  public $id;
  public $subextensions;
  private $gene_table_names;
  private $edge_table_names;
  private $gene_style;
  private $edge_style;

  /**
   * Extension constructor
   *
   * @param     array $extension_config   config array for the extension,
   *                                      as parsed by from_json()
   */
  public function __construct($extension_config) {
    $this->id = $extension_config->id;
    $this->name = $extension_config->name;
    $this->description = $extension_config->description;
    $this->gene_table_names = is_null($extension_config->gene_style) ?
      null : array_keys(get_object_vars($extension_config->gene_style));
    $this->edge_table_names = is_null($extension_config->edge_style) ?
      null : array_keys(get_object_vars($extension_config->edge_style));

    $this->subextensions = (array)$extension_config->subextensions;

    foreach ((array)$extension_config->gene_style as $subext => $style) {
      $this->gene_style[$subext] = (array)$style;
    }
    foreach ((array)$extension_config->edge_style as $subext => $style) {
      $this->edge_style[$subext] = (array)$style;
    }
  }

  /**
   * Create an extension from a JSON file
   *
   * @param     string  $json   filename of the JSON file defining
   *                            the extension
   * @return    object  instance of the extension
   */
  public static function from_json($json) {
    $json_content = json_decode(file_get_contents($json));
    if (!$json_content) {
      trigger_error("failed to parse json file: ${json}", E_USER_ERROR);
    }
    return new Extension($json_content);
  }

  public static function from_id($extension_id) {
    global $config;
    return Extension::from_json($config['extensions']['dir'].'/'.$extension_id.'.json');
  }

  public function get_genes() {
    global $db;
    $genes = array();
    foreach ($this->gene_table_names as $gene_ext) {
      $query = "SELECT
          gene_id
        FROM gene_extension
        WHERE extension_name = :ext";

      $stmt = $db->prepare($query);
      $stmt->bindParam(':ext', $gene_ext);
      $stmt->execute();
      $str_genes = $stmt->fetchAll(PDO::FETCH_COLUMN);
      $genes[$gene_ext] = array_map("intval", $str_genes);
    }
    return $genes;
  }

  public function get_edges() {
    global $db;
    $edges = array();
    foreach ($this->edge_table_names as $edge_ext) {
      $query = "SELECT
          gene_id1,
          gene_id2,
          network_id1,
          network_id2
        FROM edge_extension
        WHERE extension_name = :ext";

      $stmt = $db->prepare($query);
      $stmt->bindParam(':ext', $edge_ext);
      $stmt->execute();
      $edges[$edge_ext] = array();
      while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $edges[$edge_ext][] = array_map('intval', $row);
      }
    }
    return $edges;
  }

  public function get_gene_style() {
    return $this->gene_style;
  }

  public function get_edge_style() {
    return $this->edge_style;
  }
}

/**
 * Extension collection
 *
 * A collection of extensions for Complex.
 */
class Extension_Collection implements Iterator {

  private $position = 0;
  private $extensions = array();

  /**
   * Extension_Collection constructor
   *
   */
  public function __construct() {
    global $config;
    $this->position = 0;
    $extension_files = $this->get_extensions($config['extensions']['dir']);
    foreach ($extension_files as $extjson) {
      $this->extensions[] = Extension::from_json($extjson);
    }
  }

  public function rewind() {
    $this->position = 0;
  }

  public function current() {
    return $this->extensions[$this->position];
  }

  public function key() {
    return $this->extensions[$this->position]->name;
  }

  public function next() {
    ++$this->position;
  }

  public function is_empty() {
    return empty($this->extensions);
  }

  public function valid() {
    return isset($this->extensions[$this->position]);
  }

  /*
   * List existing extensions
   *
   * List the files belonging to existing extensions in $dir
   * and check that both the yaml and the php files exist.
   *
   * @param     string  $dir  directory where the extensions are located
   * @return    array   array of JSON file names for the extensions
   */
  private function get_extensions($dir) {
    global $config;
    // Only consider json files in the extension directory as
    // being proper extensions
    $json_files = array_filter(scandir($dir), function($x) {
      return preg_match('/\.json$/', $x);
    });

    $extension_names = array_intersect(array_filter(
      array_unique(
        array_map(function($x) {
          return preg_replace('/\.[^.\s]+$/', '', $x);
        }, $json_files)
      ), function($x) {
        return preg_match('/^[^\.]/', $x);
      }), $config['extensions']['active_extensions']);

    $extension_array = array_map(function($x) use (&$dir) {
      return $dir.'/'.$x.'.json';
    }, $extension_names);

    return $extension_array;
  }

  public function list_extensions() {
    return array_map(function($x) {
      return $x->name;
    }, $this->extensions);
  }
}

?>
