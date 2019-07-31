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
  const overlayContainer = document.getElementById('network-overlay');
  const overlayMessage = overlayContainer.querySelector('.overlay-message');
  const pvalueThresholdContainer = document.getElementById('pvalueThreshold');
  const pvalueThresholdDisplay = document.getElementById('pvalueThresholdDisplay');
  const nodeInfoContainer = document.getElementById('node-info');
  const nodeInfoTemplate = document.getElementById('node-info-template');
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
    if (message) overlayMessage.textContent = message;
    overlayContainer.style.display = 'block';
  };

  function hideOverlay() {
    if (overlayMessage.firstChild) overlayMessage.firstChild.remove();
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

  function overNodeHandler(event) {
    let node = event.target;
    let nodeInfo = document.importNode(nodeInfoTemplate, true).content;
    let infoSpans = nodeInfo.querySelectorAll('span');

    infoSpans[0].textContent = node.data('id');
    infoSpans[1].textContent = node.data('label');
    infoSpans[2].textContent = node.data('parent');
    infoSpans[3].textContent = node.connectedEdges('.co-expression').length;
    infoSpans[4].textContent = node.connectedEdges('.orthology').length;

    nodeInfoContainer.insertBefore(nodeInfo, nodeInfoContainer.firstChild);
  }

  function outNodeHandler(envent) {
    while (nodeInfoContainer.firstChild) {
      nodeInfoContainer.firstChild.remove();
    }
  }

  function overEdgeHandler(event) {
      event.target.addClass('orthology-over');
  };

  function outEdgeHandler(event) {
      event.target.removeClass('orthology-over');
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

  function extensionPieSize(node, slice) {
    if (node.data('extension') && node.data('extension').length >= slice) {
      return 100.0 / node.data('extension').length;
    }
    return 0;
  }

  function extensionPieColor(node, slice) {
    if (node.data('extension') && node.data('extension').length >= slice) {
      return node.data('extension')[slice-1].color;
    }
    return 'black';
  }

  return {
    init: function () {
      cy = cytoscape({
        container: viewContainer,
        style: [
          {
            selector: 'node',
            style: {
              'content': 'data(label)',
              'background-color': '#F7EFDB'
            }
          }, {
            selector: 'node:selected',
            style: {
              'border-width': '6px',
              'border-color': '#FC784C',
            }
          }, {
            selector: 'node.network',
            style: {
              'border-width': '0px',
              'font-size': '3em',
              'background-color': '#BBBBBB'
            }
          }, {
            selector: 'node.network.active',
            style: {
              'background-color': '#AFC27F'
            }
          }, {
            selector: 'edge.co-expression',
            style: {
              'line-color': '#999999',
            }
          }, {
            selector: 'edge.orthology',
            style: {
              'display': 'none',
              'target-arrow-shape': 'triangle',
              'arrow-scale': 2,
              'width': node => { return `${node.data('support').length * 0.5}px` },
              'line-color': '#FC784C',
              'target-arrow-color': '#FC784C',
              'opacity': 0.7
            }
          }, {
            selector: '.orthology-over',
            style: {
              'label': 'data(conservation_pvalue)',
              'opacity': 1
            }
          }, {
            selector: 'edge.extension',
            style: {
              'curve-style': 'bezier'
            }
          }, {
            selector: '.pie-node',
            style: {
              'pie-size': '100%',
              'pie-1-background-color': '#1b9e77',
              'pie-1-background-size': ele => {
                return 100 / ele.data('colors').length * ele.data('colors').some(ele => {
                  return ele === 'annotation-color-1';
                });
              },
              'pie-2-background-color': '#d95f02',
              'pie-2-background-size': ele => {
                return 100 / ele.data('colors').length * ele.data('colors').some(ele => {
                  return ele === 'annotation-color-2';
                });
              },
              'pie-3-background-color': '#7570b3',
              'pie-3-background-size': ele => {
                return 100 / ele.data('colors').length * ele.data('colors').some(ele => {
                  return ele === 'annotation-color-3';
                });
              },
              'pie-4-background-color': '#e7298a',
              'pie-4-background-size': ele => {
                return 100 / ele.data('colors').length * ele.data('colors').some(ele => {
                  return ele === 'annotation-color-4';
                });
              },
              'pie-5-background-color': '#66a61e',
              'pie-5-background-size': ele => {
                return 100 / ele.data('colors').length * ele.data('colors').some(ele => {
                  return ele === 'annotation-color-5';
                });
              },
              'pie-6-background-color': '#e6ab02',
              'pie-6-background-size': ele => {
                return 100 / ele.data('colors').length * ele.data('colors').some(ele => {
                  return ele === 'annotation-color-6';
                });
              },
              'pie-7-background-color': '#a6761d',
              'pie-7-background-size': ele => {
                return 100 / ele.data('colors').length * ele.data('colors').some(ele => {
                  return ele === 'annotation-color-7';
                });
              },
              'pie-8-background-color': '#666666',
              'pie-8-background-size': ele => {
                return 100 / ele.data('colors').length * ele.data('colors').some(ele => {
                  return ele === 'annotation-color-8';
                });
              }
            }
          }, {
            selector: 'node.extension',
            style: {
              'pie-size': '100%',
              'pie-1-background-color': node => extensionPieColor(node, 1),
              'pie-1-background-size': node => extensionPieSize(node, 1),
              'pie-2-background-color': node => extensionPieColor(node, 2),
              'pie-2-background-size': node => extensionPieSize(node, 2),
              'pie-3-background-color': node => extensionPieColor(node, 3),
              'pie-3-background-size': node => extensionPieSize(node, 3),
              'pie-4-background-color': node => extensionPieColor(node, 4),
              'pie-4-background-size': node => extensionPieSize(node, 4),
              'pie-5-background-color': node => extensionPieColor(node, 5),
              'pie-5-background-size': node => extensionPieSize(node, 5),
              'pie-6-background-color': node => extensionPieColor(node, 6),
              'pie-6-background-size': node => extensionPieSize(node, 6),
              'pie-7-background-color': node => extensionPieColor(node, 7),
              'pie-7-background-size': node => extensionPieSize(node, 7),
              'pie-8-background-color': node => extensionPieColor(node, 8),
              'pie-8-background-size': node => extensionPieSize(node, 8),
              'pie-9-background-color': node => extensionPieColor(node, 9),
              'pie-9-background-size': node => extensionPieSize(node, 9),
              'pie-10-background-color': node => extensionPieColor(node, 10),
              'pie-10-background-size': node => extensionPieSize(node, 10),
              'pie-11-background-color': node => extensionPieColor(node, 11),
              'pie-11-background-size': node => extensionPieSize(node, 11),
              'pie-12-background-color': node => extensionPieColor(node, 12),
              'pie-12-background-size': node => extensionPieSize(node, 12)
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
      cy.nodes('[parent]').on('mouseover', overNodeHandler);
      cy.nodes('[parent]').on('mouseout', outNodeHandler);
      cy.edges('.orthology').on('mouseover', overEdgeHandler);
      cy.edges('.orthology').on('mouseout', outEdgeHandler);
    },

    nodeIds: function() {
      return cy.nodes('.gene').map(node => node.id());
    },

    nodes: function(selector) {
      return cy.nodes(selector);
    },

    deselectAll: function () {
      cy.nodes().selectify().deselect().unselectify();
      cy.edges('.orthology').hide();
    },

    selectNode: function (nodeId, connectedNodes) {
      let node = cy.getElementById(nodeId);
      node.selectify().select().unselectify();
      node.connectedEdges('.orthology[conservation_pvalue < ' + pvalueThreshold + ']')
          .show()
      connectedNodes.forEach(function (connectedId) {
        cy.getElementById(connectedId).selectify().select().unselectify();
      });
    },

    deselectNode: function (nodeId, connectedNodes) {
      let node = cy.getElementById(nodeId);
      node.selectify().deselect().unselectify();
      node.connectedEdges('.orthology').hide();
      connectedNodes.forEach(function (connectedId) {
        let connectedNode = cy.getElementById(connectedId);
        connectedNode.selectify().deselect().unselectify();
        connectedNode.connectedEdges('.orthology').hide();
      });
    },

    uncolorAll: function () {
      cy.nodes('.pie-node').forEach(node => {
        node.removeClass('pie-node');
        node.data('colors', []);
      });
    },

    colorNodes: function (nodesLabel, color) {
      cy.startBatch();
      nodesLabel.forEach(label => {
        let nodes = cy.nodes(`[label='${label}']`);
        nodes.forEach(node => {
          if (node.data('colors').length === 0) node.addClass('pie-node');
          node.data('colors').push(color);
          node.removeClass('pie-node');
          node.addClass('pie-node');
        });
      });
      cy.endBatch();
    },

    uncolorNodes: function (nodesLabel, color) {
      cy.startBatch();
      nodesLabel.forEach(label => {
        let nodes = cy.nodes(`[label='${label}']`);
        nodes.forEach(node => {
          node.data('colors').splice(node.data('colors').indexOf(color), 1);
          node.removeClass('pie-node');
          node.addClass('pie-node');
          if (node.data('colors').length === 0) node.removeClass('pie-node');
        });
      });
      cy.endBatch();
    }
  };
})();

