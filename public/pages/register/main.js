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

function showFieldError(field, msg, type) {
  const element = document.querySelector(`[data-error='${field}']`);

  if (!element) return;
  element.textContent = msg;
  element.classList.remove("hidden");

  if (field === "email") emailErrorVisible = true;
}

function hideFieldError(field) {
  const element = document.querySelector(`[data-error='${field}']`);

  if (!element) return;
  element.classList.add("hidden");
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

function isEmailAddressValid(emailAddress) {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(emailAddress.trim());
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

function updateContinueButton() {
  const emailValid = emailInput.value && emailCheckValid;
  const passwordValid =
    passwordInput.value &&
    meetsPasswordStrengthRequirements(passwordInput.value);

  continueBtn.disabled = !(emailValid && passwordValid && passwordsMatch());
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

  emailErrorVisible = false;
  updateContinueButton();
  const emailValid = isEmailAddressValid(emailInput.value);

  if (!emailValid) {
    showFieldError("email", "Invalid email address", "error");
    emailErrorVisible = true;
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
    updateContinueButton();
  }
}

emailInput.addEventListener("focus", () => {
  emailAbortController?.abort(); // cancel in-flight request
  emailCheckValid = false;
  updateContinueButton();
});

emailInput.addEventListener("input", () => {
  if (!emailErrorVisible) return;

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
  updateContinueButton();
});

passwordInput.addEventListener("blur", () => {
  updatePasswordReqVisibility();
  updateRequirements(passwordInput.value);
  updateContinueButton();
});

passwordInput.addEventListener("focus", () => {
  updatePasswordReqVisibility();
  updateRequirements(passwordInput.value);
  updateContinueButton();
});

confirmPasswordInput.addEventListener("input", () => {
  if (passwordInput.value.length > 0) {
    if (!passwordsMatch()) {
      showFieldError("confirmPassword", "Passwords do not match", "error");
    } else {
      hideFieldError("confirmPassword");
    }
  }

  updateContinueButton();
});

continueBtn.addEventListener("click", () => {
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

  const randomSuffix = generateSuffix();
  const username = `${selectAdjectivesElement.value}-${selectNounsElement.value}-${randomSuffix}`;

  const res = await fetch(`/register/check-username?username=${username}`);
  const { taken } = await res.json();

  if (taken) {
    showFieldError("username", "Username already in use. Try again.", "info");
    return;
  }

  const emailAddress = emailInput.value;
  const password = passwordInput.value;

  try {
    const res = await fetch(`/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: emailAddress, username, password }),
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
    console.error(error, "local error");
  }
});

showSection("step-1");
