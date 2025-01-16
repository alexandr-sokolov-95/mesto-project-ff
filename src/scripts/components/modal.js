const modalVisibleClass = 'popup_is-opened';

function openModal(target) {
  target.classList.add(modalVisibleClass);

  document.addEventListener('keydown', closeModalOnEsc);
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

export { openModal, closeModal };
