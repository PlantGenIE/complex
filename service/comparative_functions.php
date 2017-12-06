<?php
require_once("../db.php");

/*
loads a gene list
*/
function load_genes($sG){
	$aG = array();
	if ($sG!="Genes"){
		$aG = preg_split("/[\s]+/",rtrim($sG));
		$aG = array_unique($aG);
	}
	return $aG;
}

/*
forms a [gene_id:gene_index] javascript array for use in table selection
TODO: make it json
*/
function nodes_json($gD){
	$nod = "";
	$nodes = array_keys($gD);
	foreach ($nodes as $n){
		$nod .= "'".$gD[$n]."':'".$n."', ";
	}
	$nod = rtrim($nod, ", ");
	return $nod;
}

/*
SELECT ptCorr.pt_i1, G1.pt_id, ptCorr.pt_i2, G2.pt_id, ptCorr.corr
FROM ptCorr
INNER JOIN ptGene G1 ON (ptCorr.pt_i1=G1.pt_i)
INNER JOIN ptGene G2 ON (ptCorr.pt_i2=G2.pt_i)
WHERE ( G1.pt_id IN ("POPTR_0001s01300","POPTR_0006s01250","POPTR_0008s01890")
OR G2.pt_id IN ("POPTR_0001s01300","POPTR_0006s01250","POPTR_0008s01890") )
AND ptCorr.corr > 3.0
ORDER BY ptCorr.corr;
*/
function update_genes($sp, $str_sG, $str_aG, $th){
	$sG = split(",", $str_sG);# selected genes for adding neighbors
	$aG = split(",", $str_aG);# all genes (add here the neighbors)
	$gstr = "";
	//foreach($sG as $g) $gstr .= '"'.$g.'", ';
	//$gstr = rtrim($gstr, ", ");
	
	$geneids_array_str=implode('","',$sG);
	$gstr='"'.$geneids_array_str.'"';
	
	
	$query_string = 'SELECT '.$sp.'Corr.'.$sp.'_i1, G1.'.$sp.'_id, '.$sp.'Corr.'.$sp.'_i2, G2.'.$sp.'_id, '.$sp.'Corr.corr
	 FROM  '.$sp.'Corr
	 INNER JOIN '.$sp.'Gene G1 ON ('.$sp.'Corr.'.$sp.'_i1=G1.'.$sp.'_i)
	 INNER JOIN '.$sp.'Gene G2 ON ('.$sp.'Corr.'.$sp.'_i2=G2.'.$sp.'_i)
	WHERE ( G1.'.$sp.'_id IN ('.$gstr.')
	OR G2.'.$sp.'_id IN ('.$gstr.') )
	AND '.$sp.'Corr.corr > '.$th.'
	ORDER BY '.$sp.'Corr.corr;';

	$result = mysql_query($query_string);
	if (!$result) {
		echo 'Could not run query: '.mysql_error();
		exit;
	}
	while(list($ni1, $n1, $ni2, $n2, $corr) = mysql_fetch_row($result)){
		//print_r($row);
		if (!in_array($n1,$aG)) $aG[$ni1]=$n1;
		if (!in_array($n2,$aG)) $aG[$ni2]=$n2;
	}
	return $aG;
}

/*
Called from comparative_ajax to select all genes belonging to a GO term.

SELECT gT.pt_id
FROM ptGO gGOT
INNER JOIN GO goT ON (gGOT.go_i=goT.go_i)
INNER JOIN ptGene gT ON (gGOT.g_i=gT.pt_i)
WHERE goT.go_id IN ("GO:0051788");

*/
function get_GOgenes($sp, $GOs){
	$aG = Array();
	$gostr = "";
	//foreach($GOs as $go) $gostr .= '"'.$go.'", ';
	//$gostr = rtrim($gostr, ", ");
	$geneids_array_strgo=implode('","',$GOs);
	$gostr='"'.$geneids_array_strgo.'"';
	
	
	$query_string = 'SELECT gT.'.$sp.'_id
	FROM '.$sp.'GO gGOT
	INNER JOIN GO goT ON (gGOT.go_i=goT.go_i)
	INNER JOIN '.$sp.'Gene gT ON (gGOT.g_i=gT.'.$sp.'_i)
	WHERE goT.go_id IN ('.$gostr.')';
	$result = mysql_query($query_string);
	if (!$result) {
		echo 'Could not run query: '.mysql_error();
		exit;
	}
	while(list($g) = mysql_fetch_row($result)){
		if (!in_array($g,$aG)) $aG[]=$g;
	}
	// $myFile = "../python/errlog.txt";
	// $fh = fopen($myFile, 'w') or die("can't open file");
	// fwrite($fh, json_encode($query_string));
	// fwrite($fh, json_encode($aG));
	// fclose($fh);
	return $aG;
}

/*
Reads the node alignments between two groups of nodes

SELECT atosNod.at_i, T1.at_id, atosNod.os_i, T2.os_id
FROM atosNod
INNER JOIN atGene T1 on (atosNod.at_i = T1.at_i)
INNER JOIN osGene T2 on (atosNod.os_i = T2.os_i)
WHERE T1.at_id IN ()
AND T2.os_id IN ()
*/
function readAlgnNodeDB_current($sp1, $sp2, $gl1, $gl2){
	$nC = Array();#sp1 gene_id -> sp2 gene_id
	$nA = Array();#simple array that holds the aligned nodes in species 2
	$gstr1 = "";
	/*foreach($gl1 as $g) $gstr1 .= '"'.$g.'", ';
	$gstr1 = rtrim($gstr1, ", ");*/
	$geneids_array_str=implode('","',$gl1);
	$gstr1='"'.$geneids_array_str.'"';
	
	
	$gstr2 = "";
	/*foreach($gl2 as $g) $gstr2 .= '"'.$g.'", ';
	$gstr2 = rtrim($gstr2, ", ");*/
	
	$geneids_array_str2=implode('","',$gl2);
	$gstr2='"'.$geneids_array_str2.'"'; 
	
	
	
	if (($sp1=='pt') and ($sp2=='at')) $tabln = 'ptat';
	if (($sp1=='at') and ($sp2=='pt')) $tabln = 'ptat';
	if (($sp1=='pt') and ($sp2=='os')) $tabln = 'ptos';
	if (($sp1=='os') and ($sp2=='pt')) $tabln = 'ptos';
	if (($sp1=='at') and ($sp2=='os')) $tabln = 'atos';
	if (($sp1=='os') and ($sp2=='at')) $tabln = 'atos';
	$query_string = 'SELECT '.$tabln.'Nod.'.$sp1.'_i, T1.'.$sp1.'_id, '.$tabln.'Nod.'.$sp2.'_i, T2.'.$sp2.'_id
	FROM '.$tabln.'Nod
	INNER JOIN '.$sp1.'Gene T1 on ('.$tabln.'Nod.'.$sp1.'_i = T1.'.$sp1.'_i)
	INNER JOIN '.$sp2.'Gene T2 on ('.$tabln.'Nod.'.$sp2.'_i = T2.'.$sp2.'_i)
	WHERE T1.'.$sp1.'_id IN ('.$gstr1.')
	AND T2.'.$sp2.'_id IN ('.$gstr2.');';
	//print($query_string);
	
	
	$result = mysql_query($query_string);
	if (!$result) {
		echo 'Could not run query: '.mysql_error();
		exit;
	}
	while(list($ni1, $n1, $ni2, $n2) = mysql_fetch_row($result)){
		array_push($nA,$ni2);
		if (count($nC)==0) {
			$nC[$ni1]='"'.$ni2.'"';
		}else{
			if(array_key_exists($ni1,$nC)){
				$nC[$ni1].=',"'.$ni2.'"';
			}else{
				$nC[$ni1]='"'.$ni2.'"';
			}
		}
	}
	$nA = array_unique($nA);
	return array($nC,$nA);
}

