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
  var annotationsColor = [
    { color: 'annotation-color-1', annotation: '' },
    { color: 'annotation-color-2', annotation: '' },
    { color: 'annotation-color-3', annotation: '' },
    { color: 'annotation-color-4', annotation: '' },
    { color: 'annotation-color-5', annotation: '' },
    { color: 'annotation-color-6', annotation: '' },
    { color: 'annotation-color-7', annotation: '' },
    { color: 'annotation-color-8', annotation: '' },
  ];

  function attributeColor(id) {
    let spot =  annotationsColor.find(element => { return element.annotation === ''; });
    spot.annotation = id;
    return spot.color;
  };

  function freeColor(id) {
    let spot = annotationsColor.find(element => { return element.annotation === id; })
    spot.annotation = '';
    return spot.color;
  };

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
      alignmentView.selectNode(geneId, isReference, orthologsIds);
      alignmentTable.selectRow(geneId, isReference, orthologsIds);
    },

    deselectGene: function (geneId, referenceSelectedIds) {
      let isReference = alignmentData.getIfReference(geneId);
      let orthologsIds = [];
      if (isReference) {
        orthologsIds = alignmentData.getOrthologsIds(geneId, isReference, referenceSelectedIds);
      };
      alignmentView.deselectNode(geneId, isReference, orthologsIds);
      alignmentTable.deselectRow(geneId, isReference, orthologsIds);
    },

    selectAnnotation: function (annotationId, linkedGenes) {
      let color = attributeColor(annotationId);
      colorAnnotation.colorAnnotation(annotationId, color);
      alignmentView.colorNodes(linkedGenes, color);
    },

    deselectAnnotation: function (annotationId, linkedGenes) {
      let color = freeColor(annotationId);
      colorAnnotation.uncolorAnnotation(annotationId, color);
      alignmentView.uncolorNodes(linkedGenes, color);
    }
  };
})();

