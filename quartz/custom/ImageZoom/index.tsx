// @ts-ignore
import imageZoomScript from "./imageZoom.inline"
import { QuartzComponentConstructor, QuartzComponentProps } from "../../components/types"

export default (() => {
  function ImageZoom(_props: QuartzComponentProps) {
    return null
  }

  ImageZoom.afterDOMLoaded = imageZoomScript

  return ImageZoom
}) satisfies QuartzComponentConstructor
