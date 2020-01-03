# andrewsuzuki.com

This is my personal website and blog!

It is a static website built with [Gatsby](https://www.gatsbyjs.org/) and React.

## Development

```
gatsby develop
```

## Images

Images in .md[x] files come in two formats:

- Full-width (680px), with modal full single
  - In .md[x]. Normal markdown images (`![alt text](./image.jpg)`) that are:
    - Local
    - *Alone in their own paragraphs*. Inline images should not be processed.
    - Greater than 680px wide
    - Not gif or svg
  - Sizes generated:
    - Small sizes when loading
    - 680px
    - Full size for modal
- Gallery containing thumbnails, with modal carousel
  - In .md**x**. Special globally-available component `<Gallery />`. images must be:
    - Local
    - Not gif or svg
  - ALTERNATIVE: Normal markdown images, with a special start/end wrapper to place those images in a gallery
  - Sizes generated:
    - Thumbnail
    - Full size for modal carousel. Or srcset??

Strategy:
1. Traverse markdown ast for (a) single image nodes in paragraphs (b) code blocks with lang=gallery.
2. For (a) and (b), generate images and replace with the corresponding jsx element with props (FullImage or GalleryImages).

## TODO

- all categories page
- contact form
- rss.xml
- social links? github
- about page content
- domain, https
- FUTURE: search (with js-search)
- FUTURE: comments
- FUTURE: ProgressiveImage loading image overlay
- FUTURE: resolve componentWillMount deprecation warning. Follow gatsbyjs/gatsby#17865
- FUTURE: prev/next buttons for series at bottom of posts
- FUTURE: sub-categories, and multiple categories?
