<?php
/*
 *  File:           index.php
 *  Author          Chanaka Mannapperuma
 *  Description:    Main PHP for ComPlEX2
 *  Created:        Thu May 15 09:28:04 GMT+02:00 2014
 */
if ( isset($_SERVER["REMOTE_ADDR"]) )    {
   $ip = '' . $_SERVER["REMOTE_ADDR"] . '';
   } else if ( isset($_SERVER["HTTP_X_FORWARDED_FOR"]) )    {
   $ip = '' . $_SERVER["HTTP_X_FORWARDED_FOR"] . '';
   } else if ( isset($_SERVER["HTTP_CLIENT_IP"]) )    {
   $ip = '' . $_SERVER["HTTP_CLIENT_IP"] . '';
   }
	if( $_SERVER["HTTP_REFERER"] !="http://www.biomedcentral.com/1471-2164/15/106/abstract"){
	 if( $_SERVER['SERVER_NAME']=="complex2.plantgenie.org" || isset($_GET['workflow']) || isset($_GET['direct']) || isset($_SERVER["HTTP_REFERER"]) ){ 
	 }else{
		include_once("overlay.php");  
		exit();
	 }
	 }else{
		include_once("overlay.php");  
		exit(); 
	 }
   ?>
<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <title>ComPlEx 2.0</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="keywords" content="ComPlEx 2.0" />
      <link rel="ComPlEx" href="images/favicon.png">
      <link href="tour/css/poptour.css" rel="stylesheet">
      </link>
      <link rel="stylesheet" type="text/css" href="css/demo.css" />
      <link rel="stylesheet" type="text/css" href="css/style.css" />
      <link rel="stylesheet" type="text/css" href="css/demo_table.css" />
      
      
      <script src="lib/jquery-1.10.2.min.js"></script>
        <script src="js/jquery-ui.js"></script>

      <script src="lib/jquery.qtip-1.0.0-rc3.min.js"></script>
      <script src="lib/jquery.dataTables.min.old.js"></script>
      <script src="http://v22.popgenie.org/fingerprint/fingerprint.js"></script>
      <script type="text/javascript"> 
		var ip_address = "<?php echo  $ip?>";var fp4=new Fingerprint({screen_resolution:true});if(document.cookie.indexOf("atgenie_uuid")>=0){}else{setCookie("atgenie_uuid",fp4.get()+";;"+ip_address,7)}if(document.cookie.indexOf("popgenie_uuid")>=0){}else{setCookie("popgenie_uuid",fp4.get()+";;"+ip_address,7)}if(document.cookie.indexOf("congenie_uuid")>=0){}else{setCookie("congenie_uuid",fp4.get()+";;"+ip_address,7)}
      </script>
      
      <script src="lib/AC_OETags.min.js"></script>
      <script src="lib/cytoscapeweb.min.js"></script>
      <script src="js/variable_js.js"></script>
      <script src="js/comp_net.js"></script>
      <script src="js/simple-slider.js"></script>
      <script src="js/complex.js"></script>
   </head>
   <body>
      <div class="container">
      <section class="ac-container">
         <img id="showLeftPush" style="padding:6px;margin-left:16px;  cursor:pointer;border:none;" src="images/complex80.png" />
         <div style="float:right;margin-right:24px;border-radius:6px;margin-top:10px;">
            <a title="Contact us" target="_blank" href="http://congenie.org/contact">
               <div   style="overflow:hidden;position:absolute;right:250px;cursor:pointer">
               </div>
            </a>
          
            <a target="_blank" href="http://plantgenie.org/help/tool_id/complex/"><img src="images/gnome_dialog_question2.png" alt="Help Tour" title="Help Tour"  style="top:10px;margin-top:10px;margin-left:20px; position:absolute;cursor:pointer" /></a>
            <a title="Spruce" style="text-decoration:none" target="_blank" href="http://congenie.org?genelist=enable">
            <img onClick="fire_onchange_onclick('os');" class="collage" id="os_image" style="padding:6px;margin-left:80px;  cursor:pointer;border:none;" src="images/cl.png" />
            <span id="os_num_span" class="notificationcount" style="opacity: 1;">00</span>
            </a>
            <a title="Poplar" style="text-decoration:none" target="_blank" href="http://popgenie.org?genelist=enable">
            <img onClick="fire_onchange_onclick('pt');" class="collage" id="pt_image" style="padding:6px;margin-left:6px;  cursor:pointer;border:none;" src="images/pl.png" />&nbsp;<span id="pt_num_span" class="notificationcount" style="opacity: 1;">00</span>
            </a>
            <a title="Arabidopsis" style="text-decoration:none" target="_blank" href="http://atgenie.org?genelist=enable">
            <img onClick="fire_onchange_onclick('at');" class="collage" id="at_image" style="padding:6px;margin-left:6px;  cursor:pointer;border:none;" src="images/al.png" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="at_num_span" class="notificationcount" style="opacity: 1;">00</span>
            </a>
         </div>
         <div>
            <!--<button  class="btn btn-4 btn-4c " style="border:none;text-transform:inherit;margin-top:-14px;">Example</button> -->
            <input id="ac-1" name="accordion-1" style="display:none;visibility:hidden;height:0px;width:0px;color:#c6e1ec" checked type="checkbox" />
            <label for="ac-1">Input   <button onClick="loadexample(1);loadexample(2);" style="font-size:12px;padding:4px;margin-top:-22px;"   class="tourbtn tourbtn-primary" >Load Example</button> <button id="startTourBtn" style="font-size:12px;padding:4px;margin-top:-22px;background:#F90"   class="tourbtn tourbtn-primary" >Take a Tour</button></label>
            <article style="background:#FFFFFF" class="ac-large-input">
               <br> 
               <table width="100%" border="0">
                  <tr>
                     <td width="50%">
                        <p>
                           <textarea name="sp1genes" rows="6" id="sink1" style="width:100%"></textarea>
                           <select class="sel" name="sp1" id="sp_1" style="width:100%">
                           </select>
                        </p>
                     </td>
                     <td  width="50%">
                        <p><textarea rows="6" style="width:100%" id="sink2"></textarea>
                           <select class="sel" name="sp2" id="sp_2" style="width:100%">
                           </select>
                        </p>
                     </td>
                  </tr>
               </table>
               <table id="sub_table" width="100%" border="0">
                  <tr  >
                     <td width="140px">co-expression:<span id="th1_span">(>=3)</span>
                     </td>
                     <td>
                        <table border="0" cellpadding="0" cellspacing="0"   >
                           <tr>
                              <td width="100px"></td>
                              <td width="700px"> <input data-slider="true" data-slider-range="3,10" id="th1" name="th1" data-slider-step="0.5" value="3" type="text" data-slider-snap="true" data-slider-highlight="true" />
                              </td>
                              <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                              <td >&nbsp; <button style="font-size:10px;text-transform:none" onClick="coexpressiontrclick();"  id="coexpressiontrclickbtn" class="btn btn-4 btn-4c">Show conservation slider</button></td>
                           </tr>
                        </table>
                     </td>
                  </tr>
                  <tr style="display:none" id="conservation_slider">
                     <td width="140px">conservation:<span id="consth1_span">(>=3)</td>
                     <td >
                        <table border="0" cellpadding="0" cellspacing="0"   >
                           <tr >
                              <td  width="800px" ><input   data-slider="true"  data-slider-range="2,10" id = "consth1" name="consth1" data-slider-step="0.5" value="3"  type="text" data-slider-snap="true" data-slider-highlight="true"/></td>
                           </tr>
                        </table>
                     </td>
                  </tr>
                  <tr>
                     <td></td>
                     <td><button id="align_to_species_button" class="btn btn-4 btn-4c " style="width:90%;border:none;text-transform:inherit;"></button><br>
                        <button id="compare_with_species_button"  class="btn btn-4 btn-4c "  style="width:90%;border:none;text-transform:inherit;"></button> 
                     </td>
                  </tr>
               </table>
            </article>
         </div>
         <div>
            <input id="ac-2" name="accordion-1" checked style="display:none;visibility:hidden;height:0px;width:0px;color:#c6e1ec" type="checkbox" />
            <label for="ac-2">Network<span style="color:#D84C4F;text-transform:none;font-family:Cambria, Palatino" id="newtrok_mode"></span><span style="color:#D84C4F;text-transform:none;font-family:Cambria, Palatino"  id="newtrok_mode2"></span>
            </label>
            <article class="ac-large">
               <table style="background-color:#c6e1ec" width="100%" border="0">
                  <tr>
                     <td width="50%">
                        <p><span style="z-index:100000000" id="species_span_1"></span>
                           </br>
                        <div id="cytoscapeweb1" align="center" style="width:100%;height:600px;margin-top:-40px;text-align:center;vertical-align:middle">Please wait for content generation...</div>
                        </br>
                        <button id="selectal1" value="Select all" onClick="selectSel1()">Select all</button>
                        </p>
                     </td>
                     <td>
                        <hr>
                     </td>
                     <td width="50%">
                        <p><span id="species_span_2"></span>
                           </br>
                        <div id="cytoscapeweb2" align="center" style="width:100%;height:600px;margin-top:-40px;text-align:center;vertical-align:middle">Please wait for content generation...</div>
                        </br>
                        <button value="Select all" onclick="selectSel2()">Select all</button>
                        </p>
                     </td>
                  </tr>
               </table>
            </article>
         </div>
         <div>
         <input id="ac-3" name="accordion-1" type="checkbox" style="display:none;visibility:hidden;height:0px;width:0px;color:#c6e1ec" checked />
         <label for="ac-3">Tables <span id="network_info" style="border-radius:5;padding:6px;color:#D84C4F;text-transform:none;font-family:Cambria, Palatino"> </span></label>
         <article style="background:#FFFFFF;" class="ac-extra-medium">
            <div style="float:right;margin-top: 34px;">
               <button id="replacebtn" class="btn btn-4 btn-4c " onClick="sendtogenebaskets(true)">Replace gene baskets</button>|
               <button id="sendbtn" class="btn btn-4 btn-4c " onClick="sendtogenebaskets(false)">Send to gene baskets</button>|
               <button id="selectallbtn"  class="btn btn-4 btn-4c " onClick="{tmp_nodes_flag=true;tmp_edges_flag=true;vis1.select('nodes');}">Select All</button>|
               <button id="deselectallbtn" class="btn btn-4 btn-4c " onClick="{vis1.deselect('nodes');}">Deselect All</button>|
               <button id="alignselectedbtn" class="btn btn-4 btn-4c " class="btn btn-4 btn-4c " onClick="align_selected();">Align Selected</button>|
               <button id="compareselectedbtn" class="btn btn-4 btn-4c " onClick="compare_selected();">Compare Selected</button>
            </div>
            <table width="100%" border="0">
               <tr>
                  <td valign="baseline" width="50%">
                     <div id="consdiv">
                        <table style="margin-left:10px;" width="97%" id='firsttable' name='firsttable' class='dataTable'>
                           <tbody>
                           </tbody>
                           <tfoot>
                           </tfoot>
                        </table>
                  </td>
                  <td>
                  <hr>
                  </td>
                  <td valign="baseline" width="50%">
                  <p>
                  <div id="consdiv2">
                  <table width="97%" style="margin-left:10px;" id='secondtable' name='secondtable' class='dataTable'>
                  <tbody>
                  </tbody>
                  <tfoot>
                  </tfoot>
                  </table>
                  </p>
                  </td>
               </tr>
            </table>
         </article>
         </div>
         <div>
         <input id="ac-4" name="accordion-1" type="checkbox" style="display:none;visibility:hidden;height:0px;width:0px;color:#c6e1ec" checked />
         <label for="ac-4">Citation and Contact us | Site Views for Last six months <span id="network_info" style="border-radius:5;padding:6px;color:#D84C4F;text-transform:none;font-family:Cambria, Palatino"> </span></label>
         <article style="background:#FFFFFF;" class="ac-extra-medium"><table><tr><td>
         <div style="float:left;margin-top: 34px;">
         <p>                  
         <strong>A manuscript describing Complex has been published. If you make use of the resource, please cite us:</strong><br>
         S. Netotea, D. Sundell, N. R. Street and T. R. Hvidsten. ComPlEx:
         conservation and divergence of co-expression networks in A. thaliana,
         Populus and O. sativa. BMC Genomics 15:106, 2014.<br>
         <br>
         <strong>Latest Publication: <br><a href="http://onlinelibrary.wiley.com/doi/10.1111/nph.13557/abstract">The Plant Genome Integrative Explorer Resource: PlantGenIE.org</a>. New Phytologist 2015</strong><br>
