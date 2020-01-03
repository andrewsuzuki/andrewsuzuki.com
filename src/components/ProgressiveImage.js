import React from "react"
import PropTypes from "prop-types"

const ProgressiveImage = ({
  className = "",
  useOriginal = false,
  // loadingImage,
  original,
  // aspectRatio,
  alt,
  title,
  src, // fallback
  srcSet,
  sizes,
  loading,
}) => {
  return (
    <div className={`progressive-image-wrapper ${className}`}>
      <img
        src={useOriginal ? original : src}
        srcSet={useOriginal ? null : srcSet}
        sizes={useOriginal ? null : sizes}
        alt={alt}
        title={title}
        loading={loading}
      />
    </div>
  )
}

ProgressiveImage.propTypes = {
  // Per-application component props
  className: PropTypes.string,
  useOriginal: PropTypes.bool,
  // Component props
  loadingImage: PropTypes.string,
  original: PropTypes.string.isRequired,
  // caption: PropTypes.string,
  // presentationWidth: PropTypes.string.isRequired,
  aspectRatio: PropTypes.number.isRequired,
  // img props
  alt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired, // fallback
  srcSet: PropTypes.string.isRequired, // fallback
  sizes: PropTypes.string.isRequired,
  loading: PropTypes.string.isRequired,
}

export default ProgressiveImage
