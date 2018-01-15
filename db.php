<?php
require_once("config.php");

try {
    $db = new PDO('mysql:dbname='.$config['db']['database'].';host='.$config['db']['host'],
        $config['db']['user'],
        $config['db']['password']);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Connection failed: '.$e->getMessage();
}

$spNames = array("pt" => "P. tremula", "at" => "A. thaliana", "os" => "Z. mays");

$tmp_op = isset($_POST['op']) ? $_POST['op'] : null;
$tmp_op = isset($_GET['op']) ? $_GET['op'] : $tmp_op;

$tmp_selG = isset($_POST['selG']) ? trim($_POST['selG']) : null;
$tmp_allG = isset($_POST['allG']) ? trim($_POST['allG']) : null;
$tmp_thexp = isset($_POST['thexp']) ? trim($_POST['thexp']) : null;

$sink1 = isset($_POST['sink1']) ? $_POST['sink1'] : null;
$sink2 = isset($_POST['sink2']) ? $_POST['sink2'] : null;

$tmp_sp = isset($_POST['sp']) ? trim($_POST['sp']) : null;

$tmp_sp1 = isset($_POST['sp1']) ? trim($_POST['sp1']) : null;
$tmp_th1 = isset($_POST['th1']) ? trim($_POST['th1']) : null;
$tmp_consth1 = isset($_POST['consth1']) ? (float)($_POST['consth1']) : null;

$tmp_sp2 = isset($_POST['sp2']) ? trim($_POST['sp2']) : null;
$tmp_th2 = isset($_POST['th2']) ? trim($_POST['th2']) : null;
$tmp_consth2 = isset($_POST['consth2']) ? (float)($_POST['consth2']) : null;

$tmp_showN = isset($_POST['view_state']) ? $_POST['view_state'] : 'align';
$tmp_showN = isset($_GET['view_state']) ? $_GET['view_state'] : 'align';

$debug = isset($_GET['debug']) && $_GET['debug'] === 'true';

$vowelss = array(",", ";", "\t", "\n", "\r", "s+", " ",",,");
$post_inputs=preg_replace("/\s+/", ",", trim(htmlentities($tmp_selG)));
$onlyconsonantss = strtolower(str_replace($vowelss, ",", $post_inputs));
$geneids_arrays = explode(",", $onlyconsonantss);
$geneids_array_strs = implode('","', $geneids_arrays);
$gsel1 = $geneids_arrays;

$vowels = array(",", ";", "\t", "\n", "\r", "s+", " ", ",,");
$post_input = preg_replace("/\s+/", ",", trim(htmlentities($sink1)));
$onlyconsonants = strtolower(str_replace($vowels, ",", $post_input));
$geneids_array = explode(",", $onlyconsonants);
$geneids_array_str = implode('","', $geneids_array);
$gstr1='"'.$geneids_array_str.'"';

$vowels = array(",", ";", "\t", "\n", "\r", "s+", " ", ",,");
$post_input_2 = preg_replace("/\s+/", ",", trim(htmlentities($sink2)));
$onlyconsonants_2 = strtolower(str_replace($vowels, ",", $post_input_2));
$geneids_array_2 = explode(",", $onlyconsonants_2);

$geneids_array_2_str = implode('","',$geneids_array_2);
$gstr2 = '"'.$geneids_array_2_str.'"';

$tmp_th2 = $tmp_th1;

$tmp_consth2 = $tmp_consth1;

if (($tmp_sp1 == 'pt') and ($tmp_sp2 == 'at')) $tabln = 'ptat';
if (($tmp_sp1 == 'at') and ($tmp_sp2 == 'pt')) $tabln = 'ptat';
if (($tmp_sp1 == 'pt') and ($tmp_sp2 == 'os')) $tabln = 'ptos';
if (($tmp_sp1 == 'os') and ($tmp_sp2 == 'pt')) $tabln = 'ptos';
if (($tmp_sp1 == 'at') and ($tmp_sp2 == 'os')) $tabln = 'atos';
if (($tmp_sp1 == 'os') and ($tmp_sp2 == 'at')) $tabln = 'atos';

?>