/*
Finds the conserved nodes for a group of nodes (genes) in species1
Same as readAlgnNodeDB_current, but no second gene list to align against
*/
function readAlgnNodeDB_aligned($sp1, $sp2, $gl1){
	$nC = Array();#sp1 gene_id -> sp2 gene_id
	$nA = Array();#simple array that holds the indexes of aligned nodes in species 2
	$nG = Array();#simple array that holds the gene ids of aligned nodes in species 2
	$gstr1 = "";
	
	//foreach($gl1 as $g) $gstr1 .= '"'.$g.'", ';
	//$gstr1 = rtrim($gstr1, ", ");
	$geneids_array_str=implode('","',$gl1);
	$gstr1='"'.$geneids_array_str.'"';
	
	
	if (($sp1=='pt') and ($sp2=='at')) $tabln = 'ptat';
	if (($sp1=='at') and ($sp2=='pt')) $tabln = 'ptat';
	if (($sp1=='pt') and ($sp2=='os')) $tabln = 'ptos';
	if (($sp1=='os') and ($sp2=='pt')) $tabln = 'ptos';
	if (($sp1=='at') and ($sp2=='os')) $tabln = 'atos';
	if (($sp1=='os') and ($sp2=='at')) $tabln = 'atos';
	$query_string = 'SELECT '.$tabln.'Nod.'.$sp1.'_i, T1.'.$sp1.'_id, '.$tabln.'Nod.'.$sp2.'_i, T2.'.$sp2.'_id
	FROM '.$tabln.'Nod
	INNER JOIN '.$sp1.'Gene T1 on ('.$tabln.'Nod.'.$sp1.'_i = T1.'.$sp1.'_i)
	INNER JOIN '.$sp2.'Gene T2 on ('.$tabln.'Nod.'.$sp2.'_i = T2.'.$sp2.'_i)
	WHERE T1.'.$sp1.'_id IN ('.$gstr1.');';
	$result = mysql_query($query_string);
	if (!$result) {
		echo 'Could not run query: '.mysql_error();
		exit;
	}
	while(list($ni1, $n1, $ni2, $n2) = mysql_fetch_row($result)){
		array_push($nA,$ni2);
		array_push($nG,$n2);
		if (count($nC)==0) {
			$nC[$ni1]='"'.$ni2.'"';
		}else{
			if(array_key_exists($ni1,$nC)){
				$nC[$ni1].=',"'.$ni2.'"';
			}else{
				$nC[$ni1]='"'.$ni2.'"';
			}
		}
	}
	$nA = array_unique($nA);
	$nG = array_unique($nG);
	return array($nC,$nA,$nG);
}

/*
Reads the edge alignments between two groups of nodes

SELECT ptat.pt_i1, T1_1.pt_id, ptat.pt_i2, T1_2.pt_id, ptat.at_i1, T2_1.at_id, ptat.at_i2, T2_2.at_id, ptat.corr1, ptat.corr2 FROM ptat INNER JOIN ptGene T1_1 on (ptat.pt_i1 = T1_1.pt_i) INNER JOIN ptGene T1_2 on (ptat.pt_i2 = T1_2.pt_i) INNER JOIN atGene T2_1 on (ptat.at_i1 = T2_1.at_i) INNER JOIN atGene T2_2 on (ptat.at_i2 = T2_2.at_i) WHERE T1_1.pt_id IN ("POPTR_0001s19290", "POPTR_0001s01300", "POPTR_0001s04320", "POPTR_0001s44510", "POPTR_0003s10220", "POPTR_0004s02250", "POPTR_0005s03710", "POPTR_0005s04860", "POPTR_0006s01250", "POPTR_0006s03690", "POPTR_0008s01890", "POPTR_0011s02950", "POPTR_0011s09140", "POPTR_0011s13870", "POPTR_0014s09810", "POPTR_0011s15210", "POPTR_0001s35850", "POPTR_0001s45720", "POPTR_0007s14930") AND T1_2.pt_id IN ("POPTR_0001s19290", "POPTR_0001s01300", "POPTR_0001s04320", "POPTR_0001s44510", "POPTR_0003s10220", "POPTR_0004s02250", "POPTR_0005s03710", "POPTR_0005s04860", "POPTR_0006s01250", "POPTR_0006s03690", "POPTR_0008s01890", "POPTR_0011s02950", "POPTR_0011s09140", "POPTR_0011s13870", "POPTR_0014s09810", "POPTR_0011s15210", "POPTR_0001s35850", "POPTR_0001s45720", "POPTR_0007s14930") AND T2_1.at_id IN ("AT1G17910", "AT2G04160", "AT2G45190", "AT5G18070", "AT5G51300", "AT5G61500", "AT1G16260", "AT2G04160", "AT4G23180", "AT4G39950", "AT5G01075", "AT5G36930", "AT5G67570") AND T2_2.at_id IN ("AT1G17910", "AT2G04160", "AT2G45190", "AT5G18070", "AT5G51300", "AT5G61500", "AT1G16260", "AT2G04160", "AT4G23180", "AT4G39950", "AT5G01075", "AT5G36930", "AT5G67570");

SELECT atos.at_i1, T1_1.at_id, atos.at_i2, T1_2.at_id, atos.os_i1, T2_1.os_id, atos.os_i2, T2_2.os_id, atos.corr1, atos.corr2
FROM atos
INNER JOIN atGene T1_1 on (atos.at_i1 = T1_1.at_i)
INNER JOIN atGene T1_2 on (atos.at_i2 = T1_1.at_i)
INNER JOIN atGene T2_1 on (atos.os_i1 = T2_1.os_i)
INNER JOIN atGene T2_2 on (atos.os_i2 = T2_2.os_i)
WHERE T1_1.at_id IN ()
AND T1_2.at_id IN ()
AND T2_1.os_id IN ()
AND T2_2.os_id IN ()
*/
function getTF($genes, $sp){
 //   foreach($genes as $g) $gstring .= '"'.$g.'", ';//chanaka changed
  // $gstring = rtrim($gstring, ", ");
	$geneids_array_str=implode('","',$genes);
	$gstring='"'.$geneids_array_str.'"';
	
    $query = "SELECT distinct(".$sp."TF.tf_id) as tf_id FROM ".$sp."TF WHERE ".$sp."TF.tf_id in(".$gstring.")";
    $result = mysql_query($query);
    $tfDic = array();
	if ($result) {
    while ($row = mysql_fetch_assoc($result)){
        array_push($row['tf_id']);
    }
    return $tfDic;
	}
}

