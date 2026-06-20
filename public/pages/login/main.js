const emailInput = document.querySelector("input#email");
const passwordInput = document.querySelector("input#password");
const submitBtn = document.querySelector("button#submit");

const fieldErrVisible = {
  email: false,
  network: false,
  password: false,
};

function showFieldError(field, errMessage) {
  const element = document.querySelector(`[data-error='${field}']`);

  if (!element) return;
  element.textContent = errMessage;
  element.classList.remove("hidden");
  fieldErrVisible[field] = true;
}

function hideFieldError(field) {
  const element = document.querySelector(`[data-error='${field}']`);

  if (!element) return;

  element.classList.add("hidden");
  fieldErrVisible[field] = false;
}

function handleServerErrors(errors) {
  errors.forEach((error) => {
    showFieldError(error.path, error.msg);
  });
}

function isEmailAddressValid(emailAddress) {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(emailAddress.trim());
}

emailInput.addEventListener("focus", () => {
  if (fieldErrVisible.email) {
    hideFieldError("email");
  }
});

emailInput.addEventListener("input", () => {
  if (fieldErrVisible.email) hideFieldError("email");

  if (fieldErrVisible.network) hideFieldError("network");
});

emailInput.addEventListener("blur", () => {
  if (
    !emailInput.value ||
    (emailInput.value && !isEmailAddressValid(emailInput.value))
  ) {
    showFieldError("email", "Please enter a valid email address");
  } else {
    hideFieldError("email");
  }
});

passwordInput.addEventListener("blur", () => {
  if (!passwordInput.value) {
    showFieldError("password", "This field is required");
  } else {
    hideFieldError("password");
  }
});

passwordInput.addEventListener("focus", () => {
  if (fieldErrVisible.password) hideFieldError("password");
});

passwordInput.addEventListener("input", () => {
  if (fieldErrVisible.password) hideFieldError("password");

  if (fieldErrVisible.network) hideFieldError("network");
});

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  let hasError = false;

  if (!emailInput.value || !isEmailAddressValid(emailInput.value)) {
    showFieldError("email", "Please enter a valid email address");
    hasError = true;
  }

  if (!passwordInput.value) {
    showFieldError("password", "Password is required");
    hasError = true;
  }

  if (hasError) return;

  try {
    const res = await fetch(`/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      window.location.href = data.redirectUrl;
    } else if (!res.ok) {
      handleServerErrors(data.errors);
      return;
    }
  } catch (error) {
    console.error(error);
    showFieldError("network", "Something went wrong");
  }
});
