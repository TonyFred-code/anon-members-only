function buildUsernameIfMissing(req, res, next) {
  if (!req.body.username && req.body.adjectives && req.body.nouns) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    req.body.username = `${req.body.adjectives}-${req.body.nouns}-${suffix}`;
  }
  next();
}

export { buildUsernameIfMissing };
