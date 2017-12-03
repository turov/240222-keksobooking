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
  var currentPopup = createPopup(rentData[id]);
  showPopup(currentPopup);
  var popupClose = currentPopup.querySelector('.popup__close');// находим кнопку закрытия
  popupClose.addEventListener('click', onCloseClick);
  document.addEventListener('keydown', onCloseEsc);
};

mapPinMain.addEventListener('mouseup', onMainPinMouseup);
disableFields();

// валидация формы

var address = document.querySelector('#address');
var title = document.querySelector('#title');
var price = document.querySelector('#price');
var type = document.querySelector('#type');
var timein = document.querySelector('#timein');
var timeout = document.querySelector('#timeout');
var rooms = document.querySelector('#room_number');
var capacity = document.querySelector('#capacity');
form.setAttribute('action', 'https://js.dump.academy/keksobooking');
form.setAttribute('type', 'multipart/form-data');
address.required = true;
address.value = 'meh';
address.setAttribute('readonly', 'readonly');
title.required = true;
title.setAttribute('minlength', '30');
title.setAttribute('maxlength', '100');
price.required = true;
price.min = 0;
price.max = 1000000;
price.value = 1000;

var syncroniseInputs = function (select1, select2) {
  var select = select1.value;
  select2.value = select;
  return select2;
};

var syncronisePrice = function (param1, param2) {
  switch (param1.value) {
    case 'bungalo':
      param2.min = 0;
      break;
    case 'flat':
      param2.min = 1000;
      break;
    case 'house':
      param2.min = 5000;
      break;
    case 'palace':
      param2.min = 10000;
      break;
  }
  return param2;
};

var syncroniseRooms = function (rooms1, capacity1) {
  for (var i = 0; i < capacity1.options.length; i++) {
    capacity1.options[i].disabled = true;
  }
  switch (rooms1.value) {
    case '1':
      capacity1.options[2].disabled = false;
      capacity1.value = 1;
      break;
    case '2':
      capacity1.options[1].disabled = false;
      capacity1.options[2].disabled = false;
      break;
    case '3':
      capacity1.options[0].disabled = false;
      capacity1.options[1].disabled = false;
      capacity1.options[2].disabled = false;
      capacity1.value = 3;
      break;
    case '100':
      capacity1.options[3].disabled = false;
      capacity1.value = 0;
      break;
  }
  return capacity1.options;
};

timein.addEventListener('change', function () {
  syncroniseInputs(timein, timeout);
});

timeout.addEventListener('change', function () {
  syncroniseInputs(timeout, timein);
});

type.addEventListener('change', function () {
  syncronisePrice(type, price);
});

rooms.addEventListener('change', function () {
  syncroniseRooms(rooms, capacity);
});

title.addEventListener('invalid', function () {
  if (title.validity.tooShort) {
    title.setCustomValidity('Заголовок объявления должен состоять минимум из 30 символов');
  } else if (title.validity.tooLong) {
    title.setCustomValidity('Заголовок объявления не должен превышать 100 символов');
  } else if (title.validity.valueMissing) {
    title.setCustomValidity('Обязательное поле');
  } else {
    title.setCustomValidity('');
  }
});

title.addEventListener('input', function (evt) {
  var target = evt.target;
  if (target.value.length < 2) {
    target.setCustomValidity('Заголовок объявления должен состоять минимум из 30 символов');
  } else {
    target.setCustomValidity('');
  }
});