/*Compare*/
function readAlgnEdgeDB_current($sp1, $sp2, $gl1, $gl2, $eL1, $eL2, $gD1, $gD2, $consth1, $consth2){
	$eC = Array();#sp1 edge_id -> sp2 edge_id
	$eA = Array();#simple array that holds the aligned edges in species 2
	$gstr1 = "";

	$geneids_array_str=implode('","',$gl1);
	$gstr1='"'.$geneids_array_str.'"';
		
	//foreach($gl1 as $g) $gstr1 .= '"'.$g.'", ';
	//$gstr1 = rtrim($gstr1, ", ");
	
	$gstr2 = "";
	
	//foreach($gl2 as $g) $gstr2 .= '"'.$g.'", ';
	//$gstr2 = rtrim($gstr2, ", ");
	
	$geneids_array_str2=implode('","',$gl2);
	$gstr2='"'.$geneids_array_str2.'"';
		
	
	$tabln = "";
	if (($sp1=='pt') and ($sp2=='at')) $tabln = 'ptat';
	if (($sp1=='at') and ($sp2=='pt')) $tabln = 'ptat';
	if (($sp1=='pt') and ($sp2=='os')) $tabln = 'ptos';
	if (($sp1=='os') and ($sp2=='pt')) $tabln = 'ptos';
	if (($sp1=='at') and ($sp2=='os')) $tabln = 'atos';
	if (($sp1=='os') and ($sp2=='at')) $tabln = 'atos';
	$cth1 = $consth1;
	$cth2 = $consth2;
	if (($sp1.$sp2 == 'atpt')or($sp1.$sp2 == 'ospt')or($sp1.$sp2 == 'osat')){
		$cth1 = $consth2;
		$cth2 = $consth1;	
	}
	$query_string = 'SELECT '.$tabln.'.'.$sp1.'_i1, T1_1.'.$sp1.'_id, '.$tabln.'.'.$sp1.'_i2, T1_2.'.$sp1.'_id, '.$tabln.'.'.$sp2.'_i1, T2_1.'.$sp2.'_id, '.$tabln.'.'.$sp2.'_i2, T2_2.'.$sp2.'_id, '.$tabln.'.corr1, '.$tabln.'.corr2
	FROM '.$tabln.'
	INNER JOIN '.$sp1.'Gene T1_1 on ('.$tabln.'.'.$sp1.'_i1 = T1_1.'.$sp1.'_i)
	INNER JOIN '.$sp1.'Gene T1_2 on ('.$tabln.'.'.$sp1.'_i2 = T1_2.'.$sp1.'_i)
	INNER JOIN '.$sp2.'Gene T2_1 on ('.$tabln.'.'.$sp2.'_i1 = T2_1.'.$sp2.'_i)
	INNER JOIN '.$sp2.'Gene T2_2 on ('.$tabln.'.'.$sp2.'_i2 = T2_2.'.$sp2.'_i)
	WHERE T1_1.'.$sp1.'_id IN ('.$gstr1.')
	AND T1_2.'.$sp1.'_id IN ('.$gstr1.')
	AND T2_1.'.$sp2.'_id IN ('.$gstr2.')
	AND T2_2.'.$sp2.'_id IN ('.$gstr2.')
	AND '.$tabln.'.corr1 > '.$cth1.'
	AND '.$tabln.'.corr2 > '.$cth2.';';
	//
	
	
	//print ($query_string);
	//exit();
	
	$result = mysql_query($query_string);
	if (!$result) {
		echo 'Could not run query: '.mysql_error();
		exit;
	}
	while( $row = mysql_fetch_row($result)) {
		if (($sp1=='pt') and ($sp2=='at')) list($ni1_1, $n1_1, $ni1_2, $n1_2, $ni2_1, $n2_1, $ni2_2, $n2_2, $c1, $c2) = $row;
		if (($sp1=='at') and ($sp2=='pt')) list($ni1_1, $n1_1, $ni1_2, $n1_2, $ni2_1, $n2_1, $ni2_2, $n2_2, $c2, $c1) = $row;
		if (($sp1=='pt') and ($sp2=='os')) list($ni1_1, $n1_1, $ni1_2, $n1_2, $ni2_1, $n2_1, $ni2_2, $n2_2, $c1, $c2) = $row;
		if (($sp1=='os') and ($sp2=='pt')) list($ni1_1, $n1_1, $ni1_2, $n1_2, $ni2_1, $n2_1, $ni2_2, $n2_2, $c2, $c1) = $row;
		if (($sp1=='at') and ($sp2=='os')) list($ni1_1, $n1_1, $ni1_2, $n1_2, $ni2_1, $n2_1, $ni2_2, $n2_2, $c1, $c2) = $row;
		if (($sp1=='os') and ($sp2=='at')) list($ni1_1, $n1_1, $ni1_2, $n1_2, $ni2_1, $n2_1, $ni2_2, $n2_2, $c2, $c1) = $row;
		
		//echo "ni1_1".$ni1_1-$ni1_2;
		
		/*$e1 = $ni1_1.'-'.$ni1_2;
		$e1s = $ni1_2.'-'.$ni1_1;
		$e2 = $ni2_1.'-'.$ni2_2;
		$e2s = $ni2_2.'-'.$ni2_1;*/
		
		//echo "ni1_1".$ni1_1-$ni1_2;
/*		((float)$ni1_1>(float)$ni1_2)?($e1 = $ni1_2.'-'.$ni1_1):($e1 = $ni1_1.'-'.$ni1_2);
		((float)$ni1_2>(float)$ni1_1)?($e1s = $ni1_1.'-'.$ni1_2):($e1s = $ni1_2.'-'.$ni1_1);
		((float)$ni2_1>(float)$ni2_2)?($e2 = $ni2_2.'-'.$ni2_1):($e2 = $ni2_1.'-'.$ni2_2);
		((float)$ni2_2>(float)$ni2_1)?($e2s = $ni2_1.'-'.$ni2_2):($e2s = $ni2_2.'-'.$ni2_1);*/
		
		((float)$ni1_1>(float)$ni1_2)?($e1 = $ni1_2.'-'.$ni1_1):($e1 = $ni1_1.'-'.$ni1_2);
		((float)$ni1_2>(float)$ni1_1)?($e1s = $ni1_1.'-'.$ni1_2):($e1s = $ni1_2.'-'.$ni1_1);
		((float)$ni2_1<(float)$ni2_2)?($e2 = $ni2_2.'-'.$ni2_1):($e2 = $ni2_1.'-'.$ni2_2);
		((float)$ni2_2>(float)$ni2_1)?($e2s = $ni2_1.'-'.$ni2_2):($e2s = $ni2_2.'-'.$ni2_1);
		
		
		
		##add the nodes to gD arrays if there is an adjacent edge (the gD arrays only contains those nodes from sp_gene arrays that have edges)
		if (!in_array($n1_1,$gD1)) $gD1[$ni1_1]=$n1_1;
		if (!in_array($n1_2,$gD1)) $gD1[$ni1_2]=$n1_2;
		if (!in_array($n2_1,$gD2)) $gD2[$ni2_1]=$n2_1;
		if (!in_array($n2_2,$gD2)) $gD2[$ni2_2]=$n2_2;
		if (!((array_key_exists($e1,$eL1)) or (array_key_exists($e1s,$eL1)))) $eL1[$e1]=$c1;
		if (!((array_key_exists($e2,$eL2)) or (array_key_exists($e2s,$eL2)))) $eL2[$e2]=$c2;
		
		array_push($eA,$e2);
		if (count($eC)==0) {
			$eC[$e1]='"'.$e2.'"';
		}else{
			if (array_key_exists($e1,$eC)){
				$eC[$e1].=',"'.$e2.'"';
			}else{
				$eC[$e1]='"'.$e2.'"';
			}
		}
	}
	/*$eA = array_unique($eA);
    $eC = array_unique($eC);
	$eL1 = array_unique($eL1);
	$eL2 = array_unique($eL2);*/
	$eA = array_unique($eA);
	$eL1 = array_unique($eL1);


	//$eL2 = array_unique($gD2);
	return array($eC,$eA,$eL1,$eL2,$gD1,$gD2);
}

