const placesContainer = document.querySelector('.places__list')

function renderPlaces() {
  initialCards.forEach((card) => {

  let placeCard = createPlace(card.name, card.link)

    placesContainer.append(placeCard)
  })
}

function createPlace(name, link) {
  const placeTemplate = document.querySelector('#card-template').content
  const placeItem = placeTemplate.querySelector('.places__item').cloneNode(true)

  placeItem.querySelector('.card__title').textContent = name
  placeItem.querySelector('.card__image').setAttribute('src', link)
  placeItem.querySelector('.card__delete-button').addEventListener('click', removePlace)

  return placeItem
}

function removePlace(event) {
  event.target.parentElement.remove()
}

renderPlaces()
