/**
 * @module enrichment - Get and display the enrichment information for the selected genes
 *
 * @const enrichmentContainer - Pointer to the enrichment panel HTML node.
 *
 * @property {object} enrichmentData  - Enrichment dataset used for the current alignment.
 * @property {object} databaseEntries - Correspondance between species names and shortname used in the dabatase URL.
 *
 * @method init          - Set enrichment panel event listeners.
 * @method getPrivates   - Return `enrichmentData` and `databaseEntries`.
 * @method fetchDatabase - Get the enrichment dataset for each network in the alignment.
 */
var enrichment = (function () {
  const enrichmentContainer = document.getElementById('enrichment-content');
  const enrichmentToggler = document.getElementById('enrichment-toggler');
  var enrichmentData = {};
  var databaseEntries = {
    'Arabidopsis thaliana': 'athaliana',
    'Populus tremula': 'potra',
    'Zea mays': ''
  };

  return {
    init: function () {
      document.getElementById('enrichment-toggler').addEventListener('click', function (e) {
        let menu = document.getElementById('enrichment-content');
        if(window.getComputedStyle(menu, null).display === 'block') {
          menu.style.display = 'none';
        } else {
          menu.style.display = 'block';
        };
      });
    },

    getPrivates: function () {
      return {
        enrichmentData: enrichmentData,
        databaseEntries: databaseEntries
      };
    },

    fetchDatabase: function (genesLists) {
      enrichmentData = {};
      console.log(genesLists);
      genesLists.forEach(function (network) {
        $.ajax({
          url: `https://microasp.upsc.se:5432/${databaseEntries[network.species]}/enrichment`,
          method: 'POST',
          data: JSON.stringify({
            'target': ['go','pfam','kegg'],
            'genes': network.genesNames,
            'include_names': true
          }),
          headers: {
            'content-type': 'application/json'
          },
          dataType: 'json',
          success: function(data) {
            enrichmentData[network.name] = data;
          },
          error: function(jqXHR) {
            console.error(jqXHR);
          }
        });
      });
    }
  };
})();
