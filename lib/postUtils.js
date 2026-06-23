function getPostAuthorDisplayName(post, viewer) {
  if (viewer && viewer.id === post.author_id) return "You";

  if (viewer && (viewer.is_member || viewer.is_admin)) {
    return post.author_username;
  }

  return `anon-${post.author_id.slice(0, 4)}-${post.author_id.slice(4, 8)}`;
}

export { getPostAuthorDisplayName };
