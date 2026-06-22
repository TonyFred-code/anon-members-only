function isEmailAddressValid(emailAddress) {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(emailAddress.trim());
}

export { isEmailAddressValid };
