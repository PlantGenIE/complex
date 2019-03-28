// Run when webpage is loaded
window.onload = function () {

  // Define input error message style
  complexmessage.options = {
    closeButton: false,
    debug: false,
    positionClass: "toast-bottom-right",
    onclick: null,
    showDuration: "100",
    hideDuration: "100",
    timeOut: "8000",
    extendedTimeOut: "1000",
    showEasing: "linear",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
  };

  // Hide webpage loader
  $('#loader').hide();

  // Initialize input manager modules
  networksList.init();
  genesLists.init();
  alignTrigger.init();

  // Initialize display modules
  alignmentData.init();
  alignmentView.init();
  alignmentTable.init();
  enrichment.init();
  eventLinker.init();

  // Add the hide/show accordion event
  $('.accordion .accordion-head').addClass('opened').click(function() {
    $(this).next().toggle();
    $(this).toggleClass('opened');
    $(this).toggleClass('collapsed');
    alignmentView.getPrivates().cy.resize();
    return false;
  });

  // Hide scripts loader
  $('#prebox').delay(500).fadeOut();
};

