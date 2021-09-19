var documentation = (function () {
    const helpButton = document.getElementById('help-button');
    const docFade = document.getElementById('documentation-fade');
    const doc = document.getElementById('documentation-article');
    let isVisible = null;

    return {
        init: function () {
            let self = this;

            if (location.hash === '#documentation') {
                this.show();
            }

            helpButton.addEventListener('click', (e) => {
                if (isVisible) {
                    self.hide();
                } else {
                    self.show();
                }
            });

            window.addEventListener('hashchange', () => {
                if (location.hash === '#documentation') {
                    self.show();
                } else if (location.hash === '' || location.hash === '#') {
                    self.hide();
                }
            });

            window.addEventListener('keydown', (e) => {
                if (isVisible) {
                    if (e.code === 'Escape') {
                        this.hide();
                    }
                }
            });
        },

        show: function () {
            docFade.classList.remove('hide');
            doc.classList.remove('hide');
            helpButton.innerHTML = 'X';
            location.hash = '#documentation';
            isVisible = true;
        },

        hide: function () {
            docFade.classList.add('hide');
            doc.classList.add('hide');
            helpButton.innerHTML = '?';
            location.hash = '';
            isVisible = false;
        }

    }
})();
