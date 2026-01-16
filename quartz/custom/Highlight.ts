import { QuartzTransformerPlugin } from "../plugins/types"
import { Root } from "mdast"
import { findAndReplace as mdastFindReplace } from "mdast-util-find-and-replace"

const highlightRegex = new RegExp(/==([^=]+)==/g)

export const Highlight: QuartzTransformerPlugin = () => {
  return {
    name: "Highlight",
    markdownPlugins() {
      return [
        () => (tree: Root) => {
          mdastFindReplace(tree, [
            [
              highlightRegex,
              (_value: string, ...capture: string[]) => {
                const [inner] = capture
                return {
                  type: "textHighlight",
                  data: { hName: "span", hProperties: { className: ["text-highlight"] } },
                  children: [{ type: "text", value: inner }],
                } as any
              },
            ],
          ])
        },
      ]
    },
  }
}
