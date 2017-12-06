<?php
//include_once("koneksi.php");
//$ip=$uuid;
function getdefaultsamplelist_at()
{
    include("koneksi.php");
    $ip            = $uuid;
    $sampleliststr = "SELECT samplebaskets.samplelist,samplebaskets.sample_basket_id FROM samplebaskets WHERE samplebaskets.ip='$ip'";
    $samplelistresults = mysql_query($sampleliststr) or die("query gagal dijalankan");
    if (mysql_num_rows($samplelistresults) != 0) {
        $defaultsampledata = mysql_fetch_assoc($samplelistresults);
        $samplesendstringt = $defaultsampledata['samplelist'];
        $sampletemparr     = explode(',', $samplesendstringt);
        return $sampletemparr;
    }
    //	return 'null';
}
function getdefaultgolist_at()
{
    include("koneksi.php");
    $ip            = $uuid;
    $sampleliststr = "SELECT gobaskets.golist FROM gobaskets WHERE gobaskets.ip='$ip'";
    $samplelistresults = mysql_query($sampleliststr) or die("query gagal dijalankan");
    if (mysql_num_rows($samplelistresults) != 0) {
        $defaultsampledata = mysql_fetch_assoc($samplelistresults);
        $samplesendstringt = $defaultsampledata['golist'];
        $sampletemparr     = explode(',', $samplesendstringt);
        return $sampletemparr;
    }
    //return 'null';
}
function getdefaultgenelist_at()
{
    include("koneksi.php");
    $ip         = $uuid;
    $defaultstr = "SELECT genebaskets.genelist FROM defaultgenebaskets LEFT JOIN genebaskets ON defaultgenebaskets.gene_basket_id=genebaskets.gene_basket_id where defaultgenebaskets.ip='$ip'";
    $defaultresults = mysql_query($defaultstr) or die("query gagal dijalankan");
    if (mysql_num_rows($defaultresults) != 0) {
        $defaultgeenedata = mysql_fetch_assoc($defaultresults);
        $genessendStringt = $defaultgeenedata['genelist'];
        $tmpArr           = explode(',', $genessendStringt);
        return $tmpArr;
    }
    //return 'null';
}
function getdefaultgenelistname_at()
{
    include("koneksi.php");
    $ip         = $uuid;
    $defaultstr = "SELECT genebaskets.gene_basket_name FROM defaultgenebaskets LEFT JOIN genebaskets ON defaultgenebaskets.gene_basket_id=genebaskets.gene_basket_id where defaultgenebaskets.ip='$ip'";
    $defaultresults = mysql_query($defaultstr) or die("query gagal dijalankan");
    if (mysql_num_rows($defaultresults) != 0) {
        $defaultgeenedata = mysql_fetch_assoc($defaultresults);
        $genessendStringt = $defaultgeenedata['gene_basket_name'];
        //$tmpArr=explode(',',$genessendStringt);
        return $genessendStringt;
    }
    //return 'null';
}
function updategenebasket_at($genearray)
{
    global $config;
    $dp_at=mysql_connect(
        $config["basket_db"]["host"],
        $config["basket_db"]["user"],
        $config["basket_db"]["password"]
    ) or die("maaf, tidak berhasil konek ke database " . mysql_error());
	mysql_select_db("arabidopsisbasket",$dp_at) or die("database tidak ada");
	

	global $at_uuid;
if ( isset($_SERVER["REMOTE_ADDR"]) )    {
    $ip = '' . $_SERVER["REMOTE_ADDR"] . '';
} else if ( isset($_SERVER["HTTP_X_FORWARDED_FOR"]) )    {
    $ip = '' . $_SERVER["HTTP_X_FORWARDED_FOR"] . '';
} else if ( isset($_SERVER["HTTP_CLIENT_IP"]) )    {
    $ip = '' . $_SERVER["HTTP_CLIENT_IP"] . '';
}
//mysql_close();
/*if($_COOKIE['initatgenie_uuid']==0 || !isset($_COOKIE['atgenie_uuid']))
	{*/
	if(!isset($_COOKIE['atgenie_uuid']))
	{
    $expire=time()+ 86400 * 7;//however long you want
	$popuuids=uniqid().';;'.$ip;
	$myDomain = ereg_replace('^[^\.]*\.([^\.]*)\.(.*)$', '\1.\2', $_SERVER['HTTP_HOST']);
	$setDomain = ($_SERVER['HTTP_HOST']) != "localhost" ? ".$myDomain" : false;
	setcookie ("atgenie_uuid", $popuuids, $expire, '/', $setDomain, 0 );
	}else{
	$popuuid=$_COOKIE['atgenie_uuid'];
	}
	
	$at_uuid =$popuuid; 
	
    $ip                      = $at_uuid;
    $genessendaddStringArray = array_unique($genearray);
    $genessendaddString      = implode(",", $genessendaddStringArray);
    $check                   = mysql_query("select * from defaultgenebaskets where ip='$ip'",$dp_at);
    if (mysql_num_rows($check) == 0) {
        // NO DEFAULT GENEBASKETS,INSTERED
        $initcounts = count($genessendaddStringArray);
        mysql_query("insert into genebaskets(gene_basket_id,gene_basket_name,harga,genelist,ip) values('$kode','default','$initcounts','$genessendaddString','$ip')",$dp_at) or die("data gagal di insert");
        mysql_query("insert into defaultgenebaskets(defaultgenebaskets.gene_basket_id,defaultgenebaskets.ip) SELECT LAST_INSERT_ID(gene_basket_id),'$ip' from genebaskets WHERE ip='$ip' ORDER BY gene_basket_id DESC Limit 1;",$dp_at);
        //return $genessendaddString;
    } else {
        //FOUND DEFAULT genes
        $defaultstr = "SELECT genebaskets.genelist,genebaskets.gene_basket_id FROM defaultgenebaskets LEFT JOIN genebaskets ON defaultgenebaskets.gene_basket_id=genebaskets.gene_basket_id where defaultgenebaskets.ip='$ip'";
        $defaultresults = mysql_query($defaultstr,$dp_at) or die("query gagal dijalankan");
        if (mysql_num_rows($defaultresults) != 0) {
            $defaultgeenedata = mysql_fetch_assoc($defaultresults);
            $dbgenesStr       = $defaultgeenedata['genelist'];
            $basketid         = $defaultgeenedata['gene_basket_id'];
            $dbgenesStrArray  = explode(",", $dbgenesStr);
            if (strlen($dbgenesStr) < 5) {
                //EMPTY gene basket
                $initcount = count($genessendaddStringArray);
                mysql_query("update genebaskets set genelist='$genessendaddString',harga='$initcount' where gene_basket_id='$basketid'",$dp_at) or die("data gagal di update");
                //echo 'harga'.$defaultstr;
            } else {
                //Gene basket with genes
                $tmpresultArr      = array_merge($dbgenesStrArray, $genessendaddStringArray);
                $updategenelistArr = array_unique($tmpresultArr);
                $updatecount       = count($updategenelistArr);
                $updategenelist    = implode(',', $updategenelistArr);
                mysql_query("update genebaskets set genelist='$updategenelist',harga='$updatecount' where gene_basket_id='$basketid'",$dp_at) or die("data gagal di update");
                //echo '2'.$updategenelist;
            }
        } else {
        }
        //mysql_query("update defaultgenebaskets set gene_basket_id='$kode' where ip='$ip'") or die ("data gagal di update");
    }
	mysql_close($dp_at);
}
function removegenebasket_at($removegenearray)
{
    include("koneksi.php"); 
    $ip                      = $uuid;
    $genessendremovetringArr = array_unique($removegenearray);
    $genessendremovetring    = implode(",", $genessendremovetringArr);
    $defaultstrRemove        = "SELECT genebaskets.genelist,genebaskets.gene_basket_id FROM defaultgenebaskets LEFT JOIN genebaskets ON defaultgenebaskets.gene_basket_id=genebaskets.gene_basket_id where defaultgenebaskets.ip='$ip'";
    $defaultresultsRemove = mysql_query($defaultstrRemove) or die("query gagal dijalankan");
    if (mysql_num_rows($defaultresultsRemove) != 0) {
        $defaultgeeneremovedata = mysql_fetch_assoc($defaultresultsRemove);
        $dbgenesremoveStr       = $defaultgeeneremovedata['genelist'];
        $basketremoveid         = $defaultgeeneremovedata['gene_basket_id'];
        $dbgenesStrRemoveArray  = explode(",", $dbgenesremoveStr);
        if ($dbgenesremoveStr != "") {
            $tmpresultRemoveArr      = array_diff($dbgenesStrRemoveArray, $genessendremovetringArr);
            $updategenelistRemoveArr = array_unique($tmpresultRemoveArr);
            $updatecountremove       = count($updategenelistRemoveArr);
            $updategenelistremove    = implode(',', $updategenelistRemoveArr);
            mysql_query("update genebaskets set genelist='$updategenelistremove',harga='$updatecountremove' where gene_basket_id='$basketremoveid'") or die("data gagal di update");
            //echo $updategenelistremove;
        } else {
            echo "no gene ids to remove";
        }
    } else {
        echo 'no default gene basket selected';
    }
}
function updategenebasketall_at($updateallarr, $name = FALSE)
{
    global $config;
	if($name){
		$basketname=$name;
	}else{
		$basketname="default";	
	}
        $dp_at=mysql_connect(
            $config["basket_db"]["host"],
            $config["basket_db"]["user"],
            $config["basket_db"]["password"]
        ) or die("maaf, tidak berhasil konek ke database " . mysql_error());
	mysql_select_db("arabidopsisbasket",$dp_at) or die("database tidak ada");
	

	global $at_uuid;
if ( isset($_SERVER["REMOTE_ADDR"]) )    {
    $ip = '' . $_SERVER["REMOTE_ADDR"] . '';
} else if ( isset($_SERVER["HTTP_X_FORWARDED_FOR"]) )    {
    $ip = '' . $_SERVER["HTTP_X_FORWARDED_FOR"] . '';
} else if ( isset($_SERVER["HTTP_CLIENT_IP"]) )    {
    $ip = '' . $_SERVER["HTTP_CLIENT_IP"] . '';
}
//mysql_close();
/*if($_COOKIE['initatgenie_uuid']==0 || !isset($_COOKIE['atgenie_uuid']))
	{*/
	if(!isset($_COOKIE['atgenie_uuid']))
	{
    $expire=time()+ 86400 * 7;//however long you want
	$popuuids=uniqid().';;'.$ip;
	$myDomain = ereg_replace('^[^\.]*\.([^\.]*)\.(.*)$', '\1.\2', $_SERVER['HTTP_HOST']);
	$setDomain = ($_SERVER['HTTP_HOST']) != "localhost" ? ".$myDomain" : false;
	setcookie ("atgenie_uuid", $popuuids, $expire, '/', $setDomain, 0 );
	}else{
	$popuuid=$_COOKIE['atgenie_uuid'];
	}
	
	$at_uuid =$popuuid; 
    $ip                 = $at_uuid;
    $updategenelistArrx = array_unique($updateallarr);
    $genessendaddString = implode(",", $updategenelistArrx);
    $checkme            = mysql_query("select * from defaultgenebaskets where ip='$ip'");
	if( $name == "explot list"){
		$checkme_genebasket = mysql_query("select * from genebaskets where ip='$ip' AND gene_basket_name='explot list'");
		if (mysql_num_rows($checkme_genebasket) == 0 ) { 
		 $initcountsupdate = count($updategenelistArrx);
        mysql_query("insert into genebaskets(gene_basket_id,gene_basket_name,harga,genelist,ip) values('$kode','$basketname','$initcountsupdate','$genessendaddString','$ip')") or die("data gagal di insert");
		return $initcountsupdate; 
		}else{
			 $gene_AND_default_basket_id_query = "SELECT genebaskets.genelist,genebaskets.gene_basket_id FROM genebaskets where genebaskets.ip='$ip' AND gene_basket_name='explot list'";
			 $gene_AND_default_basket_id_results = mysql_query($gene_AND_default_basket_id_query) ;
			 if (mysql_num_rows($gene_AND_default_basket_id_results) == TRUE) {
            		$gene_AND_default_basket_id_data = mysql_fetch_assoc($gene_AND_default_basket_id_results);
            		$gene_AND_default_basket_id = $gene_AND_default_basket_id_data['gene_basket_id'];
					$gene_AND_default_basket_id_genelist= $gene_AND_default_basket_id_data['genelist'];
            		$gene_AND_default_basket_id_genelist_array= explode(",", $gene_AND_default_basket_id_genelist);
					
				if (strlen($gene_AND_default_basket_id_genelist) < 5) {
					$initcount = count($updategenelistArrx);
					mysql_query("update genebaskets set genelist='$genessendaddString',harga='$initcount' where gene_basket_id='$gene_AND_default_basket_id'  AND gene_basket_name='explot list' ") or die("data gagal di update");
					return 3;
				} else {
					$tmpresultArr      = array_merge($gene_AND_default_basket_id_genelist_array, $updategenelistArrx);
					$updategenelistArr = array_unique($tmpresultArr);
					$updatecount       = count($updategenelistArr);
					$updategenelist    = implode(',', $updategenelistArr);
					mysql_query("update genebaskets set genelist='$updategenelist',harga='$updatecount' where gene_basket_id='$gene_AND_default_basket_id' AND gene_basket_name='explot list'") or die("data gagal di update");
					return 4;
				}
	 
			 }
		}
		
		
	}else{
    if (mysql_num_rows($checkme) == 0 ) { 
        // NO DEFAULT GENEBASKETS,INSTERED
        $initcountsupdate = count($updategenelistArrx);
        mysql_query("insert into genebaskets(gene_basket_id,gene_basket_name,harga,genelist,ip) values('$kode','$basketname','$initcountsupdate','$genessendaddString','$ip')") or die("data gagal di insert");
        mysql_query("insert into defaultgenebaskets(defaultgenebaskets.gene_basket_id,defaultgenebaskets.ip) SELECT LAST_INSERT_ID(gene_basket_id),'$ip' from genebaskets WHERE ip='$ip' ORDER BY gene_basket_id DESC Limit 1;");
        //return $genessendaddString;
    } else {
        //FOUND DEFAULT genes
        $defaultstru = "SELECT genebaskets.gene_basket_id FROM defaultgenebaskets LEFT JOIN genebaskets ON defaultgenebaskets.gene_basket_id=genebaskets.gene_basket_id where defaultgenebaskets.ip='$ip'";
        $defaultresultsu = mysql_query($defaultstru) or die("query gagal dijalankan");
        $dbgenesStrArrayu = implode(",", $updategenelistArrx);
        //EMPTY gene basket
        $initcountu       = count($updategenelistArrx);
        if (mysql_num_rows($defaultresultsu) != 0) {
            $cleardefaultbasketdatau = mysql_fetch_assoc($defaultresultsu);
            $clearbasketidu          = $cleardefaultbasketdatau['gene_basket_id'];
            mysql_query("update genebaskets set genelist='$dbgenesStrArrayu',harga='$initcountu' where gene_basket_id='$clearbasketidu'") or die("data gagal di update"); //echo '2'.$updategenelist;
        }
        //mysql_query("update defaultgenebaskets set gene_basket_id='$kode' where ip='$ip'") or die ("data gagal di update");
    }
	
	}
	mysql_close($dp_at);
//	return "sss";
}
function sharetable_at($updateallarr, $name = FALSE, $randid = FALSE)
{
    if ($name) {
        $basketname = $name;
    } else {
        $basketname = "default";
    }
    include("koneksi.php");
    $ip                 = $uuid;
    $updategenelistArrx = array_unique($updateallarr);
    $genessendaddString = implode(",", $updategenelistArrx);
    // NO DEFAULT GENEBASKETS,INSTERED
    $initcountsupdate   = count($updategenelistArrx);
    $mysqldate          = date('Y-m-d H:i:s');
    mysql_query("DELETE FROM share_table WHERE time < (NOW() - INTERVAL 30 DAY) ;");
    mysql_query("insert into share_table(gene_basket_id,gene_basket_name,harga,genelist,ip,time,randid) values('$kode','$basketname','$initcountsupdate','$genessendaddString','$ip','$mysqldate','$randid')") or die("data gagal di insert");
}
function getdefaultsaredgenelist_at($randid)
{
    include("koneksi.php");
    $ip      = $uuid;
    $checkme = mysql_query("select * from share_table where randid='$randid';");
    if (mysql_num_rows($checkme) != 0) {
        $defaultstr = "SELECT share_table.genelist FROM share_table where share_table.randid='$randid'";
        $defaultresults = mysql_query($defaultstr) or die("query gagal dijalankan");
        if (mysql_num_rows($defaultresults) != 0) {
            $defaultgeenedata = mysql_fetch_assoc($defaultresults);
            $genessendStringt = $defaultgeenedata['genelist'];
            $tmpArr           = explode(',', $genessendStringt);
            return $tmpArr;
        }
        echo 'null';
    } else {
        echo 'null';
    }
}
function checksharedlinkexist_at($randid)
{
    include("koneksi.php");
    $ip      = $uuid;
    $checkme = mysql_query("select * from share_table where randid='$randid';");
    if (mysql_num_rows($checkme) != 0) {
        $defaultstr = "SELECT time FROM share_table where randid='$randid';";
        $defaultresults = mysql_query($defaultstr) or die("query gagal dijalankan");
       	$result = mysql_fetch_assoc($defaultresults);
	    $datetime = new DateTime($result['time']);
		echo $datetime->format('Y-m-d');
    } else {
        echo 'null';
    }
}

