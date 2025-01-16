export function createCard(
  cardData,
  callbackLike,
  callbackModal,
  callbackRemove
) {
  const placeTemplate = document.querySelector('#card-template').content;
  const placeItem = placeTemplate
    .querySelector('.places__item')
    .cloneNode(true);
  const placeTitle = placeItem.querySelector('.card__title');
  const placeImage = placeItem.querySelector('.card__image');
  const placeLikeBtn = placeItem.querySelector('.card__like-button');
  const placeDeleteBtn = placeItem.querySelector('.card__delete-button');

  placeTitle.textContent = cardData.name;
  placeImage.src = cardData.link;
  placeImage.alt = cardData.name;
  placeImage.addEventListener('click', callbackModal);
  placeLikeBtn.addEventListener('click', callbackLike);
  placeDeleteBtn.addEventListener('click', callbackRemove);

  return placeItem;
}

export function likeCard(evt) {
  const likeBtn = evt.target;
  likeBtn.classList.toggle('card__like-button_is-active');
}

export function removeCard(card) {
  card.remove();
}
