import React from "react"

import Layout, { Content } from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"
import ContactForm from "../components/ContactForm"

const ContactPage = () => (
  <Layout>
    <SEO title="Contact" description="Send me an email" />
    <PageTitle>Contact</PageTitle>
    <Content>
      <p>Feel free to send me an email using the form below.</p>
      <ContactForm />
    </Content>
  </Layout>
)

export default ContactPage
