var extensions = (function() {
  var ready = false;
  var hideNonExtensionsCheckbox;

  function reloadExtensions() {
    Array.from(document.getElementsByClassName('extension-checkbox')).forEach(ele => {
      if (ele.checked) {
        getGenes(ele.dataset.extensionId, highlightNodes);
        getEdges(ele.dataset.extensionId, addEdges);
      }
    });
  }

  function toggleExtension(event) {
    let extensionId = event.target.dataset.extensionId;
    if (event.target.checked) {
      getGenes(extensionId, highlightNodes);
      getEdges(extensionId, addEdges);
    } else {
      getGenes(extensionId, removeNodeHighlight);
      getEdges(extensionId, removeEdges);
    }
  }

  function getGenes(extension, callback) {
    $.ajax({
      url: 'service/extension_controller.php',
      dataType: 'json',
      method: 'POST',
      data: {
        method: 'getGenes',
        extension: extension,
        genes: alignmentView.nodeIds()
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

  function getEdges(extension, callback) {
    $.ajax({
      url: 'service/extension_controller.php',
      dataType: 'json',
      method: 'POST',
      data: {
        method: 'getEdges',
        extension: extension,
        genes: alignmentView.nodeIds()
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

  function highlightNodes(data, extension) {
    for (let subext in data) {
      let eles = alignmentView.nodes().filter(node => {
        return $.inArray(
          node.id(),
          data[subext].genes.map(x => x.toString())
        ) !== -1;
      });

      eles.addClass(`${subext}-highlight`);
      eles.addClass('extension');

      eles.each(x => {
        for (let attr in data[subext].style) {
          if (attr === 'background-color') {
            if (!x.data('extension')) {
              x.data('extension', []);
            }
            let extensionData = x.data('extension');
            extensionData.push({name: subext, color: data[subext].style[attr]});
            x.data('extension', extensionData);
          } else {
            console.warn(`warning: ${attr} not supported yet`);
          }
        }
      });
    }
    updateNonExtensionHiding();
  }

  function removeNodeHighlight(data, extension) {
    for (let subext in data) {
      let eles = alignmentView.nodes(`.${subext}-highlight`);
      eles.each(node => {
        let extensionData = node.data('extension')
          .filter(x => x.name != subext)
        node.data('extension', extensionData);
        node.removeClass(`.${subext}-highlight`);
        if (extensionData.length === 0) {
          node.removeClass('extension');
        }
      });
    }
    updateNonExtensionHiding();
  }

  function addEdges(data, extension) {
    let edgeData = [];
    for (let subext in data) {
      for (let i in data[subext].edges) {
        let e = data[subext].edges[i];
        if (alignmentView.nodes(`#${e[0]}`).length === 0 ||
            alignmentView.nodes(`#${e[1]}`).length === 0) {
          continue;
        }
        edgeData.push({
          group: 'edges',
          classes: `${subext} extension`,
          data: {
            id: `${subext}-${e[0]}-${e[1]}`,
            source: e[0],
            target: e[1],
            extension: [{
              name: subext,
              lineColor: data[subext].style['line-color'],
              lineStyle: data[subext].style['line-style'],
              width: data[subext].style['width']
            }]
          }
        });
      }
    }
    alignmentView.add(edgeData);
  }

  function removeEdges(data, extension) {
    for (let subext in data) {
      alignmentView.edges(`.${subext}`).remove();
    }
  }

  function hideNonExtensions() {
    alignmentView.nodes('.gene').hide();
    alignmentView.nodes('.extension').show();
  }

  function showNonExtensions() {
    alignmentView.nodes().show();
  }

  function updateNonExtensionHiding() {
    if (hideNonExtensionsCheckbox.checked) {
      hideNonExtensions();
    } else {
      showNonExtensions();
    }
  }

  return {
    init: function() {
      hideNonExtensionsCheckbox = document.getElementById('show-only-extensions-checkbox');
      hideNonExtensionsCheckbox.addEventListener('change', updateNonExtensionHiding);

      Array.from(document.getElementsByClassName('extension-checkbox'))
        .forEach(element => {
          element.addEventListener('change', toggleExtension);
        });

      this.ready = true;
    },

    update: function() {
      if (this.ready) {
        reloadExtensions();
      }
    }
  };
})()
