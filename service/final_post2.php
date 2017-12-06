<?php
require_once("../db.php");
require("array_column.php");

if($tmp_op=='expand'){
#SELECT  count(distinct pt_i1) FROM ptcorr_view WHERE  pt_id in('') AND corr > 4
/*if($debug==true){print("<strong>----------------a.) QUERY >> WHEN WE NEED TO EXPAND</strong></br>");}
$a0_query ='SELECT  '.$tmp_sp1.'_i1 FROM '.$tmp_sp1.'corr_view  WHERE '.$tmp_sp1.'_id in('.$gsel1.') AND corr > '.$tmp_th1.' limit 201';
$a0_query_results = mysql_query($a0_query);
while ($a0_row = mysql_fetch_array($a0_query_results)){
      $a0_array[] = $a0_row[0];
 }
if(count($a0_array) > 200) {
echo json_encode("overflow");  
exit();	
}*/

$a0_query ='SELECT  '.$tmp_sp1.'_i1 FROM '.$tmp_sp1.'Corr WHERE ('.$tmp_sp1.'_i1 in(SELECT '.$tmp_sp1.'_i FROM '.$tmp_sp1.'Gene WHERE '.$tmp_sp1.'_id in('.$gsel1.')) OR '.$tmp_sp1.'_i2 in(SELECT '.$tmp_sp1.'_i FROM '.$tmp_sp1.'Gene WHERE '.$tmp_sp1.'_id in('.$gsel1.')) 
)AND corr > '.$tmp_th1.' limit 201';
$msc=microtime(true);
$a0_query_results = mysql_query($a0_query);
while ($a0_row = mysql_fetch_array($a0_query_results)){
      $a0_array[] = $a0_row[0];
   }
$msc=microtime(true)-$msc;

if(count($a0_array) > 200) {
echo json_encode("overflow");  
exit();	
	} 
	
	

//$a_query ='SELECT '.$tmp_sp1.'_i1,'.$tmp_sp1.'_i2  FROM '.$tmp_sp1.'Corr WHERE ('.$tmp_sp1.'_i1 in(SELECT '.$tmp_sp1.'_i FROM '.$tmp_sp1.'Gene WHERE '.$tmp_sp1.'_id in('.$gsel1.')) OR '.$tmp_sp1.'_i2 in(SELECT '.$tmp_sp1.'_i FROM '.$tmp_sp1.'Gene WHERE '.$tmp_sp1.'_id in('.$gsel1.')) )AND corr > '.$tmp_th1.' ';
$a_query ='SELECT  '.$tmp_sp1.'_i1,'.$tmp_sp1.'_i2 FROM '.$tmp_sp1.'corr_view  WHERE '.$tmp_sp1.'_id in('.$gsel1.') AND corr > '.$tmp_th1.'';

$a_query_results = mysql_query($a_query);
if($debug==true){print($a_query);} 
while ($a_row = mysql_fetch_array($a_query_results)){
      $a_array[] = $a_row[0];
	  $a_array1[] = $a_row[1];
   }
$a_array2=array_merge($a_array,$a_array1);
$a_array_string=implode(',',array_values(array_unique($a_array2)));
}


$first_array=array();
if($tmp_op=='expand'){
$first_query='SELECT '.$tmp_sp1.'_i,'.$tmp_sp1.'_id FROM '.$tmp_sp1.'Gene WHERE '.$tmp_sp1.'_i in('.$a_array_string.') or '.$tmp_sp1.'_id in('.$gstr1.')';// or '.$tmp_sp1.'_id in('.$gstr1.')
}else{
$first_query='SELECT '.$tmp_sp1.'_i,'.$tmp_sp1.'_id FROM '.$tmp_sp1.'Gene WHERE '.$tmp_sp1.'_id in('.$gstr1.')';	
}

$first_query_results = mysql_query($first_query);
$a1=0;
while ($row=mysql_fetch_row($first_query_results)){
	$first_array[$a1]['id']=$row[0];
	$first_array[$a1]['label']=$row[1];
	$a1++;}
