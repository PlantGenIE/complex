/**
 * @module enrichment - Get and display the enrichment information for the selected genes
 *
 * @const enrichmentContainer - Pointer to the enrichment panel content HTML node.
 * @const enrichmentToggler   - Pointer to the enrichment panel toggler HTML node.
 * @const legendTemplate      - Pointer to the enrichment legend template HTML node.
 * @const enrichmentTemplate  - Pointer to the enrichment item template HTML node.
 * @const proportionTemplate  - Pointer to the enrichment proportion template HTML node.
 *
 * @property {object} enrichmentData  - Enrichment dataset used for the current alignment.
 * @property {object} databaseEntries - Correspondance between species names and shortname used in the dabatase URL.
 *
 * @function displayEnrichment - For each network create a legend and create an item for each unique term between networks.
 *
 * @method init          - Set enrichment panel event listeners.
 * @method getPrivates   - Return `enrichmentData` and `databaseEntries`.
 * @method fetchDatabase - Get the enrichment dataset for each network in the alignment.
 */
var enrichment = (function () {
  const enrichmentContainer = document.getElementById('enrichment-content');
  const enrichmentToggler = document.getElementById('enrichment-toggler');
  const legendTemplate = document.getElementById('legend-template');
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
      let legend = document.importNode(legendTemplate.content, true);
      legend.querySelector('.dot').classList.add(`network${index + 1}`);
      legend.querySelector('.name').textContent = network.network;
      let legendNodes = enrichmentContainer.querySelectorAll('.enrichment-legend');

      if (legendNodes.length === 0) {
        enrichmentContainer.insertBefore(legend, enrichmentContainer.firstChild);
      } else {
        enrichmentContainer.insertBefore(legend, legendNodes[legendNodes.length - 1].nextSibling);
      };

      network.go.forEach(function (term) {
        let item = document.importNode(enrichmentTemplate.content, true);
        item.querySelector('.name').textContent = term.name;
        item.querySelector('.name').title = term.def;
        item.querySelector('.id').textContent = term.id;
        item.querySelector('.id').setAttribute('href', `http://amigo.geneontology.org/amigo/term/${term.id}`);

        let proportion = document.importNode(proportionTemplate.content, true);
        let progress = proportion.querySelector('.proportion-progress');
        progress.classList.add(`network${index + 1}`);
        progress.setAttribute('style', `width:${(term.nt / network.ngenes) * 100}%`);
        proportion.querySelector('.proportion-value').textContent = `${term.nt}/${network.ngenes}`;

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
            progress.setAttribute('style', `width:${(otherTerm.nt / otherNetwork.ngenes) * 100}%`);
            proportion.querySelector('.proportion-value').textContent = `${otherTerm.nt}/${otherNetwork.ngenes}`;
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
            'include_defs': true,
            'alpha': 0.05
          }),
          headers: {
            'content-type': 'application/json'
          },
          dataType: 'json',
          success: function (data) {
            data.network = network.name;
            data.ngenes = network.genesNames.length;
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

