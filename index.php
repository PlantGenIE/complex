<?php
/*
 *  File:           index.php
 *  Author          Chanaka Mannapperuma
 *  Description:    Main PHP for ComPlEX2
 *  Created:        Thu May 15 09:28:04 GMT+02:00 2014
 */

// Extensions
require_once("service/extensions.php");
$ext = new Extension_Collection();

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Complex 2.0</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="keywords" content="Complex 2.0">
    <link rel="icon" type="image/png" href="favicon.ico">
    <link rel="stylesheet" type="text/css" href="css/demo.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.16/b-1.5.1/b-html5-1.5.1/r-2.2.1/sc-1.4.4/sl-1.2.5/datatables.min.css">
    <link rel="stylesheet" href="https://cdn.rawgit.com/cytoscape/cytoscape.js-panzoom/2.5.2/cytoscape.js-panzoom.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
    <link href="css/complexmessage.min.css" media="screen" type="text/css" rel="stylesheet">
  </head>
  <body>
    <div id="prebox" style="width:100%;height:400%;background-color:#FFF;z-index:5000000;position:absolute;top:0px;left:0px;vertical-align:middle" >
      <div style="left:48%;top:48%"  class="loader_color2 medium"></div>
    </div>

    <header>
      <img src="images/complex_logo.png" alt="Complex logo">
    </header>
    <div class="accordion">
      <div class="accordion-head">
        Input
      </div>

      <div class="accordion-content input-container">
        <div class="network-input">
          <div>
            <label for="sink1">Genes</label>
            <button id="load-example-button">Load example genes</button>
          </div>
          <textarea name="sp1genes" rows="6" id="sink1"></textarea>
          <label>Available networks</label>
          <div id="network-buttons" class="network-button-container"></div>
          <label>Selected networks</label>
          <div id="selected-network-buttons" class="network-button-container"></div>
        </div>

        <div class="network-control">
          <label for="coexpressionThreshold">Co-expression threshold: &ge;<span id="coexpressionThresholdDisplay">0.990</span></label>
          <input id="coexpressionThreshold" type="range" min="0.95" max="1" step="0.001" value="0.99" name="coexpressionThreshold">

          <label for="pvalueThreshold">P-value threshold: &le;<span id="pvalueThresholdDisplay">0.05</span></label>
          <input id="pvalueThreshold" type="range" min="0" max="0.2" step="0.01" value="0.05">
          <button id="align_to_species_button" class="btn btn-4 btn-4c">Align</button>
        </div>
      </div>

      <?php if (!$ext->empty()): ?>
      <div class="accordion-head">
        Extensions
      </div>
      <div class="accordion-content">
        <div class="extension-control">
        <?php foreach ($ext as $n=>$e): ?>
          <div class="extension">
            <input class="extension-checkbox" type="checkbox" id="<?php echo $e->id; ?>-extension-checkbox"
              data-extension-name="<?php echo $n; ?>"
              data-extension-id="<?php echo $e->id; ?>">
            <label for="<?php echo $e->id; ?>-extension-checkbox"><?php echo $n ?></label>
            <p><?php echo $e->description; ?>
            <div class="extension-legend">
            <strong>Legend:</strong>
            <?php
            $gene_style = $e->get_gene_style();
            $edge_style = $e->get_edge_style();
            ?>
            <?php foreach ($e->subextensions as $x): ?>
              <div class="extension-legend-item">
                <svg width="40px" height="20px" xmlns="http://www.w3.org/2000/svg">
                <line class="edge" x1="0" y1="10" x2="30" y2="10" style="<?php echo !is_null($edge_style[$x->id]['line-color']) ? 'stroke: '.$edge_style[$x->id]['line-color'].';' : ''; ?><?php echo !is_null($edge_style[$x->id]['width']) ? 'stroke-width: '.$edge_style[$x->id]['width'].';' : '' ?><?php echo $edge_style[$x->id]['line-style'] === 'dashed' ? 'stroke-dasharray: 5,3;' : ''; ?>" />
                <circle class="node" cx="30" cy="10" r="9" style="<?php echo !is_null($gene_style[$x->id]['background-color']) ? 'fill: '.$gene_style[$x->id]['background-color'].';' : ''; ?>" />
                </svg>
                <abbr title="<?php echo $x->description; ?>"><?php echo $x->name; ?></abbr>
              </div>
            <?php endforeach; ?>
            </div>
          </div>
        <?php endforeach; ?>
        </div>
      </div>
      <?php endif; ?>

      <div class="accordion-head">
        Network
        <span style="color:#D84C4F;text-transform:none;font-family:Cambria, Palatino" id="newtrok_mode"></span>
        <span style="color:#D84C4F;text-transform:none;font-family:Cambria, Palatino"  id="newtrok_mode2"></span>
      </div>
      <div class="accordion-content">
        <div class="network-overlay">
          <p class="overlay-message"></p>
          <div class="loader_color2 spinner"></div>
        </div>
        <div class="network-wrapper">
          <div id="cytoscapeweb1" class="network-container"></div>
        </div>
      </div>

      <div class="accordion-head">
        Tables
        <span id="network_info" style="border-radius:5;padding:6px;color:#D84C4F;text-transform:none;font-family:Cambria, Palatino"></span>
      </div>
      <div class="accordion-content network-table-wrapper">
        <div>
          <h3>Active network</h3>
          <table id="active-network-table">
            <thead>
              <tr>
                <th></th>
                <th>Gene</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
        <div>
          <h3>Aligned networks</h3>
          <table id="other-network-table">
            <thead>
              <tr>
                <th></th>
                <th>Gene</th>
                <th>Network</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>

      <div class="accordion-head">
        Citation and Contact us
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

    <div class="lifted_content_box">
      &copy; <?php echo date("Y"); ?> UPSC Bioinformatics
    </div>

    <div id="loader" class="loader_color small"></div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

    <script src="lib/jquery.qtip-1.0.0-rc3.min.js"></script>
    <script src="https://cdn.datatables.net/v/dt/dt-1.10.16/b-1.5.1/b-colvis-1.5.1/b-html5-1.5.1/r-2.2.1/sl-1.2.5/datatables.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.2.7/cytoscape.min.js"></script>
    <script src="http://marvl.infotech.monash.edu/webcola/cola.v3.min.js"></script>
    <script src="https://cdn.rawgit.com/cytoscape/cytoscape.js-cose-bilkent/1.6.5/cytoscape-cose-bilkent.js"></script>
    <script src="https://cdn.rawgit.com/cytoscape/cytoscape.js-cola/v2.2.4/cytoscape-cola.js"></script>
    <script src="https://cdn.rawgit.com/cytoscape/cytoscape.js-panzoom/2.5.2/cytoscape-panzoom.js"></script>
    <script src="https://cdn.rawgit.com/cytoscape/cytoscape.js-cxtmenu/v3.0.2/cytoscape-cxtmenu.js"></script>
    <script src="js/network_overlay.js"></script>
    <script src="js/table_network.js"></script>
    <script src="js/complexmessage.min.js"></script>
    <script src="js/networkselect.js"></script>
    <script src="js/complex.js"></script>
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

