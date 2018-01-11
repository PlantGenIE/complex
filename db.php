<?php
require_once("config.php");

try {
    $db = new PDO('mysql:dbname='.$config['db']['database'].';host='.$config['db']['host'],
        $config['db']['user'],
        $config['db']['password']);
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


 if($debug==true){
	 if($_GET['selG']==""){
//$_POST['selG']="At4g18780,At5g16910";

$_POST['selG']="Potri.001G266400,Potri.004G059600,Potri.005G027600,Potri.005G194200,Potri.006G052600,Potri.006G181900,Potri.006G251900,Potri.009G060800,Potri.013G082200,Potri.016G054900,Potri.018G029400,Potri.019G049700,Potri.001G120000,Potri.001G448400,Potri.002G178700,Potri.003G113000,Potri.005G116800,Potri.007G014400,Potri.008G080000,Potri.010G176600,Potri.011G153300,Potri.012G126500,Potri.013G092400,Potri.013G113100,Potri.014G104800,Potri.015G127400,Potri.019G066000,Potri.019G083600";
	 }else{$_POST['selG']=$_GET['selG'] ;}
 }
$vowelss = array(",", ";", "\t", "\n", "\r", "s+", " ",",,");
$post_inputs=preg_replace("/\s+/", ",", trim(htmlentities($tmp_selG))); 
$onlyconsonantss = strtolower(str_replace($vowelss, ",", $post_inputs));
$geneids_arrays = explode(",", $onlyconsonantss);
//print_r($geneids_array);
$geneids_array_strs=implode('","',$geneids_arrays);
$gsel1='"'.$geneids_array_strs.'"';

//$_POST['sink1']="Potri.001G308100,Potri.002G230400,Potri.T073100";
 if($debug==true){
	 if($_GET['n1']==""){
	//	$_POST['sink1']= "At4g18780,At5g16910,At5g64740,At1g02730,At5g09870,At2g33100,At1g32180,At5g44030,At2g25540,At4g39350,At5g05170,At4g32410,At5g17420,At3g03050,At4g38190,At2g21770";
		//$_POST['sink1'] ="MA_10426189g0020,MA_10431579g0010,MA_10432389g0010,MA_10435716g0010,MA_10436590g0010,MA_10437155g0020,MA_109735g0020,MA_15346g0010,MA_158791g0170,MA_159139g0090,MA_161668g0010,MA_164660g0010,MA_183690g0010,MA_19157g0020,MA_31132g0010";
$_POST['sink1']="Potri.001G266400,Potri.004G059600,Potri.005G027600,Potri.005G194200,Potri.006G052600,Potri.006G181900,Potri.006G251900,Potri.009G060800,Potri.013G082200,Potri.016G054900,Potri.018G029400,Potri.019G049700";
	 }else{$_POST['sink1']=$_GET['n1'] ;}
 }
$vowels = array(",", ";", "\t", "\n", "\r", "s+", " ",",,");
$post_input=preg_replace("/\s+/", ",", trim(htmlentities($sink1))); 
$onlyconsonants = strtolower(str_replace($vowels, ",", $post_input));
$geneids_array = explode(",", $onlyconsonants);
//print_r($geneids_array);
$geneids_array_str=implode('","',$geneids_array);
$gstr1='"'.$geneids_array_str.'"';
//echo $gstr1;
if($debug==true){
	if($_GET['n2']==""){ 
$_POST['sink2']="At5g64740,At2g33100,At4g39350,At5g05170,At4g32410,At4g38190";
}else{$_POST['sink2']=$_GET['n2'] ;}
 }
$vowels = array(",", ";", "\t", "\n", "\r", "s+", " ",",,");
$post_input_2=preg_replace("/\s+/", ",", trim(htmlentities($sink2))); 
$onlyconsonants_2 = strtolower(str_replace($vowels, ",", $post_input_2));
$geneids_array_2 = explode(",", $onlyconsonants_2);
////print_r($geneids_array_2);

$geneids_array_2_str=implode('","',$geneids_array_2);
$gstr2='"'.$geneids_array_2_str.'"';
//echo $gstr2;

 if($debug==true){
if($_GET['sp1']==""){$tmp_sp1="pt";}else{$tmp_sp1=$_GET['sp1'];}
if($_GET['sp2']==""){$tmp_sp2="at";}else{$tmp_sp2=$_GET['sp2'];}

$tmp_th1=4;
$tmp_th2=4;

$tmp_consth1=3;
$tmp_consth2=3;
 }



$tmp_th2=$tmp_th1;



$tmp_consth2=$tmp_consth1;


if (($tmp_sp1=='pt') and ($tmp_sp2=='at')) $tabln = 'ptat';
if (($tmp_sp1=='at') and ($tmp_sp2=='pt')) $tabln = 'ptat';
if (($tmp_sp1=='pt') and ($tmp_sp2=='os')) $tabln = 'ptos';
if (($tmp_sp1=='os') and ($tmp_sp2=='pt')) $tabln = 'ptos';
if (($tmp_sp1=='at') and ($tmp_sp2=='os')) $tabln = 'atos';
if (($tmp_sp1=='os') and ($tmp_sp2=='at')) $tabln = 'atos';

?>
