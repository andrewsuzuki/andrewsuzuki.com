module.exports = {
  siteMetadata: {
    title: `Andrew Suzuki`, // TODO
    description: ``, // TODO
    author: `@andrewsuzuki`,
  },
  plugins: [
    // TODO source-filesystem (page content)
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    // TODO remark
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Andrew Suzuki`,
        short_name: `Andrew Suzuki`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#ffffff`,
        icon: `src/images/favicon.svg`,
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
        // TODO override spinner right offset override on mobile
        showSpinner: true,
      },
    },
    "gatsby-plugin-catch-links",
  ],
}
