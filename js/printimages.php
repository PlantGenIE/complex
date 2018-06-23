<?php
 // session_start();
 
 $random_id=rand(10,9999999);
 
  $image_string = $_POST['image'];
  $tid = $_POST['tid'];
  $type = $_POST['type'];
  chdir('/mnt/spruce/www/tmp');
  $img = $image_string; 
  if($type == "pdf"){
      $img = base64_decode($image_string);
      #$img = $image_string;
      $path = "network_image_".$random_id.".pdf";
    }else if($type == "xml"){
      $path = "network_image_".$random_id.".xml";
    }
    else if($type == "svg"){
      $path = "network_image_".$random_id.".svg"; 
    }
	echo $path;
  $fh = fopen($path,"w");
  fwrite($fh, $img);  
  fclose($fh);  
  
  
?> 