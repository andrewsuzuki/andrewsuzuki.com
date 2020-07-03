/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const _ = require("lodash")
const path = require("path")
const fs = require("fs")
const visit = require("unist-util-visit")
const FlexSearch = require("flexsearch")
const { flexSearchCreateOptions } = require("./src/flexSearchCreateOptions")

// Helpers

function postSlugToPath(postSlug) {
  return `/${postSlug}`
}

function tagSlugToPath(tagSlug) {
  return `/tags/${tagSlug}`
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

// Gatsby

/**
 * Handle Mdx node creation from gatsby-plugin-mdx,
 * adding slug (from parent File node), series, and tag fields.
 */
exports.onCreateNode = ({ node, actions, reporter, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === "Mdx") {
    // Get the parent File node for directory name
    const fileNode = getNode(node.parent)

    // Must be a File that came from posts source
    if (
      fileNode.internal.type !== "File" ||
      fileNode.sourceInstanceName !== "posts"
    ) {
      reporter.warn(
        `Markdown Mdx parent node was not a File from 'posts' source, skipping.`
      )
      return
    }

    // Derive slug and slugPath (from parent File node)
    const parsedFilePath = path.parse(fileNode.absolutePath)
    const splitDir = parsedFilePath.dir.split("---")
    if (
      ![".md", ".mdx"].includes(parsedFilePath.ext) ||
      splitDir.length !== 2
    ) {
      reporter.panicOnBuild(
        `Post directory format is malformed; must consist of two parts separated by '---'.`
      )
      return
    }
    // Determine slug from directory name
    // The date prefix is not used (only for file browser order)
    // Example: 2017-04-01---foo-bar
    const slug = splitDir[1]
    const slugPath = postSlugToPath(slug)

    const { frontmatter } = node

    // Validate frontmatter
    const validators = [
      [frontmatter.title, "missing title"],
      [frontmatter.description, "missing description"],
      [frontmatter.date, "missing date"],
      [
        /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/.test(
          frontmatter.date
        ),
        "invalid iso 8601 date",
      ],
      [typeof frontmatter.draft === "boolean", "missing draft, or not boolean"],
    ]
    validators.forEach(([ok, error]) => {
      if (!ok) {
        console.log(node)
        reporter.panicOnBuild(
          `Frontmatter validation failed (${node.fileAbsolutePath}): ${error}`
        )
      }
    })

    // Add fields to this Mdx node

    // Add slug (mostly for plugin compat, e.g. gatsby-plugin-feed[-mdx])
    createNodeField({
      node,
      name: "slug",
      value: slug,
    })

    // Add slugWithPath
    createNodeField({
      node,
      name: "slugWithPath",
      value: { slug, path: slugPath },
    })

    // Add seriesSlug
    createNodeField({
      node,
      name: "seriesSlug",
      value: postSlugToSeriesMap[slug] || NOT_IN_SERIES,
    })

    // Add tagsWithPaths field to the Mdx node with (tag, path) maps
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
 * 5. Reduce list of all series from posts, and create a page for each
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const postPageTemplate = path.resolve("src/templates/PostPage.js")
  const tagPageTemplate = path.resolve("src/templates/TagPage.js")

  const result = await graphql(`
    {
      allMdx(limit: 2000, filter: { frontmatter: { draft: { ne: true } } }) {
        edges {
          node {
            mdxAST
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
              title
              description
              date
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

  const postEdges = result.data.allMdx.edges

  const postSlugToTitleMap = postEdges.reduce(
    (acc, edge) => ({
      ...acc,
      [edge.node.fields.slugWithPath.slug]: edge.node.frontmatter.title,
    }),
    {}
  )

  // Verify series posts against actual post slugs
  Object.entries(seriesMap).forEach(([seriesSlug, series]) => {
    if (series.posts) {
      series.posts.forEach(post => {
        if (!postSlugToTitleMap[post.postSlug]) {
          reporter.panicOnBuild(
            `Series ${seriesSlug} specifies posts that don't exist, or are drafts.`
          )
        }
      })
    }
  })

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

  // Build search index (NOTE doesn't have to do with page creation, but
  // this seems to be the only Gastsby Node API that exposes graphql.)

  const activity = reporter.activityTimer(`build flexsearch index`)
  activity.start()

  const index = new FlexSearch(flexSearchCreateOptions)

  // To save final space in the final export, maintain a map
  // of ad hoc integers to actual post documents (for display)
  let id = 0
  const postDocs = {}

  postEdges
    .map(edge => {
      // extract text nodes from mdx (markdown) AST, then
      // crudely join them together to form search content
      const ast = edge.node.mdxAST || {}
      const textNodes = []
      visit(ast, "text", textNode => {
        textNodes.push(textNode.value)
      })
      return {
        node: edge.node,
        crudeContent: textNodes.join(" "),
      }
    })
    .forEach(({ node, crudeContent }) => {
      const thisId = id++
      postDocs[thisId] = {
        title: node.frontmatter.title,
        date: node.frontmatter.date,

        slugWithPath: node.fields.slugWithPath,
        tagsWithPaths: node.fields.tagsWithPaths,
      }

      const indexedTags = node.fields.tagsWithPaths
        ? node.fields.tagsWithPaths.reduce((acc, { tag }, i) => {
            // only take first three tags (tag0, tag1, tag2)
            if (i > 2) {
              return acc
            }
            return {
              ...acc,
              [`tag${i}`]: tag,
            }
          }, {})
        : {}

      const year = new Date(node.frontmatter.date).getFullYear()

      // Add as "document"
      index.add({
        id: thisId,
        title: node.frontmatter.title,
        ...indexedTags,
        year: `${year}`,
        content: crudeContent,
      })
    })

  await fs.promises.writeFile(
    `./public/search-index.json`,
    JSON.stringify({
      postDocs,
      index: index.export({
        serialize: false, // don't stringify (yet)
        index: true, // export index
        doc: false, // don't export search docs as we're exporting our own (with additional data)
      }),
    })
  )

  activity.end()
}

// Allow local imports from src (e.g. import Tag from 'components/Tag')
// NOTE This is a workaround for gatsby-plugin-mdx local imports
// Follow https://github.com/gatsbyjs/gatsby/issues/20150 for updates
// and remove this / update imports if relative imports are implemented?
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
  })
}
