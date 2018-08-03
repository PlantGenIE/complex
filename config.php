<?php

$config = array();

$config["db"]["host"] = null;
$config["db"]["user"] = null;
$config["db"]["password"] = null;
$config["db"]["database"] = null;
$config["db"]["port"] = 3306;

/**
 * Ignore extensions
 *
 * If the base name of an extension JSON file
 * matches with any of the strings in this array
 * the extension will be ignored.
 */
$config["ignore_extensions"] = array(
  "example"
);

require_once("local_config.php");

?>
