function buildUsername(adjective, noun) {
  const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${adjective.toLowerCase()}-${noun.toLowerCase()}-${suffix}`;
}

function getDisplayNameFromUsername(username) {
  const [adjective, noun] = username.split("-");
  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
  return `${capitalize(adjective)} ${capitalize(noun)}`;
}

export { buildUsername, getDisplayNameFromUsername };
