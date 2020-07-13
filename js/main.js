"use strict";

var map = document.querySelector(".map");

var COUNT_OFFERS = 8;
var LOCATION_X_MIN = 0;
var LOCATION_X_MAX = map.clientWidth;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 600;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var BOOKING_PRICE_MIN = 1;
var BOOKING_PRICE_MAX = 100000;
var BOOKING_ROOMS_MIN = 1;
var BOOKING_ROOMS_MAX = 6;
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
var ROOMS_AND_GUESTS = {
  any: ["any"],
  1: ["1", "2"],
  2: ["any", "2"],
  3: ["0", "1", "2"],
};

var BOOKING_TYPES_MAP = {
  palace: "Дворец",
  flat: "Квартира",
  house: "Дом",
  bungalo: "Бунгало",
};
var PIN_ELEM_CLASS = "map__pin";

var fieldsets = document.querySelectorAll("fieldset");
var rooms = document.querySelector("#housing-rooms");
var guests = document.querySelector("#housing-guests").options;
var pinTemplate = document
  .querySelector("#pin")
  .content.querySelector(".map__pin");

//  делаем поля и карту неактивными
var addForm = document.querySelector(".ad-form");
var mainButton = document.querySelector(".map__pin--main");
var mapFilters = document.querySelector(".map__filters");

//  функция дезактивации карты
var offActivePage = function () {
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].setAttribute("disabled", "true");
  }

  mapFilters.classList.add("ad-form--disabled");
  addForm.classList.add("ad-form--disabled");
};
offActivePage();

//получаем случайное число
var getRandomNumber = function (min, max) {
  var random = Math.floor(min + Math.random() * (max - min));
  return random;
};

//  получаем случайный элемент массива
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
      address: getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX) +
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
      x: getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX - PIN_WIDTH),
      y: getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX - PIN_HEIGHT),
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

var bookingArray = getBookings();
var bookingByLocationMap = {};

var renderPins = function () {
  var moveX = PIN_WIDTH / 2;
  var moveY = PIN_HEIGHT;
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < bookingArray.length; i++) {
    var pinElem = pinTemplate.cloneNode(true);
    var pinLocation =
      bookingArray[i].location.x + "," + bookingArray[i].location.y;

    pinElem.style.left = bookingArray[i].location.x - moveX + "px";
    pinElem.style.top = bookingArray[i].location.y - moveY + "px";
    pinElem.src = bookingArray[i].author.avatar;
    pinElem.alt = bookingArray[i].offer.title;
    pinElem.dataset.location = pinLocation;
    bookingByLocationMap[pinLocation] = bookingArray[i];

    fragment.appendChild(pinElem);
  }

  map.appendChild(fragment);
};

var onPinElementClick = function (evt) {
  var pinElement = evt.target;
  var cardPopup = document.querySelector(".map__card");

  if (!pinElement.classList.contains(PIN_ELEM_CLASS)) return;

  if (cardPopup) {
    map.removeChild(cardPopup);
  }
  setCardInformation(bookingByLocationMap[pinElement.dataset.location]);
};

map.addEventListener("click", onPinElementClick);

var cardTempalte = document
  .querySelector("#card")
  .content.querySelector(".popup");
var mapFilterContainer = document.querySelector(".map__filters-container");

var setCardInformation = function (newCard) {
  var cardElem = cardTempalte.cloneNode(true);
  var cardImage = cardElem.querySelector(".popup__avatar");
  cardImage.src = newCard.author.avatar;
  cardElem.querySelector(".popup__title").textContent = newCard.offer.title;
  cardElem.querySelector(".popup__text--address").textContent =
    newCard.offer.address;
  cardElem.querySelector(".popup__text--price").textContent =
    newCard.offer.price + " Р/ночь";
  cardElem.querySelector(".popup__type").textContent =
    BOOKING_TYPES_MAP[newCard.offer.type];
  cardElem.querySelector(".popup__text--capacity").textContent =
    newCard.offer.rooms + " комнаты для " + newCard.offer.guests + " гостей";
  cardElem.querySelector(".popup__text--time").textContent =
    "Заезд после " +
    newCard.offer.checkin +
    ", выезд до " +
    newCard.offer.checkout;
  cardElem.querySelector(".popup__description").textContent =
    newCard.offer.description;

  map.insertBefore(cardElem, mapFilterContainer);
};

//  функция активация карты
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
    renderPins();
  } else {
    alert("Нужно нажать левую кнопку мыши");
  }
});

//  активация полей и карты при нажатии клавиши Enter
document.addEventListener("keydown", function (evt) {
  if (evt.key === "Enter") {
    evt.preventDefault();
    onActivePage();
    renderPins();
  }
});

var popup = document.querySelector(".popup");
var popupCloseButton = document.querySelector(".popup__close");

var closeCardClick = function () {
  popup.classList.add("hidden");
};
//  валидация полей по конмате и гостям

function handleChangeRoom(evt) {
  var selectedRoomValue = evt.target.value;
  var validGuestValues = ROOMS_AND_GUESTS[selectedRoomValue];

  for (var i = 0; i < guests.length; i++) {
    var currentRoomValue = guests[i].value;

    if (validGuestValues.includes(currentRoomValue)) {
      guests[i].removeAttribute("disabled");
      guests[i].setAttribute("selected", "");
    } else {
      guests[i].setAttribute("disabled", "");
      guests[i].removeAttribute("selected");
    }
  }
}

rooms.addEventListener("change", handleChangeRoom);

//  валидация времени прибытия и отъезда
(function () {
  var timeIn = document.querySelector("#timein");
  var timeOut = document.querySelector("#timeout");

  timeIn.onchange = function () {
    timeOut.selectedIndex = this.selectedIndex;
  };

  timeOut.onchange = function () {
    timeIn.selectedIndex = this.selectedIndex;
  };
})();

var addType = document.querySelector("#type").options;
var addPrice = document.querySelector("#price").setAttribute("value", "");

addType.onchange = function () {
  var type = addType.selectedIndex;
  window.type;
  return type;
};

var minPriceTypes = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};
