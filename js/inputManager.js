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
  const availableNetworksContainer = document.getElementById('network-buttons');
  const selectedNetworksContainer = document.getElementById('selected-network-buttons');
  var availableNetworks = [];
  var selectedNetworks = [];
  var referenceNetwork;
  var draggedToken;

  function createTokens(tokensData) {
    tokensData.forEach(function (tokenData) {
      let token = document.createElement('div');
      token.setAttribute('data-species', tokenData.shortname);
      token.setAttribute('data-network', tokenData.id);
      token.setAttribute('draggable', true);
      token.classList.add('network-token');
      token.id = 'network' + tokenData.id + '-token';
      token.textContent = tokenData.name;

      token.addEventListener('dragstart', handleDragStart, false);
      token.addEventListener('dragover', handleDragOver, false);
      token.addEventListener('drop', handleReorderDrop, false);
      token.addEventListener('dragend', handleDragEnd, false);

      availableNetworksContainer.appendChild(token);
      availableNetworks.push(tokenData.id);
    });
  };

  function handleDragStart(event) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', this.id);
    draggedToken = this;
    draggedToken.classList.add('inactive');
  };

  function handleDragOver(event) {
    if (event.stopPropagation) {event.stopPropagation()};
    if (event.preventDefault) {event.preventDefault()};
    
    event.dataTransfer.dropEffect = 'move';
  };

  function handleSelectionDrop(event) {
    if (event.stopPropagation) {event.stopPropagation()};
    if (event.preventDefault) {event.preventDefault()};

    if (this !== draggedToken.parentNode) {
      if (this === selectedNetworksContainer) {
        draggedToken.classList.add('selected');
      } else {
        draggedToken.classList.remove('selected');
      };
      draggedToken.parentNode.removeChild(draggedToken);
      this.appendChild(draggedToken);
      checkNetworksState();
    };
  };

  function handleReorderDrop(event) {
    if (event.stopPropagation) {event.stopPropagation()};
    if (event.preventDefault) {event.preventDefault()};

    if (draggedToken.parentNode === this.parentNode && this.parentNode === selectedNetworksContainer) {
      if (draggedToken !== this) {
        var insertionPoint, elem = this;
        
        do {
          elem = elem.nextSibling;
        } while (elem && elem !== draggedToken);
        
        insertionPoint = elem ? this : this.nextSibling;
        this.parentNode.insertBefore(draggedToken, insertionPoint);
        
        checkNetworksState();
      };
    };
  };

  function handleDragEnd(event) {
    draggedToken.classList.remove('inactive');
    draggedToken = null;
  };

  function checkNetworksState() {
    let oldReference = referenceNetwork;
    let oldSelected = selectedNetworks;
    let referenceNode = selectedNetworksContainer.firstChild

    referenceNetwork = referenceNode ? referenceNode.getAttribute('data-network') : '';
    selectedNetworks = [];

    selectedNetworksContainer.childNodes.forEach(function (network) {
      selectedNetworks.push(network.getAttribute('data-network'));
    });

    if (oldReference !== referenceNetwork || oldSelected !== selectedNetworks) {
      alignTrigger.setNetworksValues(referenceNetwork, selectedNetworks);
      if (referenceNode) {
        genesLists.updateDisplay(referenceNode.getAttribute('data-species'));
      };
    };
  };

  return {
    init: function () {
      this.fetchDatabase();
      availableNetworksContainer.addEventListener('dragover', handleDragOver, false);
      availableNetworksContainer.addEventListener('drop', handleSelectionDrop, false);
      selectedNetworksContainer.addEventListener('dragover', handleDragOver, false);
      selectedNetworksContainer.addEventListener('drop', handleSelectionDrop, false);
      checkNetworksState();
    },

    getPrivates: function () {
      return {
        availableNetworks: availableNetworks,
        selectedNetworks: selectedNetworks,
        referenceNetwork: referenceNetwork
      };
    },

    fetchDatabase: function () {
      while (availableNetworksContainer.firstChild) {
        availableNetworksContainer.removeChild(availableNetworksContainer.firstChild);
      };
      while (selectedNetworksContainer.firstChild) {
        selectedNetworksContainer.removeChild(selectedNetworksContainer.firstChild);
      };
      $.ajax({
        url: 'service/metadata.php',
        type: 'POST',
        data: {method: 'get_networks'},
        dataType: 'JSON',
        success: function (data) {
          createTokens(data);
        }
      });
    }
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
  var databases = [];
  var lists = [];

  function loadExamples() {
    databases.forEach(function (database) {
      // slice() allow to pass the value instead of reference
      lists[database.species] = database['list-example'].slice();
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
             lists[database.species].push.apply(lists[database.species], data);
            }
          });
        });
      };
    },

    updateDisplay: function (species) {
      if (lists[species]) {
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

