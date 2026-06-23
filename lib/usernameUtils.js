function buildUsername(adjective, noun) {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${adjective.toLowerCase()}-${noun.toLowerCase()}-${suffix}`;
}

export { buildUsername };
