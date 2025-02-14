import { catchError, likeCardServer, unlikeCardServer, deleteCardServer } from "./api";

function createCard(
  cardData,
  userId,
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
  const placeLikeCount = placeItem.querySelector('.card__like-count');
  const placeDeleteBtn = placeItem.querySelector('.card__delete-button');

  placeTitle.textContent = cardData.name;
  placeImage.src = cardData.link;
  placeImage.alt = cardData.name;
  placeImage.addEventListener('click', callbackModal);
  placeLikeBtn.addEventListener('click', callbackLike);

  placeLikeCount.textContent = cardData.likes.length;

  let isLiked = cardData.likes.find((like) => userId === like._id);

  isLiked
    ? placeLikeBtn.classList.add('card__like-button_is-active')
    : placeLikeBtn.classList.remove('card__like-button_is-active');

  cardData.owner._id === userId
    ? placeDeleteBtn.addEventListener('click', callbackRemove)
    : placeDeleteBtn.remove();

  return placeItem;
}


function likeCard(likeButtonElement, cardId) {
  likeCardServer(cardId)
    .then((likeData) => {
      likeButtonElement.classList.add('card__like-button_is-active');
      likeButtonElement.nextElementSibling.innerHTML = likeData.likes.length;
    })
    .catch(catchError);
}

function unlikeCard(likeButtonElement, cardId) {
  unlikeCardServer(cardId)
    .then((likeData) => {
      likeButtonElement.classList.remove('card__like-button_is-active');
      likeButtonElement.nextElementSibling.innerHTML = likeData.likes.length;
    })
    .catch(catchError);
}

function toggleCardLike(likeButtonElement, cardId) {
  if (!likeButtonElement.classList.contains('card__like-button_is-active')) {
    likeCard(likeButtonElement, cardId);
  } else {
    unlikeCard(likeButtonElement, cardId);
  }
}

function removeCard(cardElement, cardId) {
  deleteCardServer(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch(catchError)
}

export { createCard, toggleCardLike, removeCard }
