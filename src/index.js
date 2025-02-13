import './pages/index.css';
import { openModal, closeModal } from './scripts/components/modal';
import { createCard } from './scripts/components/card';
import {
  enableFormsValidation,
  resetForm,
} from './scripts/components/validate';
import {
  catchError,
  patchAvatarServer,
  getAuthorServer,
  patchAuthorServer,
  getInitialCards,
  addCardServer,
  deleteCardServer,
  likeCardServer,
  unlikeCardServer,
} from './scripts/components/api';

const cardsContainer = document.querySelector('.places__list');

const profileAvatar = document.querySelector('.profile__image');
const profileTitle = document.querySelector('.profile__title');
const profileDesc = document.querySelector('.profile__description');

const modals = Array.from(document.querySelectorAll('.popup'));
const avatarModal = modals.find((el) =>
  el.classList.contains('popup_type_edit-photo')
);
const editModal = modals.find((el) => el.classList.contains('popup_type_edit'));
const addCardModal = modals.find((el) =>
  el.classList.contains('popup_type_new-card')
);
const imageModal = modals.find((el) =>
  el.classList.contains('popup_type_image')
);
const imageModalImg = imageModal.querySelector('.popup__image');
const imageModalCaption = imageModal.querySelector('.popup__caption');
const editModalTrigger = document.querySelector('.profile__edit-button');
const addCardModalTrigger = document.querySelector('.profile__add-button');

const avatarForm = document.forms['new-photo'];
const avatarFormLink = avatarForm.link;

const editForm = document.forms['edit-profile'];
const editFormName = editForm.name;
const editFormDesc = editForm.description;

const newPlaceForm = document.forms['new-place'];
const newPlaceFormName = newPlaceForm['place-name'];
const newPlaceFormLink = newPlaceForm['link'];

const formsValidationParams = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error',
};
const { formSelector, ...formResetParams } = formsValidationParams;

function editAuthor(name, desc, avatar = null) {
  profileTitle.textContent = name;
  profileDesc.textContent = desc;
  if (avatar) {
    profileAvatar.style.backgroundImage = `url(${avatar})`;
  }
}

function openAvatarModal() {
  resetForm(avatarForm, formResetParams);

  openModal(avatarModal);
}

function openEditModal() {
  resetForm(editForm, formResetParams);

  editFormName.value = profileTitle.textContent;
  editFormDesc.value = profileDesc.textContent;

  openModal(editModal);
}

function openCardModal() {
  resetForm(newPlaceForm, formResetParams);
  openModal(addCardModal);
}

function openImageModal(evt) {
  const image = evt.target;

  imageModalImg.src = image.src;
  imageModalImg.alt = image.alt;
  imageModalCaption.textContent = image.alt;

  openModal(imageModal);
}

function savingFormMessage(buttonElement, message) {
  buttonElement.textContent = message;
}

function handleAvatarFormSubmission(evt) {
  evt.preventDefault();

  let newAvatar = {
    avatar: avatarFormLink.value,
  };

  patchAvatarServer(newAvatar)
    .then(() => {
      savingFormMessage(
        evt.target.querySelector('.popup__button'),
        'Сохраняем...'
      );
      profileAvatar.style.backgroundImage = `url(${avatarFormLink.value})`;

      closeModal(evt.target.closest('.popup'));
    })
    .catch(catchError);
}

function handleEditAuthorFormSubmisstion(evt) {
  evt.preventDefault();

  let newAuthor = {
    name: editFormName.value,
    about: editFormDesc.value,
  };

  patchAuthorServer(newAuthor)
    .then(() => {
      savingFormMessage(
        evt.target.querySelector('.popup__button'),
        'Сохраняем...'
      );

      editAuthor(newAuthor.name, newAuthor.about);

      closeModal(evt.target.closest('.popup'));
    })
    .catch(catchError);
}

function handleNewPlaceFormSubmission(evt) {
  evt.preventDefault();

  let cardData = {
    name: newPlaceFormName.value,
    link: newPlaceFormLink.value,
  };

  addCardServer(cardData)
    .then((data) => {
      let newCard = createCard(
        data,
        data.owner._id,
        (evt) => {
          let likeButtonElement = evt.target;
          toggleCardLike(likeButtonElement, data._id, data.owner._id);
        },
        openImageModal,
        () => {
          removeCard(newCard, data._id);
        }
      );

      savingFormMessage(
        evt.target.querySelector('.popup__button'),
        'Сохраняем...'
      );

      cardsContainer.prepend(newCard);

      closeModal(evt.target.closest('.popup'));
      evt.target.reset();
    })
    .catch(catchError);
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
  cardElement.remove();
  deleteCardServer(cardId);
}

let pageLoadData = [getAuthorServer(), getInitialCards()];

Promise.all(pageLoadData)
  .then(([author, initialCards]) => {
    editAuthor(author.name, author.about, author.avatar);
    let authorId = author._id;

    initialCards.forEach((cardData) => {
      let cardId = cardData._id;

      let newCard = createCard(
        cardData,
        authorId,
        (evt) => {
          let likeButtonElement = evt.target;
          toggleCardLike(likeButtonElement, cardId, authorId);
        },
        openImageModal,
        () => {
          removeCard(newCard, cardId);
        }
      );

      cardsContainer.append(newCard);
    });
  })
  .catch(catchError);

profileAvatar.addEventListener('click', openAvatarModal);
editModalTrigger.addEventListener('click', openEditModal);
addCardModalTrigger.addEventListener('click', openCardModal);

avatarForm.addEventListener('submit', handleAvatarFormSubmission);
editForm.addEventListener('submit', handleEditAuthorFormSubmisstion);
newPlaceForm.addEventListener('submit', handleNewPlaceFormSubmission);

enableFormsValidation(formsValidationParams);
