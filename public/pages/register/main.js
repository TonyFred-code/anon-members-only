import { isEmailAddressValid } from "../lib/validators.js";

const emailInput = document.querySelector("input#email");

const passwordInput = document.querySelector("input#password");
const confirmPasswordInput = document.querySelector("input#confirm_password");
const passwordReqListContainer = document.querySelector(
  "div#container__req-list"
);

const usernamePreviewElement = document.querySelector("span#username-preview");
const selectAdjectivesElement = document.querySelector("select#adjectives");
const selectNounsElement = document.querySelector("select#nouns");
const randomUsernameBtn = document.querySelector("button#random-username");

const continueBtn = document.querySelector("button#continue-btn");
const previousRegStepBtn = document.querySelector("button#restart-reg");
const submitRegistrationBtn = document.querySelector("button#submit-reg");

let emailErrorVisible = false;
let emailCheckValid = false;
let emailAbortController = null;

const errorFieldVisible = {
  email: false,
  network: false,
  password: false,
  username: false,
  confirmPassword: false,
  adjectives: false,
  nouns: false,
};

function showFieldError(field, msg, type) {
  const element = document.querySelector(`[data-error='${field}']`);

  if (!element) return;
  element.textContent = msg;
  element.classList.remove("hidden");

  errorFieldVisible[field] = true;
}

function hideFieldError(field) {
  const element = document.querySelector(`[data-error='${field}']`);

  if (!element) return;
  element.classList.add("hidden");
  errorFieldVisible[field] = false;
}

function showSection(targetSection) {
  const element = document.querySelector(`[data-step='${targetSection}']`);

  if (!element) return;
  element.classList.remove("hidden");
}

function hideSection(targetSection) {
  const element = document.querySelector(`[data-step='${targetSection}']`);

  if (!element) return;
  element.classList.add("hidden");
}

const fieldToSection = {
  email: "step-1",
  username: "step-2",
  password: "step-1",
  network: "step-1",
  adjectives: "step-2",
  nouns: "step-2",
};

function handleServerErrors(errors) {
  const sectionsWithErrors = errors.map((err) => fieldToSection[err.path]);
  const targetSection = sectionsWithErrors.includes("step-1")
    ? "step-1"
    : "step-2";

  showSection(targetSection);
  hideSection(targetSection === "step-1" ? "step-2" : "step-1");

  errors.forEach((err) => {
    showFieldError(err.path, err.msg, "error");
  });
}

function passwordsMatch() {
  return (
    confirmPasswordInput.value.length > 0 &&
    confirmPasswordInput.value === passwordInput.value
  );
}

