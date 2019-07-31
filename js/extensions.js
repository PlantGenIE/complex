var extensions = (function() {

  function toggleExtension(event) {
    let extensionId = event.target.dataset.extensionId;
    if (event.target.checked) {
      console.log('loading extension');
      getGenes(extensionId, highlightNodes);
      getEdges(extensionId, () => {});
    } else {
      console.log('removing extension');
      getGenes(extensionId, removeNodeHighlight);
      getEdges(extensionId, () => {});
    }
  }

  function getGenes(extension, callback) {
    $.ajax({
      url: 'service/extension_controller.php',
      dataType: 'json',
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
  }

  return {
    init: function() {
      Array.from(document.getElementsByClassName('extension-checkbox'))
        .forEach(element => {
          element.addEventListener('change', toggleExtension);
        });
    }
  };
})()
