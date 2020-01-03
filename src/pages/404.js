import React from "react"
import { Link } from "gatsby"

import Layout, { Content } from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404 Not found" />
    <PageTitle>404 Page Not Found</PageTitle>
    <Content>
      <p>The requested page doesn't exist.</p>
      <p>
        <Link to="/" title="Posts">
          Browse all posts?
        </Link>
      </p>
    </Content>
  </Layout>
)

export default NotFoundPage
