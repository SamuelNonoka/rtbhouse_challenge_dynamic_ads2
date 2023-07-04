document.addEventListener("DOMContentLoaded", initApplication);

const offerAPI =
  "https://rekrutacja.webdeveloper.rtbhouse.net/files/banner.json";

const _SUCCESS = 200;

async function initApplication() {
  const jsonOffers = await loadOffers();
  const offers = generateRandomOffers(jsonOffers);
  Dom.mountOffers(offers);
}

async function loadOffers() {
  const response = await fetch(offerAPI);

  if (response.status !== _SUCCESS) return [];

  const data = await response.json();
  return data.offers;
}

function generateRandomOffers(offersArray) {
  let randomTimes = 3;
  let offersRange = [...offersArray];

  randomOffers = [];

  const loop = [...Array(randomTimes).keys()];

  loop.forEach(() => {
    const random = Math.floor(Math.random() * offersRange.length);
    const offer = offersRange.splice(random, 1);
    randomOffers.push(offer[0]);
  });

  return randomOffers;
}

function formatPrice(price, currency) {
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: currency,
  }).format(price);
}

class Dom {
  static mountOffers(offers) {
    offers.forEach((offer) => {
      Dom.mountOffer(offer);
    });

    SlideAnimation.slide();
    SlideAnimation.start();
  }

  static async mountOffer(offer) {
    const offerElement = createOfferElement();
    const mainContentElement = createMainContentElement();
    const pictureElement = createElement("picture");
    const imgElement = createImgElement(offer);

    pictureElement.appendChild(imgElement);
    mainContentElement.appendChild(pictureElement);

    const nameElement = createNameElement();
    nameElement.textContent = offer.name;

    mainContentElement.appendChild(nameElement);

    const priceElement = document.createElement("p");
    priceElement.textContent = formatPrice(offer.price, offer.currency);
    priceElement.classList.add("offer-price");

    mainContentElement.appendChild(priceElement);

    const buttonElement = document.createElement("button");
    buttonElement.textContent = "Check";
    buttonElement.classList.add("offer-button");

    mainContentElement.appendChild(buttonElement);

    offerElement.appendChild(mainContentElement);

    const offersSection = document.querySelector(".offers");
    offersSection.appendChild(offerElement);

    const img = document.querySelector(`[data-src="${offer.imgURL}"]`);
    img.setAttribute("src", offer.imgURL);
  }
}

function createOfferElement() {
  return createElement("article", [
    "offer",
    "w-100",
    "white",
    "flex",
    "flex-column",
    "justify-space-between",
    "pa-8",
  ]);
}

function createMainContentElement() {
  return createElement("main", [
    "offer-content",
    "flex",
    "flex-1",
    "flex-column",
    "justify-space-between",
  ]);
}

function createImgElement(offer) {
  return createElement(
    "img",
    ["max-w-100"],
    [
      { name: "alt", value: offer.name },
      { name: "data-src", value: offer.imgURL },
    ]
  );
}

function createNameElement() {
  return createElement("h1", ["offer-name"]);
}

function createElement(tag, classList = [], attributeList = []) {
  const element = document.createElement(tag);

  attributeList.forEach((attr) => {
    element.setAttribute(attr.name, attr.value);
  });

  classList.forEach((className) => {
    element.classList.add(className);
  });

  return element;
}

class SlideAnimation {
  static slideItems = 3;
  static currentSlidePosition = 2;

  static start() {
    setInterval(SlideAnimation.slide, 3000);
  }

  static slide() {
    let slideToAdd = 0;
    const maximunIndex = SlideAnimation.slideItems - 1;

    if (SlideAnimation.currentSlidePosition < maximunIndex) {
      slideToAdd = SlideAnimation.currentSlidePosition + 1;
    }

    let slideToRemove = slideToAdd - 1;
    if (slideToAdd === 0) {
      slideToRemove = maximunIndex;
    }

    const offerElementNodes = document.querySelectorAll(".offer");

    const offerToRemove = offerElementNodes[slideToRemove];
    offerToRemove.classList.add("slide-out");

    const offerElement = offerElementNodes[slideToAdd];
    offerElement.classList.add("slide-in");

    setTimeout(() => {
      offerToRemove.classList.remove("slide-in");
      offerToRemove.classList.remove("slide-out");
    }, 1000);

    SlideAnimation.currentSlidePosition = slideToAdd;
  }
}
