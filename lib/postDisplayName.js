function getDisplayName(post, viewer) {
  console.log(post, viewer);
  if (viewer && (viewer.is_member || viewer.is_admin)) {
    if (viewer.id === post.author_id) return "You";

    return post.author_username;
  }
  return `anon-${post.author_id.slice(0, 4)}-${post.author_id.slice(4, 8)}`;
}

export { getDisplayName };
