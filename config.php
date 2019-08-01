<?php

/**
 * Complex config
 * ==============
 *
 * Do not edit this file directly. Instead, modify any parameters using
 * the file `local_config.php` instead. If this file does not exist, then
 * make it a copy of this file and remove everything below the comment that
 * says "COPY UNTIL HERE". Since this file will contain passwords, make
 * sure to set as restrictive permissions as possible.
 */

$config = array();

/**
 * ========
 * Database
 * ========
 *
 * MySQL database settings.
 *
 * Variables
 * ---------
 * host     - IP or URL to the database server.
 * user     - Username.
 * password - Password associated with the username.
 * database - Database name.
 * port     - Port on the server to access.
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
 * Controls network visualisation extensions.
 *
 * Variables
 * ---------
 * enabled           - Boolean controlling whether extensions are
 *                     enabled or not.
 * dir               - Directory where extension files are stored.
 * active_extensions - Array of names of extensions that should be
 *                     enabled. If the base name of an extension
 *                     JSON file matches with any of the strings in
 *                     this array, the extension will be active.
 */
$config["extensions"]["enabled"] = false;
$config["extensions"]["dir"] = dirname(__FILE__).'/extensions';
$config["extensions"]["active_extensions"] = array();

/**
 * ===========
 * Annotations
 * ===========
 *
 * gofer2 settings
 * ---------------
 * gofer2 is used for fetching gene annotations.
 * See https://github.com/bschiffthaler/gofer2.
 *
 * Variables
 * ---------
 * enabled - Boolean to decide whether gofer2 should be used or not.
 * url     - The url to the gofer2 API, including port.
 */
$config["gofer2"]["enabled"] = false;
$config["gofer2"]["url"] = null;

/**
 * GenIE API settings
 * ------------------
 * Settings controlling what GenIE instances should be used for
 * managing gene lists, amongst other things.
 *
 * Variables
 * ---------
 * url       - URL to the GenIE API.
 * instances - An array of arrays of GenIE instances that are available.
 *             Each instance should have the keys species (full species
 *             name), name (MySQL table name), code (short species name),
 *             and defaultLists. defaultLists is an array of arrays of
 *             gene lists that always should be available in Complex.
 *             Each entry should have the keys gene_basket_name (name of
 *             the gene list) and gene_list (a comma-separated list of
 *             genes).
 *
 *             Example of a single instance:
 *             array(
 *               array(
 *                 "species" => "Arabidopsis thaliana", // species name
 *                 "name" => "atgenie", // database name
 *                 "code" => "artha", // short species identifier
 *                 "defaultLists" => array( // default lists to show in Complex
 *                   array(
 *                     "gene_basket_name" => "Example",
 *                     "gene_list" => "AT1G06590, AT1G15570, AT1G34065"
 *                   )
 *                 )
 *               )
 *             )
 */
$config["genie"]["url"] = null;
$config["genie"]["instances"] = array();

/********************************************
 *                                          *
 *            COPY UNTIL HERE               *
 *                                          *
 * and don't forget to close the php tag... *
 *                                          *
 ********************************************/

/**
 * Include local config file that can be used to override settings in
 * this file.
 */
require_once("local_config.php");

/**
 * Save relevant parts of the config to a JSON file, if requested.
 */
if (isset($_GET["init"])) {
  file_put_contents(
    "config.json",
    json_encode(array(
      "gofer2" => $config["gofer2"],
      "genie" => $config["genie"],
      "extensions" => $config["extensions"])
    )
  );
}

?>
