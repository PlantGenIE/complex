var firsttable;
var secondtable;

var table_options = {
    searching: false,
    columns: [
        {
            data: "selected",
            render: function(data, type, row, meta) {
                var checkbox = '<input type="checkbox" value="' +
                    data.id + '" ' + (data.is_selected ? ' checked' : '') + '/>';
                return type === 'display' ? checkbox : data;
            }
        },
        {data: "gene"}
    ]
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
            name: 'cose',
            animate: false
        },
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': 'blue'
                }
            }, {
                selector: 'node:selected',
                style: {
                    'border-style': 'solid',
                    'border-color': 'red',
                    'border-width': '2px'
                }
            }
        ],
        boxSelectionEnabled: true
    });

    this.cy.nodes().one('select', function(x) {
        console.log(this);
    });

    this.set_data = function(data) {
        this.cy.elements().remove();
        this.cy.add(data);
        this.cy.layout({name: 'cose'}).run();

        this.datatable.clear();
        var table_data = $.grep(data, function(x) {
            return x.group === 'nodes';
        }).map(function(x) {
            return {
                selected: {
                    is_selected: typeof(x.selected) == "undefined" ? false : x.selected,
                    id: x.data.id
                },
                gene: x.data.label
            };
        });
        this.datatable.rows.add(table_data).draw();
    };
}

