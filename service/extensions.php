<?php
header('Content-Type: text/html');

/**
 * Extension for Complex
 *
 * Superclass for an extension for Complex. Any extension
 * should inherit from this class.
 */
abstract class Extension {

  public $name;

  /**
   * Extension constructor
   *
   * @param     array $extension_config   config array for the extension,
   *                                      as parsed by from_json()
   */
  public function __construct($extension_config) {
    $this->name = $extension_config->name;
  }

  /**
   * Create an extension from a JSON file
   *
   * @param     string  $json   filename of the JSON file defining
   *                            the extension
   * @param     string  $php    filename of the PHP file with the
   *                            implementation of the extension
   * @return    object  instance of the extension
   */
  public static function from_json($json, $php) {
    $json_content = json_decode(file_get_contents($json));
    if (!$json_content) {
      trigger_error("failed to parse json file: ${json}", E_USER_ERROR);
    }
    require_once($php);
    return new $json_content->{'class_name'}($json_content);
  }
}

/**
 * Extension collection
 *
 * A collection of extensions for Complex.
 */
class Extension_Collection {

  private $extensions = array();

  /**
   * Extension_Collection constructor
   *
   * @param   string  $dir  directory where the extensions are located
   */
  function __construct($dir) {
    $extension_files = $this->get_extensions($dir);
    foreach ($extension_files as $ext) {
      $this->extensions[] = Extension::from_json($ext['json'], $ext['php']);
    }
  }

  /*
   * List existing extensions
   *
   * List the files belonging to existing extensions in $dir
   * and check that both the yaml and the php files exist.
   *
   * @param     string  $dir  directory where the extensions are located
   * @return    array   array of JSON and PHP file names for
   *                    each extension
   */
  private function get_extensions($dir) {
    // Only consider json files in the extension directory as
    // being proper extensions
    $json_files = array_filter(scandir($dir), function($x) {
      return preg_match('/\.json$/', $x);
    });

    $extension_names = array_filter(
      array_unique(
        array_map(function($x) {
          return preg_replace('/\.[^.\s]+$/', '', $x);
        }, $json_files)
      ), function($x) {
        return preg_match('/^[^\.]/', $x);
      });

    $extension_array = array();
    foreach ($extension_names as $x) {
      $extension_array[$x] = array(
        'json' => $dir.'/'.$x.'.json',
        'php' => $dir.'/'.$x.'.php'
      );
    }

    foreach ($extension_array as $ext=>$ext_files) {
      if (!file_exists($ext_files['php'])) {
        trigger_error("invalid extension '${dir}/${ext}': php file missing", E_USER_ERROR);
      }
    }

    return $extension_array;
  }

  public function list_extensions() {
    return array_map(function($x) {
      return $x->name;
    }, $this->extensions);
  }
}

?>
