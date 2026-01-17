// @ts-ignore
import imageZoomScript from "./scripts/imageZoom.inline"
import { QuartzComponentConstructor, QuartzComponentProps } from "../components/types"

export default (() => {
  function ImageZoom(_props: QuartzComponentProps) {
    return null
  }

  ImageZoom.afterDOMLoaded = imageZoomScript

  return ImageZoom
}) satisfies QuartzComponentConstructor
