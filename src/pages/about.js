import React from "react"
import { Link } from "gatsby"

import Layout, { Content } from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"

const AboutPage = () => (
  <Layout>
    <SEO title="About" />
    <PageTitle>About</PageTitle>
    <Content>
      <p>My name is Andrew Suzuki.</p>
      <p>I'm a software engineer, cyclist, maker, and musician.</p>
      <p>I live in New Haven, CT.</p>
      <p>
        <Link to="/contact" title="Contact">
          Send me an email!
        </Link>
      </p>
    </Content>
  </Layout>
)

export default AboutPage
