import React, { useContext } from "react"
import { ModalContext } from "./Layout"
import ModalCarousel from "./ModalCarousel"
import ProgressiveImage from "./ProgressiveImage"

const FullImageMDX = ({ image }) => {
  const setModal = useContext(ModalContext)

  if (!image) {
    return null
  }

  return (
    <div className="full-image-mdx">
      <a
        href={image.original}
        title={image.caption}
        onClick={e => {
          e.preventDefault()
          setModal(<ModalCarousel images={[image]} initialIndex={0} />)
        }}
      >
        <ProgressiveImage {...image} />
      </a>
    </div>
  )
}

export default FullImageMDX