/*ALIGN
The only difference to readAlgnEdgeDB_current is that it does not use a second genel list for species 2 to compare against.
*/
function readAlgnEdgeDB_aligned($sp1, $sp2, $gl1, $eL1, $eL2, $gD1, $gD2, $consth1, $consth2){
	$eC = Array();#sp1 edge_id -> sp2 edge_id
	$eA = Array();#simple array that holds the aligned edges in species 2
	$gstr1 = "";
	
	foreach($gl1 as $g) $gstr1 .= '"'.$g.'", ';
	$gstr1 = rtrim($gstr1, ", ");
	
	
	$tabln = "";
	if (($sp1=='pt') and ($sp2=='at')) $tabln = 'ptat';
	if (($sp1=='at') and ($sp2=='pt')) $tabln = 'ptat';
	if (($sp1=='pt') and ($sp2=='os')) $tabln = 'ptos';
	if (($sp1=='os') and ($sp2=='pt')) $tabln = 'ptos';
	if (($sp1=='at') and ($sp2=='os')) $tabln = 'atos';
	if (($sp1=='os') and ($sp2=='at')) $tabln = 'atos';
	$cth1 = $consth1;
	$cth2 = $consth2;
	if (($sp1.$sp2 == 'atpt')or($sp1.$sp2 == 'ospt')or($sp1.$sp2 == 'osat')){
		$cth1 = $consth2;
		$cth2 = $consth1;	
	}
	$query_string = 'SELECT '.$tabln.'.'.$sp1.'_i1, T1_1.'.$sp1.'_id, '.$tabln.'.'.$sp1.'_i2, T1_2.'.$sp1.'_id, '.$tabln.'.'.$sp2.'_i1, T2_1.'.$sp2.'_id, '.$tabln.'.'.$sp2.'_i2, T2_2.'.$sp2.'_id, '.$tabln.'.corr1, '.$tabln.'.corr2
	FROM '.$tabln.'
	INNER JOIN '.$sp1.'Gene T1_1 on ('.$tabln.'.'.$sp1.'_i1 = T1_1.'.$sp1.'_i)
	INNER JOIN '.$sp1.'Gene T1_2 on ('.$tabln.'.'.$sp1.'_i2 = T1_2.'.$sp1.'_i)
	INNER JOIN '.$sp2.'Gene T2_1 on ('.$tabln.'.'.$sp2.'_i1 = T2_1.'.$sp2.'_i)
	INNER JOIN '.$sp2.'Gene T2_2 on ('.$tabln.'.'.$sp2.'_i2 = T2_2.'.$sp2.'_i)
	WHERE T1_1.'.$sp1.'_id IN ('.$gstr1.')
	AND T1_2.'.$sp1.'_id IN ('.$gstr1.')
	AND '.$tabln.'.corr1 > '.$cth1.'
	AND '.$tabln.'.corr2 > '.$cth2.';';
	
	//echo $query_string;
	//exit();
	
	//print ($query_string);
	$result = mysql_query($query_string);
	if (!$result) {
		echo 'Could not run query: '.mysql_error();
		exit;
	}
	while( $row = mysql_fetch_row($result)) {
		if (($sp1=='pt') and ($sp2=='at')) list($ni1_1, $n1_1, $ni1_2, $n1_2, $ni2_1, $n2_1, $ni2_2, $n2_2, $c1, $c2) = $row;
		if (($sp1=='at') and ($sp2=='pt')) list($ni1_1, $n1_1, $ni1_2, $n1_2, $ni2_1, $n2_1, $ni2_2, $n2_2, $c2, $c1) = $row;
		if (($sp1=='pt') and ($sp2=='os')) list($ni1_1, $n1_1, $ni1_2, $n1_2, $ni2_1, $n2_1, $ni2_2, $n2_2, $c1, $c2) = $row;
		if (($sp1=='os') and ($sp2=='pt')) list($ni1_1, $n1_1, $ni1_2, $n1_2, $ni2_1, $n2_1, $ni2_2, $n2_2, $c2, $c1) = $row;
		if (($sp1=='at') and ($sp2=='os')) list($ni1_1, $n1_1, $ni1_2, $n1_2, $ni2_1, $n2_1, $ni2_2, $n2_2, $c1, $c2) = $row;
		if (($sp1=='os') and ($sp2=='at')) list($ni1_1, $n1_1, $ni1_2, $n1_2, $ni2_1, $n2_1, $ni2_2, $n2_2, $c2, $c1) = $row;
		//print($ni1_1.', '.$n1_1.', '.$ni1_2.', '.$n1_2.', '.$ni2_1.', '.$n2_1.', '.$ni2_2.', '.$n2_2.', '.$c2.', '.$c1."\n");
		/*$e1 = $ni1_1.'-'.$ni1_2;
		$e1s = $ni1_2.'-'.$ni1_1;
		$e2 = $ni2_1.'-'.$ni2_2;
		$e2s = $ni2_2.'-'.$ni2_1;*/
		//echo "ni1_1".$ni1_1-$ni1_2;
		//Added by Chanaka
		((float)$ni1_1>(float)$ni1_2)?($e1 = $ni1_2.'-'.$ni1_1):($e1 = $ni1_1.'-'.$ni1_2);
		((float)$ni1_2>(float)$ni1_1)?($e1s = $ni1_1.'-'.$ni1_2):($e1s = $ni1_2.'-'.$ni1_1);
		((float)$ni2_1>(float)$ni2_2)?($e2 = $ni2_2.'-'.$ni2_1):($e2 = $ni2_1.'-'.$ni2_2);
		((float)$ni2_2>(float)$ni2_1)?($e2s = $ni2_1.'-'.$ni2_2):($e2s = $ni2_2.'-'.$ni2_1);
		
		##add the nodes to gD arrays if there is an adjacent edge (the gD arrays only contains those nodes from sp_gene arrays that have edges)
		if (!in_array($n1_1,$gD1)) $gD1[$ni1_1]=$n1_1;
		if (!in_array($n1_2,$gD1)) $gD1[$ni1_2]=$n1_2;
		if (!in_array($n2_1,$gD2)) $gD2[$ni2_1]=$n2_1;
		if (!in_array($n2_2,$gD2)) $gD2[$ni2_2]=$n2_2;
		if (!((array_key_exists($e1,$eL1)) or (array_key_exists($e1s,$eL1)))) $eL1[$e1]=$c1;
		if (!((array_key_exists($e2,$eL2)) or (array_key_exists($e2s,$eL2)))) $eL2[$e2]=$c2;
		array_push($eA,$e2);
		if (count($eC)==0) {
			$eC[$e1]='"'.$e2.'"';
		}else{
			if (array_key_exists($e1,$eC)){
				$eC[$e1].=',"'.$e2.'"';
			}else{
				$eC[$e1]='"'.$e2.'"';
			}
		}
	}
	
	
	//Added by Chanaka
	$eA = array_unique($eA);
	$eL1 = array_unique($eL1);
	
	return array($eC,$eA,$eL1,$eL2,$gD1,$gD2);
}

function writeGeneTable($tbi, $sp, $glist){
	$gstr = "";
	foreach($glist as $g){
		$gstr .= '"'.$g.'", ';
	}
	$gstr = rtrim($gstr, ", ");
	if (count($glist)<1){
		$query_string = 'SELECT '.$sp.'Gene.'.$sp.'_id, '.$sp.'Gene.pfam, '.$sp.'Gene.taird
		FROM '.$sp.'Gene limit 20';
	}else{
		$query_string = 'SELECT '.$sp.'Gene.'.$sp.'_id, '.$sp.'Gene.pfam, '.$sp.'Gene.taird
		FROM '.$sp.'Gene
		WHERE '.$sp.'Gene.'.$sp.'_id IN ('.$gstr.')  limit 20';
	}
	$result = mysql_query($query_string);
	if (!$result) {
		echo 'Could not run query: '.mysql_error();
		exit;
	}
	##Now write the table
	print'
			<table cellpadding="0" cellspacing="0" border="0" class="display" id="gtab'.$tbi.'">
				<thead><tr><th>Select</th><th>Gene ID</th><th>PFAM id</th><th>TAIR desc</th></tr></thead>
				<tbody>';
	while(list($gid, $pfam, $taird) = mysql_fetch_row($result)){
		print '
						<tr><td><input style="display:inline" type="checkbox" id="'.$gid.'" /></td><td>'.$gid.'</td><td>'.$pfam.'</td><td>'.$taird.'</td></tr>';	
	}
	print'
				</tbody>
				<tfoot><tr><th>Select</th><th>Gene ID</th><th>PFAM id</th><th>TAIR desc</th></tr></tfoot>
			</table>';
	return;
}

/*
reads the database for the coexpression networks from collections of nodes

SELECT ptCorr.pt_i1, G1.pt_id, ptCorr.pt_i2, G2.pt_id, ptCorr.corr
FROM ptCorr
INNER JOIN ptGene G1 ON (ptCorr.pt_i1=G1.pt_i)
INNER JOIN ptGene G2 ON (ptCorr.pt_i2=G2.pt_i)
WHERE G1.pt_id IN ("POPTR_0001s01300","POPTR_0006s01250","POPTR_0008s01890")
AND G2.pt_id IN ("POPTR_0001s01300","POPTR_0006s01250","POPTR_0008s01890")
AND ptCorr.corr > 0.2;

*/
function readNetDB($sp, $glist, $th){
	$gstr = "";
	foreach($glist as $g){
		$gstr .= '"'.$g.'", ';
	}
	$gstr = rtrim($gstr, ", ");
	$query_string = 'SELECT  G.'.$sp.'_i, G.'.$sp.'_id
	FROM '.$sp.'Gene G
	WHERE G.'.$sp.'_id IN ('.$gstr.');';
	$result = mysql_query($query_string);
	if (!$result) {
		echo 'Could not run query: '.mysql_error();
		exit;
	}
	$gD = array(); #gene index to gene id dictionary for species sp
	while(list($gi, $g) = mysql_fetch_row($result)){
		if (!in_array($g,$gD)) $gD[$gi]=$g;
	}
	$query_string = 'SELECT '.$sp.'Corr.'.$sp.'_i1, G1.'.$sp.'_id, '.$sp.'Corr.'.$sp.'_i2, G2.'.$sp.'_id, '.$sp.'Corr.corr
	FROM '.$sp.'Corr
	INNER JOIN '.$sp.'Gene G1 ON ('.$sp.'Corr.'.$sp.'_i1=G1.'.$sp.'_i)
	INNER JOIN '.$sp.'Gene G2 ON ('.$sp.'Corr.'.$sp.'_i2=G2.'.$sp.'_i)
	WHERE G1.'.$sp.'_id IN ('.$gstr.')
	AND G2.'.$sp.'_id IN ('.$gstr.')
	AND '.$sp.'Corr.corr > '.$th.';';
	$eL = array(); #eL['geneind1-geneind2']=correlation
	$result = mysql_query($query_string);
	if (!$result) {
		echo 'Could not run query: '.mysql_error();
		exit;
	}
	while(list($ni1, $n1, $ni2, $n2, $corr) = mysql_fetch_row($result)){
		$e = $ni1.'-'.$ni2;
		if (!array_key_exists($e,$eL)) $eL[$e]=$corr;		
	}
	return array($gD, $eL);
}

