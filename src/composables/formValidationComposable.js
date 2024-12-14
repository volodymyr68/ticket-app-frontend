import {ref} from 'vue';
import {ERRORS} from "@/errors/form-errors.js";

export function useFormValidation() {
  const errors = ref({
    firstNameErrors: [],
    lastNameErrors: [],
    emailErrors: [],
    passwordErrors: [],
    confirmPasswordErrors: [],
  });

  const validateFirstName = (name) => {
    errors.value.firstNameErrors = [];
    if (name.trim().length === 0) {
      errors.value.firstNameErrors.push(ERRORS.EMPTY_NAME);
    }
    if (name.length < 3) {
      errors.value.firstNameErrors.push(ERRORS.NAME_SIZE);
    }
    if (!/^[a-zA-Z ]+$/.test(name)) {
      errors.value.firstNameErrors.push(ERRORS.NAME_FORMAT);
    }
  };

  const validateLastName = (name) => {
    errors.value.lastNameErrors = [];
    if (name.trim().length === 0) {
      errors.value.lastNameErrors.push(ERRORS.EMPTY_NAME);
    }
    if (name.length < 3) {
      errors.value.lastNameErrors.push(ERRORS.NAME_SIZE);
    }
    if (!/^[a-zA-Z ]+$/.test(name)) {
      errors.value.lastNameErrors.push(ERRORS.NAME_FORMAT);
    }
  };

  const validateEmail = (email) => {
    errors.value.emailErrors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.value.emailErrors.push(ERRORS.EMAIL_FORMAT);
    }
  };

  const validatePassword = (password) => {
    errors.value.passwordErrors = [];
    if (
        password.length < 1
    ) {
      errors.value.passwordErrors.push(ERRORS.PASSWORD_FORMAT);
    }
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    errors.value.confirmPasswordErrors = [];
    if (password !== confirmPassword) {
      errors.value.confirmPasswordErrors.push(ERRORS.CONFIRM_PASSWORD_MATCH);
    }
  };

  const setErrors = () => {
    errors.value.firstNameErrors = [];
    errors.value.lastNameErrors = [];
    errors.value.emailErrors = [];
    errors.value.passwordErrors = [];
    errors.value.confirmPasswordErrors = [];
  };

  const validateSignUp = (firstName, email, password, confirmPassword) => {
    validateFirstName(firstName);
    validateEmail(email);
    validatePassword(password);
    validateConfirmPassword(password, confirmPassword);
  };

  const isValidSignUp = () => {
    return (
        errors.value.firstNameErrors.length === 0 &&
        errors.value.lastNameErrors.length === 0 &&
        errors.value.emailErrors.length === 0 &&
        errors.value.passwordErrors.length === 0 &&
        errors.value.confirmPasswordErrors.length === 0
    );
  };

  const validateSignIn = (email, password) => {
    validateEmail(email);
    validatePassword(password);
  };

  const isValidSignIn = () => {
    return (
        errors.value.emailErrors.length === 0 &&
        errors.value.passwordErrors.length === 0
    );
  };

  return {
    errors,
    validateFirstName,
    validateLastName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    setErrors,
    validateSignUp,
    isValidSignUp,
    validateSignIn,
    isValidSignIn,
  };
}