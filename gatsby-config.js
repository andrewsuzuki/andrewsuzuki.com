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
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 680,
            },
          },
          // {
          //   resolve: "gatsby-remark-responsive-iframe",
          //   options: {
          //     wrapperStyle: "margin-bottom: 1.0725rem",
          //   },
          // },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          {
            resolve: "gatsby-remark-smartypants",
            options: {
              // -- => en, --- => em
              dashes: "oldschool",
            },
          },
          // TODO mdx?
        ],
      },
    },
    `gatsby-plugin-sharp`,
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
