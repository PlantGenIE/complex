<?php
/*
 *  File:           index.php
 *  Author          Chanaka Mannapperuma
 *  Description:    Main PHP for ComPlEX2
 *  Created:        Thu May 15 09:28:04 GMT+02:00 2014
 */
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

   </head>
   <body>
      <div id="prebox" style="width:100%;height:400%;background-color:#FFF;z-index:5000000;position:absolute;top:0px;left:0px;vertical-align:middle" >
         <div  align="center" style="left:48%;top:48%"  class="loader_color2 medium"></div>
      </div>
      <div>
         <img id="showLeftPush" style="padding:6px;margin-left:16px;  cursor:pointer;border:none;" src="images/complex80.png" />
         <div style="float:right;margin-right:24px;border-radius:6px;margin-top:10px;">
            <a target="_blank" href="http://plantgenie.org/help/tool_id/complex/">
                <img src="images/gnome_dialog_question2.png" alt="Help Tour" title="Help Tour" style="margin-top:10px;margin-left:20px;cursor:pointer" />
            </a>
         </div>
         <div class="accordion">
            <div class="accordion-head">
                Input
                <button id="load-example-button" style="font-size:12px;padding:4px;margin-top:-22px;" class="tourbtn tourbtn-primary" >Load Example</button>
                <button id="startTourBtn" style="font-size:12px;padding:4px;margin-top:-22px;background:#F90" class="tourbtn tourbtn-primary" >Take a Tour</button>
            </div>

            <div class="accordion-content ac-large-input">
                <div class="network-input">
                    <div>
                        <textarea name="sp1genes" rows="6" id="sink1"></textarea>
                        <select class="sel" name="sp1" id="sp_1"></select>
                    </div>

                    <div>
                        <textarea rows="6" id="sink2"></textarea>
                        <select class="sel" name="sp2" id="sp_2"></select>
                    </div>
                </div>

                <div class="network-control">
                    <label for="th1">co-expression: <span id="th1_span">(>=0.990)</label>
                    <input type="range" min="0.95" max="1" step="0.001" value="0.99" id="th1" name="th1">

                    <button id="align_to_species_button" class="btn btn-4 btn-4c"></button>
                    <button id="compare_with_species_button"  class="btn btn-4 btn-4c"></button>
                </div>
            </div>

            <div class="accordion-head">
                Network
                <span style="color:#D84C4F;text-transform:none;font-family:Cambria, Palatino" id="newtrok_mode"></span>
                <span style="color:#D84C4F;text-transform:none;font-family:Cambria, Palatino"  id="newtrok_mode2"></span>
            </div>
            <div class="accordion-content ac-large">
                <div class="network-wrapper">
                    <div id="cytoscapeweb1" class="network-container"></div>
                    <div id="cytoscapeweb2" class="network-container"></div>
                </div>
            </div>

            <div class="accordion-head">
                Tables
                <span id="network_info" style="border-radius:5;padding:6px;color:#D84C4F;text-transform:none;font-family:Cambria, Palatino"></span>
            </div>
            <div class="accordion-content ac-extra-medium">
                <div style="float:right;margin-top:1em;margin-bottom:1em;">
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
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Gene</th>
                                    </tr>
                                </thead>
                               <tbody>
                               </tbody>
                            </table>
                      </td>
                      <td>
                      <hr>
                      </td>
                      <td valign="baseline" width="50%">
                      <p>
                      <div id="consdiv2">
                      <table width="97%" style="margin-left:10px;" id='secondtable' name='secondtable' class='dataTable'>
                        <thead>
                                    <tr>
                                        <th></th>
                                        <th>Gene</th>
                                    </tr>
                        </thead>
                      <tbody>
                      </tbody>
                      </table>
                      </p>
                      </td>
                   </tr>
                </table>
            </div>
            <div class="accordion-head">
                Citation and Contact us
                <span id="network_info" style="border-radius:5;padding:6px;color:#D84C4F;text-transform:none;font-family:Cambria, Palatino"></span>
            </div>
            <div class="accordion-content ac-extra-medium">
                <p>
                    <strong>A manuscript describing Complex has been published. If you make use of the resource, please cite us:</strong><br>
                    S. Netotea, D. Sundell, N. R. Street and T. R. Hvidsten. ComPlEx:
                    conservation and divergence of co-expression networks in A. thaliana,
                    Populus and O. sativa. BMC Genomics 15:106, 2014.
                </p>
            </div>
         </div>
      </div>
      <div style="background:#FFF;">
         <article class="lifted_content_box">
            <div>
            &copy; <?php echo date("Y"); ?> UPSC Bioinformatics
            </div>
         </article>
      </div>
    <div id="loader" class="loader_color small"></div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

        <script src="lib/jquery.qtip-1.0.0-rc3.min.js"></script>
        <script src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js"></script>

        <script src="lib/AC_OETags.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.2.7/cytoscape.min.js"></script>
        <script src="js/variable_js.js"></script>
        <script src="js/tables.js"></script>
        <script src="js/networks.js"></script>
        <script src="js/table_network.js"></script>
        <script src="js/complexmessage.min.js"></script>
        <script src="js/complex.js"></script>
        <script src="http://popgenie.org/tools/tour/poptour.js"></script>
        <script src="http://popgenie.org/tools/tour/workflow.js"></script>
        <script src="js/jquery.validate.min.js"></script>
        <script src="js/jquery.form.js"></script>
        <script src="js/validate.js"></script>
        <script src="tour/poptour.js"></script>
        <script src="tour/complex.js"></script>
      <link href="css/complexmessage.min.css" media="screen" type="text/css" rel="stylesheet">
      <style>
	   .ui-effects-transfer-remove { border: 2px dotted #d35530; z-index:2000;}
 .ui-effects-transfer { border: 2px dotted #d35530; z-index:2000;border-radius:36px;}
 .ui-effects-transfer-2 { border: 2px groove #d35530; z-index:2000;border-radius:36px;}
	  </style>
        <script>
            //Very cool custom functions
            function $_GET(q, s) {
                s = s ? s : window.location.search;
                var re = new RegExp('&' + q + '(?:=([^&]*))?(?=&|$)', 'i');
                return (s = s.replace('?', '&').match(re)) ? (typeof s[1] == 'undefined' ? '' : decodeURIComponent(s[1])) : undefined;
            }

            if (typeof $_GET('workflow') != 'undefined') {
                var workflow="w"+$_GET('workflow');
                mannapperuma.startTour(eval(workflow));
            }
        </script>
   </body>
</html>

