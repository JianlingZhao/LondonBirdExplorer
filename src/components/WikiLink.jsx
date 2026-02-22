function WikiLink({ url }) {
  // modal bottom_wiki link (external)

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#7FAF8B", textDecoration: "underline" }}
    >
      View on Wikipedia
    </a>
  );
}

export default WikiLink;
