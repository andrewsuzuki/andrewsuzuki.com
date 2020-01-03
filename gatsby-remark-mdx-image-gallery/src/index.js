const { DEFAULT_OPTIONS } = require(`./constants`)
const visitWithParents = require(`unist-util-visit-parents`)
const getDefinitions = require(`mdast-util-definitions`)
const path = require(`path`)
const queryString = require(`query-string`)
const isRelativeUrl = require(`is-relative-url`)
const _ = require(`lodash`)
const { fluid, stats } = require(`gatsby-plugin-sharp`)
const Promise = require(`bluebird`)
const { slash } = require(`gatsby-core-utils`)
const chalk = require(`chalk`)
const remark = require(`remark`) // slightly dirty as this is probably a different version of remark

// If the image is relative (not hosted elsewhere)
// 1. Find the image file
// 2. Find the image's size
// 3. Filter out any responsive image fluid sizes that are greater than the image's width
// 4. Create the responsive images.
// 5. Set the html w/ aspect ratio helper.
module.exports = (
  {
    files,
    markdownNode,
    markdownAST,
    pathPrefix,
    getNode,
    reporter,
    cache,
    compiler,
  },
  pluginOptions
) => {
  const options = _.defaults(pluginOptions, { pathPrefix }, DEFAULT_OPTIONS)

  // Validate loading option
  if (![`lazy`, `eager`, `auto`].includes(options.loading)) {
    reporter.warn(
      reporter.stripIndent(`
        ${chalk.bold(options.loading)} is an invalid value for the ${chalk.bold(
        `loading`
      )} option. Please pass one of "lazy", "eager" or "auto".
      `)
    )
  }

  // Get all the available definitions in the markdown tree
  const definitions = getDefinitions(markdownAST)

  // Get all "full" images (to be standalone, full-width, possibly with modal)
  const fullImageNodes = []
  visitWithParents(
    markdownAST,
    [`image`, `imageReference`],
    (node, ancestors) => {
      // this image must be the only child of a paragraph
      const parent = ancestors[ancestors.length - 1]
      if (parent.type === "paragraph" || parent.children.length === 1) {
        fullImageNodes.push({ node, parentParagraph: parent })
      }
    }
  )

  // Get all "gallery" code blocks (to be thumbnail gallery with modal carousel)
  const galleryCodeNodes = []
  visitWithParents(markdownAST, [`code`], node => {
    if (node.lang === "gallery") {
      // Parse markdown ast inside code block and get image nodes
      const subImageNodes = []
      const galleryAST = remark().parse(node.value)
      visitWithParents(galleryAST, [`image`], imageNode => {
        subImageNodes.push(imageNode)
      })

      // Add
      galleryCodeNodes.push({ node, subImageNodes })
    }
  })

  const getImageInfo = uri => {
    const { url, query } = queryString.parseUrl(uri)
    return {
      ext: path
        .extname(url)
        .split(`.`)
        .pop(),
      url,
      query,
    }
  }

  const warnBadImage = path => {
    console.error(`bad image ${path}, does it exist?`)
  }

  const captionOptions = Array.isArray(options.showCaptions)
    ? options.showCaptions
    : options.showCaptions === true
    ? [`title`, `alt`]
    : []
  const getImageCaption = (node, overWrites) => {
    const getCaptionString = () => {
      for (const option of captionOptions) {
        switch (option) {
          case `title`:
            if (node.title) {
              return node.title
            }
            break
          case `alt`:
            if (overWrites.alt) {
              return overWrites.alt
            }
            if (node.alt) {
              return node.alt
            }
            break
        }
      }

      return null
    }
    const captionString = getCaptionString()

    if (!captionString) {
      return null
    }

    if (!options.markdownCaptions || !compiler) {
      return _.escape(captionString)
    }

    // Compile markdown in captions
    return compiler.generateHTML(compiler.parseString(captionString))
  }

  // Takes a node and generates the needed images and then returns
  // the needed HTML replacement for the image
  const generateFull = async function(node, overWrites = {}) {
    // Check if this markdownNode has a File parent. This plugin
    // won't work if the image isn't hosted locally.
    const parentNode = getNode(markdownNode.parent)
    let imagePath
    if (parentNode && parentNode.dir) {
      imagePath = slash(path.join(parentNode.dir, getImageInfo(node.url).url))
    } else {
      return null
    }

    const imageNode = _.find(files, file => {
      if (file && file.absolutePath) {
        return file.absolutePath === imagePath
      }
      return null
    })

    if (!imageNode || !imageNode.absolutePath) {
      return null
    }

    // Process image (with gatsby-plugin-sharp)
    let fluidResult = await fluid({
      file: imageNode,
      args: options,
      reporter,
      cache,
    })

    if (!fluidResult) {
      return null
    }

    // Generate default alt tag
    const srcSplit = getImageInfo(node.url).url.split(`/`)
    const fileName = srcSplit[srcSplit.length - 1]
    const fileNameNoExt = fileName.replace(/\.[^/.]+$/, ``)
    const defaultAlt = fileNameNoExt.replace(/[^A-Z0-9]/gi, ` `)

    const alt = _.escape(
      overWrites.alt ? overWrites.alt : node.alt ? node.alt : defaultAlt
    )

    const title = node.title ? _.escape(node.title) : alt

    let disableLoadingImage = false
    if (options.disableBgImageOnAlpha) {
      const imageStats = await stats({ file: imageNode, reporter })
      if (imageStats && imageStats.isTransparent) {
        disableLoadingImage = true
      }
    }

    return {
      // Component props
      loadingImage: disableLoadingImage ? null : fluidResult.base64,
      original: fluidResult.originalImg,
      caption: options.showCaptions ? getImageCaption(node, overWrites) : null,
      presentationWidth: fluidResult.presentationWidth, // (number)
      aspectRatio: fluidResult.aspectRatio, // (number)

      // HTML props for <img />
      alt,
      title,
      src: fluidResult.src, // (fallback)
      srcSet: fluidResult.srcSet,
      sizes: fluidResult.sizes,
      loading: options.loading,
    }
  }

  const updateFullImageNode = (node, obj) => {
    const rawJSX = `<FullImageMDX image={${JSON.stringify(obj)}} />`
    node.type = "jsx"
    node.value = rawJSX
    return node
  }

  const updateGalleryCodeNode = (node, objs) => {
    const rawJSX = `<GalleryMDX images={${JSON.stringify(objs)}} />`
    node.type = "jsx"
    node.value = rawJSX
    return node
  }

  return Promise.all(
    // Simple because there is no nesting in markdown
    fullImageNodes.map(
      ({ node, parentParagraph }) =>
        new Promise(async (resolve, reject) => {
          const overWrites = {}
          let refNode
          if (
            !node.hasOwnProperty(`url`) &&
            node.hasOwnProperty(`identifier`)
          ) {
            // Consider as imageReference node
            refNode = node
            node = definitions(refNode.identifier)
            // Pass original alt from referencing node
            overWrites.alt = refNode.alt
            if (!node) {
              // No definition found for image reference,
              // so there's nothing for us to do.
              return resolve()
            }
          }
          const fileType = getImageInfo(node.url).ext

          // Ignore gifs as we can't process them,
          // svgs as they are already responsive by definition
          if (
            isRelativeUrl(node.url) &&
            fileType !== `gif` &&
            fileType !== `svg`
          ) {
            const obj = await generateFull(node, overWrites)

            if (obj) {
              // Replace the image or ref node with an inline HTML node.
              if (refNode) {
                node = refNode
              }

              updateFullImageNode(parentParagraph, obj)

              return resolve()
            }
          }

          // Image isn't relative, or something else
          return resolve()
        })
    )
  ).then(() =>
    Promise.all(
      // handle galleries
      galleryCodeNodes.map(
        ({ node, subImageNodes }) =>
          new Promise(async (resolve, reject) => {
            const objs = await Promise.all(
              subImageNodes.map(async subImageNode => {
                const fileType = getImageInfo(subImageNode.url).ext

                // Ignore gifs as we can't process them,
                // svgs as they are already responsive by definition
                if (
                  !isRelativeUrl(subImageNode.url) ||
                  fileType === `gif` ||
                  fileType === `svg`
                ) {
                  return
                }

                const obj = await generateFull(subImageNode, resolve, {})

                if (!obj) {
                  warnBadImage(subImageNode.url)
                }

                return obj
              })
            )

            updateGalleryCodeNode(
              node,
              objs.filter(a => a)
            )
            resolve()
          })
      )
    )
  )
}
