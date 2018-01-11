<?php
ini_set('max_execution_time', 500);
require_once("../db.php");
require("array_column.php");
$msc=microtime(true);

if($tmp_op=='expand'){
    $a0_query ='SELECT  '.$tmp_sp1.'_i1 FROM '.$tmp_sp1.'Corr WHERE ('.$tmp_sp1.'_i1 in(SELECT '.$tmp_sp1.'_i FROM '.$tmp_sp1.'Gene WHERE '.$tmp_sp1.'_id in('.$gsel1.')) OR '.$tmp_sp1.'_i2 in(SELECT '.$tmp_sp1.'_i FROM '.$tmp_sp1.'Gene WHERE '.$tmp_sp1.'_id in('.$gsel1.')) 
    )AND corr > '.$tmp_th1.' limit 201';

    $a0_query_results = mysql_query($a0_query);
    while ($a0_row = mysql_fetch_array($a0_query_results)){
        $a0_array[] = $a0_row[0];
    }

    if(count($a0_array) > 200) {
        echo json_encode("overflow");  
        exit();	
    } 
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

$first_array = array();
if ($tmp_op == 'expand') {
    $first_query = 'SELECT id, name FROM gene WHERE id in('.$a_array_string.') OR name IN ('.$gstr1.')';
} else {
    $first_query = 'SELECT id, name FROM gene WHERE name in('.$gstr1.')';
}

$first_query_stmt = $db->query($first_query);
$first_query_stmt->execute();
$a1=0;
while ($row = $first_query_stmt->fetch(PDO::FETCH_ASSOC)) {
    $first_array[$a1]['id'] = $row['id'];
    $first_array[$a1]['label'] = $row['name'];
    $a1++;
}

if($debug==true){print("<strong>----------------1.) QUERY >> FIRST NETWORK</strong></br>");}
if($debug==true){print($first_query);}

$first_sp_1_array=array_column2($first_array, 'id');
$first_sp_1_array_string=implode(',',array_values(array_unique($first_sp_1_array)));

$second_array=array();
if($tmp_showN=='align'){
	if($debug==true){print("<br><strong>----------------2.) QUERY >> ALIGN BOTH NETWORKS</strong></br>");}	

        $second_query = 'SELECT gene_id1, gene_id2 FROM conservation
            WHERE gene_id1 IN ('.$first_sp_1_array_string.')
            AND type = "conserved"
            AND network_id1 = '.$tmp_sp1.' AND network_id2 = '.$tmp_sp2;
	if($debug==true){print($second_query);}
} else {
	if($debug==true){print("<br><strong>----------------3.) QUERY >> COMPARE BOTH NETWORkS</strong></br>");}	
        $second_query = 'SELECT gene_id1, gene_id2 FROM conservation
            WHERE gene_id1 IN ('.$first_sp_1_array_string.')
            AND gene_id2 IN (SELECT id FROM gene WHERE name IN ('.$gstr2.'))
            AND type = "conserved"
            AND network_id1 = '.$tmp_sp1.' AND network_id2 = '.$tmp_sp2;

	if($debug==true){print($second_query);}
}