if($debug==true){print("<strong>----------------1.) QUERY >> FIRST NETWORK</strong></br>");}
if($debug==true){print($first_query);}
$first_sp_1_array=array_column($first_array, 'id');
$first_sp_1_array_string=implode(',',array_values(array_unique($first_sp_1_array)));
$second_array=array();
if($tmp_showN=='align'){
if($debug==true){print("<br><strong>----------------2.) QUERY >> ALIGN BOTH NETWORKS</strong></br>");}	
$second_query='SELECT '.$tmp_sp1.'_i,'.$tmp_sp2.'_i FROM '.$tabln.'Nod WHERE '.$tmp_sp1.'_i IN ('.$first_sp_1_array_string.') AND type="c" AND corr = 2';
if($debug==true){print($second_query);}
}else{
if($debug==true){print("<br><strong>----------------3.) QUERY >> COMPARE BOTH NETWORkS</strong></br>");}	
$second_query='SELECT '.$tmp_sp1.'_i,'.$tmp_sp2.'_i FROM '.$tabln.'Nod WHERE '.$tmp_sp1.'_i IN ('.$first_sp_1_array_string.') AND '.$tmp_sp2.'_i IN(SELECT '.$tmp_sp2.'_i FROM '.$tmp_sp2.'Gene WHERE '.$tmp_sp2.'_id in('.$gstr2.')) AND type="c" AND corr = 2';	
if($debug==true){print($second_query);}
}
$second_query_results = mysql_query($second_query);
$a2=0;
while(list($sp1_id, $sp2_id) = mysql_fetch_row($second_query_results)){
	if($sp1_id>$sp2_id){$trgt=$sp1_id;$src=$sp2_id;}else{$trgt=$sp2_id;$src=$sp1_id;}
	$second_array[$a2]['links']=$src.'-'.$trgt;
	$second_array[$a2]['sp2']=$sp2_id;
	$second_array[$a2][$sp1_id]=$sp2_id;
	$second_array[$a2][$sp2_id.'second']=$sp1_id;
	$a2++;}
if($debug==true){print("<br><strong>----------------4.) RESULTS >> FIRST NETWORK NODE(S) 2 SECOND NETWORK NODE(S)</strong></br>");}
$second_sp1_sp2_array=array_column($second_array, 'links');
$second_sp1_sp2_array_string=implode(',',array_values(array_unique($second_sp1_sp2_array)));
if($debug==true){print($second_sp1_sp2_array_string);}
if($debug==true){print("<br><strong>----------------5.) RESULTS >> SECOND NETWORK IDS</strong></br>");}
$second_sp_2_array = array_column($second_array, 'sp2');
$second_sp_2_array=array_values(array_unique($second_sp_2_array));
$second_sp_2_array_string=implode(',',$second_sp_2_array); 
if($debug==true){print($second_sp_2_array_string);}
if($debug==true){print("<br><strong>----------------6.) QUERY >> CONSERVED EDGES</strong></br>");}
$third_array=array();
$third_query = 'SELECT '.$tmp_sp1.'_i1,'.$tmp_sp1.'_i2,corr1,'.$tmp_sp2.'_i1,'.$tmp_sp2.'_i2,corr2 FROM '.$tabln.' WHERE ('.$tmp_sp1.'_i1 IN ('.$first_sp_1_array_string.') AND '.$tmp_sp1.'_i2 IN ('.$first_sp_1_array_string.')) AND ('.$tmp_sp2.'_i1 IN ('.$second_sp_2_array_string.') AND '.$tmp_sp2.'_i2 IN ('.$second_sp_2_array_string.')) AND corr1>'.$tmp_consth1.' AND corr2>'.$tmp_consth2.'';
if($debug==true){print($third_query);}
$third_query_results = mysql_query($third_query);
$a3=0;
while(list($i11, $i12,$corr1,$i21,$i22,$corr2) = mysql_fetch_row($third_query_results)){
	if($i11>$i12){$trgt1=$i11;$src1=$i12;}else{$trgt1=$i12;$src1=$i11;}
	if($i21>$i22){$trgt2=$i21;$src2=$i22;}else{$trgt2=$i22;$src2=$i21;}
	$third_array[$a3][$src1.'-'.$trgt1]=$src2.'-'.$trgt2;
	$third_array[$a3][$src2.'-'.$trgt2.'second']=$src1.'-'.$trgt1;
	$a3++;}
