/**
 * @module alignmentData - Get and store the data used in the alignment
 *
 * @property {object} networksData     - Current networks dataset used for the alignment.
 * @property {object} referenceNetwork - Pointer to the reference network data.
 * @property {object} parameters       - Parameters used in the PHP query for the current dataset.
 *
 * @function getReferenceNetwork - Get which network is the reference in the `networksData`.
 * @function networkNode         - Constructor for network nodes in alignmentView.
 * @function geneNode            - Constructor for gene nodes in alignmentView.
 * @function orthologsEdge       - Constructor for orthology edges in alignmentView.
 * @function coexpressionEdge    - Constructor for coexpression edges in alignmentView.
 * @function tableRow            - Constructor for rows in alignmentTable.
 * @function prepareData         - Use `networksData` to construct data structure usable by each served module.
 *
 * @method init            - Do nothing.
 * @method getPrivate      - Return `networksData`, `referenceNetwork` and `parameters`.
 * @method fetchDatabase   - Get a dataset for a new alignment.
 * @method serveData       - Dispatch the data to be displayed to the display modules.
 * @method getIfReference  - Return wether a gene belong to the reference network.
 * @method getOrthologsIds - Return all the orthologs of a given gene. If concurrent genes are given, the orthologs which are in common between the reference gene and the concurrents are removed from the returned list.
 */
