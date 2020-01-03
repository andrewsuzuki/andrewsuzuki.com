import React, { useState } from "react"
import ProgressiveImage from "./ProgressiveImage"

const ModalCarousel = ({ images, initialIndex }) => {
  const [index, setIndex] = useState(initialIndex)

  // current image
  const image = images[index]

  if (!image) {
    if (images.length) {
      // Probably not reachable, but just reset index in this case.
      setIndex(0)
    }

    return null
  }

  return (
    <>
      <ProgressiveImage {...image} useOriginal className="modal-inner" />
      {image.caption && (
        <div className="modal-caption">
          <span>{image.caption}</span>
        </div>
      )}
      {images.length > 1 && index !== 0 && (
        <div className="modal-nav left">
          <button onClick={() => setIndex(index - 1)} title="Previous Image">
            🢀
          </button>
        </div>
      )}
      {images.length > 1 && index !== images.length - 1 && (
        <div className="modal-nav right">
          <button onClick={() => setIndex(index + 1)} title="Next Image">
            🢂
          </button>
        </div>
      )}
    </>
  )
}

export default ModalCarousel
