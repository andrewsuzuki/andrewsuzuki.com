import React, { useState } from "react"
import { useForm } from "react-hook-form"

const NETLIFY_FORM_NAME = "andrewsuzuki-contact"

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

export default function ContactForm() {
  const [submitResult, setSubmitResult] = useState(false)

  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm()

  if (submitResult === true) {
    return (
      <p className="success-message">Your message was sent successfully!</p>
    )
  }

  const onSubmit = async data => {
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": NETLIFY_FORM_NAME,
          ...data,
        }),
      })

      if (response.status !== 200) {
        throw new Error()
      }

      setSubmitResult(true)
    } catch (err) {
      setSubmitResult("Submission error, please try again.")
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <div className="contact-form">
      <form
        className="form"
        name={NETLIFY_FORM_NAME}
        action="/contact"
        method="post"
        onSubmit={handleSubmit(onSubmit)}
        data-netlify="true"
        data-netlify-honeypot="bot-field"
      >
        <input
          type="hidden"
          name="form-name"
          value={NETLIFY_FORM_NAME}
          ref={register}
        />
        <p hidden>
          <label htmlFor="bot-field">
            Don’t fill this out: <input name="bot-field" ref={register} />
          </label>
        </p>
        <div className="field">
          <label htmlFor="contact-name">
            <span>Name</span>
            <input
              type="text"
              placeholder="Name"
              name="name"
              id="contact-name"
              className={errors.name ? "has-error" : null}
              ref={register({ required: true, maxLength: 80 })}
            />
          </label>
        </div>
        <div className="field">
          <label htmlFor="contact-email">
            <span>Email</span>
            <input
              type="email"
              placeholder="Email"
              name="email"
              id="contact-email"
              className={errors.email ? "has-error" : null}
              ref={register({ required: true, pattern: /^\S+@\S+$/i })}
            />
          </label>
        </div>
        <div className="field">
          <label htmlFor="contact-message">
            <span>Message</span>
            <textarea
              name="message"
              id="contact-message"
              className={errors.message ? "has-error" : null}
              ref={register({ required: true })}
            />
          </label>
        </div>

        <div className="field">
          {hasErrors && (
            <p className="error-message">
              Please correct the above fields before submitting again.
            </p>
          )}
          {typeof submitResult === "string" && (
            <p className="error-message">{submitResult}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            title="Submit contact form"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
