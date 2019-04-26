/**
 * @module eventLinker - Synchronise the events between the table and the view.
 *
 * @method init         - Do nothing.
 * @method getPrivates  - Do nothing.
 * @method deselectAll  - Call the method to deselect all genes.
 * @method selectGene   - Determine if the gene is a reference, get its orthologs and call the appropriate method to select the genes.
 * @method deselectGene - Determine if the gene is a reference, get its orthologs and call the appropriate method to deselect the genes.
 */
var eventLinker = (function () {

  return {
    init: function () {
    },

    getPrivates: function () {
    },

    deselectAll: function () {
      alignmentView.deselectAll();
      alignmentTable.deselectAll();
    },

    selectGene: function (geneId, shiftPressed) {
      let isReference = alignmentData.getIfReference(geneId);
      let orthologsIds = alignmentData.getOrthologsIds(geneId, isReference, []);
      if (!shiftPressed) {
        alignmentView.deselectAll();
        alignmentTable.deselectAll();
      };
      alignmentView.selectNode(geneId, orthologsIds);
      alignmentTable.selectRow(geneId, orthologsIds);
    },

    deselectGene: function (geneId, referenceSelectedIds) {
      let isReference = alignmentData.getIfReference(geneId);
      let orthologsIds = [];
      if (isReference) {
        orthologsIds = alignmentData.getOrthologsIds(geneId, isReference, referenceSelectedIds);
      };
      alignmentView.deselectNode(geneId, orthologsIds);
      alignmentTable.deselectRow(geneId, orthologsIds);
    },

    uncolorAll: function () {
      colorAnnotation.uncolorAll();
      alignmentView.uncolorAll();
    },

    colorAnnotation: function (annotationId, linkedGenes, color) {
      colorAnnotation.colorAnnotation(annotationId, color);
      alignmentView.colorNodes(linkedGenes, color);
    },

    uncolorAnnotation: function (annotationId, linkedGenes, color) {
      colorAnnotation.uncolorAnnotation(annotationId, color);
      alignmentView.uncolorNodes(linkedGenes, color);
    }
  };
})();

