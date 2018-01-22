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

function ComplexTable(element) {
    this.datatable = $(element).DataTable(table_options);
    $(element + " thead th").each(function() {
        if ($(this).index() != 0) {
            var title = $(this).text();
            $(this).html(title + '</br><input id="' + title.toLowerCase() + '_index" type="text" placeholder="Search ' + title.toLowerCase() + '">');
        }
    });

    this.set_data = function(data) {
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

function init_tables() {
    console.log('initialisting tables');
    firsttable = new ComplexTable("#firsttable");
    secondtable = new ComplexTable("#secondtable");
}