if($debug==true){print("<br><strong>----------------7.) QUERY >> NODES WITHIN FIRST NETWORK</strong></br>");}
$forth_array=array();
$forth_query ='SELECT '.$tmp_sp1.'_i1,'.$tmp_sp1.'_i2,corr FROM '.$tmp_sp1.'Corr WHERE '.$tmp_sp1.'_i1 in('.$first_sp_1_array_string.') AND '.$tmp_sp1.'_i2 in('.$first_sp_1_array_string.') AND corr>'.$tmp_th1.'';
$forth_query_results = mysql_query($forth_query);
if($debug==true){print($forth_query);}
$a4=0;
while(list($i11, $i12,$corr) = mysql_fetch_row($forth_query_results)){
	if($i11>$i12){$trgt=$i11;$src=$i12;}else{$trgt=$i12;$src=$i11;}
	$forth_array[$a4]['id']=$src.'-'.$trgt;
	$forth_array[$a4]['corr']=$corr;	
	$forth_array[$a4]['src']=$src;
	$forth_array[$a4]['trgt']=$trgt;
	$a4++;}
if($debug==true){print("<br><strong>----------------8.) QUERY >> NODES WITHIN SECOND NETWORK</strong></br>");}
$fifth_array=array();
$fifth_query ='SELECT '.$tmp_sp2.'_i1,'.$tmp_sp2.'_i2,corr FROM '.$tmp_sp2.'Corr WHERE '.$tmp_sp2.'_i1 in('.$second_sp_2_array_string.') AND '.$tmp_sp2.'_i2 in('.$second_sp_2_array_string.') AND corr>'.$tmp_th2.'';
if($debug==true){print($fifth_query);}
$fifth_query_results = mysql_query($fifth_query);
$a5=0;
while(list($i21, $i22,$corr) = mysql_fetch_row($fifth_query_results)){
	if($i21>$i22){$trgt2=$i21;$src2=$i22;}else{$trgt2=$i22;$src2=$i21;}
	$fifth_array[$a5]['id']=$src2.'-'.$trgt2;
	$fifth_array[$a5]['src']=$src2;
	$fifth_array[$a5]['trgt']=$trgt2;
	$fifth_array[$a5]['corr']=$corr;
	$a5++;}
if($debug==true){print("<br><strong>----------------9.) QUERY >> SECOND NETWORK LABELS</strong></br>");}
$sixth_array=array();
$sixth_query='SELECT '.$tmp_sp2.'_i,'.$tmp_sp2.'_id FROM '.$tmp_sp2.'Gene WHERE '.$tmp_sp2.'_i in('.$second_sp_2_array_string.')';
if($debug==true){print($sixth_query);}
$sixth_query_results = mysql_query($sixth_query);
$a6=0;
while (list($sp2_i, $sp2_id)=mysql_fetch_row($sixth_query_results)){
	$sixth_array[$a6][$sp2_i]=$sp2_id;
	$a6++;}
if($debug==true){print("<br><strong>----------------10.) ARRAY PROCESSING >> FIRST NETWORK NODE(S) 2 NODE(S) ARRAY</strong></br>");}
for($m=0;$m<count($first_array);$m++){
	$first_array_node_id_array=array_column($first_array, 'id');
	$children[$m]->id=$first_array_node_id_array[$m];
	$first_array_node_label_array=array_column($first_array, 'label');
	$children[$m]->label=$first_array_node_label_array[$m];
	$first_array_node_connection_array=array_column($second_array, $first_array_node_id_array[$m]);
	$first_array_node_connection_string=implode(",",array_values(array_unique($first_array_node_connection_array)));
	$children[$m]->conN=array($first_array_node_connection_string);
	if($first_array_node_connection_string==""){$col=0;}else{$col=1;}
	$children[$m]->col=$col;
	$children[$m]->tf="";
	$first_array_nodes_array[]=$children[$m];
}
if($debug==true){print_r($first_array_nodes_array);}
if($debug==true){print("<br><strong>----------------11.) ARRAY PROCESSING >> FIRST NETWORK EDGES ARRAY</strong></br>");}
for($m=0;$m<count($forth_array);$m++){
		$first_array_edges_id_array=array_column($forth_array, 'id');
		$edges_children[$m]->id=$first_array_edges_id_array[$m];
		$first_array_edges_src_array=array_column($forth_array, 'src');
		$edges_children[$m]->source=$first_array_edges_src_array[$m];
		$first_array_edges_trgt_array=array_column($forth_array, 'trgt');
		$edges_children[$m]->target=$first_array_edges_trgt_array[$m];
		$first_array_edges_corr_array=array_column($forth_array, 'corr');
		$edges_children[$m]->corr=round($first_array_edges_corr_array[$m]);
		$first_array_edges_connection_array=array_column($third_array, $first_array_edges_id_array[$m]);
		$first_array_edges_connection_string=implode(",",array_values(array_unique($first_array_edges_connection_array)));
		$edges_children[$m]->conE=array($first_array_edges_connection_string);
		if($first_array_edges_connection_string==""){$col=0;}else{$col=1;}
		$edges_children[$m]->col=$col;
		$first_array_edges_array[]=$edges_children[$m];	
	}
