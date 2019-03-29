/**
 * @module alignmentView - Display the alignment data using Cytoscape.
 *
 * @constant viewContainer            - Pointer to the cytoscape HTML node.
 * @constant overlayContainer         - Pointer to the overlay HTML node.
 * @constant overlayMessageContainer  - Pointer to the overlay message HTML node.
 * @constant pvalueThresholdContainer - Pointer to the pvalue range HTML node.
 * @constant pvalueThresholdDisplay   - Pointer to the pvalue display HTML node.
 *
 * @property {object} cy              - Cytoscape object containing nodes and edges data of the network alignment.
 * @property {object} cxtmenuItems    - Define the commands usable in the context menu.
 * @property {string} pvalueThreshold - Pvalue used as threshold to display the ortholgy edges.
 *
 * @function showOverlay        - Show the overlay on layout loading.
 * @function hideOverlay        - Hide the overlay.
 * @function referenceSelected  - Return all reference genes selected.
 * @function tapHandler         - Determine the state and type of the taped element and call the appropriate action.
 * @function boxHandler         - Call a shifted selection for all unselected element in the box.
 * @function setPvalueThreshold - Change the pvalue threshold and hide or show the orthology edges accordingly.
 *
 * @method init         - Set cytoscape style, context menu and event listeners.
 * @method getPrivates  - Return `cy` and `pvalueThreshold`.
 * @method setData      - Set the nodes and edges data.
 * @method deselectAll  - Deselect every nodes and hide every edges.
 * @method selectNode   - Select a nodes, the connected nodes based on orthology data and show the orthology edges connecting them.
 * @method deselectNode - Deselect a nodes, the connected nodes based on orthology data and hide the ortholgy edges connecting them.
 */
