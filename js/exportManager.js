var exportManager = (function () {
  const fingerprint = window.localStorage.getItem('fingerprint');
  const activeNetworkContainer = document.getElementById('active-network');
  const outputListContainer = document.getElementById('output-list');
  const copyButton = document.getElementById('output-copy');
  const saveButton = document.getElementById('output-save');
  var activeNetwork;
  var databases;
  var selectedList = [];

  function updateDisplay() {
    activeNetworkContainer.textContent = `${activeNetwork.name} (${activeNetwork.species})`;
    outputListContainer.value = activeNetwork.selected.join('\n');
  }

  function saveGenesList() {
    if (fingerprint && activeNetwork.selected.length > 0) {
      let database = databases.find(ele => { return ele.species === activeNetwork.species; });
      let listName = window.prompt('Choose a name for the list');
      if (listName === "") { listName = "complex_list"; }
      if (listName !== null) {
        $.ajax( {
          url: config.get('genie').url
               + '/genelist/create_list_by_name?name=plantgenie_genelist'
               + '&fingerprint=' + fingerprint
               + '&list=' + activeNetwork.selected.join(',')
               + '&list_name=' + listName
               + '&table=' + database.name,
          method: 'POST',
          timeout: 0,
          processData: false,
          mimeType: "multipart/form-data",
          contentType: false,
          data: new FormData(),
          error: function (jqXHR) {
            console.warn(jqXHR);
          },
          success: function () {
            genesLists.fetchDatabasesLists()
          }
        });
      }
    }
  }

  return {
    init: function () {
      databases = config.get('genie').instances;

      copyButton.addEventListener('click', () => {
        outputListContainer.classList.remove('no-display');
        outputListContainer.focus();
        outputListContainer.select();
        document.execCommand('copy');
        outputListContainer.classList.add('no-display');
      });

      saveButton.addEventListener('click', () => {
        saveGenesList();
      });
    },

    getPrivates: function () {
      return {
        selectedList: selectedList
      }
    },

    setData: function (data) {
      selectedList = [];
      data.forEach(network => {
        var newNetwork = {
          name: network.name,
          species: network.species,
          selected: []
        };
        selectedList.push(newNetwork);
      });
    },

    changeActive: function (network) {
      activeNetwork = selectedList.find(ele => { return ele.name === network; });
      updateDisplay();
    },

    deselectAll: function () {
      selectedList.forEach(network => { network.selected = []; });
      updateDisplay();
    },

    selectGene: function (networkName, geneId) {
      let concernedNetwork = selectedList.find(ele => { return ele.name === networkName; });
      concernedNetwork.selected.push(geneId);
      updateDisplay();
    },

    deselectGene: function (networkName, geneId) {
      let concernedNetwork = selectedList.find(ele => { return ele.name === networkName; });
      concernedNetwork.selected.splice(concernedNetwork.selected.indexOf(geneId), 1);
      updateDisplay();
    }
  }
})();

