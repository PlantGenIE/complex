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

/**
 * Populate the network selection tool.
 * 
 * @param {array} data - Network data.
 * @param {string} element - ID of element where the buttons should go.
 * @param {string} targetElement - ID of element where selected buttons should go.
 */
function populateNetworkSelect(data, element, targetElement) {
  var container = document.querySelector(element);
  var targetContainer = document.querySelector(targetElement);

  getSelectedSpecies = function() {
    var tokens = document.querySelectorAll('.network-token.selected');
    var selectedSpecies = []
    for (let i = 0; i < tokens.length; ++i) {
      let s = tokens[i].getAttribute('data-species');
      if (selectedSpecies.indexOf(s) === -1) {
        selectedSpecies.push(s);
      }
    }
    return selectedSpecies;
  };

  moveToken = function(token, target) {
    var selecting = target == targetContainer;
    if (selecting) {
      token.classList.add('selected');
    } else {
      token.classList.remove('selected');
    }
    var unselectedTokens = document.querySelectorAll('.network-token:not(.selected)');
    var tokenSpecies = token.getAttribute('data-species');
    [].forEach.call(unselectedTokens, function(t) {
      if (t.getAttribute('data-species') === tokenSpecies) {
        if (selecting) {
          t.draggable = false;
          t.classList.add('inactive');
        } else {
          t.draggable = true;
          t.classList.remove('inactive');
        }
      }
    });
    target.appendChild(token);
  };

  handleDragOver = function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
  };

  handleDrop = function(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    var token = document.getElementById(e.dataTransfer.getData('text'));
    var tokenSpecies = token.getAttribute('data-species');
    if (token.parentNode != this) {
      moveToken(token, this);
    }
    return false;
  };

  handleTokenDrop = function(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    var token = document.getElementById(e.dataTransfer.getData('text'));
    if (token.parentNode == this.parentNode && this != token) {
      // Got this from https://stackoverflow.com/a/11974430/885443
      var insertionPoint, elem = this;

      do {
        elem = elem.nextSibling;
      } while (elem && elem !== token);

      insertionPoint = elem ? this : this.nextSibling;
      this.parentNode.insertBefore(token, insertionPoint);
    } else if (token.parentNode != this.parentNode) {
      moveToken(token, this.parentNode);
    }
    return false;
  };

  [].forEach.call(data, function(val) {
    var token = document.createElement('div');
    token.setAttribute('data-species', val.shortname);
    token.setAttribute('data-network', val.id);
    token.setAttribute('draggable', true);
    token.classList.add('network-token');
    token.id = `network${val.id}-token`;
    token.appendChild(document.createTextNode(val.name));

    token.addEventListener('dragstart', function(e) {
      this.classList.add('inactive');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', this.id);
    }, false);

    token.addEventListener('dragend', function() {
      targetContainer.classList.remove('token-over');
      this.classList.remove('inactive');
    }, false);

    token.addEventListener('dragover', handleDragOver, false);
    token.addEventListener('drop', handleTokenDrop, false);
    container.append(token);
  });

  targetContainer.addEventListener('dragover', handleDragOver, false);
  container.addEventListener('dragover', handleDragOver, false);
  targetContainer.addEventListener('drop', handleDrop, false);
  container.addEventListener('drop', handleDrop, false);
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
      updateExtensions();
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

function getExtensionEdges(extension, callback) {
  $.ajax({
    url: 'service/extension_controller.php',
    dataType: 'json',
    data: {
      method: 'getEdges',
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
  })
}

function highlightGenes(data, extension) {
  for (let subext in data) {
    let eles = view1.cy.nodes().filter(function(x) {
      return $.inArray(x.id(), data[subext].genes.map(function(x) {
        return x.toString()
      })) !== -1;
    });

    eles.addClass(`${subext}-highlight`);

    eles.each(function(x) {
      for (let attr in data[subext].style) {
        if (attr === 'background-color') {
          x.addClass('pie-node');
          if (!x.data(attr)) {
            x.data(attr, [data[subext].style[attr]]);
          } else {
            x.data(attr).push(data[subext].style[attr]);
          }
        } else {
          console.error(`warning: ${attr} not supported yet`);
        }
      }
    });
  }

  var pieNodes = view1.cy.nodes('.pie-node');
  pieNodes.each(function(x) {
    let n = x.data('background-color').length;
    for (let i = 1; i < n + 1; ++i) {
      x.style('pie-size', '100%');
      x.style(`pie-${i}-background-color`, x.data('background-color')[i - 1]);
      x.style(`pie-${i}-background-size`, 100.0 / n);
    }
  });
}

function removeExtension(data, extension) {
  for (var subext in data) {
    var eles = view1.cy.nodes(`.${subext}-highlight`);
    eles.removeClass(`${subext}-highlight`);

    eles.each(function(x) {
      for (let attr in data[subext].style) {
        if (attr === 'background-color') {
          let styling = x.data(attr);
          styling.splice(styling.indexOf(data[subext].style[attr]), 1);
          x.data(attr, styling);
          let n = styling.length;

          if (n === 0) {
            x.style('pie-size', 0);
            x.removeClass('pie-node');
          } else {
            for (let i = 0; i < n; ++i) {
              x.style(`pie-${i + 1}-background-color`, styling[i]);
              x.style(`pie-${i + 1}-background-size`, 100.0 / n);
            }
          }
        } else {
          console.error(`warning: ${attr} not supported yet`);
        }
      }
    });
  }
}

function addExtensionEdges(data, extension) {
  var edge_data = [];
  for (let subext in data) {
    for (let i in data[subext]['edges']) {
      let e = data[subext]['edges'][i];
      if (view1.cy.nodes(`[id='${e[0]}']`).length === 0 ||
          view1.cy.nodes(`[id='${e[1]}']`).length === 0) {
        continue;
      }
      edge_data.push({
        group: 'edges',
        classes: subext,
        data: {
          id: `${subext}-${e[0]}-${e[1]}`,
          source: `${e[0]}`,
          target: `${e[1]}`
        }
      });
    }
  }

  view1.cy.add(edge_data);

  for (let subext in data) {
    for (let attr in data[subext]['style']) {
      if (attr === 'line-color' ||
          attr === 'line-style' ||
          attr === 'width') {
        view1.cy.elements(`.${subext}`).style(attr, data[subext].style[attr]);
      }
    }
  }
}

function removeExtensionEdges(data, extension) {
  for (let subext in data) {
    view1.cy.elements(`.${subext}`).remove();
  }
}

function toggleExtension(e) {
  if (e.target.checked) {
    getExtensionGenes(e.target.dataset.extensionId, highlightGenes);
    getExtensionEdges(e.target.dataset.extensionId, addExtensionEdges);
  } else {
    getExtensionGenes(e.target.dataset.extensionId, removeExtension);
    getExtensionEdges(e.target.dataset.extensionId, removeExtensionEdges);
  }
}

function updateExtensions() {
  $('.extension-checkbox').each(function(i, x) {
    if (x.checked) {
      getExtensionGenes(x.dataset.extensionId, highlightGenes);
      getExtensionEdges(x.dataset.extensionId, addExtensionEdges);
    }
  });
}

window.onload = init(function(d) {
  $("#loader").hide();

  $('.accordion .accordion-head').addClass('opened').click(function() {
    $(this).next().toggle();
    $(this).toggleClass('opened');
    $(this).toggleClass('collapsed');
    return false;
  });

  populateNetworkSelect(d, '#network-buttons', '#selected-network-buttons');

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
