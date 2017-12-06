<?php
require_once("../config.php");
$basket_db=mysql_connect(
    $config["basket_db"]["host"],
    $config["basket_db"]["user"],
    $config["basket_db"]["password"]
) or die("maaf, tidak berhasil konek ke database");

if ( $_GET['db']=="at") {
    include('atgenie/koneksi.php'); 
    mysql_select_db("arabidopsisbasket",$basket_db) or die("database tidak ada");
}

if ($_GET['db']=="pt") {
    include('poplar/koneksi.php'); 
    if(isset($_COOKIE['select_species'])){
        mysql_select_db("v4genebasket_".$_COOKIE['select_species'],$basket_db) or die("database tidak adas");
    }else{
        mysql_select_db("v4genebasket_potri",$basket_db) or die("database tidak ada");
    }


}

if ( $_GET['db']=="os" ) {
    include('spruce/koneksi.php'); 
    mysql_select_db("congeniebaskets_beta",$basket_db) or die("database tidak ada");
}


if (isset($_GET) && $_GET['id'] !="") {
    $uuid = $_GET['id'];

    $g= 0;
    $ip = $uuid;//="536b9ed660d70;;85.226.188.54";
    $getgenelistsql = "SELECT genebaskets.genelist,genebaskets.harga FROM genebaskets JOIN defaultgenebaskets ON  genebaskets.gene_basket_id=defaultgenebaskets.gene_basket_id where defaultgenebaskets.ip='$ip'";
    $genelistresults = mysql_query($getgenelistsql,$basket_db) or die("query gagal dijalankan");
    if (mysql_num_rows($genelistresults) != 0) {
        $genelistdata   = mysql_fetch_assoc($genelistresults);
        $genelistnumber = $genelistdata['genelist'];
        $children[$g]->genelist=explode(',',$genelistnumber);
        $children[$g]->harga=$genelistdata['harga'];

    } else {
        $children[$g]->genelist=array();
        $children[$g]->harga="0";
    }
    $ret[] = $children[$g];;
    $g++;


    $arrs = array ('basket'=>$ret);
    echo  json_encode($arrs);
    mysql_close($basket_db);
}else{
    return;	
}

?>
