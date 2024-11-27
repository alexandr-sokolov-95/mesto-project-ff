const placesContainer = document.querySelector('.places__list');

renderInitialPlaces();

function renderInitialPlaces() {
  initialCards.forEach((card) => {
    const placeCard = createPlace(card);

    placesContainer.append(placeCard);
  });
}

function createPlace(cardData) {
  const placeTemplate = document.querySelector('#card-template').content;
  const placeItem = placeTemplate
    .querySelector('.places__item')
    .cloneNode(true);

  placeItem.querySelector('.card__title').textContent = cardData.name;
  placeItem.querySelector('.card__image').src = cardData.link;
  placeItem.querySelector('.card__image').alt = cardData.name;
  placeItem
    .querySelector('.card__delete-button')
    .addEventListener('click', removePlace);

  return placeItem;
}

function removePlace(event) {
  event.target.closest('.places__item').remove();
}
