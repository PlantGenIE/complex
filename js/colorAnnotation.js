var colorAnnotation = null;

config.ready().then(function() {
  if (!config.get('gofer2').enabled) {
    return;
  }

  colorAnnotation = (function () {
    const annotationContainer = document.getElementById('annotation-content');
    const annotationToggler = document.getElementById('annotation-toggler');
    const annotationListContainer = document.getElementById('annotations-list');
    const annotationTemplate = document.getElementById('annotation-template');
    const deselectButton = document.getElementById('deselect-annotations');
    const searchBar = document.getElementById('search-annotation');
    const overlayContainer = document.getElementById('annotation-overlay');
    const overlayMessage = overlayContainer.querySelector('.overlay-message');
    var activeTab;
    var genesList;
    var annotationsData = {};
    var annotationsColor = [
          { color: 'annotation-color-1', annotation: '' },
          { color: 'annotation-color-2', annotation: '' },
          { color: 'annotation-color-3', annotation: '' },
          { color: 'annotation-color-4', annotation: '' },
          { color: 'annotation-color-5', annotation: '' },
          { color: 'annotation-color-6', annotation: '' },
          { color: 'annotation-color-7', annotation: '' },
          { color: 'annotation-color-8', annotation: '' }
        ];

    function showOverlay(message) {
      if (message) overlayMessage.textContent = message;
      overlayContainer.style.display = 'block';
    };

    function hideOverlay() {
      if (overlayMessage.firstChild) overlayMessage.firstChild.remove();
      overlayContainer.style.display = 'none';
    };

    function handleChange(e) {
      if (annotationListContainer.querySelectorAll('input[type="checkbox"]:checked').length > 8) {
        e.target.checked = false;
      } else { 
        let id = e.target.id;
        let annotation = annotationsData[activeTab].find(element => { return element.id === id; });
        let genes = [];
        genesList.forEach(network => {
          genes = genes.concat(annotation[network.name]);
        });

        if (e.target.checked) {
          let color = attributeColor(id);
          eventLinker.colorAnnotation(id, genes, color);
        } else {
          let color = freeColor(id);
          eventLinker.uncolorAnnotation(id, genes, color);
        }
      }
    };

    function handleSearch(e) {
      let search = new RegExp(e.target.value, 'i');
      annotationListContainer.querySelectorAll(`.${activeTab}`).forEach(node => {
        node.classList.remove('no-display');
      });
      annotationsData[activeTab].forEach(annotation => {
        if (!annotation.id.match(search) && !annotation.name.match(search) && !annotation.def.match(search)) {
          document.getElementById(annotation.id).parentNode.classList.add('no-display');
        }
      });
    };

    function processData(data) {
      data.forEach(species => {
        for (annotationType in species) {
          if(species.hasOwnProperty(annotationType) && annotationsData.hasOwnProperty(annotationType)) {
            species[annotationType].forEach(gene => {
              gene.terms.forEach(term => {
                if (!annotationsData[annotationType].find(element => { return element.id == term.id; })) {
                  genesList.forEach(network => { term[network.name] = []; });
                  annotationsData[annotationType].push(term);
                }

                let annotation = annotationsData[annotationType].find(element => { return element.id == term.id; });
                genesList.forEach(network => {
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
      annotationListContainer.querySelectorAll('.annotation-item').forEach(node => { node.remove(); });

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

            annotationListContainer.appendChild(annotationItem);
          });
        }
      }
      annotationListContainer.querySelectorAll('.annotation-item').forEach(item => {
        item.querySelector('input[type="checkbox"]')
            .addEventListener('change', handleChange);
      });

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

    function attributeColor(id) {
      let spot = annotationsColor.find(ele => { return ele.annotation === ''; });
      spot.annotation = id;
      return spot.color;
    };

    function freeColor(id) {
      let spot = annotationsColor.find(ele => { return ele.annotation === id; });
      spot.annotation = '';
      return spot.color;
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

        deselectButton.addEventListener('click', e => {
          eventLinker.uncolorAll();
        });

        searchBar.addEventListener('input', handleSearch);
      },

      getPrivates: function () {
        return {
          annotationsData: annotationsData
        };
      },

      setData: function (data) {
        showOverlay('Fetching annotations...');
        annotationsData = { go: [], pfam: [], kegg: [] };
        annotationsColor.forEach(color => { color.annotation = ''; });
        genesList = data.genesList;
        processData(data.annotationsData);
      },

      uncolorAll: function () {
        annotationsColor.forEach(color => { color.annotation = ''; });
        annotationContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(selectedItem => {
          let colorClass = Array.from(selectedItem.parentNode.classList).find(ele => {
            return ele.includes('annotation-color-');
          });
          selectedItem.parentNode.classList.remove(colorClass);
          selectedItem.checked = false;
        });
      },

      colorAnnotation: function (annotationId, color) {
        let annotation = document.getElementById(annotationId);
        annotation.parentNode.classList.add(color);
      },

      uncolorAnnotation: function (annotationId, color) {
        let annotation = document.getElementById(annotationId);
        annotation.parentNode.classList.remove(color);
      }
    };
  })();
});
