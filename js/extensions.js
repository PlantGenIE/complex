var extensions = (function() {

  function toggleExtension(event) {
    if (event.target.checked) {
      console.log('loading extension');
      getGenes(event.target.dataset.extensionId, () => {});
      getEdges(event.target.dataset.extensionId, () => {});
    } else {
      console.log('removing extension');
      getGenes(event.target.dataset.extensionId, () => {});
      getEdges(event.target.dataset.extensionId, () => {});
    }
  }

  function getGenes(extension, callback) {
    $.ajax({
      url: 'service/extension_controller.php',
      dataType: 'json',
      data: {
        method: 'getGenes',
        extension: extension,
        genes: alignmentView.nodes()
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
        genes: alignmentView.nodes()
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

  return {
    init: function() {
      console.log('initialising extensions');
      Array.from(document.getElementsByClassName('extension-checkbox'))
        .forEach(element => {
          element.addEventListener('change', toggleExtension);
        });
    }
  };
})()
