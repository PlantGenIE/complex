var table_options = {
  searching: false,
  columnDefs: [{
    orderable: false,
    className: 'select-checkbox',
    targets: 0,
    data: null,
    defaultContent: ""
  }, {
    data: "gene",
    targets: 1
  }],
  select: {
    style: "os",
  },
  rowId: "id",
  order: [[1, 'asc']]
};

function TableNetwork(table_element, network_element) {
  this.datatable = $(table_element).DataTable(table_options);
  $(table_element + " thead th").each(function() {
    if ($(this).index() != 0) {
      var title = $(this).text();
      $(this).html(title + '</br><input id="' + title.toLowerCase() +
        '_index" type="text" placeholder="Search ' + title.toLowerCase() + '">');
    }
  });

  this.cy = cytoscape({
    container: $(network_element),
    layout: {
      name: 'cose-bilkent',
      animate: false
    },
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
        selector: 'node.network-node',
        style: {
          'font-size': '3em'
        }
      }
    ],
    userZoomingEnabled: false,
    boxSelectionEnabled: true
  });

  this.cy.panzoom({

  });

  var self = this;
  var networkSelect = false;
  var tableSelect = false;

  this.cy.on('select', 'node', function(e) {
    if (tableSelect) {
      tableSelect = true;
      return;
    }
    networkSelect = true;
    var nodeId = e.target.data('id');
    self.datatable.row('#' + nodeId).select();
  });

  this.cy.on('unselect', 'node', function(e) {
    if (tableSelect) {
      tableSelect = false;
      return;
    }
    networkSelect = true;
    var nodeId = e.target.data('id');
    self.datatable.row('#' + nodeId).deselect();
  });

  var networkSelectionFromTable = function(e, dt, type) {
    if (networkSelect) {
      networkSelect = false;
      return;
    }
    tableSelect = true;
    if (type === "row") {
      var nodeIds = self.datatable.rows({selected: true}).ids().toArray();
      self.cy.nodes().deselect();
      self.cy.nodes().filter(function(x) {
        return $.inArray(x.data('id'), nodeIds) !== -1;
      }).select();
    }
    tableSelect = false;
  }

  this.datatable.on('select', networkSelectionFromTable);
  this.datatable.on('deselect', networkSelectionFromTable);

  this.add_network = function(networkID) {

  }

  this.set_data = function(data) {
    this.cy.elements().remove();
    this.data = data;
    this.cy.add(this.data);
    this.cy.layout({name: 'cose-bilkent'}).run();

    //        this.datatable.clear();
    //        var table_data = $.grep(this.data, function(x) {
    //            return x.group === 'nodes';
    //        }).map(function(x) {
    //            return {
    //                selected: {
    //                    is_selected: typeof(x.selected) == "undefined" ? false : x.selected,
    //                    id: x.data.id
    //                },
    //                gene: x.data.label,
    //                id: x.data.id
    //            };
    //        });
    //        this.datatable.rows.add(table_data).draw();
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

