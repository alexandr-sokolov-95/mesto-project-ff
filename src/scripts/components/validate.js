function showInputError(
  formElement,
  inputElement,
  inputErrorClass,
  errorClass,
  errorMessage
) {
  const errorElement = formElement.querySelector(
    `.${errorClass}_${inputElement.name}`
  );

  inputElement.classList.add(inputErrorClass);
  errorElement.classList.add(`${errorClass}_visible`);
  errorElement.textContent = errorMessage;
}

function hideInputError(
  formElement,
  inputElement,
  inputErrorClass,
  errorClass
) {
  const errorElement = formElement.querySelector(
    `.${errorClass}_${inputElement.name}`
  );

  inputElement.classList.remove(inputErrorClass);
  errorElement.classList.remove(`${errorClass}_visible`);
  errorElement.textContent = '';
}

function isValid(formElement, inputElement, inputErrorClass, errorClass) {
  if (inputElement.validity.valid) {
    hideInputError(formElement, inputElement, inputErrorClass, errorClass);
  } else {
    let errorMessage = inputElement.validity.patternMismatch
      ? inputElement.dataset.errorMessage
      : inputElement.validationMessage;

    showInputError(
      formElement,
      inputElement,
      inputErrorClass,
      errorClass,
      errorMessage
    );
  }
}

function hasInvalidInput(inputsList) {
  return inputsList.some((input) => !input.validity.valid);
}

function toggleFormButton(buttonElement, buttonInactiveClass, inputsList) {
  if (hasInvalidInput(inputsList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(buttonInactiveClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(buttonInactiveClass);
  }
}

function setFormEventListeners(
  formElement,
  inputClass,
  inputErrorClass,
  buttonClass,
  buttonInactiveClass,
  errorClass
) {
  const inputsList = Array.from(formElement.querySelectorAll(inputClass));
  const buttonElement = formElement.querySelector(buttonClass);

  toggleFormButton(buttonElement, buttonInactiveClass, inputsList);

  inputsList.forEach((input) => {
    input.addEventListener('input', function () {
      isValid(formElement, input, inputErrorClass, errorClass);

      toggleFormButton(buttonElement, buttonInactiveClass, inputsList);
    });
  });
}

function enableFormsValidation(params) {
  const {
    formSelector,
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
    errorClass,
  } = params;

  const forms = Array.from(document.querySelectorAll(formSelector));

  forms.forEach((form) => {
    setFormEventListeners(
      form,
      inputSelector,
      inputErrorClass,
      submitButtonSelector,
      inactiveButtonClass,
      errorClass
    );
  });
}

function resetForm(formElement, params) {
  const {
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
    errorClass,
  } = params;
  const inputs = Array.from(formElement.querySelectorAll(inputSelector));
  const submit = formElement.querySelector(submitButtonSelector);

  formElement.reset();

  inputs.forEach((input) => {
    hideInputError(formElement, input, inputErrorClass, errorClass);
  });

  toggleFormButton(submit, inactiveButtonClass, inputs);
}

export { enableFormsValidation, resetForm };
