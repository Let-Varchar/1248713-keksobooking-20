"use strict";

var COUNT_OFFERS = 8;
var LOCATION_X_MIN = 0;
var LOCATION_X_MAX = 1200;
var LOCATION_Y_MIN = 0;
var LOCATION_Y_MAX = 630;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var BOOKING_PRICE_MIN = 1;
var BOOKING_PRICE_MAX = 100000;
var BOOKING_ROOMS_MIN = 1;
var BOOKING_ROOMS_MAX = 100;
var BOOKING_GUESTS_MIN = 1;
var BOOKING_GUESTS_MAX = 8;
var BOOKING_TYPES = ["palace", "flat", "house", "bungalo"];
var BOOKING_CHECKINS = ["12:00", "13:00", "14:00"];
var BOOKING_CHECKOUTS = ["12:00", "13:00", "14:00"];
var BOOKING_FEATURES = [
  "wi-fi",
  "dishwasher",
  "parking",
  "washer",
  "elevator",
  "conditioner",
];
var BOOKING_PHOTOS = [
  "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel3.jpg",
];
var BOOKING_TITLE = "Заголовок предложения ";
var BOOKING_DESCRIPTION = "Описание предложения ";
var map = document.querySelector(".map");
var mainPin = document.querySelector(".map__pins");
var pinTemplate = document
  .querySelector("#pin")
  .content.querySelector(".map__pin");

//  делаем поля и карту неактивными
var addForm = document.querySelector(".ad-form");
var mainButton = document.querySelector(".map__pin--main");
var mapFilters = document.querySelector(".map__filters");
mapFilters.classList.add("ad-form--disabled");
addForm.classList.add("ad-form--disabled");
var fieldsets = document.querySelectorAll("fieldset");

for (var i = 0; i < fieldsets.length; i++) {
  fieldsets[i].setAttribute("disabled", "true");
}

//  функция, для активации полей и карты

//временно убираем класс .map--faded у карты
// map.classList.remove("map--faded");

//получаем случайное число
var getRandomNumber = function (min, max) {
  var random = Math.floor(min + Math.random() * (max - min));
  return random;
};

//получаем случайный элемент массива
var getRandomValue = function (array) {
  return array[getRandomNumber(0, array.length)];
};

//  создаем объект с предложением
var getBooking = function (value) {
  return {
    author: {
      avatar: "img/avatars/user0" + value + ".png",
    },
    offer: {
      title: BOOKING_TITLE + value,
      address:
        getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX) +
        ", " +
        getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX),
      price: getRandomNumber(BOOKING_PRICE_MIN, BOOKING_PRICE_MAX),
      type: getRandomValue(BOOKING_TYPES),
      rooms: getRandomNumber(BOOKING_ROOMS_MIN, BOOKING_ROOMS_MAX),
      guests: getRandomNumber(BOOKING_GUESTS_MIN, BOOKING_GUESTS_MAX),
      checkin: getRandomValue(BOOKING_CHECKINS),
      checkout: getRandomValue(BOOKING_CHECKOUTS),
      features: getRandomValue(BOOKING_FEATURES),
      description: BOOKING_DESCRIPTION + value,
      photos: getRandomValue(BOOKING_PHOTOS),
    },
    location: {
      x: getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX),
      y: getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX),
    },
  };
};

//  генерируем из объекта массив объектов
var getBookings = function () {
  var bookings = [];

  for (var i = 1; i <= COUNT_OFFERS; i++) {
    bookings.push(getBooking(i));
  }

  return bookings;
};

var pinTemplate = document
  .querySelector("#pin")
  .content.querySelector(".map__pin");

var bookingArray = getBookings();
for (var i = 0; i < bookingArray.length; i++) {
  var pinElem = pinTemplate.cloneNode(true);
  var locX = bookingArray[i].location.x;
  var locY = bookingArray[i].location.y;
  pinElem.style.left = toString(locX) + "px";

  map.appendChild(pinElem);
}

//  первоночальный код
// var createPin = function (getBookings) {
//   var pinElem = pinTemplate.cloneNode(true);
//   var pinImg = pinElem.querySelector("img");
//   var moveX = PIN_WIDTH / 2;
//   var moveY = PIN_HEIGHT;

//   pinElem.style.left = getBookings().location.x - moveX + "px";
//   pinElem.style.top = getBookings().location.y - moveY + "px";
//   pinImg.src = getBookings().author.avatar;
//   pinImg.alt = getBookings().offer.title;

//   return pinElem;
// };

// var renderPinList = function (createPin) {
//   var fragment = document.createDocumentFragment();

//   for (var i = 0; i < getBookings.length; i++) {
//     fragment.appendChild(createPin(getBookings[i]));
//   }

//   map.appendChild(fragment);
// };

// renderPinList(getBookings);

var onActivePage = function () {
  map.classList.remove("map--faded");
  addForm.classList.remove("ad-form--disabled");
  mapFilters.classList.remove("ad-form--disabled");
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].removeAttribute("disabled");
  }
};

//  при нажатии кнопки мыши карта и поля активируются

mainButton.addEventListener("mousedown", function (evt) {
  if (evt.button === 0) {
    onActivePage();
  } else {
    alert("Нужно нажать левую кнопку мыши");
  }
});

//  активация полей и карты при нажатии клавиши Enter
document.addEventListener("keydown", function (evt) {
  if (evt.key === "Enter") {
    evt.preventDefault();
    onActivePage();
  }
});

var ROOMS_AND_GUESTS = {
  any: ["any"],
  1: ["1", "2"],
  2: ["any", "2"],
  3: ["0", "1", "2"],
};

var ROOMS = document.querySelector("#housing-rooms");
var GUESTS = document.querySelector("#housing-guests").options;

function handleChangeRoom(evt) {
  var selectedRoomValue = evt.target.value;
  var validGuestValues = ROOMS_AND_GUESTS[selectedRoomValue];

  for (var i = 0; i < GUESTS.length; i++) {
    var currentRoomValue = GUESTS[i].value;

    if (validGuestValues.includes(currentRoomValue)) {
      GUESTS[i].removeAttribute("disabled");
      GUESTS[i].setAttribute("selected", "");
    } else {
      GUESTS[i].setAttribute("disabled", "");
      GUESTS[i].removeAttribute("selected");
    }
  }
}

ROOMS.addEventListener("change", handleChangeRoom);
