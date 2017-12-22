'use strict';

(function () {

  var FILTER_MIN_PRICE = 10000;
  var FILTER_MAX_PRICE = 50000;
  var MAX_NUMBER_OF_PINS = 5;

  var filters = document.querySelector('.map__filters');
  var filterType = filters.querySelector('#housing-type');
  var filterPrice = filters.querySelector('#housing-price');
  var filterRooms = filters.querySelector('#housing-rooms');
  var filterGuests = filters.querySelector('#housing-guests');
  var filterFeaturesCollection = filters.querySelectorAll('.features input[type="checkbox"]');
  var filterFeatures = Array.prototype.slice.call(filterFeaturesCollection, 0);
  var filteredPins;

  var hideAllPins = function (pins) {
    pins.forEach(function (pin) {
      pin.classList.add('hidden');
    });
  };

  var showFilteredPins = function () {
    var iterationCount = Math.min(MAX_NUMBER_OF_PINS, filteredPins.length);
    for (var i = 0; i < iterationCount; i++) {
      filteredPins[i].classList.remove('hidden');
    }
  };

  var filterByProperty = function (filterSelect, property) {
    return function (item) {
      var id = item.dataset.id;
      return filterSelect.value === 'any' || filterSelect.value === (window.rentInformations[id].offer[property] + '');
    };
  };

  var filterByPrice = function (filterSelect) {
    return function (item) {
      var id = item.dataset.id;
      var adPrice = window.rentInformations[id].offer.price + '';

      switch (filterSelect.value) {
        case 'any':
          return true;
        case 'middle':
          return adPrice >= FILTER_MIN_PRICE && adPrice <= FILTER_MAX_PRICE;
        case 'low':
          return adPrice < FILTER_MIN_PRICE;
        case 'high':
          return adPrice > FILTER_MAX_PRICE;
      }

      return false;
    };
  };

  var filterByFeatures = function (item) {
    var id = item.dataset.id;
    var features = [];

    filterFeatures.forEach(function (_item, i) {
      if (_item.checked) {
        features.push(_item.value);
      }
    });

    /*
        filterFeatures.forEach(function (_item, i) {
      if (filterFeatures[i].checked) {
        features.push(filterFeatures[i].value);
      }
    });
     */

    return features.every(function (feature) {
      return window.rentInformations[id].offer.features.indexOf(feature) !== -1;
    });
  };

  var updateFilteredPins = function () {
    filteredPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    filteredPins = Array.from(filteredPins);

    // При изменении формы с фильтрами изначально скрываем все пины
    hideAllPins(filteredPins);

    // И скрываем блок с объявлением
    window.card.hide();

    // Фильтруем массив с пинами, пин объявления, которое не подходит, не попадает в filteredPins
    filteredPins = filteredPins.filter(filterByProperty(filterType, 'type'));
    filteredPins = filteredPins.filter(filterByPrice(filterPrice));
    filteredPins = filteredPins.filter(filterByProperty(filterRooms, 'rooms'));
    filteredPins = filteredPins.filter(filterByProperty(filterGuests, 'guests'));
    filteredPins = filteredPins.filter(filterByFeatures);

    // После всех фильтраций показываем пины, которые соответствуют фильтрам
    showFilteredPins(filteredPins);
  };

  var onFiltersChange = function () {
    window.debounce(updateFilteredPins);
  };

  filters.addEventListener('change', onFiltersChange);

})();