/*Updated on 4th December 2013 by Chanaka */
function updategobasket_at($genearray)
{
    include("koneksi.php");
    $ip = $uuid;
    
    $samplestrArr    = array_unique($genearray);
    $initcounts      = count($samplestrArr);
    $sampleaddString = implode(",", $samplestrArr);
    
    $check = mysql_query("SELECT * FROM gobaskets WHERE gobaskets.ip='$ip'");
    if (mysql_num_rows($check) == 0) {
        mysql_query("insert into gobaskets(go_basket_id,go_basket_name,harga,golist,ip) values('$kode','default','$initcounts','$sampleaddString','$ip')") or die("data gagal di insert");		echo $initcounts . '  added(1)';
    } else {
        $samplequerystr = "SELECT gobaskets.golist,gobaskets.go_basket_id FROM gobaskets WHERE gobaskets.ip='$ip'";
        $samplequeryresults = mysql_query($samplequerystr) or die("query gagal dijalankan");
        $samplequerydata = mysql_fetch_assoc($samplequeryresults);
        $samplelisttmp   = $samplequerydata['golist'];
        $samplelistidtmp = $samplequerydata['go_basket_id'];
        if ($samplelisttmp == "") {
            mysql_query("update gobaskets set gobaskets.golist='$sampleaddString',gobaskets.harga='$initcounts' where gobaskets.go_basket_id='$samplelistidtmp'") or die("data gagal di update");
            echo $initcounts . '  updated(2)';
        } else {
            $samplelisttmpArr = explode(",", $samplelisttmp);
            
            $tmpresultArr           = array_merge($samplelisttmpArr, $samplestrArr);
            $filtertedtmpresultsArr = array_unique($tmpresultArr);
            $filteredupdatecount    = count($filtertedtmpresultsArr);
            $filteredupdatedlist    = implode(',', $filtertedtmpresultsArr);
            mysql_query("update gobaskets set gobaskets.golist='$filteredupdatedlist',gobaskets.harga='$filteredupdatecount' where gobaskets.go_basket_id='$samplelistidtmp'") or die("data gagal di update");
            //echo $filteredupdatecount.'->'.$filteredupdatedlist;
            echo $filteredupdatecount . '  updated(3)';
        }
    }
}

