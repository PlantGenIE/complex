/**
 * @module networksList - Manage the networks buttons.
 *
 * @constant availableNetworksContainer - Pointer to the available networks HTML node.
 * @constant selectedNetworksContainer  - Pointer th the selected networks HTML node.
 *
 * @property {array}  availableNetworks - List of the available networks.
 * @property {array}  selectedNetworks  - List of the selected networks.
 * @property {string} referenceNetwork  - Store the selected reference network.
 * @property {object} draggedToken      - Data of the currently dragged token.
 *
 * @function createTokens        - Populate the available networks container and add event listeners on the tokens. 
 * @function handleDragStart     - Allow the token to move and store the data of the dragged token.
 * @function handleDragOver      - Allow the tolen to be dropped.
 * @function handleSelectionDrop - Move the token from one container to another.
 * @function handleReorderDrop   - Move the token before the token it is dropped on inside the selected networks container.
 * @function handleDragEnd       - Delete the stored data of the dropped token.
 * @function checkNetworksState  - Check if there is a new selected or reference network, and if so, signal the change to the alignTrigger module.
 *
 * @method init          - Populate the buttons and add the event listeners on the containers.
 * @method getPrivates   - Return `availableNetworks`, `selectedNetworks` and `referenceNetwork`.
 * @method fetchDatabase - Get the available networks from the database.
 */
var networksList = (function () {
  const networkItemsContainer = document.getElementById('network-selection-wrapper');
  const networkItemTemplate = document.getElementById('network-selection-template');
  const networkReferenceBorder = document.getElementById('network-reference-border');
  const networkReferenceLine = document.getElementById('network-reference-line');
  var availableNetworks = [];
  var selectedNetworks = [];
  var referenceNetwork;

  function createItems(itemsData) {
    itemsData.forEach(itemData => {
      let item = document.importNode(networkItemTemplate, true).content;

      let token = item.querySelector('.network-selection-token');
      token.textContent = itemData.name;
      token.value = itemData.id;
      token.setAttribute('data-species', itemData.shortname);
      token.addEventListener('click', handleSelectionClick, false);

      let radio = item.querySelector('.network-selection-radio');
      radio.value = itemData.id
      radio.setAttribute('data-species', itemData.shortname);
      radio.addEventListener('click', handleReferenceClick, false);

      networkItemsContainer.appendChild(item);
      availableNetworks.push(itemData.id);
    });
  }

  function handleSelectionClick(e) {
    let token = e.target;
    let tokenId = e.target.value;
    
    if (selectedNetworks.indexOf(tokenId) === -1) {
      token.classList.add('selected-token');
      selectedNetworks.push(tokenId);
    } else {
      if (tokenId !== referenceNetwork) {
        token.classList.remove('selected-token');
        selectedNetworks.splice(selectedNetworks.indexOf(tokenId), 1);
      }
    }

    alignTrigger.setNetworksValues(referenceNetwork, selectedNetworks);
  }

  function handleReferenceClick(e) {
    let radio = e.target;
    let radioValue = e.target.value;
    let relatedToken = radio.previousSibling;
    let oldReferenceToken = networkItemsContainer.querySelector(`.network-selection-token[value="${referenceNetwork}"]`);
    referenceNetwork = radioValue;

    networkReferenceBorder.style.top = `${relatedToken.offsetTop - 5}px`;
    networkReferenceBorder.style.left = `${relatedToken.offsetLeft - 5}px`;
    networkReferenceBorder.style.height = `${relatedToken.offsetHeight}px`;
    networkReferenceBorder.style.width = `${relatedToken.offsetWidth}px`;
    networkReferenceLine.style.left = `${radio.offsetLeft - 2 + radio.offsetWidth / 2}px`;
    networkReferenceLine.style.top = `${relatedToken.offsetTop + relatedToken.offsetHeight}px`;
    networkReferenceLine.style.height = `${radio.offsetTop - networkReferenceLine.offsetTop}px`;

    relatedToken.click();
    if (oldReferenceToken) { oldReferenceToken.click(); }
    alignTrigger.setNetworksValues(referenceNetwork, selectedNetworks);
    genesLists.updateDisplay(radio.getAttribute('data-species'));
  }

  return {
    init: function () {
      return $.ajax({
        url: 'service/metadata.php',
        type: 'POST',
        data: {method: 'get_networks'},
        dataType: 'JSON',
        success: function (data) {
          createItems(data);
        }
      });
    },

    selectDefault: function() {
      networkItemsContainer.querySelector('.network-selection-radio').click();
    },

    getPrivates: function () {
      return {
        availableNetworks: availableNetworks,
        selectedNetworks: selectedNetworks,
        referenceNetwork: referenceNetwork
      };
    },
  };
})();

