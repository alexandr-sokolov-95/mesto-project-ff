import { openModal } from './modal';

export function createCard(cardData, callbackLike, callbackModal) {
  const placeTemplate = document.querySelector('#card-template').content;
  const placeItem = placeTemplate
    .querySelector('.places__item')
    .cloneNode(true);

  placeItem.querySelector('.card__title').textContent = cardData.name;
  placeItem.querySelector('.card__image').src = cardData.link;
  placeItem.querySelector('.card__image').alt = cardData.name;
  placeItem
    .querySelector('.card__image')
    .addEventListener('click', callbackModal);
  placeItem
    .querySelector('.card__like-button')
    .addEventListener('click', callbackLike);
  placeItem
    .querySelector('.card__delete-button')
    .addEventListener('click', removeCard);

  return placeItem;
}

export function likeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export function openImageModal(image, modal) {
  openModal(modal);

  let imageModalImg = modal.querySelector('.popup__image');
  let imageModalCaption = modal.querySelector('.popup__caption');

  imageModalImg.src = image.src;
  imageModalImg.alt = image.alt;
  imageModalCaption.textContent = image.alt;
}

function removeCard(evt) {
  evt.target.closest('.places__item').remove();
}
