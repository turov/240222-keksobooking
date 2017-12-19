'use strict';

(function () {
  var FILTER_MIN_PRICE = 10000;
  var FILTER_MAX_PRICE = 50000;

  var filters = document.querySelector('.map__filters');
  var filterType = filters.querySelector('.housing__type');
  var filterPrice = filters.querySelector('.housing__price');
  var filterRooms = filters.querySelector('.housing__rooms');
  var filterGuests = filters.querySelector('.housing__guests');
  var filterFeaturesCollection = filters.querySelectorAll('.features input[type="checkbox"]');
  var filterFeaturesArray = Array.prototype.slice.call(filterFeaturesCollection, 0);
  var filteredPins;

  var hideAllPins = function (pins) {
    pins.forEach(function (pin) {
      pin.classList.add('hidden');
    });
  };

  var showFilteredPins = function (pins) {
    pins.forEach(function (pin) {
      pin.classList.remove('hidden');
    });
  };

  var filterByProperty = function (filterSelect, property) {
    return function (item) {
      var id = item.id;

      if (filterSelect.value === 'any' || filterSelect.value === (window.map.rentData[id].offer[property] + '')) {
        return true;
      } else {
        return false;
      }
    };
  };

  var filterByPrice = function (filterSelect) {
    return function (item) {
      var id = item.id;
      var adPrice = window.map.rentData[id].offer.price + '';

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
    var id = item.id;
    var features = [];

    filterFeaturesArray.forEach(function (_item, i) {
      if (filterFeaturesArray[i].checked) {
        features.push(filterFeaturesArray[i].value);
      }
    });

    return features.every(function (feature) {
      return window.map.rentData[id].offer.features.indexOf(feature) !== -1;
    });
  };

  var updateFilteredPins = function () {
    filteredPins = window.map.pins;

    console.log(filteredPins); //
    console.log(Array.from(filteredPins)); //
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
