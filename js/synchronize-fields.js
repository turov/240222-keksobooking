'use strict';
(function () {

  window.synchronizeFields = function (firstField, secondField, firstArray, secondArray, syncValues) {
    var value = firstField.value;
    var index = firstArray.indexOf(value);
    syncValues(secondField, secondArray[index]);
  };
})();

