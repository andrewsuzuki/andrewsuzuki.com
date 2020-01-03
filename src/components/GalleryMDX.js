import React, { useContext } from "react"
import { ModalContext } from "./Layout"
import ModalCarousel from "./ModalCarousel"
import ProgressiveImage from "./ProgressiveImage"

const GalleryMDX = ({ images }) => {
  const setModal = useContext(ModalContext)

  if (!images) {
    return null
  }

  return (
    <div className="gallery-thumbnails">
      {images.map((image, i) => (
        <a
          key={i}
          href={image.original}
          title={image.caption}
          onClick={e => {
            e.preventDefault()
            setModal(<ModalCarousel images={images} initialIndex={i} />)
          }}
        >
          <ProgressiveImage {...image} />
        </a>
      ))}
    </div>
  )
}

export default GalleryMDX
