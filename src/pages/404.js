import React from "react"
import { Link } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404 Not found" />
    <PageTitle>404 Page Not Found</PageTitle>
    <p>The requested page doesn't exist anymore.</p>
    <p>
      <Link to="/">Browse all posts?</Link>
    </p>
  </Layout>
)

export default NotFoundPage
