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
      return this.fetchDatabases();
    },

    getPrivates: function () {
      return {
        databases: databases,
        lists: lists
      };
    },

    fetchDatabases: function () {
      var self = this;
      return $.ajax( {
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
            url: config.get('genie').url + '/genelist/get_all?table='
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

