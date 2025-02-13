const requestConfig = {
  url: 'https://nomoreparties.co/v1/wff-cohort-31',
  authToken: '89c408cb-16d5-4b6e-a56b-a248694e16f8',
};

function processResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    new Promise.reject(`Ошибка ${res.status}`);
  }
}

function catchError(error) {
  console.log(error);
}

function getAuthorServer() {
  return fetch(`${requestConfig.url}/users/me`, {
    method: 'GET',
    headers: {
      authorization: requestConfig.authToken,
    },
  }).then(processResponse);
}

function patchAvatarServer(data) {
  return fetch(`${requestConfig.url}/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      authorization: requestConfig.authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(processResponse);
}

function patchAuthorServer(data) {
  return fetch(`${requestConfig.url}/users/me`, {
    method: 'PATCH',
    headers: {
      authorization: requestConfig.authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(processResponse);
}

function getInitialCards() {
  return fetch(`${requestConfig.url}/cards`, {
    method: 'GET',
    headers: {
      authorization: requestConfig.authToken,
    },
  }).then(processResponse);
}

function addCardServer(data) {
  return fetch(`${requestConfig.url}/cards`, {
    method: 'POST',
    headers: {
      authorization: requestConfig.authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(processResponse);
}

function deleteCardServer(cardId) {
  return fetch(`${requestConfig.url}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: requestConfig.authToken,
    },
  }).then(processResponse);
}

function likeCardServer(cardId) {
  return fetch(`${requestConfig.url}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: {
      authorization: requestConfig.authToken,
    },
  }).then(processResponse);
}

function unlikeCardServer(cardId) {
  return fetch(`${requestConfig.url}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: requestConfig.authToken,
    },
  }).then(processResponse);
}

export {
  catchError,
  patchAvatarServer,
  getAuthorServer,
  patchAuthorServer,
  getInitialCards,
  addCardServer,
  deleteCardServer,
  likeCardServer,
  unlikeCardServer,
};
