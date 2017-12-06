<?php
//require_once('../session.php');
require_once("comparative_functions.php");
//$_SESSION['tab']="Comparative display";
//header("Content-Type: application/json", true);
###   END OF Menu ########
$spNames = array("pt" => "P. Triocharpa", "at" => "A. Thaliana", "os" => "O. Sativa");
//"=" +sink1+"&="+sp1+"&="+th1+"&=" +consth1+"&=" +sink2+"&="+sp2+"&="+th2+"&=" +consth2;
//$_SESSION['showN']='example';
 

if (isset($_POST['op'])) $tmp_op=trim($_POST['op']);


if (isset($_POST['selG'])) $tmp_selG=trim($_POST['selG']);
if (isset($_POST['allG']))$tmp_allG=trim($_POST['allG']);
if (isset($_POST['thexp']))$tmp_thexp=trim($_POST['thexp']);

if (isset($_POST['sp'])) $tmp_sp=trim($_POST['sp']);


if (isset($_POST['sp1'])) $tmp_sp1=trim($_POST['sp1']);
if (isset($_POST['th1']))$tmp_th1=(float)($_POST['th1']);
if (isset($_POST['consth1'])) $tmp_consth1=(float)($_POST['consth1']);

if (isset($_POST['sp2'])) $tmp_sp2=trim($_POST['sp2']);
if (isset($_POST['th2'])) $tmp_th2=(float)($_POST['th2']);
if (isset($_POST['consth2'])) $tmp_consth2=(float)($_POST['consth2']);

//if (!isset($_SESSION['showN'])) $_SESSION['showN']='align';
 
if($_POST['view_state']=="compare"){ $tmp_showN='compare';}else{ $tmp_showN='align';}

//if (isset($tmp_op)) 
//$tmp_showN='example';  

$lim_n = 300;
$lim_e = 500;

$tmp_at_array=array();
$tmp_pt_array=array();
$tmp_os_array=array();


/*$tmp_pt_array = array("POPTR_0001s00710","POPTR_0003s05690","POPTR_0007s10830","POPTR_0011s10440","POPTR_0015s10230","POPTR_0001s01510","POPTR_0008s21090","POPTR_0001s15190","POPTR_0001s09390","POPTR_0001s17730","POPTR_0003s10790","POPTR_0004s08390","POPTR_0005s06810","POPTR_0016s05210","POPTR_0002s19670","POPTR_0018s08990","POPTR_0003s08060","POPTR_0003s09980","POPTR_0005s14110","POPTR_0003s12760","POPTR_0004s07930","POPTR_0004s15260","POPTR_0002s09400","POPTR_0005s16620","POPTR_0014s11520","POPTR_0001s18590","POPTR_0002s23380");
$tmp_at_array=array("AT1G06590","AT1G15570","AT1G34065","AT1G48270","AT1G79820","AT2G23380","AT2G31650","AT3G14740","AT3G19080","AT3G25100","AT4G08690","AT4G11450","AT4G16970","AT4G33130","AT5G06940","AT5G37630","AT5G45560","AT5G62410","AT5G63920");
$tmp_os_array=array("Os10g0563500","Os06g0199800","Os06g0275500","Os09g0134500","Os03g0307800","Os11g0128400","Os12g0124700","Os03g0105800","Os01g0904400","Os02g0102800","Os02g0274900","Os02g0752000");
*/

/*if (!isset($_SESSION['at_array'])) {$_SESSION['at_array']=Array();}
if (!isset($_SESSION['pt_array'])) {$_SESSION['pt_array']=Array();}
if (!isset($_SESSION['os_array'])) {$_SESSION['os_array']=Array();}*/

/*

//$geneids_array = explode(",", $genes);
//$gstring=implode('","',$genes);
	//$gstring='"'.$gstring.'"';

$_SESSION['at_array']=array();
$_SESSION['pt_array']=array();
$_SESSION['os_array']=array();*/
$tmp_pt_array = array("");
$tmp_at_array=array("");
$tmp_os_array=array("");