var alignmentData = (function () {
  var networksData;
  var annotationsData = [];
  var referenceNetwork;
  var parameters = {
    active_network: '',
    network_ids: [],
    gene_names: [],
    threshold: ''
  };
  var databaseEntries = {
    'Arabidopsis thaliana': 'athaliana',
    'Populus tremula': 'potra',
    'Zea mays': ''
  };

  function manageSameSpecies() {
    let duplicate = [];

    //Duplicate co-expression edges
    networksData.forEach(species => {
      if (Object.keys(species.networks).length > 1) {
        for (networkId in species.networks) {
          if (species.networks.hasOwnProperty(networkId)) {
            duplicate.push(networkId);
            let network = species.networks[networkId];
            for (nodeId in network.nodes) {
              if(network.nodes.hasOwnProperty(nodeId)) {
                network.nodes[`${nodeId}-${networkId}`] = network.nodes[nodeId];
                delete network.nodes[nodeId];
              }
            }

            network.edges.forEach(edge => {
              edge.source = `${edge.source}-${networkId}`;
              edge.target = `${edge.target}-${networkId}`;
            });
          }
        }
      }
    });

    //Duplicate orthologs edges
    if (duplicate.length > 0) {
      for (nodeId in referenceNetwork.nodes) {
        if (referenceNetwork.nodes.hasOwnProperty(nodeId)) {
          let orthologs = referenceNetwork.nodes[nodeId].orthologs;
          for (orthologId in orthologs) {
            if (orthologs.hasOwnProperty(orthologId)) {
              let ortholog = orthologs[orthologId];
              if (duplicate.some(ele => { return ele == ortholog.conservation[0].networkId; })) {
                ortholog.conservation.forEach(network => {
                  let newId = `${orthologId}-${network.networkId}`
                  orthologs[newId] = ortholog;
                  orthologs[newId].conservation = [network];
                });
                delete orthologs[orthologId];
              }
            }
          }
        }
      }
    }
  };

  function getReferenceNetwork() {
    networksData.forEach(function (species) {
      for (var network in species.networks) {
        if (species.networks[network].isReference) {
          referenceNetwork = species.networks[network];
        };
      };
    });
  };

  function networkNode(id, name, isReference) {
    this.group = 'nodes';
    this.classes = 'network';
    if (isReference) {this.classes += ' active'};
    this.data = {
      id: `network${id}`,
      label: name,
      active: isReference
    }
  };

  function geneNode(id, name, parentName, annotations) {
    this.group = 'nodes';
    this.classes = 'gene';
    this.data = {
      id: id,
      label: name,
      parent: parentName,
      colors: [],
      go: annotations.go,
      pfam: annotations.pfam,
      kegg: annotations.kegg
    };
  };

  function orthologEdge(source, target, support, pvalue) {
    this.group = 'edges';
    this.classes = 'orthology';
    this.data = {
      source: source,
      target: target,
      support: support,
      conservation_pvalue: pvalue
    }
  };

  function coexpressionEdge(source, target, weight) {
    this.group = 'edges';
    this.classes = 'co-expression';
    this.data = {
      source: source,
      target: target,
      weight: weight
    }
  };

  function tableRow(id, gene, network, annotations) {
    this.id = id;
    this.gene = gene;
    this.network = network;
    this.checkbox = {
      value: null,
      order: 0,
    },
    this.go = annotations.go,
    this.pfam = annotations.pfam,
    this.kegg = annotations.kegg
  };

  function prepareData() {
    let viewData = {
      nodes: [],
      edges: []
    };
    let tableData = { rows: [], referenceNetwork: referenceNetwork.name };
    let outputData = []
    let genesList = [];

    networksData.forEach(function (species) {
      for(var networkId in species.networks) {
        if (species.networks.hasOwnProperty(networkId)) {
          let network = species.networks[networkId];
          let isReference = network.isReference;
          let networkGenesList = {
            species: species.speciesName,
            name: network.name,
            genesNames: []
          };
          let parent = new networkNode(networkId, network.name, isReference);
          viewData.nodes.push(parent);
          outputData.push({ name: network.name, species: species.speciesName });

          for (var nodeId in network.nodes) {
            if (network.nodes.hasOwnProperty(nodeId)) {
              let gene = network.nodes[nodeId];
              networkGenesList.genesNames.push(gene.name);

              let nodeAnnotations = { go: '', pfam: '', kegg: '' };
              let rowAnnotations = { go: '', pfam: '', kegg: '' };
              ['go', 'pfam', 'kegg'].forEach(function (type) {
                try {
                  let terms = [];
                  let termsIds = [];
                  let matchingTerms = annotationsData
                    .find(el => {return el.species === species.speciesName})
                    [type]
                    .find(le => {return le.id === gene.name});
                  matchingTerms.terms.forEach(term => {
                    termsIds.push(term.id);
                    terms.push(`${term.id}: ${term.name}`);
                  });
                  nodeAnnotations[type] = termsIds.join(', ');
                  rowAnnotations[type] = terms.join('<br/>');
                } catch (error) {}
              });

              let node = new geneNode(nodeId, gene.name, parent.data.id, nodeAnnotations);
              viewData.nodes.push(node);
              
              let row = new tableRow(nodeId, gene.name, network.name, rowAnnotations);

              for (var orthologId in gene.orthologs) {
                if (gene.orthologs.hasOwnProperty(orthologId)) {
                  let ortholog = gene.orthologs[orthologId];
                  let edge = new orthologEdge(nodeId, orthologId,
                    ortholog.methods.join(' '),
                    ortholog.conservation[0].pvalue);
                  viewData.edges.push(edge);
                };
              };

              tableData.rows.push(row);
            };
          };

          if(network.edges) {
            network.edges.forEach(function (coexpression) {
              let edge = new coexpressionEdge(coexpression.source, coexpression.target, coexpression.score);
              viewData.edges.push(edge);
            });
          };
          genesList.push(networkGenesList);
        };
      };
    });

    let colorAnnotationData = {
      genesList: genesList,
      annotationsData: annotationsData
    };

    return {
      view: viewData,
      table: tableData,
      colorAnnotation: colorAnnotationData,
      output: outputData
    };
  };

  return {
    init: function () {
    },

    getPrivates: function () {
      return {
        networksData: networksData,
        annotationsData: annotationsData,
        referenceNetwork: referenceNetwork,
        parameters: parameters
      };
    },

    fetchDatabase: function (postData) {
      let self = this;
      parameters = postData;
      $.ajax({
        url: 'service/network.php',
        method : 'POST',
        data: postData,
        dataType: 'json',
        success: function (data) {
          networksData = data;
          getReferenceNetwork();
          manageSameSpecies();
          self.fetchAnnotations();
        },
        error: function (jqXHR) {
          console.warn(jqXHR);
        }
      });
    },

    fetchAnnotations: function () {
      let self = this;
      let speciesCount = networksData.length;
      let finishedQuerry = 0;
      annotationsData = [];

      networksData.forEach(function (species) {
        for (networkId in species.networks) {
          if (species.networks.hasOwnProperty(networkId)) {
            let genesLists = [];
            let network = species.networks[networkId];
            for (geneId in network.nodes) {
              if (network.nodes.hasOwnProperty(geneId)) {
                genesLists.push(network.nodes[geneId].name);
              };
            };

            $.ajax({
              url: `https://microasp.upsc.se:5432/${databaseEntries[species.speciesName]}/gene-to-term`,
              method: 'POST',
              data: JSON.stringify({
                'target': ['go', 'pfam', 'kegg'],
                'genes': genesLists,
                'include_defs': true,
                'include_names': true
              }),
              headers: {
                'content-type': 'application/json'
              },
              dataType: "json",
              success: function(data) {
                data.species = species.speciesName;
                annotationsData.push(data);
              },
              error: function(jqXHR) {
                console.warn(jqXHR);
              },
              complete: function () {
                finishedQuerry += 1;
                if (finishedQuerry === speciesCount) {
                  self.serveData();
                };
              }
            })
          };
          break;
        }
      });
    },

    serveData: function () {
      let preparedData = prepareData();

      exportManager.setData(preparedData.output);
      alignmentView.setData(preparedData.view);
      alignmentTable.setData(preparedData.table);
      colorAnnotation.setData(preparedData.colorAnnotation);
    },

    getIfReference: function (geneId) {
      let isReference = referenceNetwork.nodes[geneId] ? true : false;
      return isReference;
    },

    getOrthologsIds: function (geneId, isReference, concurrentGenes) {
      let orthologsIds = [];

      if (isReference) {
        // Remove geneId from it's own concurrent
        concurrentGenes.splice(concurrentGenes.indexOf(geneId), 1);

        let geneOrthologs = referenceNetwork.nodes[geneId].orthologs;
        for (var orthologId in geneOrthologs) {
          if (geneOrthologs.hasOwnProperty(orthologId)) {
            orthologsIds.push(orthologId);
          };
        };

        concurrentGenes.forEach(function (concurrentId) {
          let concurrentOrthologs = referenceNetwork.nodes[concurrentId].orthologs;
          for (var orthologId in concurrentOrthologs) {
            if (concurrentOrthologs.hasOwnProperty(orthologId)) {
              let inOrthologs = orthologsIds.indexOf(orthologId);
              if (inOrthologs > -1) {
                orthologsIds.splice(inOrthologs, 1);
              };
            };
          };
        });

      } else {
        let referenceGenes = referenceNetwork.nodes;
        for (orthologId in referenceGenes) {
          if (referenceGenes.hasOwnProperty(orthologId)) {
            if (referenceGenes[orthologId].orthologs[geneId]) {
              orthologsIds.push(orthologId);
            };
          };
        };
      };

      return orthologsIds;
    }
  };
})();

