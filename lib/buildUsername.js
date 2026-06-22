function buildUsername(adjective, noun) {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${adjective}-${noun}-${suffix}`;
}

export { buildUsername };
