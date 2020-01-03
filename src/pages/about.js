import React from "react"
import { Link } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"

const AboutPage = () => (
  <Layout>
    <SEO title="About" />
    <PageTitle>About</PageTitle>
    <p>My name is Andrew Suzuki.</p>
    <p>I am a software engineer, cyclist, maker, and musician.</p>
    <p>I live in New Haven, CT.</p>
    <p>
      <Link to="/contact" title="Contact me">
        Send me an email!
      </Link>
    </p>
  </Layout>
)

export default AboutPage
