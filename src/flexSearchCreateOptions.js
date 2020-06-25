// NOTE uses exports so that gatsby-node.js can import

// TODO tweak indexing parameters
exports.flexSearchCreateOptions = {
  doc: {
    id: "id",
    field: ["title", "tag0", "tag1", "tag2", "year", "content"],
    tag: ["tag0", "tag1", "tag2", "year"], // super-fields
  },
}