if($_POST['sink1']!="" && isset($_POST['sink1'])){
$vowels = array(",", ";", "\t", "\n", "\r", "s+", " ",",,");
$post_input=preg_replace("/\s+/", ",", trim(htmlentities($_POST['sink1']))); 
$onlyconsonants = strtolower(str_replace($vowels, ",", $post_input));
$geneids_array = explode(",", $onlyconsonants);

if(checkprefix($onlyconsonants,"po")==true){
	$tmp_pt_array=$geneids_array;
}

if(checkprefix($onlyconsonants,"at")==true){
	$tmp_at_array=$geneids_array;
}

if(checkprefix($onlyconsonants,"ma")==true){
	$tmp_os_array=$geneids_array;
	
}
}



if($_POST['sink2']!="" && isset($_POST['sink2'])){
$vowels = array(",", ";", "\t", "\n", "\r", "s+", " ",",,");
$post_input=preg_replace("/\s+/", ",", trim(htmlentities($_POST['sink2']))); 
$onlyconsonants = strtolower(str_replace($vowels, ",", $post_input));
$geneids_array = explode(",", $onlyconsonants);

if(checkprefix($onlyconsonants,"po")==true){
	$tmp_pt_array=$geneids_array;
}

if(checkprefix($onlyconsonants,"at")==true){
	$tmp_at_array=$geneids_array;
}

if(checkprefix($onlyconsonants,"ma")==true){
	$tmp_os_array=$geneids_array;
	
}
}




/*if (!isset($_SESSION['pt_array']))$_SESSION['pt_array'] = array("POPTR_0001s00710","POPTR_0003s05690","POPTR_0007s10830","POPTR_0011s10440","POPTR_0015s10230","POPTR_0001s01510","POPTR_0008s21090","POPTR_0001s15190","POPTR_0001s09390","POPTR_0001s17730","POPTR_0003s10790","POPTR_0004s08390","POPTR_0005s06810","POPTR_0016s05210","POPTR_0002s19670","POPTR_0018s08990","POPTR_0003s08060","POPTR_0003s09980","POPTR_0005s14110","POPTR_0003s12760","POPTR_0004s07930","POPTR_0004s15260","POPTR_0002s09400","POPTR_0005s16620","POPTR_0014s11520","POPTR_0001s18590","POPTR_0002s23380");
if (!isset($_SESSION['at_array']))$_SESSION['at_array']=array("AT1G06590","AT1G15570","AT1G34065","AT1G48270","AT1G79820","AT2G23380","AT2G31650","AT3G14740","AT3G19080","AT3G25100","AT4G08690","AT4G11450","AT4G16970","AT4G33130","AT5G06940","AT5G37630","AT5G45560","AT5G62410","AT5G63920");
if (!isset($_SESSION['os_array']))$_SESSION['os_array']=array("Os10g0563500","Os06g0199800","Os06g0275500","Os09g0134500","Os03g0307800","Os11g0128400","Os12g0124700","Os03g0105800","Os01g0904400","Os02g0102800","Os02g0274900","Os02g0752000");

## --- Section: Load the gene list --- ##
## load sample gene arrays
if ($tmp_showN == 'example'){
	$_SESSION['at_array'] = array("AT1G06590","AT1G15570","AT1G34065","AT1G48270","AT1G79820","AT2G23380","AT2G31650","AT3G14740","AT3G19080","AT3G25100","AT4G08690","AT4G11450","AT4G16970","AT4G33130","AT5G06940","AT5G37630","AT5G45560","AT5G62410","AT5G63920");
	$_SESSION['pt_array'] = array("POPTR_0001s00710","POPTR_0003s05690","POPTR_0007s10830","POPTR_0011s10440","POPTR_0015s10230","POPTR_0001s01510","POPTR_0008s21090","POPTR_0001s15190","POPTR_0001s09390","POPTR_0001s17730","POPTR_0003s10790","POPTR_0004s08390","POPTR_0005s06810","POPTR_0016s05210","POPTR_0002s19670","POPTR_0018s08990","POPTR_0003s08060","POPTR_0003s09980","POPTR_0005s14110","POPTR_0003s12760","POPTR_0004s07930","POPTR_0004s15260","POPTR_0002s09400","POPTR_0005s16620","POPTR_0014s11520","POPTR_0001s18590","POPTR_0002s23380");
	$_SESSION['os_array'] = array("Os10g0563500","Os06g0199800","Os06g0275500","Os09g0134500","Os03g0307800","Os11g0128400","Os12g0124700","Os03g0105800","Os01g0904400","Os02g0102800","Os02g0274900","Os02g0752000");
	$tmp_th1 = 4.0;
	$tmp_th2 = 4.0;
	$tmp_consth1=2.0;
	$tmp_consth2=2.0;
}*/

