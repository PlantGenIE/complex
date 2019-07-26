<?php

/**
 * Complex config
 * ==============
 *
 * Do not edit this file directly. Instead, modify any parameters using
 * the file `local_config.php` instead. If this file does not exist, then
 * make it a copy of this file. Since this file will contain passwords,
 * make sure to set as restrictive permissions as possible.
 */

$config = array();

/**
 * ========
 * Database
 * ========
 */
$config["db"]["host"] = null;
$config["db"]["user"] = null;
$config["db"]["password"] = null;
$config["db"]["database"] = null;
$config["db"]["port"] = 3306;

/**
 * ==========
 * Extensions
 * ==========
 *
 * Extension directory
 * -------------------
 *
 * Where extension files are stored.
 */
$config["extension_dir"] = dirname(__FILE__).'/extensions';

/**
 * Active extensions
 * -----------------
 *
 * If the base name of an extension JSON file
 * matches with any of the strings in this array
 * the extension will be active.
 */
$config["active_extensions"] = array();

/**
 * ===========
 * Annotations
 * ===========
 *
 * gofer2 settings
 * ---------------
 */
$config["gofer2"]["enabled"] = false;
$config["gofer2"]["url"] = null;

/**
 * GenIE API settings
 * ------------------
 */
$config["genie"]["url"] = null;
$config["genie"]["instances"] = array();

require_once("local_config.php");

if (isset($_GET["init"])) {
  file_put_contents(
    "config.json",
    json_encode(array("gofer2" => $config["gofer2"],
                      "genie" => $config["genie"]))
  );
}

?>
