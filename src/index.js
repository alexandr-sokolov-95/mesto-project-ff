import './pages/index.css';
import { openModal, closeModal } from './scripts/components/modal';
import { createCard, toggleCardLike, removeCard } from './scripts/components/card';
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

function saveFormMessage(buttonElement, message) {
  buttonElement.textContent = message;
}

function handleAvatarFormSubmission(evt) {
  evt.preventDefault();

  let saveButton = evt.target.querySelector('.popup__button')
  let newAvatar = { avatar: avatarFormLink.value };

  saveFormMessage(saveButton, 'Сохраняем...');

  patchAvatarServer(newAvatar)
    .then(() => {
      profileAvatar.style.backgroundImage = `url(${avatarFormLink.value})`;

      closeModal(evt.target.closest('.popup'));
    })
    .catch((err) => {
      saveFormMessage(saveButton, 'Что-то пошло не так')
      catchError(err)
    })
    .finally(() => {
      saveFormMessage(saveButton, 'Сохранить')
    })
}

function handleEditAuthorFormSubmisstion(evt) {
  evt.preventDefault();

  let saveButton = evt.target.querySelector('.popup__button');
  let newAuthor = {
    name: editFormName.value,
    about: editFormDesc.value,
  };

  saveFormMessage(saveButton, 'Сохраняем...');

  patchAuthorServer(newAuthor)
    .then(() => {

      editAuthor(newAuthor.name, newAuthor.about);

      closeModal(evt.target.closest('.popup'));
    })
    .catch((err) => {
      saveFormMessage(saveButton, 'Что-то пошло не так')
      catchError(err)
    })
    .finally(() => {
      saveFormMessage(saveButton, 'Сохранить')
    })
}

function handleNewPlaceFormSubmission(evt) {
  evt.preventDefault();

  let saveButton = evt.target.querySelector('.popup__button');
  let cardData = {
    name: newPlaceFormName.value,
    link: newPlaceFormLink.value,
  };

  saveFormMessage(saveButton, 'Сохраняем...');

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

      saveFormMessage(
        evt.target.querySelector('.popup__button'),
        'Сохраняем...'
      );

      cardsContainer.prepend(newCard);

      closeModal(evt.target.closest('.popup'));
      evt.target.reset();
    })
    .catch((err) => {
      saveFormMessage(saveButton, 'Что-то пошло не так')
      catchError(err)
    })
    .finally(() => {
      saveFormMessage(saveButton, 'Сохранить')
    })
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