David Sundell, Chanaka Mannapperuma, Sergiu Netotea, Nicolas Delhomme, Yao-Cheng Lin, Andreas Sjödin, Yves Van de Peer, Stefan Jansson, Torgeir R. Hvidsten,</p>

         <form id="contact" style="font-size:18px" name="contact" method="post">  
         <table width="600px" style="border-spacing:0 5px;border-collapse: separate;font-size:16px;margin-left:16px;" border="0">
         <tr>
         <td>Name<span class="required">*</span>:&nbsp;</td>
         <td><input type="text" name="name" id="name" size="30" value="" required/></td><br>
         </tr>
         <tr>
         <td>Email<span class="required">*</span>:&nbsp;</td>
         <td> <input type="text" name="email" id="email" size="30" value="" required/></td>
         </tr>
         <tr>
         <td valign="top">Message<span class="required">*</span>: &nbsp;</td>
         <td><textarea name="message" cols="40" rows="6" id="message" required></textarea></td>
         </tr>
         <tr>
         <td valign="top">What color is a "<i>Poplar</i>" leaf?<span class="required">*</span>:&nbsp;</td>
         <td> <input type="text"  name="captcha" value="" required/></td>
         </tr>
         <tr>
         <td>&nbsp; </td>
         <td> <input id="submit" class="btn btn-4 btn-4c "  type="submit" name="submit" value="Send"  style="float:right;padding:6px;padding-left:12px;padding-right:12px;"/> </td>
         </tr>
         </table>
         </form>
         <div id="success">
         <span>
         <p><strong>Your message was sent succssfully! We will be in touch very soon.</strong></p>
         </span>
         </div>
         <div id="error">
         <span>
         <p>Something went wrong, try refreshing and submitting the form again.</p>
         </span>
         </div>
         <br>	
         </div>
         </article>
         </td><td>
         <script type="text/javascript" src="//ajax.googleapis.com/ajax/static/modules/gviz/1.0/chart.js">
            {"dataSourceUrl":"//docs.google.com/spreadsheet/tq?key=0Aj2bYzePbGwJdHhXMURKTURNWEtVOTczTnY0YlV2VGc&transpose=0&headers=0&range=A2%3AB25&gid=0&pub=1","options":{"vAxes":[{"useFormatFromData":true,"minValue":null,"viewWindow":{"min":null,"max":null},"maxValue":null},{"useFormatFromData":true,"minValue":null,"viewWindow":{"min":null,"max":null},"maxValue":null}],"titleTextStyle":{"fontSize":6},"booleanRole":"certainty","title":"Chart title","colors":["#DC3912","#EFE6DC","#109618"],"legend":"right","displayMode":"regions","datalessRegionColor":"#d0e0e3","hAxis":{"useFormatFromData":true,"title":"Horizontal axis title","minValue":null,"viewWindow":{"min":null,"max":null},"maxValue":null},"width":800,"height":341},"state":{},"view":{},"isDefaultVisualization":false,"chartType":"GeoChart","chartName":"Chart 3"} 
         </script>
         </td></tr></table>
         </div>
      </section>
      </div>
      <div style="background:#FFF;">
         <article class="lifted_content_box">
            <div>
               © 2014 UPSC Bioinformatics
            </div>
         </article>
      </div>
      <script type="text/javascript" src="js/complexmessage.min.js"></script>
      <script src="js/jquery.validate.min.js"></script>
      <script src="js/jquery.form.js"></script>
      <script src="js/validate.js"></script>
      <script src="tour/poptour.js"></script>
      <script src="tour/complex.js"></script>
      <link href="css/complexmessage.min.css" media="screen" type="text/css" rel="stylesheet">
      <div id="prebox" style="width:100%;height:400%;background-color:#FFF;z-index:5000000;position:absolute;top:0px;left:0px;vertical-align:middle" >
         <div  align="center" style="left:48%;top:48%"  class="loader_color2 medium"></div>
      </div>
      <style>
	   .ui-effects-transfer-remove { border: 2px dotted #d35530; z-index:2000;}
 .ui-effects-transfer { border: 2px dotted #d35530; z-index:2000;border-radius:36px;}
 .ui-effects-transfer-2 { border: 2px groove #d35530; z-index:2000;border-radius:36px;}
	  </style>
   </body>
</html>
<div id="loader" class="loader_color small"></div>
<script>
   (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
   })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
   
   ga('create', 'UA-49780808-1', 'plantgenie.org');
   ga('send', 'pageview');
   
   //Very cool custom functions
function $_GET(q, s) {
    s = s ? s : window.location.search;
    var re = new RegExp('&' + q + '(?:=([^&]*))?(?=&|$)', 'i');
    return (s = s.replace('?', '&').match(re)) ? (typeof s[1] == 'undefined' ? '' : decodeURIComponent(s[1])) : undefined;
}

   
</script>


<script src="http://popgenie.org/tools/tour/poptour.js"></script>
<script src="http://popgenie.org/tools/tour/workflow.js"></script> 
    <script>
	if (typeof $_GET('workflow') != 'undefined') {
		var workflow="w"+$_GET('workflow');
		 mannapperuma.startTour(eval(workflow));
	}
	</script> 
