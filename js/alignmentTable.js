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
  const referenceTableContainer = $('#active-network-table');
  const alignedTableContainer = $('#other-network-table');
  var referenceTable;
  var alignedTable;

  function referenceSelected() {
    let referenceSelectedIds = [];
    referenceTable.rows('.selected').every(function () {
      referenceSelectedIds.push(this.id());
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
      referenceTable = referenceTableContainer.DataTable({
        searching: false,
        columnDefs: [
          {
            className: 'select-checkbox',
            targets: 0,
            defaultContent: '',
            data: 'checkbox',
            render: {
              _: 'value',
              sort: 'order'
            },
            orderSequence: ['desc', 'asc']
          }, {
            data: 'gene',
            targets: 1
          }
        ],
        select: {
          style: "multi",
        },
        rowId: "id",
        order: [[1, 'asc']]
      });
      alignedTable = alignedTableContainer.DataTable({
        searching: false,
        columnDefs: [
          {
            className: 'select-checkbox',
            targets: 0,
            data: 'checkbox',
            render: {
              _: 'value',
              sort: 'order'
            },
            orderSequence: ['desc', 'asc']
          }, {
            data: 'gene',
            targets: 1
          }, {
            data: 'network',
            targets: 2
          }
        ],
        select: {
          style: "multi",
        },
        rowId: "id",
        order: [[1, 'asc']]
      });
      referenceTable.on('user-select', selectHandler);
      alignedTable.on('user-select', selectHandler);
    },

    getPrivates: function () {
      return {
        referenceTable: referenceTable,
        alignedTable: alignedTable
      };
    },

    setData: function (referenceData, alignedData) {
      referenceTable.clear();
      alignedTable.clear();
      referenceTable.rows.add(referenceData).draw();
      alignedTable.rows.add(alignedData).draw();
    },

    deselectAll: function () {
      referenceTable.rows().deselect().data().checkbox.order = 0;
      alignedTable.rows().deselect().data().checkbox.order = 0;
      referenceTable.rows().invalidate().draw();
      alignedTable.rows().invalidate().draw();
    },

    selectRow: function (rowId, isReference, connectedRows) {
      if (isReference) {
        referenceTable.row("#" + rowId).select().data().checkbox.order = 1;
        connectedRows.forEach(function (connectedId) {
          alignedTable.row("#" + connectedId).select().data().checkbox.order = 1;
        });
      } else {
        alignedTable.row("#" + rowId).select().data().checkbox.order = 1;
        connectedRows.forEach(function (connectedId) {
          referenceTable.row("#" + connectedId).select().data().checkbox.order = 1;
        });
      };
      referenceTable.rows().invalidate().draw();
      alignedTable.rows().invalidate().draw();
    },

    deselectRow: function (rowId, isReference, connectedRows) {
      if (isReference) {
        referenceTable.row("#" + rowId).deselect().data().checkbox.order = 0;
        connectedRows.forEach(function (connectedId) {
          alignedTable.row("#" + connectedId).deselect().data().checkbox.order = 0;
        });
      } else {
        alignedTable.row("#" + rowId).deselect().data().checkbox.order = 0;
        connectedRows.forEach(function (connectedId) {
          referenceTable.row("#" + connectedId).deselect().data().checkbox.order = 0;
        });
      };
      referenceTable.rows().invalidate().draw();
      alignedTable.rows().invalidate().draw();
    }
  };
})();

