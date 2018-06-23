var layoutOptions = {
  name: 'cose-bilkent',
  tile: true,
  animate: 'during',
  refresh: 60
};

function TableNetwork(active_table_element, other_table_element, network_element) {
  this.activeTable = $(active_table_element).DataTable({
    searching: false,
    columnDefs: [{
      orderable: false,
      className: 'select-checkbox',
      targets: 0,
      data: null,
      defaultContent: ""
    }, {
      data: 'gene',
      targets: 1
    }],
    select: {
      style: "multi",
    },
    rowId: "id",
    order: [[1, 'asc']]
  });

  this.otherTable = $(other_table_element).DataTable({
    searching: false,
    columnDefs: [{
      orderable: false,
      className: 'select-checkbox',
      targets: 0,
      data: null,
      defaultContent: ""
    }, {
      data: 'gene',
      targets: 1
    }, {
      data: 'network',
      targets: 2
    }],
    select: {
      style: "multi",
    },
    rowId: "id",
    order: [[1, 'asc']]
  });

  $(`${active_table_element} thead th, ${other_table_element} thead th`).each(function() {
    if ($(this).index() != 0) {
      var title = $(this).text();
      $(this).html(title + '</br><input id="' + title.toLowerCase() +
        '_index" type="text" placeholder="Search ' + title.toLowerCase() + '">');
    }
  });

  this.cy = cytoscape({
    container: $(network_element),
    style: [
      {
        selector: 'node.active',
        style: {
          'background-color': '#eafff5'
        }
      }, {
        selector: 'node',
        style: {
          content: 'data(label)'
        }
      }, {
        selector: 'node.network',
        style: {
          'font-size': '3em'
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
      }
    ],
    userZoomingEnabled: false,
    boxSelectionEnabled: true
  });

  this.cy.nodes().unselectify();

  this.cy.panzoom({

  });

  this.networkLayout = this.cy.layout(layoutOptions);

  var self = this;
  var networkSelect = false;
  var tableSelect = false;
  var propagateSelection = true;

  this.deselectAll = function() {
    self.cy.nodes().selectify().deselect().unselectify();
    self.cy.edges('.orthology').style('display', 'none');
    self.activeTable.rows().deselect();
    self.otherTable.rows().deselect();
  }

  /**
   * Select a node
   *
   * Select a node in the network and show any orthology
   * edges connected to it. Also select any orthologs that
   * it is connected to.
   */
  var selectNode = function(node, fromTable) {
    // Display orthology edges
    node.selectify().select().unselectify();
    node.connectedEdges('.orthology').style('display', 'element');

    // Select the orthologs in the connected networks
    if (node.data('parent') === `network${self.activeNetworkID}`) {
      var orthologs = node.connectedEdges('.orthology').targets();
      orthologs.selectify().select().unselectify();
      var orthologIDs = orthologs.map(function(x) {
        return `#${x.id()}`;
      });
      if (!fromTable) {
        // Only select in the table if the selection was done in the network
        self.activeTable.row(`#${node.id()}`, {selected: false}).select();
      }
      self.otherTable.rows(orthologIDs, {selected: false}).select();
    } else {
      var orthologs = node.connectedEdges('.orthology').sources();
      orthologs.selectify().select().unselectify();
      var orthologIDs = orthologs.map(function(x) {
        return `#${x.id()}`;
      });
      if (!fromTable) {
        self.otherTable.row(`#${node.id()}`, {selected: false}).select();
      }
      self.activeTable.rows(orthologIDs, {selected: false}).select();
    }
  }

  /**
   * Deselect a node
   *
   * Deselect a node in the network and hide any orthology
   * edges connected to it. Also deselect the orthologous
   * nodes in any other networks that don't have other
   * orthology edges connected to them.
   */
  var deselectNode = function(node, fromTable) {
    node.selectify().deselect().unselectify();
    node.connectedEdges('.orthology').style('display', 'none');
    if (node.data('parent') === `network${self.activeNetworkID}`) {
      node.connectedEdges('.orthology')
        .targets()
        .selectify()
        .deselect()
        .unselectify();
      var selectedOrthologs = self.getActiveSelected()
        .connectedEdges('.orthology:visible')
        .targets();
      selectedOrthologs.selectify().select().unselectify();
      if (!fromTable) {
        self.activeTable.row(`#${node.id()}`, {selected: true}).deselect();
      }
      var selectedOrthologIDs = selectedOrthologs.map(function(x) {
        return `#${x.id()}`;
      });
      self.otherTable.rows().deselect();
      self.otherTable.rows(selectedOrthologIDs).select();
    } else {
      node.connectedEdges('.orthology')
        .sources()
        .selectify()
        .deselect()
        .unselectify();
      var selectedOrthologs = self.getInactiveSelected()
        .connectedEdges('.orthology:visible')
        .sources();
      selectedOrthologs.selectify().select().unselectify();
      if (!fromTable) {
        self.otherTable.row(`#${node.id()}`, {selected: true}).deselect();
      }
      var selectedOrthologIDs = selectedOrthologs.map(function(x) {
        return `#${x.id()}`;
      })
      self.activeTable.rows().deselect();
      self.activeTable.rows(selectedOrthologIDs).select();
    }
  }

  this.getActiveSelected = function() {
    return self.cy
      .nodes(`#network${self.activeNetworkID}`)
      .children(':selected');
  }

  this.getInactiveSelected = function() {
    var inactiveNetworks = $.grep(self.networks, function(x) {
      return x != self.activeNetworkID;
    }).map(x => `#network${x}`)
      .join(',');
    
    return self.cy
      .nodes(inactiveNetworks)
      .children(':selected');
  }

  var tapNode = function(node, shiftDown, fromTable) {
    if (node.hasClass('network')) {
      return;
    }

    var activeTap = node.data('parent') === `network${self.activeNetworkID}`;
    var nSelected = activeTap ? self.getActiveSelected().length :
      self.getInactiveSelected().length;
    var isSelected = node.selected();

    if (isSelected & nSelected === 1) {
      deselectNode(node, fromTable);
    } else if (isSelected & nSelected > 1 & !shiftDown) {
      self.deselectAll();
      selectNode(node, fromTablej);
    } else if (isSelected & nSelected > 1 & shiftDown) {
      deselectNode(node, fromTable);
    } else if (!isSelected & shiftDown) {
      selectNode(node, fromTable);
    } else if (!isSelected & !shiftDown) {
      self.deselectAll();
      selectNode(node, fromTable);
    }
  }

  this.cy.on('tap', function(e) {
    var type = e.target.group === undefined ? 'background' : e.target.group();

    switch (type) {
      case 'nodes': 
        tapNode(e.target, e.originalEvent.shiftKey, false);
        break;
      case 'edges': 
        break;
      case 'background':
        self.deselectAll();
        break;
      default:
        console.error(`unknown element type: ${type}`);
    }
  });

  var networkSelectionFromTable = function(e, dt, type, cell, originalEvent) {
    var selectedID = dt.row(cell.index().row).data().id;
    if (type === 'row') {
      tapNode(self.cy.nodes(`#${selectedID}`), true, true);
    }
  }

  this.activeTable.on('user-select', networkSelectionFromTable);
  this.otherTable.on('user-select', networkSelectionFromTable);

  this.add_network = function(networkID) {

  }

  this.set_data = function(data, activeNetwork, networks) {
    this.cy.elements().remove();
    this.data = data;
    this.activeNetworkID = activeNetwork;
    this.networks = networks;

    this.cy.add(this.data);
    self.networkLayout = self.cy.elements('node, edge.co-expression').layout(layoutOptions);
    self.networkLayout.run();

    this.activeTable.clear();
    var activeTableData = $.grep(this.data.nodes, function(x) {
      return x.classes.match(/gene/) !== null && x.data.parent === `network${activeNetwork}`;
    }).map(function(x) {
      return {
        gene: x.data.label,
        id: x.data.id,
        network: x.data.parent
      };
    });
    this.activeTable.rows.add(activeTableData).draw();

    this.otherTable.clear();
    var otherTableData = $.grep(this.data.nodes, function(x) {
      return x.classes.match(/gene/) !== null && x.data.parent !== `network${activeNetwork}`;
    }).map(function(x) {
      return {
        gene: x.data.label,
        id: x.data.id,
        network: x.data.parent
      };
    });
    this.otherTable.rows.add(otherTableData).draw();
  };
}

