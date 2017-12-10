'use strict';

(function () {
  var previousPopup = null;

  var show = function (popup, container) {
    if (previousPopup) {
      container.removeChild(previousPopup);
    }
    previousPopup = popup;
    container.appendChild(popup);
  };

  var hide = function () {
    previousPopup.classList.add('hidden');
  };

  window.showCard = {
    show: show,
    hide: hide
  };
})();