$second_query_stmt = $db->query($second_query);
if (!$second_query_stmt) {
    echo 'Failed to execute query: '.$second_query;
    exit;
}
$second_query_stmt->execute();
$a2=0;
while (list($gene_id1, $gene_id2) = $second_query_stmt->fetch(PDO::FETCH_NUM)) {
    if ($gene_id1 > $gene_id2) {
        $trgt = $gene_id1;
        $src = $gene_id2;
    } else {
        $trgt=$gene_id2;
        $src=$gene_id1;
    }
    $second_array[$a2]['links']=$src.'-'.$trgt;
    $second_array[$a2]['sp2']=$gene_id2;
    $second_array[$a2][$gene_id1]=$gene_id2;
    $second_array[$a2][$gene_id2.'second']=$gene_id1;
    $a2++;
}
if($debug==true){print("<br><strong>----------------4.) RESULTS >> FIRST NETWORK NODE(S) 2 SECOND NETWORK NODE(S)</strong></br>");}
$second_sp1_sp2_array=array_column2($second_array, 'links');
$second_sp1_sp2_array_string=implode(',',array_values(array_unique($second_sp1_sp2_array)));
if($debug==true){print($second_sp1_sp2_array_string);}
if($debug==true){print("<br><strong>----------------5.) RESULTS >> SECOND NETWORK IDS</strong></br>");}
$second_sp_2_array = array_column2($second_array, 'sp2');
$second_sp_2_array=array_values(array_unique($second_sp_2_array));
$second_sp_2_array_string=implode(',',$second_sp_2_array); 
if($debug==true){print($second_sp_2_array_string);}
if($debug==true){print("<br><strong>----------------6.) QUERY >> CONSERVED EDGES</strong></br>");}
$third_array=array();
/*if($tmp_consth2<$tmp_th2){
$t2=$tmp_th2;
}else{
$t2=$tmp_consth2;	
}

if($tmp_consth1<$tmp_th1){
$t1=$tmp_th1;
}else{
$t1=$tmp_consth1;	
}
*/
/*
if (($tmp_sp1=='at' and $tmp_sp2=='pt') or  ($tmp_sp1=='os' and $tmp_sp2=='pt') or ($tmp_sp1=='os' and $tmp_sp2=='at')) {
    $third_query = 'SELECT '.$tmp_sp1.'_i1,
        '.$tmp_sp1.'_i2,
        corr2,
        '.$tmp_sp2.'_i1,
        '.$tmp_sp2.'_i2,
        corr1
    FROM '.$tabln.'
    WHERE ('.$tmp_sp1.'_i1 IN ('.$first_sp_1_array_string.')
        AND '.$tmp_sp1.'_i2 IN ('.$first_sp_1_array_string.'))
        AND ('.$tmp_sp2.'_i1 IN ('.$second_sp_2_array_string.')
        AND '.$tmp_sp2.'_i2 IN ('.$second_sp_2_array_string.'))
        AND corr2 > '.$tmp_consth1.' AND corr1 > '.$tmp_consth2.'';
    print_r($third_query);
    if($debug==true){print($third_query);}
    $third_query_results = mysql_query($third_query);
    $a3=0;
    while(list($i11, $i12,$corr1,$i21,$i22,$corr2) = mysql_fetch_row($third_query_results)){
        if($i11>$i12){$trgt1=$i11;$src1=$i12;}else{$trgt1=$i12;$src1=$i11;}
        if($i21>$i22){$trgt2=$i21;$src2=$i22;}else{$trgt2=$i22;$src2=$i21;}
        $third_array[$a3][$src1.'-'.$trgt1]=$src2.'-'.$trgt2;
        $third_array[$a3][$src2.'-'.$trgt2.'second']=$src1.'-'.$trgt1;	

        $first_n_con_array[$a3]['id']=$src2.'-'.$trgt2;
        $first_n_con_array[$a3]['src']=$src2;
        $first_n_con_array[$a3]['trgt']=$trgt2;
        $first_n_con_array[$a3]['corr']=$corr2;

        $second_n_con_array[$a3]['id']=$src1.'-'.$trgt1;
        $second_n_con_array[$a3]['src']=$src1;
        $second_n_con_array[$a3]['trgt']=$trgt1;
        $second_n_con_array[$a3]['corr']=$corr1;

        $a3++;}
}else{
    $third_query = 'SELECT '.$tmp_sp1.'_i1,
        '.$tmp_sp1.'_i2,
        corr1,
        '.$tmp_sp2.'_i1,
        '.$tmp_sp2.'_i2,
        corr2
    FROM '.$tabln.'
    WHERE ('.$tmp_sp1.'_i1 IN ('.$first_sp_1_array_string.')
        AND '.$tmp_sp1.'_i2 IN ('.$first_sp_1_array_string.'))
        AND ('.$tmp_sp2.'_i1 IN ('.$second_sp_2_array_string.')
        AND '.$tmp_sp2.'_i2 IN ('.$second_sp_2_array_string.'))
        AND corr1 > '.$tmp_consth1.' AND corr2 > '.$tmp_consth2.'';		
    print_r($third_query);
    if($debug==true){print($third_query);}
    $third_query_results = mysql_query($third_query);
    $a3=0;
    while(list($i11, $i12,$corr1,$i21,$i22,$corr2) = mysql_fetch_row($third_query_results)){
        if($i11>$i12){$trgt1=$i11;$src1=$i12;}else{$trgt1=$i12;$src1=$i11;}
        if($i21>$i22){$trgt2=$i21;$src2=$i22;}else{$trgt2=$i22;$src2=$i21;}
        $third_array[$a3][$src1.'-'.$trgt1]=$src2.'-'.$trgt2;
        $third_array[$a3][$src2.'-'.$trgt2.'second']=$src1.'-'.$trgt1;

        $first_n_con_array[$a3]['id']=$src2.'-'.$trgt2;
        $first_n_con_array[$a3]['src']=$src2;
        $first_n_con_array[$a3]['trgt']=$trgt2;
        $first_n_con_array[$a3]['corr']=$corr2;

        $second_n_con_array[$a3]['id']=$src1.'-'.$trgt1;
        $second_n_con_array[$a3]['src']=$src1;
        $second_n_con_array[$a3]['trgt']=$trgt1;
        $second_n_con_array[$a3]['corr']=$corr1;

        $a3++;}
}
 */

