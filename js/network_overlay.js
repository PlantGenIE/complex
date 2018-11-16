function showOverlay(message) {
  var overlay = document.querySelector('.network-overlay');
  var overlayMessage = document.querySelector('.overlay-message');
  if (overlayMessage.firstChild) {
    overlayMessage.firstChild.remove();
  }
  overlayMessage.appendChild(document.createTextNode(message));
  overlay.style.display = 'block';
}

function hideOverlay() {
  var overlay = document.querySelector('.network-overlay');
  overlay.style.display = 'none';
}
