'use strict';

function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
} /* Нахождение случайного числа в диапозоне от min до max  */

function compareRandom() {
  return Math.random() - 0.5;
} /* Случайный порядок в массиве */

var homeTypeNames = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var profilePhotos = [];
profilePhotos.length = 8;
for (var i = 0; i <= profilePhotos.length - 1; i++) {
  profilePhotos[i] = 'img/avatars/user' + '0' + (+i + +1) + '.png';
}
var types = ['flat', 'house', 'bungalo'];
var checkins = ['12:00', '13:00', '14:00'];
var checkouts = ['12:00', '13:00', '14:00'];
types.sort(compareRandom);
var xLocations = [];
xLocations.length = 8;
for (var j = 0; j <= xLocations.length - 1; j++) {
  xLocations[j] = randomInteger(300, 900);
}
var yLocations = [];
yLocations.length = 8;
for (var t = 0; t <= yLocations.length - 1; t++) {
  yLocations[t] = randomInteger(100, 500);
}

xLocations [0];
yLocations [0];

var ShuffleProfilePhotos = profilePhotos.slice(0);
var ShuffleHomeTypeNames = homeTypeNames.slice(0);

ShuffleHomeTypeNames.sort(compareRandom);
ShuffleProfilePhotos.sort(compareRandom);
types.sort(compareRandom);
checkins.sort(compareRandom);
checkouts.sort(compareRandom);
console.log(ShuffleHomeTypeNames);
console.log(profilePhotos);
console.log(ShuffleProfilePhotos);

var object0 = {
  'author': {'avatar': ShuffleProfilePhotos[0]
  }, 'offer': {'title': ShuffleHomeTypeNames[0],
    'address': 11,
    'price': randomInteger(1000, 1000000),
    'type': types[0],
    'rooms': randomInteger(1, 5),
    'guests': randomInteger(1, 10),
    'checkin': checkins[0],
    'checkout': checkouts[0],
  }
};

console.log(object0);

/*
var similarObjects = [];
var object1 = {'author':
  {
    'avatar':
    'img/avatars/user' + '0' + randomInteger(1, 8) + '.png'
  },

  'offer':
  {
    'title':
}
};

var randoms = []
randoms.length = 8;
console.log(randoms);

for (var i = 0; i <= randoms.length; i++) {

}

/*
similarObjects[0] = object1;

console.log(similarObjects);


['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png',
  'img/avatars/user04.png', 'img/avatars/user05.png', 'img/avatars/user06.png', 'img/avatars/user07.png',
  'img/avatars/user08.png']


*/

