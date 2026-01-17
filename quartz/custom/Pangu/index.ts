import { QuartzTransformerPlugin } from "../../plugins/types"
import { Root } from "mdast"
import { findAndReplace as mdastFindReplace } from "mdast-util-find-and-replace"

export const Pangu: QuartzTransformerPlugin = () => {
  return {
    name: "Pangu",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root) => {
            mdastFindReplace(tree, [
              [
                /([\u4e00-\u9fa5])([a-zA-Z0-9])/g,
                (_value: string, p1: string, p2: string) => `${p1} ${p2}`,
              ],
              [
                /([a-zA-Z0-9])([\u4e00-\u9fa5])/g,
                (_value: string, p1: string, p2: string) => `${p1} ${p2}`,
              ],
            ])
          }
        },
      ]
    },
  }
}