function removegobasket_at($removegenearray)
{
	
    include("koneksi.php");
    $ip = $uuid;
	$samplesremoveArr = array_unique($removegenearray);
	$sampleremovecount=count($samplesremoveArr);
	$sampleremovetring = implode(",",$samplesremoveArr);
	$check2=mysql_query("SELECT * FROM gobaskets WHERE gobaskets.ip='$ip'")  or die("query gagal dijalankan");;
	  if(mysql_num_rows($check2)==0){
		}else{
			$sampleremovequerystr="SELECT gobaskets.golist,gobaskets.go_basket_id FROM gobaskets WHERE gobaskets.ip='$ip'";
				$sampleremovequeryresults=mysql_query($sampleremovequerystr) or die("query gagal dijalankan");
				$sampleremovequerydata=mysql_fetch_assoc($sampleremovequeryresults);
				$sampleremovelisttmp=$sampleremovequerydata['golist'];
				$sampleremovelistidtmp=$sampleremovequerydata['go_basket_id'];
				echo '1';
		if($sampleremovelisttmp==""){
			}else{
				$sampleremovelisttmpArr = explode(",",$sampleremovelisttmp);
				$tmpresultRemoveArr =  array_diff($sampleremovelisttmpArr,$samplesremoveArr);
				$updatesamplelistRemoveArr=array_unique($tmpresultRemoveArr);
				$updatecountremove=count($updatesamplelistRemoveArr);
				$updatesremove=implode(',',$updatesamplelistRemoveArr);
				mysql_query("update gobaskets set gobaskets.golist='$updatesremove',gobaskets.harga='$updatecountremove' where gobaskets.go_basket_id='$sampleremovelistidtmp'") or die ("data gagal di update");
				echo '2';
				}
		}
}

?>
