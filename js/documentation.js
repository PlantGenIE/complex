var documentation = (function () {
    const docFade = document.getElementById('documentation-fade');
    const doc = document.getElementById('documentation-article');
    let isVisible = null;

    return {
        init: function () {
            let self = this;

            if (location.hash === '#documentation') {
                this.show();
            }

            document.getElementById('help-button').addEventListener('click', (e) => {
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
        },

        show: function () {
            docFade.classList.remove('hide');
            doc.classList.remove('hide');
            location.hash = '#documentation';
            isVisible = true;
        },

        hide: function () {
            docFade.classList.add('hide');
            doc.classList.add('hide');
            location.hash = '';
            isVisible = false;
        }

    }
})();
