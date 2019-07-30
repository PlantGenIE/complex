/**
 * @module alignmentTable - Display the alignment data using DataTables.
 *
 * @constant referenceTableContainer - Pointer to the reference table HTML node.
 * @constant alignedTableContainer   - Pointer to the aligned table HTML node.
 *
 * @property {object} referenceTable - DataTables object containing reference network data.
 * @property {object} alignedTable   - DataTables object containing aligned networks data.
 *
 * @function referenceSelected - Return all reference genes selected.
 * @function selectHandler     - Determine the state of the row selected and the appropriate action.
 *
 * @method init        - Set datatables style and event listeners.
 * @method getPrivates - Return `referenceTable` and `alignedTable`.
 * @method setData     - Set the rows data.
 * @method deselectAll - Deselect every rows.
 * @method selectRow   - Select a row and the connected rows based on orthology data.
 * @method deselectRow - Deselect a row and the connected rows based on orthology data.
 */
var alignmentTable = (function () {
  const tableContainer = $('#alignement-table');
  const tableTabsContainer = document.getElementById('table-tabs');
  const tableTabTemplate = document.getElementById('table-tab-template');
  var table;
  var referenceNetwork;

  function referenceSelected() {
    let referenceSelectedIds = [];
    table.rows('.selected').every(function () {
      if (this.data().network === referenceNetwork) {
        referenceSelectedIds.push(this.id());
      }
    });
    return referenceSelectedIds;
  };

  function selectHandler(e, dt, type, cell, originalEvent, isReference) {
    if (type === 'row') {
      let targetId = dt.row(cell.index().row).data().id;
      let isSelected = dt.row(cell.index().row).node().classList.contains('selected');
      if (isSelected) {
        let referenceSelectedIds = referenceSelected();
        eventLinker.deselectGene(targetId, referenceSelectedIds);
      } else {
        eventLinker.selectGene(targetId, true);
      };
    };
    return false;
  };

  function displayTabs() {
    tableTabsContainer.querySelectorAll('.table-tab').forEach(tab => { tab.remove() });

    let networks = table.column(0).data().unique()
    for (var i = 0, length = networks.length; i < length; i++) {
      let network = networks[i];
      let tab = document.importNode(tableTabTemplate, true).content;
      let tabButton = tab.querySelector('button');

      tabButton.value = network;
      tabButton.textContent = network;
      tableTabsContainer.appendChild(tabButton);

      tableTabsContainer.lastChild.addEventListener('click', e => {
        $.fn.dataTable.ext.search.pop();
        $.fn.dataTable.ext.search.push((settings, data, dataIndex) => {
          return table.row(dataIndex).data().network === network;
        });
        table.draw();

        exportManager.changeActive(network);
      });
    }
    tableTabsContainer.querySelector('.table-tab').click();
  }

  return {
    init: function () {
      table = tableContainer.DataTable({
        searching: true,
        columnDefs: [
          {
            data: 'network',
            visible: false,
            targets: 0
          }, {
            className: 'select-checkbox',
            targets: 1,
            data: 'checkbox',
            render: {
              _: 'value',
              sort: 'order'
            },
            orderSequence: ['desc', 'asc']
          }, {
            data: 'gene',
            targets: 2
          }, {
            data: 'go',
            targets: 3
          }, {
            data: 'pfam',
            targets: 4
          }, {
            data: 'kegg',
            targets: 5
          }
        ],
        select: {
          style: "multi",
        },
        rowId: "id",
        order: [[2, 'asc']]
      });
      table.on('user-select', selectHandler);
    },

    getPrivates: function () {
      return {
        table: table,
      };
    },

    setData: function (tableData) {
      referenceNetwork = tableData.referenceNetwork;

      table.clear();
      table.rows.add(tableData.rows).draw();
      displayTabs();
    },

    deselectAll: function () {
      table.rows().every(function () {
        this.deselect().data().checkbox.order = 0;
      });
      exportManager.deselectAll();

      table.rows().invalidate().draw();
    },

    selectRow: function (rowId, connectedRows) {
      let rowData = table.row("#" + rowId).select().data();
      rowData.checkbox.order = 1;
      exportManager.selectGene(rowData.network, rowData.gene);

      connectedRows.forEach(function (connectedId) {
        rowData = table.row("#" + connectedId).select().data();
        rowData.checkbox.order = 1;
        exportManager.selectGene(rowData.network, rowData.gene);
      });

      table.rows().invalidate().draw();
    },

    deselectRow: function (rowId, connectedRows) {
      let rowData = table.row("#" + rowId).deselect().data();
      rowData.checkbox.order = 0;
      exportManager.deselectGene(rowData.network, rowData.gene);

      connectedRows.forEach(function (connectedId) {
        rowData = table.row("#" + connectedId).deselect().data();
        rowData.checkbox.order = 0;
        exportManager.deselectGene(rowData.network, rowData.gene);
      });
      
      table.rows().invalidate().draw();
    }
  };
})();

