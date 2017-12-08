'use strict';

(function () {
// валидация формы
  var form = document.querySelector('.notice__form');
  var inputAddress = document.querySelector('#address');
  var inputTitle = document.querySelector('#title');
  var inputPrice = document.querySelector('#price');
  var inputType = document.querySelector('#type');
  var inputTimein = document.querySelector('#timein');
  var inputTimeout = document.querySelector('#timeout');
  var inputRooms = document.querySelector('#room_number');
  var inputCapacity = document.querySelector('#capacity');
  form.setAttribute('action', 'https://js.dump.academy/keksobooking');
  form.setAttribute('type', 'multipart/form-data');
  inputAddress.required = true;
  inputAddress.value = 'meh';
  inputAddress.setAttribute('readonly', 'readonly');
  inputTitle.required = true;
  inputTitle.setAttribute('minlength', '30');
  inputTitle.setAttribute('maxlength', '100');
  inputPrice.required = true;
  inputPrice.min = 0;
  inputPrice.max = 1000000;
  inputPrice.value = 1000;
  var syncroniseInputs = function (select1, select2) {
    var select = select1.value;
    select2.value = select;
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
  };

  inputTimein.addEventListener('change', function () {
    syncroniseInputs(inputTimein, inputTimeout);
  });

  inputTimeout.addEventListener('change', function () {
    syncroniseInputs(inputTimeout, inputTimein);
  });

  inputType.addEventListener('change', function () {
    syncronisePrice(inputType, inputPrice);
  });

  syncroniseRooms(inputRooms, inputCapacity);

  inputRooms.addEventListener('change', function () {
    syncroniseRooms(inputRooms, inputCapacity);
  });

  inputTitle.addEventListener('invalid', function () {
    inputTitle.style.border = '1px solid tomato';
    if (inputTitle.validity.tooShort) {
      inputTitle.setCustomValidity('Заголовок объявления должен состоять минимум из 30 символов');
    } else if (inputTitle.validity.tooLong) {
      inputTitle.setCustomValidity('Заголовок объявления не должен превышать 100 символов');
    } else if (inputTitle.validity.valueMissing) {
      inputTitle.setCustomValidity('Пожалуйста, заполните это поле');
    } else {
      inputTitle.setCustomValidity('');
    }
  });

  inputPrice.addEventListener('invalid', function () {
    inputPrice.style.border = '1px solid tomato';
    if (inputPrice.validity.rangeUnderflow) {
      inputPrice.setCustomValidity('Цена меньше допустимой для вашего типа жилья');
    } else if (inputPrice.validity.rangeOverflow) {
      inputPrice.setCustomValidity('Цена не должна превышать 1 000 000 рэ');
    } else if (inputPrice.validity.valueMissing) {
      inputPrice.setCustomValidity('Пожалуйста, заполните это поле');
    } else {
      inputPrice.setCustomValidity('');
    }
  });

  inputTitle.addEventListener('input', function () {
    inputTitle.style.border = 'none';
  });

  inputPrice.addEventListener('input', function () {
    inputPrice.style.border = 'none';
  });

  inputTitle.addEventListener('input', function (evt) { // для ie
    var target = evt.target;
    if (target.value.length < 2) {
      target.setCustomValidity('Заголовок объявления должен состоять минимум из 30 символов');
    } else {
      target.setCustomValidity('');
    }
  });
})();