/*
Same as readNetDB, but adds to the gene and edge list instead of creating them anew.
*/
function addNetDB($sp, $glist, $gD, $eL, $th){
	$gstr = "";
	foreach($glist as $g){
		$gstr .= '"'.$g.'", ';
	}
	$gstr = rtrim($gstr, ", ");
	$query_string = 'SELECT  G.'.$sp.'_i, G.'.$sp.'_id
	FROM '.$sp.'Gene G
	WHERE G.'.$sp.'_id IN ('.$gstr.');';
	$result = mysql_query($query_string);
	if (!$result) {
		echo 'Could not run query: '.mysql_error();
		exit;
	}
	while(list($gi, $g) = mysql_fetch_row($result)){
		if (!in_array($g,$gD)) $gD[$gi]=$g;
	}
	$query_string = 'SELECT '.$sp.'Corr.'.$sp.'_i1, G1.'.$sp.'_id, '.$sp.'Corr.'.$sp.'_i2, G2.'.$sp.'_id, '.$sp.'Corr.corr
	FROM '.$sp.'Corr
	INNER JOIN '.$sp.'Gene G1 ON ('.$sp.'Corr.'.$sp.'_i1=G1.'.$sp.'_i)
	INNER JOIN '.$sp.'Gene G2 ON ('.$sp.'Corr.'.$sp.'_i2=G2.'.$sp.'_i)
	WHERE G1.'.$sp.'_id IN ('.$gstr.')
	AND G2.'.$sp.'_id IN ('.$gstr.')
	AND '.$sp.'Corr.corr > '.$th.';';
	
	/*$query_string = 'SELECT '.$sp.'Corr.'.$sp.'_i1, G1.'.$sp.'_id, '.$sp.'Corr.'.$sp.'_i2, G2.'.$sp.'_id, '.$sp.'Corr.corr
	FROM '.$sp.'Corr
	INNER JOIN '.$sp.'Gene G1 ON ('.$sp.'Corr.'.$sp.'_i1=G1.'.$sp.'_i)
	INNER JOIN '.$sp.'Gene G2 ON ('.$sp.'Corr.'.$sp.'_i2=G2.'.$sp.'_i)
	WHERE (G1.'.$sp.'_id IN ('.$gstr.') AND '.$sp.'Corr.corr > '.$th.')
	OR (G2.'.$sp.'_id IN ('.$gstr.')
	AND '.$sp.'Corr.corr > '.$th.');';*/
	
	
	
	$result = mysql_query($query_string);
	if (!$result) {
		echo 'Could not run query: '.mysql_error();
		exit;
	}
	while(list($ni1, $n1, $ni2, $n2, $corr) = mysql_fetch_row($result)){
		$e = $ni1.'-'.$ni2;
		$e2 = $ni2.'-'.$ni1;
		if (!((array_key_exists($e,$eL)) or (array_key_exists($e2,$eL)))) $eL[$e]=$corr;
	}
	return array($gD, $eL);
}


//Noramalized by Chanaka
function writeNet1($gD, $eL, $nC, $eC, $tfs=array()){
	$n=0;
	foreach(array_keys($gD) as $gi){
		
		$conN =array();;
		$col = 0;
		$tf="";
		if (array_key_exists($gi,$nC)) {
			//$conN = trim($nC[$gi], '"');
			array_push($conN,$nC[$gi]);
			$col = 1;
		}
		//print_r( $conN);
		///if($tfs!=null){
        if (in_array($gD[$gi],$tfs)){
            $tf = "true";
        } 
		///}
		$gi_tmp=(string)$gi;
		$nodes_array[$n]->id=$gi_tmp;
		$nodes_array[$n]->label=$gD[$gi];
		$nodes_array[$n]->conN=$conN;//'['.$conN.']';
		$nodes_array[$n]->col=$col;
		$nodes_array[$n]->tf=$tf;
		$n++;		
	}
	$j=0;
	
	//print_r($eL);
	
	foreach(array_keys($eL) as $e){
		$conE=array();
		$col = 0;
		list($n1,$n2) = split("-", $e);
		$e2 =  $n2.'-'.$n1;
		//$en=  $n1.'-'.$n2;
		//if(floatval($n1)>floatval($n2)){ $e2 =  $n2.'-'.$n1;}else{ $e2 =  $n1.'-'.$n2;}

		if (array_key_exists($e,$eC)){
			//$conE = $eC[$e];//trim($eC[$e], '"');;
			array_push($conE,$eC[$e]);
			$col = 1;
		}
		if (array_key_exists($e2,$eC)){
			//$conE =  $eC[$e2];//trim($eC[$e2], '"');;
			array_push($conE,$eC[$e2]); 
			//array_push($conE,$eC[$en]);
			$col = 1;
		}
		$v=1;
		$c=floatval($eL[$e]);
		if ($c>10){
			$v=5;
		}else{
			$v=round(5.0-4.0*(10.0-$c)/9.0);
		}
		
		//sort($conE);
		//$conE=array_unique($conE);
	
		$edges_array[$j]->id=(string)$e;
		$edges_array[$j]->source=$n1;
		$edges_array[$j]->target=$n2;
		$edges_array[$j]->corr=$v;
		$edges_array[$j]->col=$col;
		$edges_array[$j]->conE=$conE;
		$j++;
	
	}
//	print_r($edges_array);
	$final_array=array('nodes'=>$nodes_array,'edges'=>$edges_array);
	return $final_array;
}


function writeNet2($gD, $eL, $nA, $eA,$tfs=array()){
	$n=0;
	
	
	foreach(array_keys($gD) as $gi){
		$cons = 0;
        $tf = "";
		//Added by CM
		//if($tfs!=null){
        if (in_array($gD[$gi],$tfs)){
            $tf ="true";
        }
		
		if (in_array($gi,$nA)) $cons = 1;
	//	}
		$gi_tmp=(string)$gi;
		$nodes_array[$n]->id=$gi_tmp;
		$nodes_array[$n]->label=$gD[$gi];
		$nodes_array[$n]->cons=$cons;
		$nodes_array[$n]->tf=$tf;
		$n++;	 	
	}

	$j=0;

//print_r($eL);

	foreach(array_keys($eL) as $e){
		$cons = 0;
		if (in_array($e,$eA)) $cons = 1;
		list($n1,$n2) = split("-", $e);

		$v=1;
		$c=floatval($eL[$e]);
		if ($c>10){
			$v=5;
		}else{
			$v=round(5.0-4.0*(10.0-$c)/9.0);
		}
		
		
		//list($nn1,$nn2) = split("-", $e);
		//if(floatval($nn1)>floatval($nn2)){$e=$nn2."-".$nn1;}else{$e=$nn1."-".$nn2;}
		
		
		$edges_array[$j]->id=(string)$e;
		/*
		if(floatval($n1)>floatval($n2)){
		$edges_array[$j]->source=$n2;
		$edges_array[$j]->target=$n1;
		}else{*/
		$edges_array[$j]->source=$n1;
		$edges_array[$j]->target=$n2;	
		//}
		$edges_array[$j]->corr=(string)$v;// This should be wrong datatype
		$edges_array[$j]->cons=$cons;
		$j++;
	}
	
		//print_r($edges_array);
	
	$final_array=array('nodes'=>$nodes_array,'edges'=>$edges_array);
	return $final_array;
}





/*function writeNetx($gD, $eL, $nC, $eC, $tfs=array()){
	##write the nodes
	##{ id:'3525', label:'POPTR_0001s45720', conN:["4170"], tf:'true'},
	$pissu1="";
	
	$pissu1.="nodes:[";
	foreach(array_keys($gD) as $gi){
		$conN = "";
		$col = "0";
		$tf = "";
		if (array_key_exists($gi,$nC)) {
			$conN = $nC[$gi];
			$col = "1";
		}
        if (in_array($gD[$gi],$tfs)){
            $tf = ', tf:"true"';
        }
		$pissu1.= "{ id:'".$gi."', label:'".$gD[$gi]."', conN:[".$conN."], col:".$col." ".$tf."},";
	}
	$pissu1.= "],";
	##write the edges
	##{ id:'20579to1557', source:'20579', target:'1557', corr:'9.70791', col: 0, conE: []}
	$pissu1.= "			edges: [";
	foreach(array_keys($eL) as $e){
		$conE = "";
		$col = "0";
		list($n1,$n2) = split("-", $e);
		$e2 =  $n2.'-'.$n1;
		if (array_key_exists($e,$eC)){
			$conE = $eC[$e];
			$col = "1";
		}
		if (array_key_exists($e2,$eC)){
			$conE = $eC[$e2];
			$col = "1";
		}
		$v=1;
		$c=floatval($eL[$e]);
		if ($c>10){
			$v=5;
		}else{
			$v=round(5.0-4.0*(10.0-$c)/9.0);
		}
		$pissu1.= "{ id:'".$e."', source:'".$n1."', target:'".$n2."', corr:'".$v."', col: ".$col.", conE: [".$conE."]},";
	}
	$pissu1.= "],";
	return $pissu1;
}*/

