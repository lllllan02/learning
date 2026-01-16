import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"

export const CustomCodeFold: QuartzTransformerPlugin = () => {
  return {
    name: "CustomCodeFold",
    markdownPlugins() {
      return [
        () => (tree: Root) => {
          visit(tree, "code", (node: any, index, parent: any) => {
            if (node.meta) {
              // 改进正则：确保 fold 是一个独立的参数（前后是空格或边界），避免误伤内容
              const foldRegex = /(?:^|\s)fold(?:="([^"]+)")?(?:\s|$)/
              const foldMatch = node.meta.match(foldRegex)

              if (foldMatch) {
                const customTitle = foldMatch[1]

                // 提取 title="..." 语法 (兼容 rehype-pretty-code 的标题语法)
                const titleMatch = node.meta.match(/title="([^"]+)"/)
                const title = titleMatch?.[1]

                const displayTitle = customTitle || title || "点击展开代码"

                // 创建包装容器，hName 决定生成的 HTML 标签
                const detailsNode = {
                  type: "codeFold",
                  data: {
                    hName: "details",
                    hProperties: {
                      className: ["code-fold-container"],
                    },
                  },
                  children: [
                    // 1. Summary 部分
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
                    // 2. 原始代码块
                    {
                      ...node,
                      // 安全地移除元数据中的 fold 标记，不影响其他 meta
                      meta: node.meta.replace(foldMatch[0], " ").trim(),
                    },
                  ],
                }

                // 替换原有的代码块节点
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
