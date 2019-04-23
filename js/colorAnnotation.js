var colorAnnotation = (function () {
  const annotationContainer = document.getElementById('annotation-content');
  const annotationToggler = document.getElementById('annotation-toggler');
  const annotationTemplate = document.getElementById('annotation-template');
  const overlayContainer = document.getElementById('annotation-overlay');
  const overlayMessage = overlayContainer.querySelector('.overlay-message');
  var activeTab;
  var annotationsData = { go: [], pfam: [], kegg: [] };
  var databaseEntries = {
    'Arabidopsis thaliana': 'athaliana',
    'Populus tremula': 'potra',
    'Zea mays': ''
  };

  function showOverlay(message) {
    if (message) overlayMessage.textContent = message;
    overlayContainer.style.display = 'block';
  };

  function hideOverlay() {
    if (overlayMessage.firstChild) overlayMessage.firstChild.remove();
    overlayContainer.style.display = 'none';
  };

  function processData(data) {
    data.annotationsData.forEach(species => {
      for (annotationType in species) {
        if(species.hasOwnProperty(annotationType) && annotationsData.hasOwnProperty(annotationType)) {
          species[annotationType].forEach(gene => {
            gene.terms.forEach(term => {
              if (!annotationsData[annotationType].find(element => { return element.id == term.id; })) {
                data.genesList.forEach(network => { term[network.name] = []; });
                annotationsData[annotationType].push(term);
              }

              let annotation = annotationsData[annotationType].find(element => { return element.id == term.id; });
              data.genesList.forEach(network => {
                if (network.species === species.species) {
                  annotation[network.name].push(gene.id);
                }
              });
            });
          });
        }
      }
    });
    displayAnnotation();
  };

  function displayAnnotation() {
    for (annotationType in annotationsData) {
      if (annotationsData.hasOwnProperty(annotationType)) {
        annotationsData[annotationType].forEach(term => {
          let annotationItem = document.importNode(annotationTemplate.content, true);
          annotationItem.querySelector('.annotation-item')
                        .classList
                        .add(annotationType);

          annotationItem.querySelector('input').id = term.id;
          annotationItem.querySelector('label').htmlFor = term.id;

          let annotationName = annotationItem.querySelector('.name')
          annotationName.textContent = term.name;
          annotationName.title = term.def;

          let annotationId = annotationItem.querySelector('.id')
          annotationId.textContent = term.id;
          annotationId.href = constructIdLink(term.id, annotationType);

          annotationContainer.appendChild(annotationItem);
        });
      }
    }
    annotationContainer.querySelector('.annotation-tab[value="go"]').click();
    hideOverlay();
  };

  function constructIdLink(id, annotationType) {
    let link;
    switch (annotationType) {
      case 'go':
        link = `http://amigo.geneontology.org/amigo/term/${id}`;
        break;
      case 'pfam':
        link = `http://pfam.xfam.org/family/${id}`;
        break;
      case 'kegg':
        link = `https://www.genome.jp/dbget-bin/www_bget?ec:${id}`;
        break;
    }

    return link;
  };

  return {
    init: function () {
      annotationToggler.addEventListener('click', e => {
        annotationContainer.classList.toggle('no-display');
      });

      annotationContainer.querySelectorAll('.annotation-tab').forEach(tab => {
        tab.addEventListener('click', e => {
          let annotationType = e.target.value;
          activeTab = annotationType;

          annotationContainer.querySelectorAll(`.${annotationType}.annotation-item`)
                             .forEach(item => { item.classList.remove('no-display'); });
          annotationContainer.querySelectorAll(`:not(.${annotationType}).annotation-item`)
                             .forEach(item => { item.classList.add('no-display'); });
        });
      });
    },

    getPrivates: function () {
      return {
        annotationsData: annotationsData
      };
    },

    setData: function (colorAnnotationData) {
      showOverlay('Fetching annotations...');
      processData(colorAnnotationData);
    }

  };
})();

