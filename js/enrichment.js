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
  const enrichmentTemplate = document.getElementById('enrichment-template');
  const proportionTemplate = document.getElementById('proportion-template');
  var enrichmentData = [];
  var databaseEntries = {
    'Arabidopsis thaliana': 'athaliana',
    'Populus tremula': 'potra',
    'Zea mays': ''
  };

  function displayEnrichment() {
    let tempData = enrichmentData;
    while (enrichmentContainer.firstChild) {
      enrichmentContainer.removeChild(enrichmentContainer.firstChild);
    };

    tempData.forEach(function (network, index) {
      network.go.forEach(function (term) {
        let item = document.importNode(enrichmentTemplate.content, true);
        item.querySelector('.name').textContent = term.name;
        item.querySelector('.id').textContent = term.id;

        let proportion = document.importNode(proportionTemplate.content, true);
        let progress = proportion.querySelector('.proportion-progress');
        progress.classList.add(`network${index + 1}`);
        progress.setAttribute('style', `width:${(term.nt / term.mt) * 100}%`);
        proportion.querySelector('.proportion-value').textContent = `${term.nt}/${term.mt}`;

        item.querySelector('.proportion-wrapper').appendChild(proportion);

        tempData.slice(index + 1).forEach(function (otherNetwork, otherIndex) {
          let termIndex = otherNetwork.go.findIndex(function (otherTerm) {
            return otherTerm.id === term.id;
          });

          if (termIndex !== -1) {
            let proportion = document.importNode(proportionTemplate.content, true);
            let progress = proportion.querySelector('.proportion-progress');
            progress.classList.add(`network${index + otherIndex + 2}`);
            
            let otherTerm = otherNetwork.go[termIndex];
            progress.setAttribute('style', `width:${(otherTerm.nt / otherTerm.mt) * 100}%`);
            proportion.querySelector('.proportion-value').textContent = `${otherTerm.nt}/${otherTerm.mt}`;
            tempData[index + otherIndex + 1].go.splice([termIndex], 1);
            item.querySelector('.proportion-wrapper').appendChild(proportion);
          };
        });
        enrichmentContainer.appendChild(item);
      });
    });
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
      enrichmentData = [];
      let listsCount = genesLists.length;
      let finishedQuerry = 0;
      genesLists.forEach(function (network) {
        $.ajax({
          url: `https://microasp.upsc.se:5432/${databaseEntries[network.species]}/enrichment`,
          method: 'POST',
          data: JSON.stringify({
            'target': ['go'],
            'genes': network.genesNames,
            'include_names': true,
            'include_defs': false,
            'alpha': 0.05
          }),
          headers: {
            'content-type': 'application/json'
          },
          dataType: 'json',
          success: function (data) {
            data.network = network.name
            enrichmentData.push(data);
          },
          error: function (jqXHR) {
            enrichmentData.push({network: network.name, go: []});
            console.error(jqXHR);
          },
          complete: function () {
            finishedQuerry += 1;
            if (finishedQuerry === listsCount) {
              displayEnrichment();
            };
          }
        });
      });
    }
  };
})();

