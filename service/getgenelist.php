<?php
require_once("../config.php");
$sp1=trim($_POST['sp1']);
$sp1_genes=$_POST['sp1_genes'];
$sp2=trim($_POST['sp2']);
$sp2_genes=$_POST['sp2_genes'];
//$replace_basket=$_POST['replacev'];
$replace_basket = filter_var($_POST['replace'], FILTER_VALIDATE_BOOLEAN);

/*if(trim($_POST['replacev']) === "true")
{
  $replace_basket=true;
}
else
{
   $replace_basket=false;
}*/

$geta="";
$getp="";
$getc="";

if($sp1=="at"){
	$sp1_genes_array = explode(",", $sp1_genes);
	include('atgenie/getgenelist.php');
	if($replace_basket==true){
	updategenebasketall_at($sp1_genes_array);
	}else{
	updategenebasket_at($sp1_genes_array);	
	}	
	 
}

if($sp1=="pt"){
	$sp1_genes_array2 = explode(",", $sp1_genes);
	include('poplar/getgenelist.php'); 
	if($replace_basket==true){
	updategenebasketall_pt($sp1_genes_array2);	
	}else{
	updategenebasket_pt($sp1_genes_array2);	
	}
}

if($sp1=="os"){
	$sp1_genes_array3 = explode(",", $sp1_genes);
	include('spruce/getgenelist.php');	
	if($replace_basket==true){
	updategenebasketall($sp1_genes_array3);	
	}else{
	updategenebasket($sp1_genes_array3);
	}
}

if($sp2=="at"){
	$sp2_genes_array2x = explode(",", $sp2_genes); 
	include('atgenie/getgenelist.php');
	if($replace_basket==true){
	updategenebasketall_at($sp2_genes_array2x);	
	}else{
	updategenebasket_at($sp2_genes_array2x);	
	//echo json_encode($sp2_genes_array2x);
	}
	
}

if($sp2=="pt"){
	$sp2_genes_array2 = explode(",", $sp2_genes);
	include('poplar/getgenelist.php'); 
	if($replace_basket==true){
	updategenebasketall_pt($sp2_genes_array2);		
	}else{
	updategenebasket_pt($sp2_genes_array2);	
	}
}

if($sp2=="os"){
	$sp2_genes_array3 = explode(",", $sp2_genes);
	include('spruce/getgenelist.php');	
	if($replace_basket==true){
	updategenebasketall($sp2_genes_array3);		
	}else{
	updategenebasket($sp2_genes_array3);
	}
}





//echo json_encode($geta); 
?>
