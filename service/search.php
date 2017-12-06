<?php 
require_once('../config.php');
require_once('Datatables2.php');
$datatables = new Datatables();

$dbconfig = array(
    'username' => $config["db"]["user"],
    'password' => $config["db"]["password"],
    'database' => $config["db"]["database"],
    'hostname' => $config["db"]["host"]
);

$datatables->connect($dbconfig);
$sp=trim($_POST['sp']);
if($sp=="at"){
$url_s="atgenie";
}
if($sp=="pt"){
$url_s="popgenie";
} 
if($sp=="os"){ 
$url_s="congenie";
}

$datatables

->select("".$sp."_i as ID,'check_box_value',".$sp."_id,pfam,taird")//,".$sp."_id as ID2
->from("".$sp."Gene")
->edit_column("".$sp."_id", '<a target="_blank" href="http://'.$url_s.'.org/gene?id=$1">$1</a>', "".$sp."_id");
//->edit_column("taird", substr("$1",10,100).'<a target="_blank" href="http://'.$url_s.'.org/gene?id=$1">...</a>', "taird");


if(isset($_POST['id']) && $_POST['id'] != ''){
	$vowels = array(",", ";", "\t", "\n", "\r", "s+", " ",", ");
	$post_input=preg_replace("/\s+/", ",", trim(htmlentities($_POST['id']))); 
	$onlyconsonants = strtolower(str_replace($vowels, ",", $post_input));
	$pattern = '/^[a-zA-Z0-9]+[.]+[a-zA-Z0-9]+[.]+[0-9]?[0-9]$/';
	
	//if(checkprefix($onlyconsonants,"go:")==true){
	$geneids_array = explode(",", $onlyconsonants);
	$geneids_array_str=implode('","',$geneids_array);
	$datatables->where(''.$sp.'_id in ',$geneids_array_str);
	//}
	/*if(checkprefix($onlyconsonants,"molecular_function")==true   || checkprefix($onlyconsonants,"biological_process")==true  || checkprefix($onlyconsonants,"cellular_component")==true  ){
	$onlyconsonants3 = str_replace($vowels, ",", $_POST['id']);	
	$geneids_array = explode(",", $onlyconsonants3);
	$geneids_array_str=implode('%" OR name_space LIKE "%',$geneids_array);
	$datatables->where('name_space like','%'.$geneids_array_str.'%');
	}
	
	if(checkprefix($onlyconsonants,"molecular_function")==flase && checkprefix($onlyconsonants,"biological_process")==false && checkprefix($onlyconsonants,"cellular_component")==false && checkprefix($onlyconsonants,"go:")==false)*/
	/*else{
	$onlyconsonants3 = str_replace($vowels, ",", $post_input);	
	$geneids_array = explode(",", $onlyconsonants3);
	$geneids_array_str=implode('%" OR description LIKE "%',$geneids_array);
	$datatables->where('description like','%'.$geneids_array_str.'%');
	}*/

} 
//if($_POST['init_flag']==true){
	
	 $datatablesx=array();
echo ($datatables->generate($datatablesx));// $datatables;	
//}else{
//echo $datatables->generate($default_gene_basket_array);	
//}

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


#####################################
//Check suffix
#####################################
function checksuffix($source, $suffix) {
    if (str_endswith($source, $suffix)) {
       return true;
    } else {
       return false;
    }
}
function str_endswith($source, $suffix) {
   return (strpos(strrev($source), strrev($suffix)) === 0);
}
/////////////////////////////////////


function limit($text,$length=4,$tail="...") {
    $text = trim($text);
    $txtl = strlen($text);
    if($txtl > $length) {
        for($i=1;$text[$length-$i]!=" ";$i++) {
            if($i == $length) {
                return substr($text,0,$length) . $tail;
            }
        }
        $text = substr($text,0,$length-$i+1) . $tail;
    }
    return ucfirst($text);
}

?>

