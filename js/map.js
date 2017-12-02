'use strict';

var generateAds = function () {
  var ads = [];
  var homeTypeNames = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ].sort(compareRandom);
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var types = ['квартира', 'дом', 'бунгало'];
  var checkins = ['12:00', '13:00', '14:00'];
  var checkouts = ['12:00', '13:00', '14:00'];
  var profilePhotos = generatePhotos(8).sort(compareRandom);

  var x = null;
  var y = null;

  for (var i = 0; i <= 7; i++) {
    x = getRandomInteger(300, 900);
    y = getRandomInteger(100, 500);
    ads[i] = {
      'id': i,
      'author': {
        'avatar': profilePhotos[i]
      },
      'offer': {
        'title': homeTypeNames[i],
        'address': x + ', ' + y,
        'price': getRandomInteger(1000, 1000000),
        'type': types[getRandomInteger(0, types.length - 1)],
        'rooms': getRandomInteger(1, 5),
        'guests': getRandomInteger(1, 10),
        'checkin': checkins[getRandomInteger(0, checkins.length - 1)],
        'checkout': checkouts[getRandomInteger(0, checkouts.length - 1)],
        'features': getRandomArray(features)
      },
      'location': {
        x: x,
        y: y
      }
    };
  }

  return ads;
};

var getRandomInteger = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

/* Нахождение случайного числа в диапозоне от min до max  */


var compareRandom = function () {
  return Math.random() - 0.5;
};

/* Случайный порядок в массиве */

var getRandomArray = function (array) {
  var copiedArray = array.slice();
  var lengthOfArray = getRandomInteger(1, array.length);
  copiedArray.sort(compareRandom);
  return copiedArray.splice(0, lengthOfArray);
};

var generatePhotos = function (numberOfPhotos) {
  var photos = [];
  for (var i = 1; i <= numberOfPhotos; i++) {
    photos[i] = 'img/avatars/user0' + i + '.png';
  }
  return photos;
};


var rentData = generateAds();

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

var fillMap = function () {
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < rentData.length; i++) {
    fragment.appendChild(createPin(rentData[i]));
  }
  mapPins.appendChild(fragment);
};


var createPopup = function (adsinfo) {
  var template = document.querySelector('template');
  var mapCard = template.content.querySelector('.map__card');
  var element = mapCard.cloneNode(true);
  element.querySelector('.popup__features').textContent = '';
  var getFeaturesList = function (features) {
    var featuresList = element.querySelector('.popup__features');
    var featureItem = document.createDocumentFragment();
    for (var j = 0; j <= features.length - 1; j++) {
      var newElement = document.createElement('li');
      newElement.className = 'feature feature--' + features[j];
      featureItem.appendChild(newElement);
    }
    featuresList.appendChild(featureItem);
  };
  element.querySelector('h3').textContent = adsinfo.offer.title;
  element.querySelector('p small').textContent = adsinfo.offer.address;
  element.querySelector('.popup__price').textContent = adsinfo.offer.price + '₽/ночь';
  element.querySelector('h4').textContent = adsinfo.offer.type;
  element.querySelectorAll('p')[2].textContent = adsinfo.offer.rooms + ' комнаты для ' + adsinfo.offer.guests + ' гостей';
  element.querySelectorAll('p')[3].textContent = 'Заезд после ' + adsinfo.offer.checkin + ', выезд до ' + adsinfo.offer.checkout;
  element.querySelector('.popup__features').textContent = '';
  getFeaturesList(adsinfo.offer.features);
  element.querySelector('img').setAttribute('src', adsinfo.author.avatar);
  return element;
};

// module-4

var escKey = 27;
var pageMap = document.querySelector('.map');
var form = document.querySelector('.notice__form');
var fields = form.querySelectorAll('fieldset');
var mapPinMain = pageMap.querySelector('.map__pin--main');
var previousPopup = null;
var previousPin = null;

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
  evt.currentTarget.removeEventListener('click', onCloseClick)
};

var onPinClick = function (event) { // кнопка открытия попапа
  var currentPin = event.currentTarget; // пин, по которому кликнули
  currentPin.classList.add('map__pin--active'); // вешаем на него класс active
  if (previousPin) {
    previousPin.classList.remove('map__pin--active'); // если до этого нажимали на пин, то удаляем из него класс active
  }
  previousPin = currentPin; // записываем наш текущий пин в предыдущий.
  var id = currentPin.dataset.id;   // заполняем и выводим попап.
  var currentPopup = createPopup(rentData[id]);
  showPopup(currentPopup);
  var popupClose = currentPopup.querySelector('.popup__close');   //находим кнопку закрытия
  popupClose.addEventListener('click', onCloseClick);
  document.addEventListener('keydown', onCloseEsc);
};

mapPinMain.addEventListener('mouseup', onMainPinMouseup);
disableFields();