$sp1_genes = ${ "tmp_" .$tmp_sp1."_array" };
$sp2_genes =${ "tmp_" .$tmp_sp2."_array" };

//${"file" . $i}
//$sp1_genes = $_SESSION[$tmp_sp1.'_array'];
//$sp2_genes = $_SESSION[$tmp_sp2.'_array'];

//print_r($_SESSION[$tmp_sp1.'_array']);

//print_r($_SESSION['at_array']);
##expand the genes with their neighbors (from the network panel context menu)
if ($tmp_op=='expand'){
	if ($tmp_sp==1){
		$sp1_genes_t = update_genes($tmp_sp1, $tmp_selG, $tmp_allG, $tmp_thexp);
		if (count($sp1_genes_t)>$lim_n){
			print "The network expansion for ".$spNames[$tmp_sp1]."is ".count($sp1_genes_t)." genes. Try increasing the co-expression threshold, or limit the initial gene selection.";
		}else{
			$sp1_genes = $sp1_genes_t;
		}
	}
	if ($tmp_sp==2){
		$sp2_genes_t = update_genes($tmp_sp2, $tmp_selG,$tmp_allG,$tmp_thexp);
		if (count($sp2_genes_t)>$lim_n){
			print "The network expansion for ".$spNames[$tmp_sp2]."is ".count($sp2_genes_t)." genes. Try increasing the co-expression threshold, or limit the initial gene selection.";
		}else{
			$sp2_genes = $sp2_genes_t;
		}
	}
}else{
	##gene list loading from text area
	/*if ($_SESSION['sp1genes']<>""){
		$sp1_genes = load_genes($_SESSION['sp1genes']);
	}
	if ($_SESSION['sp2genes']<>""){
		$sp2_genes = load_genes($_SESSION['sp2genes']);
	}*/
}

## --- Section: form different arrays needed for network display --- ##
/*

if compare start from step 2

If co-expression  add neighbours to pt genes and then start from step 1 (0)

step 0 (SELECT pt_i FROM ptGene WHERE pt_id in("Potri.001G308100","Potri.002G230400","Potri.T073100”))

Step 1 SELECT * FROM ptatNod WHERE pt_i in(2476,5674,32052) AND type="c" AND corr = 2;   Only for aligning

Step 2 SELECT * FROM ptat WHERE pt_i1 in(2476,5674,32052) AND pt_i2 in(2476,5674,32052)  AND at_i1 in(20038,4051,20039) AND at_i2 in(20038,4051,20039);

within network
Step 3a SELECT * FROM ptCorr WHERE pt_i1 in(2476,5674,32052) AND pt_i2 in(2476,5674,32052);

Step 3a SELECT * FROM atCorr WHERE at_i1 in(2476,5674,32052) AND pt_i2 in(2476,5674,32052)
*/


