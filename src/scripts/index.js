import { initialCards } from './components/cardsSource';
import { openModal, closeModal } from './components/modal';
import { createCard, likeCard, openImageModal } from './components/card';

export function init() {
  const cardsContainer = document.querySelector('.places__list');

  const modals = Array.from(document.querySelectorAll('.popup'));
  const editModal = modals.find((el) =>
    el.classList.contains('popup_type_edit')
  );
  const addCardModal = modals.find((el) =>
    el.classList.contains('popup_type_new-card')
  );
  const imageModal = modals.find((el) =>
    el.classList.contains('popup_type_image')
  );
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

  initialCards.forEach((cardData) => {
    let newCard = createCard(cardData, likeCard, function (evt) {
      openImageModal(evt.target, imageModal);
    });
    cardsContainer.append(newCard);
  });

  editModalTrigger.addEventListener('click', function () {
    openModal(editModal);
    editFormName.value = profileTitle.textContent;
    editFormDesc.value = profileDesc.textContent;
  });

  addCardModalTrigger.addEventListener('click', function () {
    openModal(addCardModal);
  });

  modals.forEach(function (modal) {
    modal.addEventListener('click', function (evt) {
      if (
        evt.target === evt.currentTarget ||
        evt.target.classList.contains('popup__close')
      ) {
        closeModal(modal);
      }
    });
  });

  editForm.addEventListener('submit', handleEditFormSubmisstion);
  newPlaceForm.addEventListener('submit', handleNewPlaceFormSubmission);

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

    let newCard = createCard(cardData, likeCard, function (evt) {
      openImageModal(evt.target, imageModal);
    });

    cardsContainer.prepend(newCard);

    closeModal(evt.target.closest('.popup'));
    evt.target.reset();
  }
}