//if($debug==true){print_r($third_array);}	
if($debug==true){print("<br><strong>----------------7.) QUERY >> NODES WITHIN FIRST NETWORK</strong></br>");}
$forth_array=array();
$forth_query = 'SELECT gene_id1, gene_id2, score
                FROM network_score
                WHERE network_id = '.$tmp_sp1.'
                    AND gene_id1 IN ('.$first_sp_1_array_string.')
                    AND gene_id2 IN ('.$first_sp_1_array_string.')
                    AND score > '.$tmp_th1;
$forth_query_stmt = $db->query($forth_query);
if (!$forth_query_stmt) {
    echo 'Network 1 edge query failed: '.$forth_query;
    exit;
}
$forth_query_stmt->execute();
if($debug==true){print($forth_query);}
$a4=0;
while (list($i11, $i12,$corr) = $forth_query_stmt->fetch(PDO::FETCH_NUM)){
    if ($i11 > $i12) {
        $trgt=$i11;
        $src=$i12;
    } else {
        $trgt=$i12;
        $src=$i11;
    }
    $forth_array[$a4]['id']=$src.'-'.$trgt;
    $forth_array[$a4]['corr']=$corr;	
    $forth_array[$a4]['src']=$src;
    $forth_array[$a4]['trgt']=$trgt;
    $a4++;
}

	//$hh=count($forth_array);
	//$ll=count($second_n_con_array);
	//if($hh>$ll){
		if($second_n_con_array!=null) foreach ($second_n_con_array as $row) { $forth_array[$row['id']] = $row;}
/*}else{
		}
	$testa = array();
	$testa=$second_n_con_array+$forth_array;
	$forth_array = array();
foreach ($testa as $row) {
    $forth_array[$row['id']] = $row;
}*/

$testa = array();
foreach ($forth_array as $row) {
    $testa[$row['id']] = $row;
}
$forth_array=$testa ;
//$forth_array=
	//$forth_array=array_values(array_unique($forth_array));
	//$forth_array=array_merge($second_n_con_array,$forth_array);
	//$forth_array=array_values(array_unique($forth_array));
	
//if($debug==true){print_r($forth_array);}	
if($debug==true){print("<br><strong>----------------8.) QUERY >> NODES WITHIN SECOND NETWORK</strong></br>");}
$fifth_array=array();
$fifth_query = 'SELECT gene_id1, gene_id2, score
    FROM network_score
    WHERE network_id = '.$tmp_sp2.'
        AND gene_id1 IN ('.$second_sp_2_array_string.')
        AND gene_id2 IN ('.$second_sp_2_array_string.')
        AND score > '.$tmp_th2;
if($debug==true){print($fifth_query);}
$fifth_query_stmt = $db->query($fifth_query);
if (!$fifth_query_stmt) {
    echo 'Network 2 edge query failed: '.$fifth_query;
    exit;
}
$fifth_query_stmt->execute();
$a5=0;
while (list($i21, $i22,$corr) = $fifth_query_stmt->fetch(PDO::FETCH_NUM)) {
    if ($i21 > $i22) {
        $trgt2=$i21;
        $src2=$i22;
    } else {
        $trgt2=$i22;
        $src2=$i21;
    }
    $fifth_array[$a5]['id']=$src2.'-'.$trgt2;
    $fifth_array[$a5]['src']=$src2;
    $fifth_array[$a5]['trgt']=$trgt2;
    $fifth_array[$a5]['corr']=$corr;
    $a5++;
}

    if($first_n_con_array!=null)foreach ($first_n_con_array as $row) { $fifth_array[$row['id']] = $row;}
	
	//$fifth_array=array_merge($first_n_con_array,$fifth_array);
	//$fifth_array=array_values(array_unique($fifth_array));
	/*$testb = array();
	$testb=$first_n_con_array+$fifth_array;
	
	$fifth_array = array();
foreach ($testb as $row) {
    $fifth_array[$row['id']] = $row;
}*/
$testb=array();
foreach ($fifth_array as $row) {
    $testb[$row['id']] = $row;
}
$fifth_array=$testb;
	//$fifth_array=array_values(array_unique($fifth_array));
	//if($debug==true){print_r($fifth_array);}	
if($debug==true){print("<br><strong>----------------9.) QUERY >> SECOND NETWORK LABELS</strong></br>");}
$sixth_array=array();
$sixth_query = 'SELECT id, name FROM gene WHERE id IN ('.$second_sp_2_array_string.')';
if($debug==true){print($sixth_query);}
$sixth_query_stmt = $db->query($sixth_query);
if (!sixth_query_stmt) {
    echo 'Query failed: '.$sixth_query;
    exit;
}
$a6=0;
while (list($sp2_i, $sp2_id) = $sixth_query_stmt->fetch(PDO::FETCH_NUM)){
	$sixth_array[$a6][$sp2_i]=$sp2_id;
	$a6++;}
