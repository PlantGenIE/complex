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
      style: "os",
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
      style: "os",
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

  this.cy.panzoom({

  });

  this.networkLayout = this.cy.layout(layoutOptions);

  var self = this;
  var networkSelect = false;
  var tableSelect = false;
  var propagateSelection = true;

  this.cy.on('click', 'node', function(e) {
    if (e.target.selected()) {
      e.target.deselect();
    }
  });

  this.cy.on('select', 'node', function(e) {
    if (!propagateSelection) {
      propagateSelection = true;
      return;
    }
    // Display orthology edges
    e.target.connectedEdges('.orthology').style('display', 'element');
    // Select the orthologs in the connected networks
    propagateSelection = false;
    if (e.target.data('parent') === `network${self.activeNetworkID}`) {
      e.target.connectedEdges('.orthology').targets().select();
    } else {
      e.target.connectedEdges('.orthology').sources().select();
    }
    
    if (tableSelect) {
      tableSelect = true;
      return;
    }
    
    networkSelect = true;
    var nodeId = e.target.data('id');
    if (e.target.data('parent') === `network${self.activeNetworkID}`) {
      self.activeTable.row(`#${nodeId}`).select();
    } else {
      self.otherTable.row(`#${nodeId}`).select();
    }
  });

  this.cy.on('unselect', 'node', function(e) {
    // Hide ortholog edges
    propagateSelection = true;
    e.target.connectedEdges('.orthology').style('display', 'none');

    if (tableSelect) {
      tableSelect = false;
      return;
    }

    networkSelect = true;
    var nodeId = e.target.data('id');
    if (e.target.data('parent') === `network${self.activeNetworkID}`) {
      self.activeTable.row(`#${nodeId}`).deselect();
    } else {
      self.otherTable.row(`#${nodeId}`).deselect();
    }
  });

  var networkSelectionFromTable = function(e, dt, type, fromActiveTable) {
    if (networkSelect) {
      networkSelect = false;
      return;
    }
    tableSelect = true;
    if (type === "row") {
      var nodeIds = dt.rows({selected: true}).ids().toArray();
      self.cy.nodes().deselect();
      self.cy.nodes().filter(function(x) {
        return $.inArray(x.data('id'), nodeIds) !== -1;
      }).select();
    }
    tableSelect = false;
  }

  this.activeTable.on('select', function(e, dt, type) {
    networkSelectionFromTable(e, dt, type, true);
  });
  this.activeTable.on('deselect', function(e, dt, type) {
    networkSelectionFromTable(e, dt, type, true);
  });
  this.otherTable.on('select', function(e, dt, type) {
    networkSelectionFromTable(e, dt, type, false);
  });
  this.otherTable.on('deselect', function(e, dt, type) {
    networkSelectionFromTable(e, dt, type, false);
  });

  this.add_network = function(networkID) {

  }

  this.set_data = function(data, activeNetwork) {
    this.cy.elements().remove();
    this.data = data;
    this.activeNetworkID = activeNetwork;
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

  this.highlightOrthologs = function(id, secondNetworkID) {
    $.ajax({
      url: 'service/orthologs.php',
      method: 'POST',
      data: {
        gene_id: Array.isArray(id) ? id : [id],
        network_id1: this.data.id,
        network_id2: secondNetworkID
      },
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        console.log(data);
      },
      error: function(jqXHR, textStatus) {
        console.error(jqXHR.responseJSON.error);
      }
    });
  }
}

