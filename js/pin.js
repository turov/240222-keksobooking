'use strict';
(function () {

  var createPin = function (info) {
    var template = document.querySelector('template');
    var mapPin = template.content.querySelector('.map__pin');
    var mapElement = mapPin.cloneNode(true);
    mapElement.style.top = info.location.y + 'px';
    mapElement.style.left = info.location.x + 'px';
    mapElement.querySelector('img').src = info.author.avatar;
    mapElement.setAttribute('data-id', info.id);
    return mapElement;
  };
  window.pin = {
    createPin: createPin
  };
})();
