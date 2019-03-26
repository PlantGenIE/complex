/**
 * @module alignmentData - Get and store the data used in the alignment
 *
 * @property {object} networksData - Current networks dataset used for the alignment.
 * @property {object} parameters   - Parameters used in the PHP query for the current dataset.
 *
 * @function prepareViewData           - Construct each node and edge data to be displayed in the view.
 * @function prepareReferenceTableData - Construct each row data to be displayed in the reference table.
 * @function prepareAlignedTableData   - Construct each row data to be displayed in the aligned table.
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
  
  function prepareViewData() {
    let viewData = {
      nodes: [],
      edges: []
    };

    function parentNode(id, name, isReference) {
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

    networksData.forEach(function (species) {
      for(var networkId in species.networks) {
        if (species.networks.hasOwnProperty(networkId)) {
          let network = species.networks[networkId];
          let isReference = network.isReference;
          let parent = new parentNode(networkId, network.name, isReference);
          viewData.nodes.push(parent);

          for (var nodeId in network.nodes) {
            if (network.nodes.hasOwnProperty(nodeId)) {
              let gene = network.nodes[nodeId];
              let node = new geneNode(nodeId, gene.name, parent.data.id);
              viewData.nodes.push(node);

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

    return viewData;
  };

  function prepareReferenceTableData() {
    let referenceTableData = $.grep(networksData.nodes, function(x) {
      return x.classes.match(/gene/) !== null && x.data.parent === `network${parameters.active_network}`;
    }).map(function(x) {
      return {
        gene: x.data.label,
        id: x.data.id,
        network: x.data.parent,
        checkbox: {
          value: null,
          order: 0
        }
      };
    });
    return referenceTableData;
  };

  function prepareAlignedTableData() {
    let networksNames = {};
    networksData.nodes.forEach(function (node) {
      if (node.classes === 'network') {
        networksNames[node.data.id] = node.data.label;
      };
    });
    let alignedTableData = $.grep(networksData.nodes, function(x) {
      return x.classes.match(/gene/) !== null && x.data.parent !== `network${parameters.active_network}`;
    }).map(function(x) {
      return {
        gene: x.data.label,
        id: x.data.id,
        network: networksNames[x.data.parent],
        checkbox: {
          value: null,
          order: 0
        }
      };
    });
    return alignedTableData;
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
      let viewData = prepareViewData();
      alignmentView.setData(viewData);

      let referenceTableData = prepareReferenceTableData();
      let alignedTableData = prepareAlignedTableData();
      alignmentTable.setData(referenceTableData, alignedTableData);
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

