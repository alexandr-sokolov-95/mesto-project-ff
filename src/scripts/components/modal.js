const modalVisibleClass = 'popup_is-opened';

function openModal(target) {
  target.classList.add(modalVisibleClass);

  document.addEventListener('keydown', closeModalOnEsc);

  target.addEventListener('click', closeModalOnClick);
}

function closeModal(target) {
  target.classList.remove(modalVisibleClass);

  document.removeEventListener('keydown', closeModalOnEsc);
}

function closeModalOnEsc(evt) {
  if (evt.key === 'Escape') {
    closeModal(document.querySelector(`.${modalVisibleClass}`));
  }
}

function closeModalOnClick(evt) {
  if (
    evt.target === evt.currentTarget ||
    evt.target.classList.contains('popup__close')
  ) {
    closeModal(evt.currentTarget);
  }
}

export { openModal, closeModal };
