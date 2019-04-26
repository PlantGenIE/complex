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

  return {
    init: function () {
      table = tableContainer.DataTable({
        searching: true,
        columnDefs: [
          {
            data: 'network',
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
          }
        ],
        select: {
          style: "multi",
        },
        rowId: "id",
        order: [[1, 'asc']]
      });
      table.on('user-select', selectHandler);
    },

    getPrivates: function () {
      return {
        table: table,
      };
    },

    setData: function (tableData) {
      table.clear();
      table.rows.add(tableData.rows).draw();
      referenceNetwork = tableData.referenceNetwork;
    },

    deselectAll: function () {
      table.rows().every(function () {
        this.deselect().data().checkbox.order = 0;
      });
      table.rows().invalidate().draw();
    },

    selectRow: function (rowId, connectedRows) {
      table.row("#" + rowId).select().data().checkbox.order = 1;
      connectedRows.forEach(function (connectedId) {
        table.row("#" + connectedId).select().data().checkbox.order = 1;
      });

      table.rows().invalidate().draw();
    },

    deselectRow: function (rowId, connectedRows) {
      table.row("#" + rowId).deselect().data().checkbox.order = 0;
      connectedRows.forEach(function (connectedId) {
        table.row("#" + connectedId).deselect().data().checkbox.order = 0;
      });
      
      table.rows().invalidate().draw();
    }
  };
})();

