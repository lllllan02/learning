import { QuartzTransformerPlugin } from "../../plugins/types"
import { Root as MdRoot } from "mdast"
import { Root as HtmlRoot, Element } from "hast"
import { visit } from "unist-util-visit"
import { toString } from "mdast-util-to-string"

export interface TodoItem {
  checked: boolean
  content: string
  id: string
  priority?: string
  created?: string
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
              let content = toString(node).trim()
              
              let priority: string | undefined
              let created: string | undefined

              // 1. 提取优先级 [priority::1]
              const priorityRegex = /\[priority::\s*(\d+)\]/
              const priorityMatch = content.match(priorityRegex)
              if (priorityMatch) {
                priority = priorityMatch[1]
                content = content.replace(priorityRegex, "").trim()
              }

              // 2. 提取创建时间 [created::2026-01-18]
              const createdRegex = /\[created::\s*(\d{4}-\d{2}-\d{2})\]/
              const createdMatch = content.match(createdRegex)
              if (createdMatch) {
                created = createdMatch[1]
                content = content.replace(createdRegex, "").trim()
              }

              // 为了让原文档不显示这些属性，我们需要修改 AST 节点
              visit(node, "text", (textNode: any) => {
                textNode.value = textNode.value
                  .replace(priorityRegex, "")
                  .replace(createdRegex, "")
                  .trim()
              })

              todos.push({
                checked: node.checked,
                content: content,
                id: id,
                priority,
                created,
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
