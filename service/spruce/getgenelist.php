<?php

//include_once("koneksi.php");
//$ip=$uuid;
function getdefaultsamplelist(){
	include("koneksi.php");
$ip=$uuid;
	 $sampleliststr="SELECT samplebaskets.samplelist,samplebaskets.sample_basket_id FROM samplebaskets WHERE samplebaskets.ip='$ip'";
		$samplelistresults=mysql_query($sampleliststr) or die("query gagal dijalankan");
		
			if(mysql_num_rows($samplelistresults)!=0)	{
							$defaultsampledata=mysql_fetch_assoc($samplelistresults);
							$samplesendstringt=$defaultsampledata['samplelist'];
							$sampletemparr=explode(',',$samplesendstringt);
							return $sampletemparr;
				}
				return 'null';
}


function getdefaultgolist(){
	include("koneksi.php");
$ip=$uuid;
	 $sampleliststr="SELECT gobaskets.golist FROM gobaskets WHERE gobaskets.ip='$ip'";
		$samplelistresults=mysql_query($sampleliststr) or die("query gagal dijalankan");
		
			if(mysql_num_rows($samplelistresults)!=0)	{
							$defaultsampledata=mysql_fetch_assoc($samplelistresults);
							$samplesendstringt=$defaultsampledata['golist'];
							$sampletemparr=explode(',',$samplesendstringt);
							return $sampletemparr;
				}
				//return 'null';
}


	
function getdefaultgenelist(){
	include("koneksi.php");
$ip=$uuid;
	
	
	 $defaultstr="SELECT genebaskets.genelist FROM defaultgenebaskets LEFT JOIN genebaskets ON defaultgenebaskets.gene_basket_id=genebaskets.gene_basket_id where defaultgenebaskets.ip='$ip'";
		$defaultresults=mysql_query($defaultstr) or die("query gagal dijalankan");
		
			if(mysql_num_rows($defaultresults)!=0)	{
			$defaultgeenedata=mysql_fetch_assoc($defaultresults);
							$genessendStringt=$defaultgeenedata['genelist'];
							$tmpArr=explode(',',$genessendStringt);
							return $tmpArr;
				}
				//return 'null';'
				
}




function getdefaultgenelistname(){
	include("koneksi.php");
$ip=$uuid;
	
	
	 $defaultstr="SELECT genebaskets.gene_basket_name FROM defaultgenebaskets LEFT JOIN genebaskets ON defaultgenebaskets.gene_basket_id=genebaskets.gene_basket_id where defaultgenebaskets.ip='$ip'";
		$defaultresults=mysql_query($defaultstr) or die("query gagal dijalankan");
		
			if(mysql_num_rows($defaultresults)!=0)	{
			$defaultgeenedata=mysql_fetch_assoc($defaultresults);
							$genessendStringt=$defaultgeenedata['gene_basket_name'];
							//$tmpArr=explode(',',$genessendStringt);
							return $genessendStringt;
				}
				//return 'null';
}




