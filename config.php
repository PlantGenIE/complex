<?php

$config = array();

$config["db"]["host"] = null;
$config["db"]["user"] = null;
$config["db"]["password"] = null;
$config["db"]["database"] = null;
$config["db"]["port"] = 3306;

/**
 * Active extensions
 *
 * If the base name of an extension JSON file
 * matches with any of the strings in this array
 * the extension will be active.
 */
$config["active_extensions"] = array();

$config["extension_dir"] = dirname(__FILE__).'/extensions';

require_once("local_config.php");

?>
