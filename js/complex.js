/*
 *  File:           complex.js
 *  Author          Chanaka Mannapperuma
 *  Description:    Main script for ComPlEX2
 *  Created:        Thu May 15 10:04:04 GMT+02:00 2014
 */
var view1;

complexmessage.options = {
  closeButton: false,
  debug: false,
  positionClass: "toast-bottom-right",
  onclick: null,
  showDuration: "100",
  hideDuration: "100",
  timeOut: "8000",
  extendedTimeOut: "1000",
  showEasing: "linear",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut"
};

function populateNetworkSelect(data, element) {
  $(data).each(function(i, val) {
    var $div = $(`<div/>`, {
      class: 'network-select',
      'data-species': val.shortname,
      'data-network': val.id,
      id: `network${val.id}-select`,
      on: {
        click: function(event) {
          $(this).toggleClass('selected');
          
          // Currently we don't support same species network comparison
          $(`.network-select[data-species = ${this.dataset.species}].selected`)
            .not(`#${this.id}`)
            .removeClass('selected');
          
          // If this is the first to be selected, then also set it to active
          if ($('.network-select.selected').length === 1 & $(this).hasClass('selected')) {
            $(this).children('.network-radio').prop('checked', true).change();
          }
          
          // If it is active, don't allow it to be deselected
          if ($(this).hasClass('active') & !$(this).hasClass('selected')) {
            $(this).addClass('selected');
          }
        }
      }
    });
    $div.append(`<input class="network-radio" type="radio" name="network-radio">`);
    $div.append(`<label>${val.name}</label>`);
    $(element).append($div);
  });

  $('.network-radio').on('change', function() {
    if (!$(this).parent('.network-select').hasClass('selected')) {
      $(this).parent('.network-select').addClass('selected');
    }
    $('.network-select.active').removeClass('active');
    $(this).parent('.network-select').addClass('active');
  });
}

/*
 * Return the selected networks
 *
 * Returns: an array of network IDs
 */
function getSelectedNetworks() {
  return $('.network-select.selected').map(function() {
    return parseInt(this.dataset.network);
  }).toArray();
}

/*
 * Return the currently active network
 *
 * Returns: the ID of the currently active network
 */
function getActiveNetwork() {
  return $('.network-select.active').data('network');
}

/*
 * Get input gene names
 *
 */
function getInputGenes() {
  var genes = $('#sink1').val().split(/[, \t\n;]+/);
  if (genes.length === 1 && genes[0] === '') {
    return [];
  } else {
    return genes;
  }
}

function align() {
  $.ajax({
    url: 'service/network.php',
    method: 'POST',
    data: {
      network_ids: getSelectedNetworks(),
      active_network: getActiveNetwork(),
      gene_names: getInputGenes(),
      threshold: $('#th1').val()
    },
    dataType: 'json',
    success: function(data, textStatus) {
      view1.set_data(data, getActiveNetwork(), getSelectedNetworks());
    },
    error: function(jqXHR) {
      console.error(jqXHR.responseJSON.error);
    }
  });
}

function init(callback) {
  $.ajax({
    url: "service/metadata.php",
    type: "POST",
    data: {method: "get_networks"},
    dataType: "JSON",
    success: function(data) {
      callback(data);
    }
  });
}

function loadexample() {
  switch ($('.network-select.active').data("species")) {
    case "potra":
      $("#sink1").val("Potra000167g00627, Potra000342g01183, Potra000393g01809, Potra000740g05836, Potra000779g06142, Potra001021g08534, Potra001047g08885, Potra001066g09183, Potra001242g10676, Potra001542g12785, Potra001630g13406, Potra002004g15732, Potra002246g17253, Potra002409g18324, Potra002484g18790, Potra002574g19365, Potra002846g20119, Potra002888g20235, Potra002914g20296, Potra003265g21167, Potra003469g21770, Potra003868g23243, Potra003935g23615, Potra003972g23875, Potra004051g24387");
      break;
    case "artha":
      $("#sink1").val("AT1G06590, AT1G15570, AT1G34065, AT1G48270, AT1G79820, AT2G23380, AT2G31650, AT3G14740, AT3G19080, AT3G25100, AT4G08690, AT4G11450, AT4G16970, AT4G33130, AT5G06940, AT5G37630, AT5G45560, AT5G62410, AT5G63920");
      break;
    case "zemay":
      $("#sink1").val("GRMZM2G445905, GRMZM2G111642, GRMZM2G113137, GRMZM2G037413, GRMZM2G074546, GRMZM2G018241, GRMZM2G150404, GRMZM2G028353, GRMZM2G082580, GRMZM2G002523, GRMZM2G039454, GRMZM2G122431, GRMZM2G055795, GRMZM2G122277, GRMZM2G011651");
      break;
    default:
      complexmessage.error('No networks selected');
      return;
  }

  complexmessage.success("Example genes loaded.", "Success!");
  align();
}

function getExtensionGenes(extension, callback) {
  $.ajax({
    url: 'service/extension_controller.php',
    dataType: 'json',
    data: {
      method: 'getGenes',
      extension: extension
    },
    error: function(jqXHR, textStatus) {
      if (jqXHR.responseJSON) {
        console.error(jqXHR.responseJSON.error);
      } else {
        console.error(textStatus);
      }
    },
    success: function(data) {
      callback(data, extension);
    }
  });
}

function highlightGenes(data, extension) {
  for (var subext in data) {
    var eles = view1.cy.nodes().filter(function(x) {
      return $.inArray(x.id(), data[subext].genes.map(function(x) {
        return x.toString()
      })) !== -1;
    });

    eles.addClass(`${extension}-highlight`);
    eles.style(data[subext].style);
  }
}

function toggleExtension(e) {
  if (e.target.checked) {
    getExtensionGenes(e.target.dataset.extensionId, highlightGenes);
  }
}

window.onload = init(function(d) {
  $("#loader").hide();

  $('.accordion .accordion-head').addClass('opened').click(function() {
    $(this).next().toggle();
    $(this).toggleClass('opened');
    $(this).toggleClass('collapsed');
    return false;
  });

  populateNetworkSelect(d, '#network-buttons');

  $('.extension-checkbox').change(toggleExtension);

  view1 = new TableNetwork('#active-network-table',
    '#other-network-table', '#cytoscapeweb1',
    $('#complex-pval-threshold').val());

  $("#load-example-button").click(function(event) {
    event.stopPropagation();
    loadexample(1);
  });

  $("#align_to_species_button").click(function(e) {
    align();
  });

  $("#th1").on("change", function() {
    $("#" + this.id + "_span").html("(>=" + this.value + ")");
    align();
  });

  $('#complex-pval-threshold').on('change', function() {
    view1.setPvalueThreshold(this.value);
    $('#complex-pval-threshold-value').html(this.value);
  })

  $("#prebox").delay(500).fadeOut();
});