function updategenebasket($genearray){
    global $config;
$dp_sp=mysql_connect(
            $config["basket_db"]["host"],
            $config["basket_db"]["user"],
            $config["basket_db"]["password"]
    ) or die("maaf, tidak berhasil konek ke database " . mysql_error());
	mysql_select_db("congeniebaskets_beta",$dp_sp) or die("database tidak ada"); 

	global $sp_uuid;
if ( isset($_SERVER["REMOTE_ADDR"]) )    {
    $ip = '' . $_SERVER["REMOTE_ADDR"] . '';
} else if ( isset($_SERVER["HTTP_X_FORWARDED_FOR"]) )    {
    $ip = '' . $_SERVER["HTTP_X_FORWARDED_FOR"] . '';
} else if ( isset($_SERVER["HTTP_CLIENT_IP"]) )    {
    $ip = '' . $_SERVER["HTTP_CLIENT_IP"] . '';
}

	if(!isset($_COOKIE['congenie_uuid']))
	{
    $expire=time()+ 86400 * 7;//however long you want
	$popuuids=uniqid().';;'.$ip;
	$myDomain = ereg_replace('^[^\.]*\.([^\.]*)\.(.*)$', '\1.\2', $_SERVER['HTTP_HOST']);
	$setDomain = ($_SERVER['HTTP_HOST']) != "localhost" ? ".$myDomain" : false;
	setcookie ("congenie_uuid", $popuuids, $expire, '/', $setDomain, 0 );
	}else{
	$popuuid=$_COOKIE['congenie_uuid'];
	}
	
	$sp_uuid =$popuuid; 
$ip=$sp_uuid;


 $genessendaddStringArray = $genearray;//explode(",",$genessendaddString);
$genessendaddString=implode(",",$genearray);

$check=mysql_query("select * from defaultgenebaskets where ip='$ip'",$dp_sp);
if(mysql_num_rows($check)==0)
		
		{
			// NO DEFAULT GENEBASKETS,INSTERED

			$initcounts=count($genessendaddStringArray);
			
			mysql_query("insert into genebaskets(gene_basket_id,gene_basket_name,harga,genelist,ip) values('$kode','default','$initcounts','$genessendaddString','$ip')",$dp_sp) or die("data gagal di insert");
			mysql_query("insert into defaultgenebaskets(defaultgenebaskets.gene_basket_id,defaultgenebaskets.ip) SELECT LAST_INSERT_ID(gene_basket_id),'$ip' from genebaskets WHERE ip='$ip' ORDER BY gene_basket_id DESC Limit 1;",$dp_sp);
			
			//return $genessendaddString;
			
		}else{
			//FOUND DEFAULT genes
		$defaultstr="SELECT genebaskets.genelist,genebaskets.gene_basket_id FROM defaultgenebaskets LEFT JOIN genebaskets ON defaultgenebaskets.gene_basket_id=genebaskets.gene_basket_id where defaultgenebaskets.ip='$ip'";
		$defaultresults=mysql_query($defaultstr,$dp_sp) or die("query gagal dijalankan");
		
			if(mysql_num_rows($defaultresults)!=0)
			{
				$defaultgeenedata=mysql_fetch_assoc($defaultresults);
				$dbgenesStr=$defaultgeenedata['genelist'];
				$basketid=$defaultgeenedata['gene_basket_id'];
				$dbgenesStrArray=explode(",",$dbgenesStr);
				
				if($dbgenesStr==""){
					//EMPTY gene basket
				$initcount=count($genessendaddStringArray);
				mysql_query("update genebaskets set genelist='$genessendaddString',harga='$initcount' where gene_basket_id='$basketid'",$dp_sp) or die ("data gagal di update");
			//echo '1'.$genessendaddString;
				}else{
					//Gene basket with genes
						
				$tmpresultArr = array_merge($dbgenesStrArray,$genessendaddStringArray);
				$updategenelistArr=array_unique($tmpresultArr);
				$updatecount=count($updategenelistArr);
				$updategenelist=implode(',',$updategenelistArr);
				
				mysql_query("update genebaskets set genelist='$updategenelist',harga='$updatecount' where gene_basket_id='$basketid'",$dp_sp) or die ("data gagal di update");
				//echo '2'.$updategenelist;
				}
			
			
			
		}else{
			
		}
		
		//mysql_query("update defaultgenebaskets set gene_basket_id='$kode' where ip='$ip'") or die ("data gagal di update");
		}
		
		mysql_close($dp_sp);
	
	
}

function removegenebasket($removegenearray){
	include("koneksi.php");
$ip=$uuid;
	
$genessendremovetringArr=$removegenearray;
$genessendremovetring=implode(",",$removegenearray);

$defaultstrRemove="SELECT genebaskets.genelist,genebaskets.gene_basket_id FROM defaultgenebaskets LEFT JOIN genebaskets ON defaultgenebaskets.gene_basket_id=genebaskets.gene_basket_id where defaultgenebaskets.ip='$ip'";
		$defaultresultsRemove=mysql_query($defaultstrRemove) or die("query gagal dijalankan");
		
			if(mysql_num_rows($defaultresultsRemove)!=0)
			{
				$defaultgeeneremovedata=mysql_fetch_assoc($defaultresultsRemove);
				$dbgenesremoveStr=$defaultgeeneremovedata['genelist'];
				$basketremoveid=$defaultgeeneremovedata['gene_basket_id'];
				$dbgenesStrRemoveArray=explode(",",$dbgenesremoveStr);
				
				if($dbgenesremoveStr!=""){
					
					
				$tmpresultRemoveArr =  array_diff($dbgenesStrRemoveArray,$genessendremovetringArr);
				$updategenelistRemoveArr=array_unique($tmpresultRemoveArr);
				$updatecountremove=count($updategenelistRemoveArr);
				$updategenelistremove=implode(',',$updategenelistRemoveArr);
				
				mysql_query("update genebaskets set genelist='$updategenelistremove',harga='$updatecountremove' where gene_basket_id='$basketremoveid'") or die ("data gagal di update");
				//echo $updategenelistremove;
					
					
				}else{
					echo "no gene ids to remove";	
				}
					

			}else{
				echo 'no default gene basket selected';
			}




	
}



