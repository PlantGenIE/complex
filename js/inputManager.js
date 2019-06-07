/**
 * @module networksList - Manage the networks buttons.
 *
 * @constant availableNetworksContainer - Pointer to the available networks HTML node.
 * @constant selectedNetworksContainer  - Pointer th the selected networks HTML node.
 *
 * @property {array}  availableNetworks - List of the available networks.
 * @property {array}  selectedNetworks  - List of the selected networks.
 * @property {string} referenceNetwork  - Store the selected reference network.
 * @property {object} draggedToken      - Data of the currently dragged token.
 *
 * @function createTokens        - Populate the available networks container and add event listeners on the tokens. 
 * @function handleDragStart     - Allow the token to move and store the data of the dragged token.
 * @function handleDragOver      - Allow the tolen to be dropped.
 * @function handleSelectionDrop - Move the token from one container to another.
 * @function handleReorderDrop   - Move the token before the token it is dropped on inside the selected networks container.
 * @function handleDragEnd       - Delete the stored data of the dropped token.
 * @function checkNetworksState  - Check if there is a new selected or reference network, and if so, signal the change to the alignTrigger module.
 *
 * @method init          - Populate the buttons and add the event listeners on the containers.
 * @method getPrivates   - Return `availableNetworks`, `selectedNetworks` and `referenceNetwork`.
 * @method fetchDatabase - Get the available networks from the database.
 */
var networksList = (function () {
  const networkItemsContainer = document.getElementById('network-selection-wrapper');
  const networkItemTemplate = document.getElementById('network-selection-template');
  const networkReferenceBorder = document.getElementById('network-reference-border');
  const networkReferenceLine = document.getElementById('network-reference-line');
  var availableNetworks = [];
  var selectedNetworks = [];
  var referenceNetwork;

  function createItems(itemsData) {
    itemsData.forEach(itemData => {
      let item = document.importNode(networkItemTemplate, true).content;

      let token = item.querySelector('.network-selection-token');
      token.textContent = itemData.name;
      token.value = itemData.id;
      token.setAttribute('data-species', itemData.shortname);
      token.addEventListener('click', handleSelectionClick, false);

      let radio = item.querySelector('.network-selection-radio');
      radio.value = itemData.id
      radio.setAttribute('data-species', itemData.shortname);
      radio.addEventListener('click', handleReferenceClick, false);

      networkItemsContainer.appendChild(item);
      availableNetworks.push(itemData.id);
    });
  }

  function handleSelectionClick(e) {
    let token = e.target;
    let tokenId = e.target.value;
    
    if (selectedNetworks.indexOf(tokenId) === -1) {
      token.classList.add('selected-token');
      selectedNetworks.push(tokenId);
    } else {
      if (tokenId !== referenceNetwork) {
        token.classList.remove('selected-token');
        selectedNetworks.splice(selectedNetworks.indexOf(tokenId), 1);
      }
    }

    alignTrigger.setNetworksValues(referenceNetwork, selectedNetworks);
  }

  function handleReferenceClick(e) {
    let radio = e.target;
    let radioValue = e.target.value;
    let relatedToken = radio.previousSibling;
    referenceNetwork = radioValue;

    networkReferenceBorder.style.width = `${relatedToken.offsetWidth + 10}px`;
    networkReferenceBorder.style.left = `${radio.parentNode.offsetLeft}px`;
    networkReferenceLine.style.left = `${radio.parentNode.offsetLeft + 8 + (relatedToken.offsetWidth / 2)}px`;

    relatedToken.click();
    alignTrigger.setNetworksValues(referenceNetwork, selectedNetworks);
    genesLists.updateDisplay(radio.getAttribute('data-species'));
  }

  return {
    init: function () {
      $.ajax({
        url: 'service/metadata.php',
        type: 'POST',
        data: {method: 'get_networks'},
        dataType: 'JSON',
        success: function (data) {
          createItems(data);
        }
      });
    },

    getPrivates: function () {
      return {
        availableNetworks: availableNetworks,
        selectedNetworks: selectedNetworks,
        referenceNetwork: referenceNetwork
      };
    },
  };
})();

/**
 * @module genesLists - Manage the genes lists.
 *
 * @constant fingerprint           - Fingerprint used for the plantGenie API.
 * @constant listsDisplayContainer - Pointer to the genes lists HTML node.
 * @constant genesDisplayContainer - Pointer to the reference genes HTML node.
 *
 * @property {array} databases - Databases informations for the POST request and a list example.
 * @property {array} lists     - Genes lists retrieved from the databases, including the example.
 *
 * @function loadExamples - Retrieve the examples genes lists among the databases informations.
 *
 * @method init                - Populate the genes lists and add the event listeners on the containers.
 * @method getPrivates         - Return `databases` and `lists`.
 * @method fetchDatabases      - Get the databases iformations.
 * @method fetchDatabasesLists - Get the genes lists from the databases.
 * @method updateDisplay       - Change the displayed lists to match the reference network.
 */
var genesLists = (function () {
  const fingerprint = window.localStorage.getItem('fingerprint');
  const listsDisplayContainer = document.getElementById('genes-lists');
  const genesDisplayContainer = document.getElementById('sink1');
  var referenceNetwork;
  var databases = [];
  var lists = [];

  function loadExamples() {
    databases.forEach(function (database) {
      // slice() allow to pass the value instead of reference
      lists[database.code] = database['list-example'].slice();
    });
  };

  return {
    init: function () {
      genesDisplayContainer.value = '';
      listsDisplayContainer.addEventListener('change', function handleChange() {
        genesDisplayContainer.value = listsDisplayContainer.value;
        alignTrigger.setGenesValues(listsDisplayContainer.value);
      });
      this.fetchDatabases();
    },

    getPrivates: function () {
      return {
        databases: databases,
        lists: lists
      };
    },

    fetchDatabases: function () {
      var self = this;
      $.ajax( {
        url: 'databases.json',
        datatype: 'json',
        error: function (jqXHR, textStatus) {
          console.log(textStatus);
        },
        success: function (data) {
          databases = data;
        },
        complete: function () {
          self.fetchDatabasesLists();
        }
     });
    },

    fetchDatabasesLists: function () {
      let self = this;
      lists = [];
      loadExamples();
      if (fingerprint) {
        databases.forEach(function (database) {
          $.ajax( {
            url: 'https://api.plantgenie.org/genelist/get_all?table='
                 + database.name + '&fingerprint='
                 + fingerprint + '&name=plantgenie_genelist',
            method: 'GET',
            datatype: 'json',
            timeout: 0,
            error: function (jqXHR) {
              console.error(jqXHR);
            },
            success: function (data) {
              lists[database.code].push.apply(lists[database.code], data);
            },
            complete: function () {
              self.updateDisplay(referenceNetwork);
            }
          });
        });
      };
    },

    updateDisplay: function (species) {
      if (lists[species]) {
        referenceNetwork = species;
        listsDisplayContainer.options.length = 0;
        lists[species].forEach(function (list) {
          listsDisplayContainer.options.add(new Option(list.gene_basket_name, list.gene_list));
        });
        genesDisplayContainer.placeholder = 'Example : ' + lists[species][0]['gene_list'];
      };
    },
  };
})();

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