if($debug==true){print("<br><strong>----------------10.) ARRAY PROCESSING >> FIRST NETWORK NODE(S) 2 NODE(S) ARRAY</strong></br>");}
for($m=0;$m<count($first_array);$m++){
	$first_array_node_id_array=array_column2($first_array, 'id');
	$children[$m]->id=$first_array_node_id_array[$m];
	$first_array_node_label_array=array_column2($first_array, 'label');
	$children[$m]->label=$first_array_node_label_array[$m];
	$first_array_node_connection_array=array_column2($second_array, $first_array_node_id_array[$m]);
	$first_array_node_connection_string=implode(",",array_values(array_unique($first_array_node_connection_array)));
	$children[$m]->conN=array($first_array_node_connection_string);
	if($first_array_node_connection_string==""){$col=0;}else{$col=1;}
	$children[$m]->col=$col;
	$children[$m]->tf="";
	$first_array_nodes_array[]=$children[$m];
}
if($debug==true){print_r($first_array_nodes_array);}
if($debug==true){print("<br><strong>----------------11.) ARRAY PROCESSING >> FIRST NETWORK EDGES ARRAY</strong></br>");}
//print_r($third_array);
//count($forth_array)==
//$forth_array=$third_array;
for($m=0;$m<count($forth_array);$m++){
	
	//$forth_array=array_merge($third_array,$forth_array);
		$first_array_edges_id_array=array_column2($forth_array, 'id');
		$edges_children[$m]->id=$first_array_edges_id_array[$m];
		$first_array_edges_src_array=array_column2($forth_array, 'src');
		$edges_children[$m]->source=$first_array_edges_src_array[$m];
		$first_array_edges_trgt_array=array_column2($forth_array, 'trgt');
		$edges_children[$m]->target=$first_array_edges_trgt_array[$m];
		$first_array_edges_corr_array=array_column2($forth_array, 'corr');
		$edges_children[$m]->corr=round($first_array_edges_corr_array[$m]);
		$first_array_edges_connection_array=array_column2($third_array, $first_array_edges_id_array[$m]);
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
	$second_array_node_label_array=array_column2($sixth_array, $second_sp_2_array[$n]);
	$second_array_node_label_array_string=implode(',',array_values(array_unique($second_array_node_label_array)));
	$second_children[$n]->label=$second_array_node_label_array_string;
	$second_array_node_connection_array=array_column2($second_array, $second_sp_2_array[$n].'second');
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
		$second_array_edges_id_array=array_column2($fifth_array, 'id');
		$second_edges_children[$m]->id=$second_array_edges_id_array[$m];
		$second_array_edges_src_array=array_column2($fifth_array, 'src');
		$second_edges_children[$m]->source=$second_array_edges_src_array[$m];
		$second_array_edges_trgt_array=array_column2($fifth_array, 'trgt');
		$second_edges_children[$m]->target=$second_array_edges_trgt_array[$m];
		$second_array_edges_corr_array=array_column2($fifth_array, 'corr');
		$second_edges_children[$m]->corr=(string)round($second_array_edges_corr_array[$m]);
		$second_array_edges_connection_array=array_column2($third_array, $second_array_edges_id_array[$m].'second');
		$second_array_edges_connection_string=implode(",",array_values(array_unique($second_array_edges_connection_array)));
		//$second_edges_children[$m]->conE=array($second_array_edges_connection_string);
		if($second_array_edges_connection_string==""){$col=0;}else{$col=1;}
		$second_edges_children[$m]->cons=$col;
		$second_array_edges_array[]=$second_edges_children[$m];	
	}

$msc=microtime(true)-$msc;
$msc=sprintf('%0.2f', $msc);

if($debug==true){print_r($second_array_edges_array);}	
if($debug==true){print("<br><strong>----------------15.) ARRAY PROCESSING >> MERGE SECOND NETWORK NODES AND EDGES ARRAYS</strong></br>");}
$second_array_nodex_and_edges_array=array('nodes'=>$second_array_nodes_array,'edges'=>$second_array_edges_array);
if($debug==true){print_r($second_array_nodex_and_edges_array);}
if($debug==true){print("<br><strong>----------------16.) ARRAY PROCESSING >> MERGE FIRST AND SECOND NETWORK ARRAYS THEN ENCODE WITH JSON </strong></br>");}	
$final_first_and_second_array=array('tmp_array1'=>$first_array_nodex_and_edges_array,'tmp_array2'=>$second_array_nodex_and_edges_array,'msc'=>$msc);
echo json_encode($final_first_and_second_array);
exit();
