'use strict';

(function () {
  var pageMap = document.querySelector('.map');
  var form = document.querySelector('.notice__form');
  var mapPinMain = pageMap.querySelector('.map__pin--main');
  var rentData = window.generatedAds;

  var fillMap = function () {
    var mapPins = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < rentData.length; i++) {
      fragment.appendChild(window.pin.create(rentData[i]));
    }
    mapPins.appendChild(fragment);
  };

  var closeAd = function () {
    window.pin.deactivate();
    window.card.hide();
  };

  var removeCloseListeners = function () {
    document.removeEventListener('keydown', onCloseEsc);
    window.card.closeBtn.removeEventListener('click', onCloseClick);
  };

  var onMainPinMouseup = function () {
    pageMap.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');
    window.form.enableFields();
    fillMap();
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var j = 0; j < pins.length; j++) {
      pins[j].addEventListener('click', onPinClick);
    }
    mapPinMain.removeEventListener('mouseup', onMainPinMouseup);
  };

  var onCloseEsc = function (evt) { // Функция навешивается на document и закрывает попап при нажатии на escape
    if (evt.keyCode === window.utils.KEY_ESCAPE) {
      closeAd();
      removeCloseListeners();
    }
  };

  var onCloseClick = function () { // функция, срабатывающая при нажатии на кнопку закрытия (клик или клавиша Enter)
    closeAd();
    removeCloseListeners();
  };

  var onPinClick = function (event) { // кнопка открытия попапа
    var currentPin = event.currentTarget; // пин, по которому кликнули
    window.pin.activate(currentPin);
    var id = currentPin.dataset.id; // заполняем и выводим попап.
    var currentPopup = window.card.create(rentData[id]);
    window.card.show(currentPopup, pageMap);
    window.card.closeBtn = currentPopup.querySelector('.popup__close');// находим кнопку закрытия
    window.card.closeBtn.addEventListener('click', onCloseClick);
    document.addEventListener('keydown', onCloseEsc);
  };

  mapPinMain.addEventListener('mouseup', onMainPinMouseup);

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      window.form.inputAddress.value = (mapPinMain.offsetTop - shift.y) + ', ' + (mapPinMain.offsetLeft - shift.x);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      pageMap.removeEventListener('mousemove', onMouseMove);
      pageMap.removeEventListener('mouseup', onMouseUp);
    };

    pageMap.addEventListener('mousemove', onMouseMove);
    pageMap.addEventListener('mouseup', onMouseUp);

  });
})();

