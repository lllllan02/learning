import { QuartzTransformerPlugin } from "../plugins/types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"
// @ts-ignore
import style from "./styles/code-fold.scss"

export const CodeFold: QuartzTransformerPlugin = () => {
  return {
    name: "CodeFold",
    externalResources() {
      return {
        css: [
          {
            content: style,
            inline: true,
          },
        ],
      }
    },
    markdownPlugins() {
      return [
        () => (tree: Root) => {
          visit(tree, "code", (node: any, index, parent: any) => {
            if (node.meta) {
              const foldRegex = /(?:^|\s)fold(?:="([^"]+)")?(?:\s|$)/
              const foldMatch = node.meta.match(foldRegex)

              if (foldMatch) {
                const customTitle = foldMatch[1]
                const titleMatch = node.meta.match(/title="([^"]+)"/)
                const title = titleMatch?.[1]
                const displayTitle = customTitle || title || "点击展开代码"

                const detailsNode = {
                  type: "codeFold",
                  data: {
                    hName: "details",
                    hProperties: {
                      className: ["code-fold-container"],
                    },
                  },
                  children: [
                    {
                      type: "codeFoldSummary",
                      data: {
                        hName: "summary",
                        hProperties: { className: ["code-fold-header"] },
                      },
                      children: [
                        {
                          type: "codeFoldIcon",
                          data: {
                            hName: "div",
                            hProperties: { className: ["code-fold-icon"] },
                          },
                          children: [],
                        },
                        {
                          type: "codeFoldTitle",
                          data: {
                            hName: "span",
                            hProperties: { className: ["code-fold-title"] },
                          },
                          children: [{ type: "text", value: displayTitle }],
                        },
                      ],
                    },
                    {
                      ...node,
                      meta: node.meta.replace(foldMatch[0], " ").trim(),
                    },
                  ],
                }

                if (parent && typeof index === "number") {
                  parent.children[index] = detailsNode
                }
              }
            }
          })
        },
      ]
    },
  }
}
