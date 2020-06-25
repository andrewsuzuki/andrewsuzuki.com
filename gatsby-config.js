const url = require("url")
const _ = require("lodash")
const visit = require("unist-util-visit")

module.exports = {
  siteMetadata: {
    title: `Andrew Suzuki`,
    description: `I'm a software engineer, musician, maker, and cyclist. This is my personal website and blog.`,
    author: `@andrewsuzuki`,
    siteUrl: `https://andrewsuzuki.com`,
  },
  plugins: [
    `gatsby-plugin-remove-trailing-slashes`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/src/content/posts`,
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            // resolve: "gatsby-remark-images",
            resolve: require.resolve("./gatsby-remark-mdx-image-gallery"),
            options: {
              maxWidth: 680,
            },
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          {
            resolve: "gatsby-remark-smartypants",
            options: {
              // -- => en, --- => em
              dashes: "oldschool",
            },
          },
        ],
      },
    },
    "gatsby-plugin-catch-links",
    {
      resolve: `gatsby-plugin-feed-mdx`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.edges.map(edge => {
                const postUrl = url.resolve(
                  site.siteMetadata.siteUrl,
                  edge.node.fields.slug
                )

                const excerptNodes = []
                visit(edge.node.mdxAST, node => {
                  if (node.type === `text` || node.type === `inlineCode`) {
                    excerptNodes.push(node.value)
                  }
                  return
                })

                const pruneLength = 280
                const excerpt = _.truncate(
                  excerptNodes
                    .join(" ")
                    .split(" ")
                    .filter(a => a)
                    .reduce((acc, s, i) => {
                      if (i === 0) {
                        return s
                      } else if ([".", "!", "?"].includes(s)) {
                        return `${acc}${s}`
                      } else {
                        return `${acc} ${s}`
                      }
                    }, ""),
                  {
                    length: pruneLength,
                    omission: `…`,
                  }
                )

                const { tagsWithPaths } = edge.node.fields
                const rssCategories = tagsWithPaths
                  ? tagsWithPaths.map(({ tag }) => tag)
                  : []

                return {
                  description: excerpt,
                  title: edge.node.frontmatter.title,
                  date: edge.node.frontmatter.date,
                  categories: rssCategories,
                  url: postUrl,
                  guid: postUrl,
                }
              })
            },
            query: `
              {
                allMdx(
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { frontmatter: { draft: { ne: true } } },
                ) {
                  edges {
                    node {
                      mdxAST
                      fields {
                        slug
                        tagsWithPaths {
                          tag
                        }
                      }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Andrew Suzuki's Blog",
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            match: "^/posts/",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Andrew Suzuki`,
        short_name: `Andrew Suzuki`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#ffffff`,
        // Unfortunately, can't use favicon.svg source on netlify
        // (doesn't have correct font), so for now use the png version
        icon: `src/images/favicon-512x512.png`,
      },
    },
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-22359344-6",
      },
    },
    {
      resolve: "gatsby-plugin-nprogress",
      options: {
        color: "#0074d9",
        showSpinner: false,
      },
    },
    {
      // Add Netlify _headers [and optionally _redirects] to publish directory
      // Automatically generates Cache-Control and Link headers
      resolve: "gatsby-plugin-netlify",
      options: {},
    },
  ],
}
