import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../components/types"
import { resolveRelative } from "../../util/path"
import { TodoItem } from "./transformer"
import { classNames } from "../../util/lang"
import { getDate } from "../../components/Date"
import { QuartzPluginData } from "../../plugins/vfile"
import { htmlToJsx } from "../../util/jsx"
import { ComponentChildren } from "preact"
import { todoPopoverScript } from "./RecentTodo"
// @ts-ignore
import style from "./todo.scss"

interface FlatTodo extends TodoItem {
  file: QuartzPluginData
}

export const TodoPage: QuartzComponent = ({ allFiles, fileData, cfg, tree }: QuartzComponentProps) => {
  const allTodos: FlatTodo[] = []
  
  for (const file of allFiles) {
    if (file.todos && file.todos.length > 0) {
      for (const todo of file.todos) {
        allTodos.push({
          ...todo,
          file,
        })
      }
    }
  }

  allTodos.sort((a, b) => {
    if (a.checked !== b.checked) {
      return a.checked ? 1 : -1
    }
    const dateA = getDate(cfg, a.file) || new Date(0)
    const dateB = getDate(cfg, b.file) || new Date(0)
    return dateB.getTime() - dateA.getTime()
  })

  // 尝试安全地转换内容
  let content: ComponentChildren = null
  try {
    if (tree && fileData.filePath) {
      content = htmlToJsx(fileData.filePath, tree) as ComponentChildren
    }
  } catch (e) {
    console.error(`[TodoPage] Error rendering content: ${e}`)
  }

  return (
    <div class="todo-page">
      {content && <article class="todo-page-content">{content}</article>}
      <div class="todo-divider">
        <hr />
        <h2>全站待办汇总</h2>
      </div>
      <ul class="todo-list">
        {allTodos.map((todo) => (
          <li id={todo.id} class={classNames("todo-item", todo.checked ? "checked" : "unchecked")}>
            <div class="todo-item-content">
              <input type="checkbox" checked={todo.checked} disabled />
              <span class="todo-text">{todo.content}</span>
              <span class="todo-source">
                来自{" "}
                <a href={resolveRelative(fileData.slug!, todo.file.slug!) + `#${todo.id}`} class="internal">
                  {todo.file.frontmatter?.title || todo.file.slug}
                </a>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

TodoPage.css = style
TodoPage.afterDOMLoaded = todoPopoverScript

export default (() => TodoPage) satisfies QuartzComponentConstructor
