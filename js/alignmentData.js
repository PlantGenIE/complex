/**
 * @module alignmentData - Get and store the data used in the alignment
 *
 * @property {object} networksData - Current networks dataset used for the alignment.
 * @property {object} parameters   - Parameters used in the PHP query for the current dataset.
 *
 * @function networkNode      - Constructor for network nodes in alignmentView.
 * @function geneNode         - Constructor for gene nodes in alignmentView.
 * @function orthologsEdge    - Constructor for orthology edges in alignmentView.
 * @function coexpressionEdge - Constructor for coexpression edges in alignmentView.
 * @function tableRow         - Constructor for rows in alignmentTable.
 * @function prepareData      - Use `networksData` to construct data structure usable by each served module.
 *
 * @method init            - Do nothing.
 * @method getPrivate      - Return `networksData` and `parameters`.
 * @method fetchDatabase   - Get a dataset for a new alignment.
 * @method serveData       - Dispatch the data to be displayed to the display modules.
 * @method getIfReference  - Return wether a gene belong to the reference network.
 * @method getOrthologsIds - Return all the orthologs of a given gene. If concurrent genes are given, the orthologs in which are in common between the reference gene and the concurrents are removed from the return.
 */
var alignmentData = (function () {
  var networksData;
  var parameters = {
    active_network: '',
    network_ids: [],
    gene_names: [],
    threshold: ''
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

  function geneNode(id, name, parentName) {
    this.group = 'nodes';
    this.classes = 'gene';
    this.data = {
      id: id,
      label: name,
      parent: parentName
    }
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

  function tableRow(id, gene, network) {
    this.id = id;
    this.gene = gene;
    this.network = network;
    this.checkbox = {
      value: null,
      order: 0,
    }
  };

  function prepareData() {
    let viewData = {
      nodes: [],
      edges: []
    };
    let referenceTableData = [];
    let alignedTableData = [];

    networksData.forEach(function (species) {
      for(var networkId in species.networks) {
        if (species.networks.hasOwnProperty(networkId)) {
          let network = species.networks[networkId];
          let isReference = network.isReference;
          let parent = new networkNode(networkId, network.name, isReference);
          viewData.nodes.push(parent);

          for (var nodeId in network.nodes) {
            if (network.nodes.hasOwnProperty(nodeId)) {
              let gene = network.nodes[nodeId];
              let node = new geneNode(nodeId, gene.name, parent.data.id);
              viewData.nodes.push(node);
              
              let row = new tableRow(nodeId, gene.name, network.name);

              if (isReference) {
                for (var orthologId in gene.orthologs) {
                  if (gene.orthologs.hasOwnProperty(orthologId)) {
                    let ortholog = gene.orthologs[orthologId];
                    let edge = new orthologEdge(nodeId, orthologId,
                      ortholog.methods.join(' '),
                      ortholog.conservation[0].pvalue);
                    viewData.edges.push(edge);
                  };
                };

                referenceTableData.push(row);
              } else {
                alignedTableData.push(row);
              };
            };
          };

          if(network.edges) {
            network.edges.forEach(function (coexpression) {
              let edge = new coexpressionEdge(coexpression.source, coexpression.target, coexpression.score);
              viewData.edges.push(edge);
            });
          };
        };
      };
    });

    return {
      view: viewData,
      referenceTable: referenceTableData,
      alignedTable: alignedTableData
    };
  };

  return {
    init: function () {
    },

    getPrivates: function () {
      return {
        networksData: networksData,
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
          self.serveData();
        },
        error: function (jqXHR) {
          console.error(jqXHR);
        }
      });
    },

    serveData: function () {
      let preparedData = prepareData();

      alignmentView.setData(preparedData.view);
      alignmentTable.setData(preparedData.referenceTable,
        preparedData.alignedTable);
    },

    getIfReference: function (geneId) {
      let geneParent = "";
      let geneFound =  networksData.nodes.some(function (gene) {
        geneParent = gene.data.parent
        return gene.data.id === geneId;
      });
      if (geneFound === false) {
        return undefined;
      } else if (geneParent === ('network' + parameters.active_network)) {
        return true;
      } else {
        return false;
      };
    },

    getOrthologsIds: function (geneId, isReference, concurrentGenes) {
      // Need optimization
      let orthologsIds = [];
      if (isReference) {
        concurrentGenes.splice(concurrentGenes.indexOf(geneId), 1);
        networksData.edges.forEach(function (edge) {
          if (edge.classes === 'orthology') {
            if (edge.data.source === geneId) {
              orthologsIds.push(edge.data.target);
            };
          };
        });
        // Get only unique
        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        };
        orthologsIds = orthologsIds.filter(onlyUnique);

        concurrentGenes.forEach(function (concurrent) {
          networksData.edges.forEach(function (edge) {
            if (edge.classes === 'orthology') {
              if (edge.data.source === concurrent) {
                let inOrthologs = orthologsIds.indexOf(edge.data.target)
                if (inOrthologs > -1) {
                  orthologsIds.splice(inOrthologs, 1);
                };
              };
            };
          });
        });
      } else {
        networksData.edges.forEach(function (edge) {
          if (edge.classes === 'orthology') {
            if (edge.data.target === geneId) {
              orthologsIds.push(edge.data.source);
            };
          };
        });
      };
      return orthologsIds;
    }
  };
})();

