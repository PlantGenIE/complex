/**
 * Populate the network selection tool.
 *
 * @param {array} data - Network data.
 * @param {string} element - ID of element where the buttons should go.
 * @param {string} targetElement - ID of element where selected buttons should go.
 */
export function populateNetworkSelect(data, element, targetElement) {
  var container = document.querySelector(element);
  var targetContainer = document.querySelector(targetElement);

  var moveToken = function(token, target) {
    var selecting = target == targetContainer;
    if (selecting) {
      token.classList.add('selected');
    } else {
      token.classList.remove('selected');
    }
    var unselectedTokens = document.querySelectorAll('.network-token:not(.selected)');
    var tokenSpecies = token.getAttribute('data-species');
    [].forEach.call(unselectedTokens, function(t) {
      if (t.getAttribute('data-species') === tokenSpecies) {
        if (selecting) {
          t.draggable = false;
          t.classList.add('inactive');
        } else {
          t.draggable = true;
          t.classList.remove('inactive');
        }
      }
    });
    target.appendChild(token);
    window.localStorage
      .setItem('selectedNetworks', JSON.stringify(getSelectedNetworks()));
  };

  var handleDragOver = function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
  };

  var handleDrop = function(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    var token = document.getElementById(e.dataTransfer.getData('text'));
    var tokenSpecies = token.getAttribute('data-species');
    if (token.parentNode != this) {
      moveToken(token, this);
    }
    return false;
  };

  var handleTokenDrop = function(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    var token = document.getElementById(e.dataTransfer.getData('text'));
    if (token.parentNode == this.parentNode && this != token) {
      // Got this from https://stackoverflow.com/a/11974430/885443
      var insertionPoint, elem = this;

      do {
        elem = elem.nextSibling;
      } while (elem && elem !== token);

      insertionPoint = elem ? this : this.nextSibling;
      this.parentNode.insertBefore(token, insertionPoint);
    } else if (token.parentNode != this.parentNode) {
      moveToken(token, this.parentNode);
    }
    return false;
  };

  [].forEach.call(data, function(val) {
    var token = document.createElement('div');
    token.setAttribute('data-species', val.shortname);
    token.setAttribute('data-network', val.id);
    token.setAttribute('draggable', true);
    token.classList.add('network-token');
    token.id = `network${val.id}-token`;
    token.appendChild(document.createTextNode(val.name));

    token.addEventListener('dragstart', function(e) {
      this.classList.add('inactive');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', this.id);
    }, false);

    token.addEventListener('dragend', function() {
      targetContainer.classList.remove('token-over');
      this.classList.remove('inactive');
    }, false);

    token.addEventListener('dragover', handleDragOver, false);
    token.addEventListener('drop', handleTokenDrop, false);
    container.append(token);
  });

  targetContainer.addEventListener('dragover', handleDragOver, false);
  container.addEventListener('dragover', handleDragOver, false);
  targetContainer.addEventListener('drop', handleDrop, false);
  container.addEventListener('drop', handleDrop, false);
}

/**
 * Return the selected species
 *
 * @returns {array} An array of the unique species currently selected.
 */
function getSelectedSpecies() {
  var tokens = document.querySelectorAll('.network-token.selected');
  var selectedSpecies = []
  for (let i = 0; i < tokens.length; ++i) {
    let s = tokens[i].getAttribute('data-species');
    if (selectedSpecies.indexOf(s) === -1) {
      selectedSpecies.push(s);
    }
  }
  return selectedSpecies;
}


/**
 * Return the selected networks
 *
 * @returns {array} An array of network IDs.
 */
export function getSelectedNetworks() {
  var selectedTokens = document.querySelectorAll('.network-token.selected');
  var networkIds = [];
  [].forEach.call(selectedTokens, function(x) {
    networkIds.push(x.getAttribute('data-network'));
  });
  return networkIds;
}

/**
 * Return the currently active network
 *
 * @returns {string} ID of the active network if there is an active network, otherwise null.
 */
export function getActiveNetwork() {
  var activeToken = document.querySelector('.network-token.selected:first-child');
  if (activeToken) {
    return activeToken.getAttribute('data-network');
  }
  return null;
}

/**
 * Get the currently active species
 *
 * @returns {string} The species of the currently active network if there is an active network, otherwise null.
 */
export function getActiveSpecies() {
  var activeToken = document.querySelector('.network-token.selected:first-child');
  if (activeToken) {
    return activeToken.getAttribute('data-species');
  }
  return null;
}