/*function writeNet2($gD, $eL, $nA, $eA,$tfs=array()){
	##write the nodes
	##{ id:'3525', label:'POPTR_0001s45720', conN:["4170"], tf:'true'},
	$pissu2="";
	$pissu2.= "			nodes: [\n";
	foreach(array_keys($gD) as $gi){
		$cons = "0";
        $tf = "";
        if (in_array($gD[$gi],$tfs)){
            $tf = ', tf:"true"';
        }
		if (in_array($gi,$nA)) $cons = "1";
		$pissu2.= "				{ id:'".$gi."', label:'".$gD[$gi]."', cons:".$cons." ".$tf."},\n";
	}
	$pissu2.= "			],\n";
	##write the edges
	##{ id:'20579to1557', source:'20579', target:'1557', corr:'9.70791', col: 0, conE: []}				
	$pissu2.= "			edges: [\n";
	foreach(array_keys($eL) as $e){
		$cons = "0";
		if (in_array($e,$eA)) $cons = "1";
		list($n1,$n2) = split("-", $e);
		$v=1;
		$c=floatval($eL[$e]);
		if ($c>10){
			$v=5;
		}else{
			$v=round(5.0-4.0*(10.0-$c)/9.0);
		}
		$pissu2.= "				{ id:'".$e."', source:'".$n1."', target:'".$n2."', corr:'".$v."', cons:".$cons."},\n";
	}
	$pissu2.= "			],\n";
	return $pissu2;
}
*/
// /*
// Checks if the input genes are the right format
// TODO:
// - right now it only checks the first gene
// - it should be done before getting data from the database
// */
// function checkSP($sp){
	// $test = substr($sp, 0, 2);
	// $check = array("PO" => "pt", "AT" => "at", "Os" => "os");
	// if ($check[$test] == $_SESSION['sp1']){
		// return TRUE;
	// }else{
		// return FALSE;
	// }
// }

// function getNodes($nodes, $th){
	// ######
	// # Get nodes that are conserved between the two species from sp1 to sp2 
	// ######
	// global $sp1, $sp2, $sp3, $sp1TFDic, $sp2TFDic, $sp1ConsDic, $sp2ConsDic, $sp1GeneDic, $sp2GeneDic, $sp1Edg, $sp2Edg, $hasEdgsp1, $hasEdgsp2, $sp1ConGene;
	// $names = getNames($nodes);
	// $query = 'SELECT '.$sp1.'Gene.'.$sp1.'_id, '.$sp1.'Gene.'.$sp1.'_i, '.$sp1.'TF.tf_i, '.$sp3.'Nod.'.$sp2.'_i, '.$sp2.'TF.tf_i FROM '.$sp1.'Gene LEFT JOIN '.$sp1.'TF ON('.$sp1.'TF.tf_i = '.$sp1.'Gene.'.$sp1.'_id) LEFT JOIN '.$sp3.'Nod ON('.$sp1.'Gene.'.$sp1.'_i = '.$sp3.'Nod.'.$sp1.'_i) LEFT JOIN '.$sp2.'TF ON('.$sp2.'TF.tf_i = '.$sp3.'Nod.'.$sp2.'_i) WHERE '.$sp1.'Gene.'.$sp1.'_id in('.$names.')';
	// $nodes = sqlQuery($query);
	// $sp2Gtmp = array();
	// ###################################
	// for($i=0; $i<sizeof($nodes); $i++){  # what for?  maybe to avoid errors
		// $sp1GeneDic[$nodes[$i][1]] = $nodes[$i][0];
		// if($nodes[$i][2] != ""){
			// $sp1TFDic[$nodes[$i][1]] = $nodes[$i][2];
		// }
		// if($nodes[$i][3] != ""){
			// if($tmp = $sp1ConGene[$nodes[$i][1]]){
				// $sp1ConGene[$nodes[$i][1]] = $tmp.','.$nodes[$i][3];
				// array_push($sp2Gtmp, $nodes[$i][3]);
			// }else{
				// $sp1ConGene[$nodes[$i][1]] = $nodes[$i][3];
				// array_push($sp2Gtmp, $nodes[$i][3]);
			// }
		// }
	// }
	// getEdg(array_keys($sp1GeneDic));
	// getSp2($sp1ConGene);
	// #print_r(array($sp1GeneDic, $sp2GeneDic, $sp1ConsGene, $sp1ConsDic, $sp2ConsDic, $sp1Edg, $sp2Edg, $hasEdgsp1, $hasEdgsp2));
// }

// function getSp2($sp1ConGene){
	// $in = array_values($sp1ConGene);	
	// global $sp1, $sp2, $sp3, $sp2TFDic, $sp2GeneDic, $hasEdgsp2, $sp2Edg;
	// $names2 = getNames($in, "int");
	// $query = 'SELECT '.$sp2.'Gene.'.$sp2.'_id, '.$sp2.'Gene.'.$sp2.'_i, '.$sp2.'TF.tf_i FROM '.$sp2.'Gene LEFT JOIN '.$sp2.'TF ON('.$sp2.'TF.tf_i = '.$sp2.'Gene.'.$sp2.'_id) WHERE '.$sp2.'Gene.'.$sp2.'_i in('.$names2.')';
	// $res = sqlQuery($query);  ## get conserved edges
	// #print_r($query);
	// foreach($res as $val){
		// $sp2GeneDic[$val[1]] = $val[0];
		// if ($val[2] != ""){
			// $sp2TFDic[$val[0]] = $val[2];
		// }
	// }
	// $query2 = 'SELECT '.$sp2.'_i1, '.$sp2.'_i2, corr FROM '.$sp2.'Corr'.$if_tf.' WHERE ('.$sp2.'_i1 in('.$names2.') AND '.$sp2.'_i2 in('.$names2.'))';
	// $resN = sqlQuery($query2);
	// foreach($resN as $val){
		// $sp2Edg[$val[0]."to".$val[1]] = $val[2];  ## get inspecies correlation
		// $hasEdgsp2[$val[0]] = TRUE;
		// $hasEdgsp2[$val[1]] = TRUE;
	// }
	// #print_r($sp2GeneDic);
// }

// function getEdg($nodes){
	// global $sp1, $sp2, $sp3, $sp1ConsDic, $sp2ConsDic, $sp1Edg, $hasEdgsp1, $hasEdgsp2, $sp2GeneDic;
	// $thresh = "1"; ## all nodes may be needed in future
	// $names = getNames($nodes, "int");
	// $query = 'SELECT '.$sp1.'_i1, '.$sp1.'_i2, corr FROM '.$sp1.'Corr'.$if_tf.' WHERE ('.$sp1.'_i1 in('.$names.') AND '.$sp1.'_i2 in('.$names.')) AND corr>'.$thresh;
	// $query2 = 'SELECT '.$sp1.'_i1, '.$sp1.'_i2, corr1, '.$sp2.'_i1, '.$sp2.'_i2, corr2 FROM '.$sp3.' WHERE ('.$sp1.'_i1 in('.$names.') AND '.$sp1.'_i2 in('.$names.'))';
	// $edges = sqlQuery($query);
	// foreach($edges as $edge){
		// $sp1Edg[$edge[0]."to".$edge[1]] = $edge[2];
		// $hasEdgsp1[$edge[0]] = TRUE;
		// $hasEdgsp1[$edge[1]] = TRUE;
	// }
	// $cons = sqlQuery($query2);
	// foreach($cons as $edge){
		// $sp1ConsDic[$edge[0]."to".$edge[1]] = array($edge[2], $edge[3]."to".$edge[4]);
		// $sp2ConsDic[$edge[3]."to".$edge[4]] = array($edge[5], $edge[0]."to".$edge[1]);
		// $hasEdgsp1[$edge[0]] = TRUE;
		// $hasEdgsp1[$edge[1]] = TRUE;
		// $hasEdgsp2[$edge[3]] = TRUE;
		// $hasEdgsp2[$edge[4]] = TRUE;
	// }
	// #$hasEdgsp1 = array_unique($hasEdgsp1); #remove doubles
	// #$hasEdgsp2 = array_unique($hasEdgsp2); #remove doubles
	
	// $names2 = getNames(array_keys($hasEdgsp2), "int");
	// $query = 'SELECT '.$sp2.'Gene.'.$sp2.'_id, '.$sp2.'Gene.'.$sp2.'_i, '.$sp2.'TF.tf_i FROM '.$sp2.'Gene LEFT JOIN '.$sp2.'TF ON('.$sp2.'TF.tf_i = '.$sp2.'Gene.'.$sp2.'_id) WHERE '.$sp2.'Gene.'.$sp2.'_i in('.$names2.')';
	// $res = sqlQuery($query);  ## get conserved edges
	// foreach($res as $val){
		// $sp2GeneDic[$val[1]] = $val[0];
		// if ($val[2] != ""){
			// $sp2TFDic[$val[0]] = $val[2];
		// }
	// }
// }

