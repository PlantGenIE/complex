<?php
require_once("../db.php");

if (isset($_POST['ids'])) $tmp_ids=$_POST['ids'];
if (isset($_POST['db1'])) $sp1=trim($_POST['db1']);
if (isset($_POST['db2'])) $sp2=trim($_POST['db2']);
//alert($tmp_ids);
$tmp_ids2=explode( ',', $tmp_ids );
$geneids_array_str2=implode('","',$tmp_ids2);
$gstr2='"'.$geneids_array_str2.'"'; 

##
#	Changes by david 2014-06-18  lines marked with #D and if nessesary an explanation
##

## Can be changed to $sp1.$sp2 since all 6 combinations now exists
## /David 2016-06-18
if (($sp1=='pt') and ($sp2=='at')) $tabln = 'ptat'; #D
if (($sp1=='at') and ($sp2=='pt')) $tabln = 'atpt';	#D
if (($sp1=='pt') and ($sp2=='os')) $tabln = 'ptos';	#D
if (($sp1=='os') and ($sp2=='pt')) $tabln = 'ospt';	#D
if (($sp1=='at') and ($sp2=='os')) $tabln = 'atos';	#D
if (($sp1=='os') and ($sp2=='at')) $tabln = 'osat';	#D

$query_string = 'SELECT pval,type,'.$sp2.'Gene.'.$sp2.'_i as K,'.$sp2.'Gene.'.$sp2.'_id as M 
						FROM '.$tabln.'Nod 
						INNER JOIN '.$sp2.'Gene on ('.$tabln.'Nod.'.$sp2.'_i = '.$sp2.'Gene.'.$sp2.'_i)  
						WHERE '.$tabln.'Nod.'.$sp1.'_i IN ('.$gstr2.')
						AND corr = 2 AND type = "c"';  #D added correlation, should be set as a variable in the end


$result = mysql_query($query_string) or die(mysql_error());	

$g = 0;
while ($array_process = mysql_fetch_array($result)) {
	$children[$g]->pval=$array_process['pval'];
	$children[$g]->type=$array_process['type'];
	$children[$g]->id=$array_process['K'];
	$children[$g]->gene=$array_process['M'];
	$ret[] = $children[$g];
	$g++;
}
echo json_encode($ret);;
?>