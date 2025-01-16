import './pages/index.css';
import { initialCards } from './scripts/components/cardsSource';
import { openModal, closeModal } from './scripts/components/modal';
import { createCard, likeCard, removeCard } from './scripts/components/card';

const cardsContainer = document.querySelector('.places__list');

const modals = Array.from(document.querySelectorAll('.popup'));
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

const editForm = document.forms['edit-profile'];
const editFormName = editForm.name;
const editFormDesc = editForm.description;
const profileTitle = document.querySelector('.profile__title');
const profileDesc = document.querySelector('.profile__description');

const newPlaceForm = document.forms['new-place'];
const newPlaceFormName = newPlaceForm['place-name'];
const newPlaceFormLink = newPlaceForm['link'];

function openEditModal(modal) {
  openModal(modal);
  editFormName.value = profileTitle.textContent;
  editFormDesc.value = profileDesc.textContent;
}

function openImageModal(evt) {
  const image = evt.target;

  imageModalImg.src = image.src;
  imageModalImg.alt = image.alt;
  imageModalCaption.textContent = image.alt;

  openModal(imageModal);
}

function handleEditFormSubmisstion(evt) {
  evt.preventDefault();

  profileTitle.textContent = editFormName.value;
  profileDesc.textContent = editFormDesc.value;

  closeModal(evt.target.closest('.popup'));
}

function handleNewPlaceFormSubmission(evt) {
  evt.preventDefault();

  let cardData = {
    name: newPlaceFormName.value,
    link: newPlaceFormLink.value,
  };

  let newCard = createCard(cardData, likeCard, openImageModal, () =>
    removeCard(newCard)
  );

  cardsContainer.prepend(newCard);

  closeModal(evt.target.closest('.popup'));
  evt.target.reset();
}

initialCards.forEach((cardData) => {
  let newCard = createCard(cardData, likeCard, openImageModal, () =>
    removeCard(newCard)
  );
  cardsContainer.append(newCard);
});

editModalTrigger.addEventListener('click', function () {
  openEditModal(editModal);
});

addCardModalTrigger.addEventListener('click', function () {
  openModal(addCardModal);
});

editForm.addEventListener('submit', handleEditFormSubmisstion);
newPlaceForm.addEventListener('submit', handleNewPlaceFormSubmission);
