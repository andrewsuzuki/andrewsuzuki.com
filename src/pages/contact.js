import React from "react"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"
import ContactForm from "../components/ContactForm"

const ContactPage = () => (
  <Layout>
    <SEO title="Contact" />
    <PageTitle>Contact</PageTitle>
    <ContactForm />
  </Layout>
)

export default ContactPage