// function printNW1(){
	// $onlyEdges = FALSE;
	// global $sp1TFDic, $sp2TFDic, $sp1ConsDic, $sp2ConsDic, $sp1GeneDic, $sp2GeneDic, $sp1Edg, $sp2Edg, $hasEdgsp1, $hasEdgsp2, $sp1ConGene;
	// if($onlyEdges){
		// $nodes = array_keys($hasEdgsp1); 
	// }
	// else{
		// $nodes = array_keys($sp1GeneDic);
	// }
	// #echo 'nodes: 	[ 	';
	// #print_R($hasEdgsp2);
		// foreach($nodes as $gene){
			// #if($tp = $sp1ConGene[$gene] && array_key_exists($gene,$hasEdgsp1)){	
			// if($tp = $sp1ConGene[$gene]){
				// echo "{ id:'"; echo $gene;
				// echo "', label:'"; echo $sp1GeneDic[$gene];
				// if (sizeof($sp1TFDic) > 0){
					// echo "', tf:'"; echo $sp1TFDic[$gene];
				// }
				// if($hasEdgsp2[$tp]){
				// echo "', conN:"; echo "[\"$tp\"]";
				// }else{
					// echo "', conN: []";
				// }
			// echo "},
			// ";
			// }
			// elseif($all == TRUE){ 
				// echo "{ id:'"; echo $gene;
				// echo "', label:'"; echo $sp1GeneDic[$gene];
				// if (sizeof($sp1TFDic) > 0){
					// echo "', tf:'"; echo $sp1TFDic[$gene];
				// }
				// echo "', conN: []";
				// echo "},
			// ";
			// }
		
	// }
	// echo'	],
        // edges: 	[ 	';	
	// $edges = array_keys($sp1Edg);
	// foreach($edges as $edge){
		// $tp = split("to", $edge);	
		// if(($x = $sp1ConGene[$tp[0]] && $y = $sp1ConGene[$tp[1]]) || $all == TRUE){
			// echo "{ id:'"; echo $edge;
			// echo "', source:'"; echo $tp[0];
			// echo "', target:'"; echo $tp[1];
			// echo "', corr:'"; echo $sp1Edg[$edge];
			// echo "', col: 0";
			// echo ", conE: []";
			// echo "}, 
				// ";
		// }
	// }
	// $consEdg = array_keys($sp1ConsDic);	
	// foreach($consEdg as $edge){	
		// $tp = split("to", $edge);	
		// if(($x = $sp1ConGene[$tp[0]] && $y = $sp1ConGene[$tp[1]]) || $all == TRUE){
			// echo "{ id:'"; echo $edge;
			// echo "', source:'"; echo $tp[0];
			// echo "', target:'"; echo $tp[1];
			// echo "', corr:'"; echo $sp1ConsDic[$edge][0];
			// echo "', col: 1";
			// echo ", conE: [\"".$sp1ConsDic[$edge][1]."\"]";
			// echo "}, 
				// ";
		// }
	// }
// }

// function printNW2(){
	// $onlyEdges = FALSE;
	// global $sp1TFDic, $sp2TFDic, $sp1ConsDic, $sp2ConsDic, $sp1GeneDic, $sp2GeneDic, $sp1Edg, $sp2Edg, $hasEdgsp1, $hasEdgsp2;
	// if($onlyEdges){
		// $nodes = array_keys($hasEdgsp2);
	// }
	// else{
		// $nodes = array_keys($sp2GeneDic);
	// }
	// #echo 'nodes: 	[ 	';
		// foreach($nodes as $gene){
			// echo "{ id:'"; echo $gene;
			// echo "', label:'"; echo $sp2GeneDic[$gene]."'";
			// if (sizeof($sp1TFDic) > 0){
				// echo "', tf:'"; echo $sp2TFDic[$gene];
			// }
			// #echo "', conN:"; echo "[\"$tp\"]";
			// echo "},
							// ";	
	// }
	// echo'	],
        // edges: 	[ 	';	
	// $edges = array_keys($sp2Edg);
	// foreach($edges as $edge){
		// $tp = split("to", $edge);	
		// echo "{ id:'"; echo $edge;
		// echo "', source:'"; echo $tp[0];
		// echo "', target:'"; echo $tp[1];
		// echo "', corr:'"; echo $sp2Edg[$edge];
		// echo "', col: 0";
		// #echo ", conE: []";
		// echo "}, 
			// ";
	// }
	// $consEdg = array_keys($sp2ConsDic);	
	// foreach($consEdg as $edge){	
		// $tp = split("to", $edge);	
		// echo "{ id:'"; echo $edge;
		// echo "', source:'"; echo $tp[0];
		// echo "', target:'"; echo $tp[1];
		// echo "', corr:'"; echo $sp2ConsDic[$edge][0];
		// echo "', col: 1";
		// #echo ", conE: [\"".$sp1ConsDic[$edge][1]."\"]";
		// echo "}, 
			// ";
	// }
// }

// function addNodes($nodes, $comp, $th){
	// global $sp1, $sp2, $sp3;
	// $names = getNames($nodes);
	// $query = 'SELECT '.$sp1.'Gene.'.$sp1.'_id, '.$sp1.'Gene.'.$sp1.'_i, '.$sp1.'TF.tf_i, '.$sp3.'Nod.'.$sp2.'_i, '.$sp2.'TF.tf_i FROM '.$sp1.'Gene LEFT JOIN '.$sp1.'TF ON('.$sp1.'TF.tf_i = '.$sp1.'Gene.'.$sp1.'_id) LEFT JOIN '.$sp3.'Nod ON('.$sp1.'Gene.'.$sp1.'_i = '.$sp3.'Nod.'.$sp1.'_i) LEFT JOIN '.$sp2.'TF ON('.$sp2.'TF.tf_i = '.$sp3.'Nod.'.$sp2.'_i) WHERE '.$sp1.'Gene.'.$sp1.'_id in('.$names.')';
	// #print $query;
	// $nodes = sqlQuery($query);
	// $old = "";$str = "";$old2 = "";
	// $s = sizeof($nodes);
	// $array = array();
	// $sp2Genes = array();  ##  array for keeping the second species genes
 	// for($i=0; $i<$s; $i++){  # what for?  maybe to avoid errors
		// #print_r($old.' - '.$old2.'
		// #');
		// $sp1GeneDic[$nodes[$i][1]] = $nodes[$i][0];
		// if($nodes[$i][2] != ""){
			// $sp1TFDic[$nodes[$i][1]] = $nodes[$i][2];
		// }
		// if($nodes[$i][3] != ""){
			// $sp1ConsDic[$nodes[$i][1]] = $nodes[$i][3];
			// $sp2GeneDic[$nodes[$i][3]] = "not set";
		// }
		// if($nodes[$i][1] == $old || ($nodes[$i][3] == $old2 && $old2 != "")){
		// #print_r(array($nodes[$i][1],$nodes[$i-1][1],$nodes[$i][3],$nodes[$i-1][3]));
			// if ($nodes[$i][3] != ""){
				// $str .= "\",\"".$nodes[$i][3];
				// array_push($sp2Genes, $nodes[$i][3]);
			// }
		// }
		// elseif($nodes[$i][3] != ""){
			// $str .= "\",\"".$nodes[$i][3];
			// array_push($sp2Genes, $nodes[$i][3]);
		// }
		// if($nodes[$i][1] != $nodes[$i+1][1]){
			// if($nodes[$i][3] != $nodes[$i+1][3] && $str != ""){
				// $str = substr($str, 3);
				// array_push($array, array($nodes[$i][0], $nodes[$i][1], $nodes[$i][2], $str));
				// $str = "";
			// }
		// }
		// $old = $nodes[$i][1];
		// $old2 = $nodes[$i][3];
	// }
	// $nodes = $array;
	// $sp1Genes = array();
	// #print_r(array_keys($sp2GeneDic));
	// foreach($nodes as $gene){
		// array_push($sp1Genes, $gene[1]);
		// echo "{ id:'"; echo $gene[1];
		// echo "', label:'"; echo $gene[0];
		// echo "', tf:'"; echo $gene[2];
		// if($gene[3] != ""){
			// #array_push($sp2Genes, $gene[3]);	
			// echo "', conN:"; echo "[\"$gene[3]\"]";
		// }
		// else{ echo "', conN: []";}
		// echo "},
					// ";
	// }
	// $sp2Genes = array_unique($sp2Genes);
	// return(array($sp1Genes, $sp2Genes));
// }