$eL1=Array();#eL['geneind1-geneind2']=correlation
$eL2=Array();#eL['geneind1-geneind2']=correlation
$gD1=Array();#gene index to gene id dictionary for species sp1
$gD2=Array();#gene index to gene id dictionary for species sp2
$nC=Array();#sp1 gene_id -> sp2 gene_id
$nA=Array();#simple array that holds the aligned nodes in species 2
$eC=Array();#sp1 edge_id -> sp2 edge_id
$eA=Array();#simple array that holds the aligned edges in species 2
$nG=Array();#simple array that holds the gene ids of aligned nodes in species 2
$sp1TF = getTF($sp1_genes, $tmp_sp1);
$sp2TF = getTF($sp2_genes, $tmp_sp2);
if ((count($sp1_genes)<1) or (count($sp2_genes)<1)){
	if (count($sp1_genes)<1) print($spNames[$tmp_sp1].' gene basket is empty. Either display example or load some genes!');
	if (count($sp2_genes)<1) print($spNames[$tmp_sp2].' gene basket is empty. Either display example or load some genes!');
}else{
    if ($tmp_showN!='align'){
		##read the nodes and edges from the database
		list($gD1, $eL1)=readNetDB($tmp_sp1, $sp1_genes,$tmp_th1);
		list($gD2, $eL2)=readNetDB($tmp_sp2, $sp2_genes, $tmp_th2);
		##http://cytoscapeweb.cytoscape.org/documentation/visualization#section/addElements
		$isEmpty = False;
		if ( empty($gD1) or empty($gD2) or empty($eL1) or empty($eL2) ) $isEmpty = True;
		if ( (!$isEmpty) and ($tmp_sp1!=$tmp_sp2) ){
			##get the node and edge alignments
			list($eC,$eA,$eL1,$eL2,$gD1,$gD2) = readAlgnEdgeDB_current($tmp_sp1, $tmp_sp2, $sp1_genes, $sp2_genes, $eL1, $eL2, $gD1, $gD2, $tmp_consth1,$tmp_consth2);
			##get the node alignments only for the nodes that have adjacent edges
			#list($nC,$nA) = readAlgnNodeDB_current($tmp_sp1, $tmp_sp2, array_values($gD1), array_values($gD2));
			list($nC,$nA) = readAlgnNodeDB_current($tmp_sp1, $tmp_sp2, $sp1_genes, $sp2_genes);
		}
	}else{
		if ($tmp_sp1!=$tmp_sp2){
			##read the nodes and edges from the database for species1
			list($gD1, $eL1)=readNetDB($tmp_sp1, $sp1_genes, $tmp_th1);
			##add the edge alignments
			if (count($gD1)>1){
				list($eC,$eA,$eL1,$eL2,$gD1,$gD2) = readAlgnEdgeDB_aligned($tmp_sp1, $tmp_sp2, $sp1_genes, $eL1, $eL2, $gD1, $gD2, $tmp_consth1,$tmp_consth2);
				##read the node alignments
				list($nC, $nA, $nG) = readAlgnNodeDB_aligned($tmp_sp1, $tmp_sp2, $sp1_genes);
				$sp2_genes = array_merge(array_values($gD2),$nG);
				##read coex network for the aligned nodes & edges
				list($gD2, $eL2) = addNetDB($tmp_sp2, $sp2_genes, $gD2, $eL2, $tmp_th2);
			}else{
				##read the node alignments
				list($nC, $nA, $nG) = readAlgnNodeDB_aligned($tmp_sp1, $tmp_sp2, $sp1_genes);
				##read coex network for the aligned nodes & edges
				$eL2 = Array();
				$gD2 = Array();
				$sp2_genes = $nG; 
				if (!empty($sp2_genes)) list($gD2, $eL2) = addNetDB($tmp_sp2, $sp2_genes, $gD2, $eL2, $tmp_th2);
			}
		}else{
			print "Select different species!";
		}
	}
}

## These session lists are needed in the Ajax calls by the Comparative Tool buttons
/*$_SESSION['eL1'] = $eL1;
$_SESSION['eL2'] = $eL2;
$_SESSION['gD1'] = $gD1;
$_SESSION['gD2'] = $gD2;
$_SESSION['nC'] = $nC;*/

##we set the session gene lists as they are used in other tools as well
//$_SESSION[$tmp_sp1.'_array'] = $sp1_genes;
//$_SESSION[$tmp_sp2.'_array'] = $sp2_genes;

//$sp1_genes = ${ "tmp_" .$tmp_sp1."_array" };
//$sp2_genes =${ "tmp_" .$tmp_sp2."_array" };

$tmp_array1= writeNet1($gD1, $eL1, $nC, $eC,$sp1TF);
$tmp_array2= writeNet2($gD2, $eL2, $nA, $eA,$sp2TF);

$arrsg = array('tmp_array1'=>$tmp_array1,'tmp_array2'=>$tmp_array2);



ob_clean();
$test= json_encode($arrsg);
//$stringObject = json_decode(stripslashes($test));
echo $test;
//echo  json_encode($arrsg,JSON_UNESCAPED_UNICODE );
//$str = str_replace('\\/', '', $json_encode($arrsg,JSON_UNESCAPED_SLASHES ));
//echo $str;
ob_flush();

##These must be unset everytime the page is loaded
//unset($tmp_showN);
//unset($_SESSION['op']);

#####################################
//Check prefix
#####################################
function checkprefix($source, $prefix) {
    if (str_startswith($source, $prefix)) {
       return true;
    } else {
       return false;
    }
}
function str_startswith($source, $prefix)
{
   return strncmp($source, $prefix, strlen($prefix)) == 0;
}
/////////////////////////////////////

exit();
?>
