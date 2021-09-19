<article id="documentation-article" class="documentation hide">
    <header>
        <h1>Help</h1>
    </header>

    <section>
        <h2>Introduction</h2>
        <p>
            Complex is a tool for exploring conservation of gene co-expression across species.
            The co-expression conservation has been calculated by comparing network neighbourhoods of orthologous genes in different species.
            If the overlap between the neighbourhoods is larger than expected by chance, the co-expression of the starting gene is considered to be conserved.
        </p>
    </section>

    <section>
        <h2>Getting started</h2>

        <p>
            The first choice you will have to make is what networks you want to compare.
            The available networks are listed at the top of the page.
            If a network has a turquoise background, then it is selected, and you can select multiple networks to visualise.
            The radio buttons below the networks controls the reference network.
            The selected reference network will have an orange border.
            Since the network conservation statistics are not commutative, whichever network is set as the reference network will be what the conservations statistics are based on.
        </p>

        <p>
            The complete networks are too big to visualise as a whole, so the next step is to define what part of the network you want to look at.
            You can enter gene identifiers separated by any combination of commas and whitespace.
            If you just want to test the tool, you can click the "Load example" button.
            This will populate the input with a number of genes, and species for which the IDs belong depends on the species of the reference network.
        </p>

        <p>
            The co-expression threshold roughly correponds to how many edges you will have in the resulting network.
            The more lenient the threshold is (i.e. further to the left), the more edges you will see, and more stringent (i.e. further to the right) will result in fewer edges.
        </p>

        <p>
            To visualise the networks, click the "Align" button.
            This will fetch a subnetwork for the genes you have entered from the reference network.
            If you have selected more than one network, the corresponding subnetwork in these will be fetched, based on gene orthology.
        </p>
    </section>

    <section>
        <h2>Network view</h2>

        <p>
            The network view displays the networks that you have selected.
            Each of the individual networks are represented as square nodes, labelled with the name of the network.
            Inside the square nodes, the nodes and edges in that network are displayed.
            Two genes are connected if their level of co-expression exceeds the threshold set in the input.
            Hovering a gene will display some information about that particular gene to the right of the network view.
        </p>

        <p>
            Selecting a gene in the network by clicking it will highlight that gene, and any orthologs that were identified in the other networks.
            Edges betweeen the orthologs appear if the p-value of the conservation of co-expression is below the value set by the conservation p-value threshold slider that can be found above the network view.
            Hovering over an ortholog edge will display the p-value of the conservation.
        </p>
    </section>

    <?php if ($config["extensions"]["enabled"]): ?>
    <section>
        <h2>Extensions</h2>

        <p>
            Extensions is a way of adding annotations to the network.
            By enabling an extension, nodes and/or edges are coloured according to the legend for the respective extension.
            In the background, this is based on lists of genes and/or interactions between genes.
            Hovering over the legend will reveal a more detailed definition of the categories.
        </p>
    </section>
    <?php endif; ?>

    <?php if ($config["gofer2"]["enabled"]): ?>
    <section>
        <h2>Annotations</h2>

        <p>
            In the panel to the right of the network view, you can see three different types of annotations that the network can be annotated with: GO, PFAM, and KEGG.
            Clicking one of these will list all the terms for that particular type of annotation that are available in the currently displayed network.
            Selecting an annotation will colour nodes accordingly.
        </p>

        <?php if ($config["extensions"]["enabled"]): ?>
        <p>
            Note that if both extensions and annotations are in use, extensions take precedence.
        </p>
        <?php endif; ?>
    </section>
    <?php endif; ?>

    <section>
        <h2>Citation</h2>

        <p>
            If you are using Complex in your work, please cite the following paper:
        </p>

        <p>
            Netotea, S., Sundell, D., Street, N.R., Hvidsten, T.R.
            ComPlEx: conservation and divergence of co-expression networks in <i>A. thaliana</i>, <i>Populus</i> and <i>O. sativa</i>.
            BMC Genomics 15, 106 (2014).
            <a href="https://doi.org/10.1186/1471-2164-15-106">https://doi.org/10.1186/1471-2164-15-106</a>
        </p>

        <p>The source code of Complex can be found on Github: <a href="https://github.com/plantgenie/complex">PlantGenIE/Complex</a></p>
    </section>
</article>
