'use strict'

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
var BOOKING_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var BOOKING_CHECKINS = ['12:00', '13:00', '14:00'];
var BOOKING_CHECKOUTS = ['12:00', '13:00', '14:00'];
var BOOKING_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var BOOKING_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var BOOKING_TITLE = 'Заголовок предложения ';
var BOOKING_DESCRIPTION = 'Описание предложения ';
var map = document.querySelector('.map');
var mapPin = document.querySelector('#pin').content.querySelector('.map__pin');

//временно убираем класс .map--faded у карты
map.classList.remove('.map--faded');

//получаем случайное число
var getRandomNumber = function (min, max) {
  var random = Math.floor(min + Math.random() * (max - min));
  return random;
};

//получаем случайный элемент массива
var getRandomValue = function (array) {
  return array[getRandomNumber(0, array.length)];
};

var createBooking = function (value) {
  var avatarUrl = 'img/avatars/user0' + value + '.png';
  var currentBooking = {
    author: {
      avatar: avatarUrl
    },
    offer: {
      title: BOOKING_TITLE + value,
      address: getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX) + ', ' + getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX),
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
      y: getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX)
    }
  }
  return currentBooking;
};

var getOffers = function () {
  var offers = [];
  for (var i = 1; i <= COUNT_OFFERS; i++) {
    var offer = createBooking(i);
    offers.push(offer);
  }
  return offers;
};

var createPin = function (offers) {
  var pinElem = mapPin.cloneNode(true);
  var pinImg = pinElem.querySelector('img');
  var moveX = PIN_WIDTH / 2;
  var moveY = PIN_HEIGHT;

  pinElem.style.left = (createBooking.location.x - moveX) + 'px';
  pinElem.style.top = (createBooking.location.y - moveY) + 'px';
  pinImg.src = currentBooking.author.avatar;
  pinImg.alt = currentBooking.offer.title;

  return pinElem;
};

var renderPinList = function (array) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(createPin(array[i]));
  }
  mapPins.appendChild(fragment);
};

renderPinList(getOffers());
