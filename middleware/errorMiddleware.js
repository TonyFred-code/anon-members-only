function serverErrorMiddleware(err, res, req, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const errMessage = err.message || "Internal server error";
  res.status(statusCode).type("text").send(`Error: ${errMessage}`);
}

export { serverErrorMiddleware };
