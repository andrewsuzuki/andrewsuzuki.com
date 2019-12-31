/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const _ = require("lodash")
const path = require("path")

// Helpers

function postSlugToPath(postSlug) {
  return `/posts/${postSlug}`
}

function tagSlugToPath(tagSlug) {
  return `/tags/${tagSlug}`
}

function categorySlugToPath(categorySlug) {
  return `/categories/${categorySlug}`
}

function seriesSlugToPath(seriesSlug) {
  return `/series/${seriesSlug}`
}

// Series setup

const seriesMapRaw = require("./src/content/series.json")

const seriesMap = Object.entries(seriesMapRaw).reduce(
  (acc, [seriesSlug, series]) => ({
    ...acc,
    [seriesSlug]: {
      ...series,
      posts: series.posts.map(postSlug => ({
        postSlug,
        path: postSlugToPath(postSlug),
      })),
    },
  }),
  {}
)

const NOT_IN_SERIES = "***NOT_IN_SERIES***"

const seriesSlugs = Object.keys(seriesMap)
// Make a reverse lookup for posts => series
const postSlugToSeriesMap = seriesSlugs.reduce((acc, seriesSlug) => {
  const { posts } = seriesMap[seriesSlug]
  return !posts
    ? acc
    : {
        ...acc,
        ...posts.reduce(
          (iacc, { postSlug }) => ({ ...iacc, [postSlug]: seriesSlug }),
          {}
        ),
      }
}, {})

// Categories setup

const categoriesMap = require("./src/content/categories.json")

const categoriesSlugs = Object.keys(categoriesMap)

// Gatsby

/**
 * 1. Handle File node creation from gatsby-plugin-filesystem,
 *    adding slug fields to appropriately well-formed md files
 * 2. Handle MarkdownRemark node creation from gatsby-transformer-remark,
 *    adding slug, series, tag fields. These nodes are children of their
 *    associated File node.
 */
exports.onCreateNode = ({ node, actions, reporter, getNode }) => {
  const { createNodeField } = actions

  if (node.sourceInstanceName === "posts" && node.internal.type === "File") {
    // Handle File nodes from the "posts" filesystem source

    const parsedFilePath = path.parse(node.absolutePath)
    const splitDir = parsedFilePath.dir.split("---")
    if (parsedFilePath.ext === ".md" && splitDir.length === 2) {
      // Add custom url pathname for blog posts.

      // Determine slug from directory name
      // The date prefix is not used (only for file browser order)
      // Example: 2017-04-01---foo-bar
      const slug = splitDir[1]
      const slugPath = postSlugToPath(slug)

      createNodeField({
        node,
        name: "slugWithPath",
        value: { slug, path: slugPath },
      })
    }
  } else if (
    node.internal.type === "MarkdownRemark"
    // && typeof node.slug === "undefined" // handle once
  ) {
    // Handle MarkdownRemark nodes

    const { frontmatter } = node

    // Validate frontmatter
    const validators = [
      [frontmatter.title, "missing title"],
      [frontmatter.category, "missing category"],
      [
        categoriesSlugs.includes(frontmatter.category),
        "specified category not found in categories.json",
      ],
      [frontmatter.date, "missing date"],
      [
        /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/.test(
          frontmatter.date
        ),
        "invalid iso 8601 date",
      ],
      [
        (typeof frontmatter.draft === "boolean",
        "missing draft, or not boolean"),
      ],
    ]
    validators.forEach(([ok, error]) => {
      if (!ok) {
        console.log(node)
        reporter.panicOnBuild(
          `Frontmatter validation failed (${node.fileAbsolutePath}): ${error}`
        )
      }
    })

    // Copy slug from parent node (File) to this MarkdownRemark node
    const fileNode = getNode(node.parent)
    const fileNodeSlug = _.get(fileNode, "fields.slugWithPath")
    if (fileNodeSlug) {
      createNodeField({
        node,
        name: "slugWithPath",
        value: fileNodeSlug,
      })

      // attach series slug
      const seriesSlug = postSlugToSeriesMap[fileNodeSlug.slug]
      createNodeField({
        node,
        name: "seriesSlug",
        value: seriesSlug || NOT_IN_SERIES,
      })
    }

    // Add categoryWithPath
    createNodeField({
      node,
      name: "categoryWithPath",
      value: {
        slug: frontmatter.category,
        path: categorySlugToPath(frontmatter.category),
        name: categoriesMap[frontmatter.category].name,
      },
    })

    // Add tagsWithPaths field to the MarkdownRemark node with (tag, path) maps
    if (frontmatter.tags) {
      const tagsWithPaths = frontmatter.tags.map(tag => ({
        tag,
        path: tagSlugToPath(tag),
      }))

      createNodeField({
        node,
        name: "tagsWithPaths",
        value: tagsWithPaths,
      })
    }
  }
}

/**
 * 1. Grab our page templates
 * 2. Get all blog posts through graphql
 * 3. Create a page for each blog post
 * 4. Reduce list of all tags from posts, and create a page for each
 * 5. Reduce list of all categories from posts, and create a page for each
 * 6. Reduce list of all series from posts, and create a page for each
 */
// TODO all-categories page
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const postPageTemplate = path.resolve("src/templates/PostPage.js")
  const tagPageTemplate = path.resolve("src/templates/TagPage.js")
  const categoryPageTemplate = path.resolve("src/templates/CategoryPage.js")

  const result = await graphql(`
    {
      allMarkdownRemark(
        limit: 2000
        filter: { frontmatter: { draft: { ne: true } } }
      ) {
        edges {
          node {
            fields {
              seriesSlug
              slugWithPath {
                slug
                path
              }
              tagsWithPaths {
                tag
                path
              }
            }
            frontmatter {
              category
              title
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const postEdges = result.data.allMarkdownRemark.edges

  const postSlugToTitleMap = postEdges.reduce(
    (acc, edge) => ({
      ...acc,
      [edge.node.fields.slugWithPath.slug]: edge.node.frontmatter.title,
    }),
    {}
  )

  // Create blog post pages

  postEdges.forEach(edge => {
    const { slugWithPath, seriesSlug } = edge.node.fields

    const seriesMaybe =
      seriesSlug !== NOT_IN_SERIES ? seriesMap[seriesSlug] : null

    createPage({
      path: slugWithPath.path,
      component: postPageTemplate,
      context: {
        slug: slugWithPath.slug,
        series: seriesMaybe && {
          ...seriesMaybe,
          posts: seriesMaybe.posts.map(post => ({
            // add post titles of other series posts,
            // now that they're known
            ...post,
            title: postSlugToTitleMap[post.postSlug],
          })),
        },
      },
    })
  })

  // Create tag pages (reduced from post frontmatter)

  // Collect all tags (with their paths -- see onCreateNode)
  const allTagsWithPaths = postEdges.reduce((acc, edge) => {
    const postTags = _.get(edge, "node.fields.tagsWithPaths")
    return postTags ? [...acc, ...postTags] : acc
  }, [])
  // Unique by the 'tag' key
  const uniqueTagsWithPaths = _.uniqBy(allTagsWithPaths, "tag")
  // Create pages
  uniqueTagsWithPaths.forEach(tagWithPath => {
    createPage({
      path: tagWithPath.path,
      component: tagPageTemplate,
      context: {
        tag: tagWithPath.tag,
      },
    })
  })

  // Create category pages (from categories.json)

  categoriesSlugs.forEach(category => {
    createPage({
      path: categorySlugToPath(category),
      component: categoryPageTemplate,
      context: {
        category,
        name: categoriesMap[category].name,
        // FUTURE more fields here
      },
    })
  })
}