function meetsPasswordStrengthRequirements(password) {
  // Min 8 characters long
  // must contain at least one upper case
  // must contain at least one lowercase characters
  // must contain at least one digit
  // must contain at least on symbol
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function updateUsernamePreview() {
  usernamePreviewElement.textContent = `${selectAdjectivesElement.value}-${selectNounsElement.value}-xxxx`;
}

function pickRandomOption(selectEl) {
  const options = selectEl.options;
  const randomIndex = Math.floor(Math.random() * options.length);
  selectEl.selectedIndex = randomIndex;
}

function generateSuffix() {
  return Math.floor(1000 + Math.random() * 9000); // Last 4 digits of username
}

function updatePasswordReqVisibility() {
  const met = meetsPasswordStrengthRequirements(passwordInput.value);
  passwordReqListContainer.classList.toggle("hidden", met);
}

function updateRequirements(password) {
  toggleRequirement("req__length", password.length >= 8);
  toggleRequirement("req__upper", /[A-Z]/.test(password));
  toggleRequirement("req__lower", /[a-z]/.test(password));
  toggleRequirement("req__number", /[0-9]/.test(password));
  toggleRequirement("req__special", /[^A-Za-z0-9]/.test(password));
}

function toggleRequirement(id, met) {
  const el = document.getElementById(id);
  el.classList.toggle("met", met);
  el.classList.toggle("unmet", !met);
}

async function checkEmailUniqueAndValid() {
  if (!emailInput.value) return;

  hideFieldError("email");
  const emailValid = isEmailAddressValid(emailInput.value);

  if (!emailValid) {
    showFieldError("email", "Invalid email address", "error");
    return;
  }

  emailAbortController = new AbortController();

  try {
    const res = await fetch(`/register/check-email?email=${emailInput.value}`, {
      signal: emailAbortController.signal,
    });
    const { taken } = await res.json();
    emailCheckValid = !taken;

    taken
      ? showFieldError("email", "Email is already in use!", "warn")
      : hideFieldError("email");
  } catch (error) {
    if (error.name === "AbortError") return; // Cancelled in-flight;
    showFieldError("email", error.message || "Email check failed", "error");
    console.error(error);
  } finally {
  }
}

emailInput.addEventListener("focus", () => {
  emailAbortController?.abort(); // cancel in-flight request
  if (errorFieldVisible.email) {
    hideFieldError("email");
  }
});

emailInput.addEventListener("input", () => {
  if (!errorFieldVisible.email) return;

  hideFieldError("email");
});

emailInput.addEventListener("blur", checkEmailUniqueAndValid);

passwordInput.addEventListener("input", () => {
  if (confirmPasswordInput.value.length > 0) {
    if (!passwordsMatch()) {
      showFieldError("confirmPassword", "Passwords do not match", "error");
    } else {
      hideFieldError("confirmPassword");
    }
  }

  updatePasswordReqVisibility();
  updateRequirements(passwordInput.value);
});

passwordInput.addEventListener("blur", () => {
  updatePasswordReqVisibility();
  updateRequirements(passwordInput.value);
});

passwordInput.addEventListener("focus", () => {
  if (errorFieldVisible.password) {
    hideFieldError("password");
  }

  updatePasswordReqVisibility();
  updateRequirements(passwordInput.value);
});

confirmPasswordInput.addEventListener("input", () => {
  if (passwordInput.value.length > 0) {
    if (!passwordsMatch()) {
      showFieldError("confirmPassword", "Passwords do not match", "error");
    } else {
      hideFieldError("confirmPassword");
    }
  }
});

confirmPasswordInput.addEventListener("focus", () => {
  if (errorFieldVisible.confirmPassword) {
    hideFieldError("confirmPassword");
  }
});

continueBtn.addEventListener("click", () => {
  // not checking if email is unique
  // server will return right error if is is emailInput event listener is bypassed
  const emailValid = isEmailAddressValid(emailInput.value);
  const passwordValid = meetsPasswordStrengthRequirements(passwordInput.value);
  const confirmPasswordMatch = passwordsMatch();

  let hasError = false;
  if (!emailValid) {
    showFieldError("email", "Please enter a valid email address");
    hasError = true;
  }

  if (!passwordInput.value) {
    showFieldError("password", "This field is required");
    hasError = true;
  } else if (!passwordValid) {
    showFieldError("password", "Please enter a strong password");
    hasError = true;
  }

  if (!confirmPasswordInput.value) {
    showFieldError("confirmPassword", "This field is required");
    hasError = true;
  } else if (!confirmPasswordMatch) {
    showFieldError("confirmPassword", "Passwords do not match");
    hasError = true;
  }

  if (hasError) return;

  pickRandomOption(selectAdjectivesElement);
  pickRandomOption(selectNounsElement);
  updateUsernamePreview();
  showSection("step-2");
  hideSection("step-1");
});

previousRegStepBtn.addEventListener("click", () => {
  showSection("step-1");
  hideSection("step-2");
});

selectAdjectivesElement.addEventListener("change", () => {
  updateUsernamePreview();
});

selectNounsElement.addEventListener("change", () => {
  updateUsernamePreview();
});

randomUsernameBtn.addEventListener("click", () => {
  pickRandomOption(selectAdjectivesElement);
  pickRandomOption(selectNounsElement);
  updateUsernamePreview();
});

submitRegistrationBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  hideFieldError("username");
  hideFieldError("network");
  hideFieldError("adjectives");
  hideFieldError("nouns");

  const emailAddress = emailInput.value;
  const password = passwordInput.value;
  const adjective = selectAdjectivesElement.value;
  const noun = selectNounsElement.value;

  const emailValid = isEmailAddressValid(emailAddress);
  const passwordValid = meetsPasswordStrengthRequirements(password);
  const confirmPasswordMatch = passwordsMatch();

  let hasError = false;
  if (!emailValid) {
    showFieldError("email", "Please enter a valid email address");
    hasError = true;
  }

  if (!passwordInput.value) {
    showFieldError("password", "This field is required");
    hasError = true;
  } else if (!passwordValid) {
    showFieldError("password", "Please enter a strong password");
    hasError = true;
  }

  if (!confirmPasswordInput.value) {
    showFieldError("confirmPassword", "This field is required");
    hasError = true;
  } else if (!confirmPasswordMatch) {
    showFieldError("confirmPassword", "Passwords do not match");
    hasError = true;
  }

  if (hasError) {
    hideSection("step-2");
    showSection("step-1"); // Ensures email+password error is in view
    return;
  }

  if (!adjective) {
    showFieldError("adjectives", "Adjective selection is required");
    hasError = true;
  }

  if (!noun) {
    showFieldError("nouns", "Noun selection is required");
    hasError = true;
  }

  if (hasError) return;

  try {
    const res = await fetch(`/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: emailAddress,
        adjectives: adjective,
        nouns: noun,
        password,
      }),
    });

    if (res.redirected) {
      window.location.href = res.url; // follow the server's redirect
    } else if (!res.ok) {
      const data = await res.json();
      handleServerErrors(data.errors);
      return;
    }
  } catch (error) {
    showFieldError(
      "network",
      "Something went wrong. Please try again.",
      "error"
    );
    console.error(error);
  }
});

showSection("step-1");