var alignmentView = (function () {
  const viewContainer = document.getElementById('cytoscapeweb1');
  const overlayContainer = document.querySelector('.network-overlay');
  const overlayMessageContainer = document.querySelector('.overlay-message');
  const pvalueThresholdContainer = document.getElementById('pvalueThreshold');
  const pvalueThresholdDisplay = document.getElementById('pvalueThresholdDisplay');
  var cy;
  var cxtmenuItems = {
    setActive: {
      content: 'Set as active',
      select: function(element) {
        console.log(`Setting ${element.id()} as active`);
      }
    },
    remove: {
      content: 'Remove',
      select: function(element) {
        console.log(`Removing ${element.id()}`);
      }
    },
    expand: {
      content: 'Expand',
      select: function(element) {
        console.log(`Expanding from ${element.id()}`);
      }
    }
  };
  var pvalueThreshold = '0.05';

  function showOverlay(message) {
    if (message) {
      overlayMessageContainer.textContent = message;
    };
    overlayContainer.style.display = 'block';
  };

  function hideOverlay() {
    if (overlayMessageContainer.firstChild) {
      overlayMessageContainer.firstChild.remove();
    };
    overlayContainer.style.display = 'none';
  };

  function referenceSelected() {
    let referenceSelectedIds = [];
    cy.nodes('.active').children(':selected').forEach(function(node) {
      referenceSelectedIds.push(node.id());
    });
    return referenceSelectedIds;
  };

  function tapHandler(event) {
    let target = event.target;
    let targetGroup = target.group === undefined ? 'background' : target.group();
    if (targetGroup === 'background') {
      eventLinker.deselectAll();
    } else {
      let targetId = target.id();
      let isSelected = target.selected();
      let shiftPressed = event.originalEvent.shiftKey;
      if (targetGroup === 'nodes') {
        if (target.hasClass('network')) {

        } else if (target.hasClass('gene')) {
          if (isSelected) {
            if (shiftPressed) {
              let referenceSelectedIds = referenceSelected();
              eventLinker.deselectGene(targetId, referenceSelectedIds);
            } else {
              eventLinker.selectGene(targetId, false);
            };
          } else {
            eventLinker.selectGene(targetId, shiftPressed);
          };
        };
      } else if (targetGroup === 'edges') {

      };
    };
    return false;
  };

  function boxHandler(event) {
    event.originalEvent = {shiftKey: true};
    event.target.forEach(function(element) {
      if (!event.target.selected()) {
        tapHandler(event);
      };
    });
  };

  function setPvalueThreshold(newPvalue) {
    pvalueThreshold = newPvalue;
    cy.edges('.orthology[conservation_pvalue >= ' + pvalueThreshold + ']')
      .hide();
    cy.nodes(':selected')
      .connectedEdges('.orthology[conservation_pvalue < ' + pvalueThreshold + ']')
      .forEach(function (edge) {
        if (edge.source().selected()) {
          if(edge.target().selected()) {
            edge.show();
          };
        };
      });
  };

  return {
    init: function (viewSettings, cxtmenuSettings) {
      cy = cytoscape({
        container: viewContainer,
        style: [
          {
            selector: 'node',
            style: {
              content: 'data(label)',
              'border-width': '2px',
              'border-color': '#333333',
              'background-color': '#C5F9FF'
            }
          }, {
            selector: 'node:selected',
            style: {
              'border-width': '6px',
              'border-color': 'red',
              'border-opacity': 0.5,
              'background-color': '#C5F9FF'
            }
          }, {
            selector: 'node.network',
            style: {
              'border-width': '2px',
              'border-color': '#777777',
              'font-size': '3em',
              'background-color': '#EEEEEE'
            }
          }, {
            selector: 'node.network.active',
            style: {
              'background-color': '#EAFFF5'
            }
          }, {
            selector: 'edge.orthology',
            style: {
              'line-style': 'dashed',
              'label': 'data(conservation_pvalue)',
              'display': 'none',
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'arrow-scale': 2
            }
          }, {
            selector: 'edge.orthology[support = "ORTHO"]',
            style: {
              'line-color': '#45ADFF',
              'target-arrow-color': '#45ADFF'
            }
          }, {
            selector: 'edge.orthology[support = "BHIF"]',
            style: {
              'line-color': '#FC784C',
              'target-arrow-color': '#FC784C'
            }
          }, {
            selector: 'edge.orthology[support = "TROG"]',
            style: {
              'line-color': '#1AC620',
              'target-arrow-color': '#1AC620'
            }
          }, {
            selector: 'edge.extension',
            style: {
              'curve-style': 'bezier'
            }
          }
        ],
        userZoomingEnabled: false,
        boxSelectionEnabled: true,
      });
      cy.cxtmenu({
        selector: 'node.gene',
        commands: [
          Object.assign({}, cxtmenuItems.expand, {enabled: false})
        ]
      });
      cy.cxtmenu({
        selector: 'node.network[?active]',
        commands: [
          Object.assign({}, cxtmenuItems.setActive, {enabled: false}),
          cxtmenuItems.remove
        ]
      });
      cy.cxtmenu({
        selector: 'node.network[!active]',
        commands: [
          cxtmenuItems.setActive,
          cxtmenuItems.remove
        ]
      });
      cy.panzoom();
      cy.on('layoutstart', () => showOverlay('Calculating network layout...'));
      cy.on('layoutstop', hideOverlay);
      cy.on('tap', tapHandler);
      cy.on('box', boxHandler);
      pvalueThresholdContainer.addEventListener('input', function handleInput() {
        pvalueThresholdDisplay.innerHTML = this.value;
        setPvalueThreshold(this.value);
      });
    },

    getPrivates: function () {
      return {
        cy: cy,
        pvalueThreshold: pvalueThreshold
      };
    },

    setData: function (data) {
      cy.elements().remove();
      cy.add(data);
      cy.elements('node, edge.co-expression').layout({
        name: 'cola',
        animate: true,
        refresh: 1,
        randomize: true,
        nodeSpacing: function (node) {
          if (node.data('parent')) {
            return 10;
          } else {
            return 100;
          }
        }
      }).run();
      cy.elements().unselectify(); // Prevent default select behavior
    },

    deselectAll: function () {
      cy.nodes().selectify().deselect().unselectify();
      cy.edges('.orthology').hide();
    },

    selectNode: function (nodeId, isReference, connectedNodes) {
      let node = cy.getElementById(nodeId);
      node.selectify().select().unselectify();
      node.connectedEdges('.orthology[conservation_pvalue < ' + pvalueThreshold + ']')
          .show()
      connectedNodes.forEach(function (connectedId) {
        cy.getElementById(connectedId).selectify().select().unselectify();
      });
    },

    deselectNode: function (nodeId, isReference, connectedNodes) {
      let node = cy.getElementById(nodeId);
      node.selectify().deselect().unselectify();
      node.connectedEdges('.orthology').hide();
      connectedNodes.forEach(function (connectedId) {
        let connectedNode = cy.getElementById(connectedId);
        connectedNode.selectify().deselect().unselectify();
        connectedNode.connectedEdges('.orthology').hide();
      });
    }
  };
})();

