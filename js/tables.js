var firsttable;
var secondtable;

var table_options = {
    searching: false
};

function ComplexTable(element) {
    this.datatable = $(element).dataTable(table_options);
    $(element + " thead th").each(function() {
        if ($(this).index() != 0) {
            var title = $(this).text();
            $(this).html(title + '</br><input id="' + title.toLowerCase() + '_index" type="text" placeholder="Search ' + title.toLowerCase() + '">');
        }
    });

    this.set_data = function(data) {
        return;
    };
}

function init_tables() {
    console.log('initialisting tables');
    firsttable = new ComplexTable("#firsttable");
    secondtable = new ComplexTable("#secondtable");
}
