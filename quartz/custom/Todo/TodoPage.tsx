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
    // 1. 状态排序：未完成优先
    if (a.checked !== b.checked) {
      return a.checked ? 1 : -1
    }
    
    // 2. 优先级排序：1 > 2 > 3 > undefined
    if (a.priority !== b.priority) {
      if (!a.priority) return 1
      if (!b.priority) return -1
      return parseInt(a.priority) - parseInt(b.priority)
    }

    // 3. 创建时间排序：新到旧
    if (a.created !== b.created) {
      if (!a.created) return 1
      if (!b.created) return -1
      return b.created.localeCompare(a.created)
    }

    // 4. 文件日期排序
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
          <li id={todo.id} class={classNames(undefined, "todo-item", todo.checked ? "checked" : "unchecked")}>
            <div class="todo-item-content">
              <input type="checkbox" checked={todo.checked} disabled />
              <span class="todo-text">{todo.content}</span>
              <div class="todo-metadata">
                {todo.priority && <span class={classNames(undefined, "todo-priority", `priority-${todo.priority}`)}>P{todo.priority}</span>}
                {todo.created && <span class="todo-created">创建于 {todo.created}</span>}
                <span class="todo-source">
                  来自{" "}
                  <a href={resolveRelative(fileData.slug!, todo.file.slug!) + `#${todo.id}`} class="internal">
                    {todo.file.frontmatter?.title || todo.file.slug}
                  </a>
                </span>
              </div>
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
