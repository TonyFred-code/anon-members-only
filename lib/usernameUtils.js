function buildUsername(adjective, noun) {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${adjective.toLowerCase()}-${noun.toLowerCase()}-${suffix}`;
}

function getDisplayNameFromUsername(username) {
  const [adjective, noun] = username.split("-");
  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
  return `${capitalize(adjective)} ${capitalize(noun)}`;
}

export { buildUsername, getDisplayNameFromUsername };
