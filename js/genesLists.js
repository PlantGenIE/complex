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
      lists[database.code] = database['defaultLists'].slice();
    });
  };

  return {
    init: function () {
      genesDisplayContainer.value = '';
      listsDisplayContainer.addEventListener('change', function handleChange() {
        genesDisplayContainer.value = listsDisplayContainer.value;
        alignTrigger.setGenesValues(listsDisplayContainer.value);
      });
      databases = config.get('genie').instances;
      this.fetchDatabasesLists();
    },

    getPrivates: function () {
      return {
        databases: databases,
        lists: lists
      };
    },

    fetchDatabasesLists: function () {
      let self = this;
      lists = [];
      loadExamples();
      if (fingerprint) {
        databases.forEach(function (database) {
          if (!database.name) {
            return;
          }
          $.ajax( {
            url: config.get('genie').url
                 + '/genelist/get_all?table='
                 + database.name + '&fingerprint='
                 + fingerprint + '&name=plantgenie_genelist',
            method: 'GET',
            datatype: 'json',
            timeout: 0,
            error: function (jqXHR, status, err) {
              console.error(`${status}: ${err}`);
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
        genesDisplayContainer.placeholder = lists[species][0]['gene_list'];
      };
    },
  };
})();