if($debug==true){print_r($first_array_edges_array);}	
if($debug==true){print("<br><strong>----------------12.) ARRAY PROCESSING >> MERGE FIRST NETWORK NODES AND EDGES ARRAYS</strong></br>");	}
$first_array_nodex_and_edges_array=array('nodes'=>$first_array_nodes_array,'edges'=>$first_array_edges_array);
if($debug==true){print_r($first_array_nodex_and_edges_array);}
if($debug==true){print("<br><strong>----------------13.) ARRAY PROCESSING >> SECOND NETWORK NODE(S) 2 NODE(S) ARRAYS</strong></br>");}
for($n=0;$n<count($second_sp_2_array);$n++){
	$second_children[$n]->id=$second_sp_2_array[$n];
	$second_array_node_label_array=array_column($sixth_array, $second_sp_2_array[$n]);
	$second_array_node_label_array_string=implode(',',array_values(array_unique($second_array_node_label_array)));
	$second_children[$n]->label=$second_array_node_label_array_string;
	$second_array_node_connection_array=array_column($second_array, $second_sp_2_array[$n].'second');
	$second_array_node_connection_string=implode(",",array_values(array_unique($second_array_node_connection_array)));
	//$second_children[$r]->conN=array($second_array_node_connection_string);
	if($second_array_node_connection_string==""){$col=0;}else{$col=1;}
		$second_children[$n]->cons=$col;
		$second_children[$n]->tf="";
		$second_array_nodes_array[]=$second_children[$n];
	}
if($debug==true){print_r($second_array_nodes_array);}	
if($debug==true){print("<br><strong>----------------14.) ARRAY PROCESSING >> SECOND NETWORK EDGES ARRAY</strong></br>");}
for($m=0;$m<count($fifth_array);$m++){
		$second_array_edges_id_array=array_column($fifth_array, 'id');
		$second_edges_children[$m]->id=$second_array_edges_id_array[$m];
		$second_array_edges_src_array=array_column($fifth_array, 'src');
		$second_edges_children[$m]->source=$second_array_edges_src_array[$m];
		$second_array_edges_trgt_array=array_column($fifth_array, 'trgt');
		$second_edges_children[$m]->target=$second_array_edges_trgt_array[$m];
		$second_array_edges_corr_array=array_column($fifth_array, 'corr');
		$second_edges_children[$m]->corr=(string)round($second_array_edges_corr_array[$m]);
		$second_array_edges_connection_array=array_column($third_array, $second_array_edges_id_array[$m].'second');
		$second_array_edges_connection_string=implode(",",array_values(array_unique($second_array_edges_connection_array)));
		//$second_edges_children[$m]->conE=array($second_array_edges_connection_string);
		if($second_array_edges_connection_string==""){$col=0;}else{$col=1;}
		$second_edges_children[$m]->cons=$col;

		$second_array_edges_array[]=$second_edges_children[$m];	
	}
if($debug==true){print_r($second_array_edges_array);}	
if($debug==true){print("<br><strong>----------------15.) ARRAY PROCESSING >> MERGE SECOND NETWORK NODES AND EDGES ARRAYS</strong></br>");}
$second_array_nodex_and_edges_array=array('nodes'=>$second_array_nodes_array,'edges'=>$second_array_edges_array);
if($debug==true){print_r($second_array_nodex_and_edges_array);}
if($debug==true){print("<br><strong>----------------16.) ARRAY PROCESSING >> MERGE FIRST AND SECOND NETWORK ARRAYS THEN ENCODE WITH JSON </strong></br>");}	
$final_first_and_second_array=array('tmp_array1'=>$first_array_nodex_and_edges_array,'tmp_array2'=>$second_array_nodex_and_edges_array,'msc'=>$msc);
echo json_encode($final_first_and_second_array);
exit();