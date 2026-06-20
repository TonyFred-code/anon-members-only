import { getAllPosts } from "../db/queries.js";

async function homeGet(req, res, next) {
  try {
    const posts = await getAllPosts();
    res.render("home", { posts });
  } catch (error) {
    next(error);
  }
}

export { homeGet };
