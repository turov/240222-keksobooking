'use strict';

(function () {
  var escKey = 27;
  var pageMap = document.querySelector('.map');
  var form = document.querySelector('.notice__form');
  var fields = form.querySelectorAll('fieldset');
  var mapPinMain = pageMap.querySelector('.map__pin--main');
  var previousPopup = null;
  var previousPin = null;
  var rentData = window.generatedAds;

  var fillMap = function () {
    var mapPins = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < rentData.length; i++) {
      fragment.appendChild(window.pin.createPin(rentData[i]));
    }
    mapPins.appendChild(fragment);
  };
  var showPopup = function (popup) {
    if (previousPopup) {
      pageMap.removeChild(previousPopup);
    }
    previousPopup = popup;
    pageMap.appendChild(popup);
  };

  var disableFields = function () {
    for (var i = 0; i < fields.length; i++) {
      fields[i].disabled = true;
    }
  };

  var onMainPinMouseup = function () {
    pageMap.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');
    for (var t = 0; t < fields.length; t++) {
      fields[t].disabled = false;
    }

    fillMap();

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var j = 0; j < pins.length; j++) {
      pins[j].addEventListener('click', onPinClick);
    }
    mapPinMain.removeEventListener('mouseup', onMainPinMouseup);
  };

  var onCloseEsc = function (evt) { // Функция навешивается на document и закрывает попап при нажатии на escape
    if (evt.keyCode === escKey) {
      previousPopup.classList.add('hidden');
      previousPin.classList.remove('map__pin--active');
    }
    document.removeEventListener('keydown', onCloseEsc);
  };

  var onCloseClick = function (evt) { // функция, срабатывающая при нажатии на кнопку закрытия (клик или клавиша Enter)
    previousPopup.classList.add('hidden');
    previousPin.classList.remove('map__pin--active');
    evt.currentTarget.removeEventListener('click', onCloseClick);
  };

  var onPinClick = function (event) { // кнопка открытия попапа
    var currentPin = event.currentTarget; // пин, по которому кликнули
    currentPin.classList.add('map__pin--active'); // вешаем на него класс active
    if (previousPin) {
      previousPin.classList.remove('map__pin--active'); // если до этого нажимали на пин, то удаляем из него класс active
    }
    previousPin = currentPin; // записываем наш текущий пин в предыдущий.
    var id = currentPin.dataset.id; // заполняем и выводим попап.
    var currentPopup = window.card.createPopup(rentData[id]);
    showPopup(currentPopup);
    var popupClose = currentPopup.querySelector('.popup__close');// находим кнопку закрытия
    popupClose.addEventListener('click', onCloseClick);
    document.addEventListener('keydown', onCloseEsc);
  };

  mapPinMain.addEventListener('mouseup', onMainPinMouseup);
  disableFields();
})();