function updategenebasketall($updateallarr, $name = FALSE){
    global $config;
	  if($name){
                $basketname=$name;
        }else{
                $basketname="default";
        }
$dp_sp=mysql_connect(
            $config["basket_db"]["host"],
            $config["basket_db"]["user"],
            $config["basket_db"]["password"]
        ) or die("maaf, tidak berhasil konek ke database " . mysql_error());
	mysql_select_db("congeniebaskets_beta",$dp_sp) or die("database tidak ada"); 

	global $sp_uuid;
if ( isset($_SERVER["REMOTE_ADDR"]) )    {
    $ip = '' . $_SERVER["REMOTE_ADDR"] . '';
} else if ( isset($_SERVER["HTTP_X_FORWARDED_FOR"]) )    {
    $ip = '' . $_SERVER["HTTP_X_FORWARDED_FOR"] . '';
} else if ( isset($_SERVER["HTTP_CLIENT_IP"]) )    {
    $ip = '' . $_SERVER["HTTP_CLIENT_IP"] . '';
}

	if(!isset($_COOKIE['congenie_uuid']))
	{
    $expire=time()+ 86400 * 7;//however long you want
	$popuuids=uniqid().';;'.$ip;
	$myDomain = ereg_replace('^[^\.]*\.([^\.]*)\.(.*)$', '\1.\2', $_SERVER['HTTP_HOST']);
	$setDomain = ($_SERVER['HTTP_HOST']) != "localhost" ? ".$myDomain" : false;
	setcookie ("congenie_uuid", $popuuids, $expire, '/', $setDomain, 0 );
	}else{
	$popuuid=$_COOKIE['congenie_uuid'];
	}
	
	$sp_uuid =$popuuid; 
$ip=$sp_uuid;
;
	$genessendaddString=implode(",",$updateallarr);
$checkme=mysql_query("select * from defaultgenebaskets where ip='$ip'");
if(mysql_num_rows($checkme)==0){
			// NO DEFAULT GENEBASKETS,INSTERED
			$initcountsupdate=count($updateallarr);
			mysql_query("insert into genebaskets(gene_basket_id,gene_basket_name,harga,genelist,ip) values('$kode','$basketname','$initcountsupdate','$genessendaddString','$ip')") or die("data gagal di insert");
			mysql_query("insert into defaultgenebaskets(defaultgenebaskets.gene_basket_id,defaultgenebaskets.ip) SELECT LAST_INSERT_ID(gene_basket_id),'$ip' from genebaskets WHERE ip='$ip' ORDER BY gene_basket_id DESC Limit 1;");
			//return $genessendaddString;
		}else{
			//FOUND DEFAULT genes
		$defaultstru="SELECT genebaskets.gene_basket_id FROM defaultgenebaskets LEFT JOIN genebaskets ON defaultgenebaskets.gene_basket_id=genebaskets.gene_basket_id where defaultgenebaskets.ip='$ip'";
		$defaultresultsu=mysql_query($defaultstru) or die("query gagal dijalankan");
				$dbgenesStrArrayu=implode(",",$updateallarr);
					//EMPTY gene basket
				$initcountu=count($updateallarr);
				if(mysql_num_rows($defaultresultsu)!=0)
			{
				$cleardefaultbasketdatau=mysql_fetch_assoc($defaultresultsu);
				$clearbasketidu=$cleardefaultbasketdatau['gene_basket_id'];
			mysql_query("update genebaskets set genelist='$dbgenesStrArrayu',harga='$initcountu' where gene_basket_id='$clearbasketidu'") or die ("data gagal di update");
				//echo '2'.$updategenelist;
			}
		//mysql_query("update defaultgenebaskets set gene_basket_id='$kode' where ip='$ip'") or die ("data gagal di update");
		}
			mysql_close($dp_sp);
}



function sharetable($updateallarr, $name = FALSE,$randid=FALSE){
	  if($name){
                $basketname=$name;
        }else{
                $basketname="default";
        }
	include("koneksi.php");
$ip=$uuid;
	$genessendaddString=implode(",",$updateallarr);
//$checkme=mysql_query("select * from defaultgenebaskets where ip='$ip'");
//if(mysql_num_rows($checkme)==0){
			// NO DEFAULT GENEBASKETS,INSTERED
			$initcountsupdate=count($updateallarr);
			$mysqldate = date('Y-m-d H:i:s');
			
			mysql_query("DELETE FROM share_table WHERE ip = '$ip' AND time < NOW() - INTERVAL 30 DAY ;");
			
			mysql_query("insert into share_table(gene_basket_id,gene_basket_name,harga,genelist,ip,time,randid) values('$kode','$basketname','$initcountsupdate','$genessendaddString','$ip','$mysqldate','$randid')") or die("data gagal di insert");
		
}


function getdefaultsaredgenelist_os($randid){
	include("koneksi.php");
	$ip=$uuid;
	$checkme=mysql_query("select * from share_table where randid='$randid';");
if(mysql_num_rows($checkme)!=0){
	 $defaultstr="SELECT share_table.genelist FROM share_table where share_table.randid='$randid'";
		$defaultresults=mysql_query($defaultstr) or die("query gagal dijalankan");
		
			if(mysql_num_rows($defaultresults)!=0)	{
			$defaultgeenedata=mysql_fetch_assoc($defaultresults);
							$genessendStringt=$defaultgeenedata['genelist'];
							$tmpArr=explode(',',$genessendStringt);
							return $tmpArr;
				}
				echo 'null';
				
}else{
	echo 'null';
}
				
}

function checksharedlinkexist($randid){
	include("koneksi.php");
	$ip=$uuid;
	$checkme=mysql_query("select * from share_table where randid='$randid';");
	if(mysql_num_rows($checkme)!=0){
		$defaultstr="SELECT time FROM share_table where randid='$randid';";
		$defaultresults=mysql_query($defaultstr) or die("query gagal dijalankan");
	       	$result = mysql_fetch_assoc($defaultresults);
	    $datetime = new DateTime($result['time']);
		echo $datetime->format('Y-m-d');
	}else{
	echo 'null';	
	}
	

}




?>