// ## 			{ id: "2to1", target: "1", source: "2" , conE: ["3to1"]}
// ## ed != 0  { id: "2to1", target: "1", source: "2" }
// function addEdges($nodes, $ed = 0){
	// global $sp1, $sp2, $sp3;
	// $thresh = "1"; ## all nodes may be needed in future
	// $EDG = array();
	// $names = getNames($nodes);
	// $intN = getNames($nodes, "int");
	// #$if_tf = "TF";
	// $query = 'SELECT '.$sp1.'_i1, '.$sp1.'_i2, corr FROM '.$sp1.'Corr'.$if_tf.' WHERE ('.$sp1.'_i1 in('.$names.') AND '.$sp1.'_i2 in('.$names.')) AND corr>'.$thresh;
	// $query2 = 'SELECT '.$sp1.'_i1, '.$sp1.'_i2, corr2, '.$sp2.'_i1, '.$sp2.'_i2, corr1 FROM '.$sp3.' WHERE ('.$sp1.'_i1 in('.$intN.') AND '.$sp1.'_i2 in('.$intN.'))';
	// $edges = sqlQuery($query);
	// foreach($edges as $edge){
		// ADD($edge);
		// array_push($EDG, $edge[0]);
		// array_push($EDG, $edge[1]);
	// }
	// $edges2 = sqlQuery($query2);
	// $arrayIn = array();$old = "";$s = sizeof($edges2);
	// for($i=0; $i<$s; $i++){
		// $str = "";
		// if($edges2[$i][1] == $old){
			// $str .= "\",\"".$edges2[$i][3]."to".$edges2[$i][4];
		// }
		// elseif($old != ""){
			// $str = substr($str, 3);
			// $old = $edges2[$i][1];
			// $str = "";
			// $str .= "\",\"".$edges2[$i][3]."to".$edges2[$i][4];
		// }else{
			// $str .= "\",\"".$edges2[$i][3]."to".$edges2[$i][4];
			// $str = substr($str, 3);
			// if($edges2[$i][3] != ""){
				// array_push($arrayIn, array($edges2[$i][0], $edges2[$i][1], $edges2[$i][2], $str));
			// }
		// }
	// }
	// $str = substr($str, 3);
	// #array_push($arrayIn, array($edges2[$s-1][0], $edges2[$s-1][1], $edges2[$s-1][2], $str));
	// $edges2 = $arrayIn;
	// foreach($edges2 as $edge){
		// ADD($edge, 1);
		// array_push($EDG, $edge[0]);
		// array_push($EDG, $edge[1]);
	// }
	// return(array_unique($EDG));
// }

// function ADD($edge, $ed=0){
	// if($edge[0] != ""){
		// echo "{ id:'"; echo $edge[0]."to".$edge[1];
		// echo "', source:'"; echo $edge[0];
		// echo "', target:'"; echo $edge[1];
		// echo "', corr:'"; echo $edge[2];
		// if ($ed != 0){
			// echo "', col: 1";
			// echo ", conE: [\"".$edge[3]."\"]";
		// }else{
			// echo "', col: 0";
			// echo ", conE: []";
		// }
			// echo "}, 
				// ";
	// }
// }	

// function addEdges2($edges, $edges2=array()){
	// foreach($edges as $edge){
		// echo "{ id:'"; echo $edge[0]."to".$edge[1];
		// echo "', source:'"; echo $edge[0];
		// echo "', target:'"; echo $edge[1];
		// echo "', corr:'"; echo $edge[2];
		// echo "', consE:'1";
		// echo "'},
				// ";
	// }
	// foreach($edges2 as $edge){
		// echo "{ id:'"; echo $edge[0]."to".$edge[1];
		// echo "', source:'"; echo $edge[0];
		// echo "', target:'"; echo $edge[1];
		// echo "', corr:'"; echo $edge[2];
		// echo "', consE:'0";
		// echo "'},
				// ";
	// }
// }

// function addCons($edges, $nodes){
		// global $sp1, $sp2, $sp3;
		// $names = getNames($edges, "int");
		// $names2 = getNames($nodes, "int");
		// print_r($edges);
		// print_r($nodes);
		// $nodes = array();
		// $nodes2 = array();
		// $edges = array();
		// $query = 'SELECT '.$sp2.'Gene.'.$sp2.'_id, '.$sp2.'Gene.'.$sp2.'_i, '.$sp2.'TF.tf_i FROM '.$sp2.'Gene LEFT JOIN '.$sp2.'TF ON('.$sp2.'TF.tf_i = '.$sp2.'Gene.'.$sp2.'_id) WHERE '.$sp2.'Gene.'.$sp2.'_i in('.$names2.')';
		// $query2 = 'SELECT '.$sp2.'_i1, '.$sp2.'_i2, corr1, '.$sp2.'_id FROM '.$sp3.' LEFT JOIN '.$sp2.'Gene ON('.$sp2.'_i = ('.$sp2.'_i1) or '.$sp2.'_i = ('.$sp2.'_i2)) WHERE ('.$sp1.'_i1 in('.$names.') AND '.$sp1.'_i2 in('.$names.'))';
		// $res = sqlQuery($query);
		// foreach($res as $val){
			// array_push($nodes2, array($val[0], $val[1]));
		// }
		// foreach($nodes2 as $gene){	
			// echo "{ id:'"; echo $gene[1];
			// echo "', label:'"; echo $gene[0];
			// echo "', cons: '1";
			// #echo "', tf:'"; echo $gene[5];
			// #echo ", conN:";
			// echo "'},
					// ";
		// }
		// $res = sqlQuery($query2);
		// foreach($res as $val){
			// if($count == 1){
				// array_push($edges, $temp);
				// array_push($nodes, array($val[1], $val[3]));
				// $count -= 1;
			// }
			// else{
				// array_push($nodes, array($val[0], $val[3]));
				// $temp = array($val[0], $val[1], $val[2]);
				// $count +=1;
			// }
		// }
		// foreach($nodes as $gene){
			// echo "{ id:'"; echo $gene[0];
			// echo "', label:'"; echo $gene[1];
			// #echo "', tf:'"; echo $gene[5];
			// #echo ", conN:";
			// echo "'},
					// ";
		// }
		// $query3 = 'SELECT '.$sp2.'_i1, '.$sp2.'_i2, corr FROM '.$sp2.'Corr'.$if_tf.' WHERE ('.$sp2.'_i1 in('.$names2.') AND '.$sp2.'_i2 in('.$names2.'))';
		// $resN = sqlQuery($query3);
		// $edges2 = array();
		// foreach($resN as $val){
			// $temp = array($val[0], $val[1], $val[2]);
			// array_push($edges2, $temp);
		// }
		// $nodes = array_merge($nodes, $nodes2);
		// return array($edges, $edges2);
// }

// function sqlQuery($query){  #return double array with values
	// $dbArray = array();
	// $result = mysql_query($query);
	// print "DB search"
	// print_r($result);
	// while($row = mysql_fetch_row($result)){
		// $array = array();
		// array_push($array, $row[0]);
		// array_push($array, $row[1]);
		// if($row[2] != NULL){
			// array_push($array, $row[2]);
		// }else{
			// array_push($array, "");
		// }
		// if(sizeof($row) > 3){
			// if($row[3] != NULL){
				// array_push($array, $row[3]);
			// }else{
				// array_push($array, "");
			// }
			// #array_push($array, $row[3]);
			// array_push($array, $row[4]);
		// }
		// if(sizeof($row) > 4){
			// array_push($array, $row[5]);
		// }
		// #print_r($array);
		// array_push($dbArray, $array);
	// }
	// #print_r($dbArray);
	// return $dbArray;
// }

// function getNames($names, $int){
	// $str = "";
	// if($int == "int"){
		// foreach($names as $name){
			// $str = $str.','.$name.'';
		// }
	// }else{
		// foreach($names as $name){
			// $str = $str.',"'.$name.'"';
		// }
	// }
	// $names = substr($str, 1);
	// return $names;
// }

// function getNames2($names, $int){
	// $str = "";
	// if($int == "int"){
		// foreach($names as $name){
			// $name = $name+1;
			// $str = $str.','.$name.'';
		// }
	// }else{
		// foreach($names as $name){
			// $str = $str.',"'.$name.'"';
		// }
	// }
	// $names = substr($str, 1);
	// $names = substr($names, 0, -3);
	// return $names;
// }

// function getGOgenes($gos){
	// global $sp1;
	// $gos = rtrim($gos);
	// $gos = preg_split("/[\s]+/",$gos);
	// $gos = array_unique($gos);
	// $gos = getNames($gos);
	// $query = "SELECT gene FROM ".$sp1."go_sl WHERE go_id in(".$gos.")";
	// $array = array();
	// $result = mysql_query($query);
	// while($row = mysql_fetch_row($result)){
		// array_push($array, $row[0]);
	// }
	// return $array;
// }

?>