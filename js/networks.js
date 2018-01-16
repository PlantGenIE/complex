var vis1;
var vis2;

function ComplexNetwork(element) {
    this.cy = cytoscape({
        container: $(element),
        layout: {
            name: 'cose',
            animate: false
        }
    });

    this.set_data = function(data) {
        this.cy.elements().remove();
        this.cy.add(data);
        this.cy.layout({name: 'cose'}).run();
    }
}

function init_networks() {
    console.log('initialising networks');
    vis1 = new ComplexNetwork('#cytoscapeweb1');
    vis2 = new ComplexNetwork('#cytoscapeweb2');
}
