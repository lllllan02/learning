import { QuartzTransformerPlugin } from "../../plugins/types"
import { Root as MdRoot } from "mdast"
import { Root as HtmlRoot, Element } from "hast"
import { visit } from "unist-util-visit"
import { toString } from "mdast-util-to-string"

export interface TodoItem {
  checked: boolean
  content: string
  id: string
}

export const TodoTransformer: QuartzTransformerPlugin = () => {
  return {
    name: "TodoTransformer",
    markdownPlugins() {
      return [
        () => (tree: MdRoot, file) => {
          const todos: TodoItem[] = []
          let todoCount = 0
          visit(tree, "listItem", (node: any) => {
            if (node.checked !== null && node.checked !== undefined) {
              const id = `todo-idx-${++todoCount}`
              todos.push({
                checked: node.checked,
                content: toString(node).trim(),
                id: id,
              })
            }
          })
          file.data.todos = todos
        },
      ]
    },
    htmlPlugins() {
      return [
        () => (tree: HtmlRoot) => {
          let todoCount = 0
          visit(tree, "element", (node: Element) => {
            if (node.tagName === "li" && node.properties) {
              // 检查是否是任务列表项（通常包含一个 checkbox 类型的 input）
              const hasCheckbox = node.children.some(
                (child) =>
                  child.type === "element" &&
                  child.tagName === "input" &&
                  child.properties?.type === "checkbox",
              )

              if (hasCheckbox) {
                const id = `todo-idx-${++todoCount}`
                node.properties.id = id
              }
            }
          })
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    todos: TodoItem[]
  }
}
