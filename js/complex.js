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

function align(geneIds = null, alignClicked = false) {
  var postData = {
    network_ids: getSelectedNetworks(),
    active_network: getActiveNetwork(),
    threshold: $('#th1').val()
  };

  var inputGenes = getInputGenes();
  var activeGenes = view1.getActiveNodeIds();

  if (postData.network_ids.length === 0) {
    complexmessage.error("No networks selected");
    return;
  }

  if (geneIds === null && inputGenes.length === 0 && activeGenes.length === 0) {
    complexmessage.error("No genes specified");
    return;
  } else if (geneIds === null && activeGenes.length === 0) {
    postData.gene_names = inputGenes;
  } else if (geneIds === null && activeGenes.length > 0 && !alignClicked) {
    postData.gene_ids = activeGenes;
  } else if (geneIds === null && inputGenes.length === 0 && alignClicked){
    postData.gene_ids = activeGenes;
  } else if (geneIds === null && inputGenes.length > 0 && alignClicked){
    postData.gene_names = inputGenes;
  } else {
    postData.gene_ids = geneIds;
  }

  $.ajax({
    url: 'service/network.php',
    method: 'POST',
    data: postData,
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
  switch (getActiveSpecies()) {
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
}

function getExtensionGenes(extension, callback) {
  $.ajax({
    url: 'service/extension_controller.php',
    dataType: 'json',
    data: {
      method: 'getGenes',
      extension: extension,
      genes: view1.getNodeIds()
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
      extension: extension,
      genes: view1.getNodeIds()
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
        classes: `${subext} extension`,
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
  // If there are edges in the extension, they will most likely take
  // longer to load compared to the nodes. Therefore we only hide the
  // overlay here, and not after loading the nodes.
  hideOverlay();
}

function removeExtensionEdges(data, extension) {
  for (let subext in data) {
    view1.cy.elements(`.${subext}`).remove();
  }
  hideOverlay();
}

function toggleExtension(e) {
  if (e.target.checked) {
    showOverlay(`Loading extension: ${e.target.dataset.extensionName}`);
    getExtensionGenes(e.target.dataset.extensionId, highlightGenes);
    getExtensionEdges(e.target.dataset.extensionId, addExtensionEdges);
  } else {
    showOverlay(`Unloading extension: ${e.target.dataset.extensionName}`);
    getExtensionGenes(e.target.dataset.extensionId, removeExtension);
    getExtensionEdges(e.target.dataset.extensionId, removeExtensionEdges);
  }
  window.localStorage.setItem('activeExtensions', JSON.stringify(getActiveExtensions()));
}

function updateExtensions() {
  $('.extension-checkbox').each(function(i, x) {
    if (x.checked) {
      getExtensionGenes(x.dataset.extensionId, highlightGenes);
      getExtensionEdges(x.dataset.extensionId, addExtensionEdges);
    }
  });
}

function getActiveExtensions() {
  var extensions = [];
  [].forEach.call(document.querySelectorAll('.extension-checkbox'), function(x) {
    if (x.checked) {
      extensions.push(x.getAttribute('data-extension-id'));
    }
  });
  return extensions;
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

  view1 = new TableNetwork('#active-network-table',
    '#other-network-table', '#cytoscapeweb1',
    $('#complex-pval-threshold').val());

  var coexpressionThreshold = window.localStorage.getItem('coexpressionThreshold');
  if (coexpressionThreshold) {
    document.querySelector('#th1').value = coexpressionThreshold;
    document.querySelector('#th1-value').innerHTML = coexpressionThreshold;
  }

  var activeNodes = JSON.parse(window.localStorage.getItem('activeNodes'));
  if (activeNodes && activeNodes.length > 0 && getSelectedNetworks().length > 0) {
    align(activeNodes);
  }

  $("#load-example-button").click(function(event) {
    event.stopPropagation();
    loadexample(1);
  });

  $("#align_to_species_button").click(function(e) {
    align(null, true);
  });

  $('.extension-checkbox').change(toggleExtension);
  var activeExtensions = JSON.parse(window.localStorage.getItem('activeExtensions'));
  if (activeExtensions) {
    [].forEach.call(activeExtensions, function(x) {
      let extensionCheckbox = document.querySelector(`input[data-extension-id=${x}]`);
      if (extensionCheckbox) {
        extensionCheckbox.checked = true;
      }
    });
  }

  document.querySelector('#th1').addEventListener('change', function() {
    window.localStorage.setItem('coexpressionThreshold', this.value);
    document.querySelector('#th1-value').innerHTML = this.value;
    if (view1.getActiveNodeIds().length > 0) {
      align(view1.getActiveNodeIds());
    }
  }, false);

  document.querySelector('#complex-pval-threshold').addEventListener('change', function() {
    window.localStorage.setItem('pvalueThreshold', this.value);
    view1.setPvalueThreshold(this.value);
    document.querySelector('#complex-pval-threshold-value').innerHTML = this.value;
  }, false);

  var pvalueThreshold = window.localStorage.getItem('pvalueThreshold');
  if (pvalueThreshold) {
    document.querySelector('#complex-pval-threshold').value = pvalueThreshold;
    document.querySelector('#complex-pval-threshold-value').innerHTML = pvalueThreshold;
    view1.pvalueThreshold = pvalueThreshold;
  }

  $("#prebox").delay(500).fadeOut();
});
