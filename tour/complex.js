/* ============ */
/* POPGENIE HELP */
/* ============ */


var tour = {
  id: "popgenie-help",
  showPrevButton: true,
  steps: [
    {
      title: "ConGenIE GeneList",
      content: "Click here to add some Spruce genes.",
      target: "os_image",
	   xOffset: 06,
	  placement: "left",
    },
    {
      title: "PopGenIE GeneList",
      content: "Click here to add some Poplar genes.",
      target: "pt_image",
	   xOffset: 06,
	  placement: "left",
    },{
      title: "AtGenIE GeneList",
      content: "Click here to add some Arabidopsis genes.",
      target: "at_image",
	   xOffset: 06,
	  placement: "left",
    },{
      target: "sink1",
      placement:"top",
      title: "Input genes",
      content: "sp1i"
    },{
      target: "sink2",
      placement:"top",
      title: "Input genes",
      content: "sp2i"
    },{
      target: "sp_1",
      placement:"top",
	   xOffset: 140,
      title: "Change First Network",
      content: "We can change the first netwrok by selecting different species."
    },
	{
      target: "sp_2",
      placement:"top",
	   xOffset: 140,
      title: "Change Second Network",
      content: "We can change the second netwrok by selecting different species."
    },
	{
      target: "th1-slider",
      placement:"top",
      title: "Co-expression",
      content: "We can select the desired co-expression threshold by changing this slider."
    },{
      target: "coexpressiontrclickbtn",
      placement:"top",
      title: "Toggle Co-expression",
      content: "Click here to show/hide co-expression slider."
    },{
      target: "align_to_species_button",
      placement:"top",
	   xOffset: 240,
      title: "Aligning Species",
      content: "align2"
    },
	{
      target: "compare_with_species_button",
      placement:"top",
	   xOffset: 240,
      title: "Compare Species",
      content: "compare2"
    },
	{
      target: "newtrok_mode",
      placement:"top",
	  xOffset: 40,
      title: "Progress overview",
      content: "Overview of the alignment or comparison processes and SQL query Execution time."
    },
	{
      target: "cytoscapeweb1",
      placement:"top",
	  xOffset: 240,
      title: "First Network",
      content: "firstn"
    },
	{
      target: "cytoscapeweb2",
      placement:"top",
	  xOffset: 240,
      title: "Second Network",
      content: "secondn"
    },{
      target: "network_info",
      placement:"top",
	  xOffset: 240,
      title: "Networks overview",
      content: "infomrtaion"
    },
	//buttons
	{
      target: "replacebtn",
      placement:"top",
      title: "Replace Genes",
      content: "replaceb"
    },
	{
      target: "sendbtn",
      placement:"top",
      title: "Send Genes",
      content: "sendb"
    },
	{
      target: "selectallbtn",
      placement:"top",
      title: "Select All",
      content: "Click here to select all genes from above two networks."
    },
	{
      target: "deselectallbtn",
      placement:"top",
      title: "Deselect All",
      content: "Click here to deselect all genes from above two networks."
    },
	{
      target: "alignselectedbtn",
      placement:"top",
      title: "Align Selected",
      content: "Click here to align the selected genes."
    },
	{
      target: "compareselectedbtn",
      placement:"left",
	   yOffset: -16,
      title: "Compare Selected",
      content: "Click here to compare the  selected genes."
    },
	{
      target: "firsttable",
      placement:"top",
	   xOffset: 240,
      title: "First Table",
      content: "firsttableg"
    },
	{
      target: "secondtable",
      placement:"top",
	   xOffset: 240,
      title: "Second Table",
      content: "secondtableg"
    },
	
	{
      target: "contact",
      placement:"top",
	   xOffset: 240,
	   yOffset: 16,
      title: "Contact us and site views ",
      content: "We would like to hear your question, feedback or suggestions."
    }
	


	/*{ 
		title: "Search few genes",
      content: "Please type in few genes or use click me to add demo data button",
		target: "main",
      placement: "top",
	  xOffset:500,
	   yOffset:60,
	   multipage: false,
	   onPrev: function() {
        window.location = "http://v3.popgenie.org/flashbulktools"
      },

	},
	
	{
		title: "Add genes into gene list",
      content: "Click here to add genes into your gene list",
		target: "main",
      placement: "right",

	   yOffset:160,
	},*/
	
	
	 
    

  ]
  
},
/* ========== */
/* PopGenIE global */
/* ========== */
addClickListener = function(el, fn) {
	
  if (el.addEventListener) {
    el.addEventListener('click', fn, false);
  }
  else {
    el.attachEvent('onclick', fn);
  }
},

startBtnEl = document.getElementById("startTourBtn");

if (startBtnEl) {
  addClickListener(startBtnEl, function() {
	if (!hopscotch.isActive) {
      hopscotch.startTour(tour);
    }
  });
}
else {
	console.log(hopscotch.getState() );
	
	 if (hopscotch.getState() === "popgenie-help:1") {
		hopscotch.startTour(tour);
	  }
	  if (hopscotch.getState() === "popgenie-help:2") {
		hopscotch.startTour(tour);
	  }
	  if (hopscotch.getState() === "popgenie-help:3") {
		hopscotch.startTour(tour);
	  }
}

