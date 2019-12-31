module.exports = {
  siteMetadata: {
    title: `Andrew Suzuki`,
    description: `I'm a software engineer, musician, maker, and cyclist. This is my personal website and blog.`,
    author: `@andrewsuzuki`,
  },
  plugins: [
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
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-images",
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
    `gatsby-plugin-sharp`,
    `gatsby-plugin-feed-mdx`,
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
    "gatsby-plugin-catch-links",
  ],
}
