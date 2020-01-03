import React from "react"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"
import ContactForm from "../components/ContactForm"

const ContactPage = () => (
  <Layout>
    <SEO title="Contact" />
    <PageTitle>Contact</PageTitle>
    <p>Feel free to send me an email using the form below.</p>
    <ContactForm />
  </Layout>
)

export default ContactPage
