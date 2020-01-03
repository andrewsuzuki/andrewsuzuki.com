import React, { useContext, useEffect } from "react"
import { ModalContext } from "./Layout"

const Modal = ({ children }) => {
  const setModal = useContext(ModalContext)

  const close = () => setModal(null)

  const onClickOverlay = e => {
    if (e.target && e.target.className === "modal-overlay") {
      close()
    }
  }

  const onDown = e => {
    if (e.key === "Escape" || e.keyCode === 27) {
      close()
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onDown)

    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", onDown)
    }
  })

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <div className="modal-overlay" onClick={onClickOverlay} role="dialog">
        {children}
        <div className="modal-close">
          <button onClick={close}>✖</button>
        </div>
      </div>
    </>
  )
}

export default Modal
