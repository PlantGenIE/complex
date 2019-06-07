/**
 * @module alignTrigger - Manage the align event.
 *
 * @constant genesDisplayContainer          - Pointer to the reference genes HTML node.
 * @constant coexpressionThresholdContainer - Pointer to the coexpression range HTML node.
 * @constant coexpressionThresholdDisplay   - Pointer to the coexpression display HTML node.
 * @constant alignButton                    - Pointer to the align button HTML node.
 *
 * @property {object} inputParameters - Current state of the displayed input parameters.
 *
 * @function unpdateLocalStorage - On new alignment, store input parameters into window local storage.
 * @function fetchLocalStorage   - Retrieve input parameters stored into window local storage.
 *
 * @method init              - Add event listeners on containers and ask for new data query based on local storage parameters values.
 * @method getPrivates       - Return `inputParameters`.
 * @method setNetworksValues - Update the stored reference and selected networks based on the new input values.
 * @method setGenesValues    - Update the stored reference genes based on the new inputed values.
 * @method newAlignment      - Check that every parameter is filled then ask for new data query with the new input parameters.
 */
var alignTrigger = (function () {
  const genesDisplayContainer = document.getElementById('sink1');
  const coexpressionThresholdContainer = document.getElementById('coexpressionThreshold');
  const coexpressionThresholdDisplay = document.getElementById('coexpressionThresholdDisplay');
  const alignButton = document.getElementById('align_to_species_button');
  var inputParameters = {
    active_network: '',
    network_ids: [],
    gene_names: [],
    threshold: '0.99'
  };

  function updateLocalStorage(parameters) {
    // JSON.stringify to store an array properly
    window.localStorage.setItem('referenceNetwork', parameters.active_network);
    window.localStorage.setItem('selectedNetworks', JSON.stringify(parameters.network_ids));
    window.localStorage.setItem('referenceGenes', JSON.stringify(parameters.gene_names));
    window.localStorage.setItem('coexpressionThreshold', parameters.threshold);
  };

  function fetchLocalStorage() {
    let localParameters = {
      threshold: '0.99'
    };
    if (window.localStorage.referenceNetwork) {
      localParameters.active_network = window.localStorage.getItem('referenceNetwork');
    };
    if (window.localStorage.selectedNetworks) {
      localParameters.network_ids = JSON.parse(window.localStorage.getItem('selectedNetworks'));
    };
    if (window.localStorage.referenceGenes) {
      localParameters.gene_names = JSON.parse(window.localStorage.getItem('referenceGenes'));
    };
    if (window.localStorage.coexpressionThreshold) {
      localParameters.threshold = window.localStorage.getItem('coexpressionThreshold');
    };
    return localParameters;
  };

  return {
    init: function () {
      let self = this;

      genesDisplayContainer.addEventListener('change', function handleChange() {
        self.setGenesValues(this.value);
      });

      coexpressionThresholdContainer.value = 0.99;
      coexpressionThresholdContainer.addEventListener('input', function handleInput() {
        coexpressionThresholdDisplay.innerHTML = this.value;
        inputParameters.threshold = this.value;
      }, false);

      alignButton.addEventListener('click', function handleClick() {
        self.newAlignment(inputParameters);
      });

      let localParameters = fetchLocalStorage();
      if (localParameters.active_network && localParameters.network_ids && localParameters.gene_names) {
        self.newAlignment(localParameters);
      };
    },

    getPrivates: function () {
      return {
        inputParameters: inputParameters
      };
    },

    setNetworksValues: function (referenceNetwork, selectedNetworks) {
      inputParameters.active_network = referenceNetwork;
      inputParameters.network_ids = selectedNetworks;
    },

    setGenesValues: function (genes) {
      genes = genes.split(/[, \t\n;]+/);
      if (genes.length === 1 && genes[0] === '') {
        inputParameters.gene_names = [];
      } else {
        inputParameters.gene_names = genes;
      };
    },

    newAlignment: function (parameters) {
      if (parameters.active_network.length === 0) {
        complexmessage.error('No reference network selected');
      } else if (parameters.network_ids.length === 0) {
        complexmessage.error('No network selected');
      } else if (parameters.gene_names.length === 0) {
        complexmessage.error('No reference genes specified');
      } else {
        alignmentData.fetchDatabase(parameters);
        updateLocalStorage(parameters);
      };
    }
  };
})();

