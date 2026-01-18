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
  displayDate: Date
}

const todoPageScript = `
${todoPopoverScript}
document.addEventListener("nav", () => {
  const todoContainer = document.querySelector(".todo-list")
  if (!todoContainer) return

  const items = Array.from(todoContainer.querySelectorAll(".todo-item"))
  if (items.length === 0) return

  const pageSize = 10
  let currentPage = 1
  let currentSort = "date" // "date" | "priority"
  let currentOrder = "desc" // "asc" | "desc"

  const sortItems = (mode, order) => {
    const sorted = [...items].sort((a, b) => {
      // 始终未完成优先
      const checkA = a.classList.contains("checked")
      const checkB = b.classList.contains("checked")
      if (checkA !== checkB) return checkA ? 1 : -1

      let result = 0
      if (mode === "priority") {
        const pA = parseInt(a.dataset.priority) || 999
        const pB = parseInt(b.dataset.priority) || 999
        result = pA - pB
      } else {
        const dateA = new Date(a.dataset.date).getTime()
        const dateB = new Date(b.dataset.date).getTime()
        result = dateA - dateB
      }

      return order === "desc" ? -result : result
    })
    
    sorted.forEach(item => todoContainer.appendChild(item))
    updateDisplay()
  }

  const updateSortUI = () => {
    document.querySelectorAll(".sort-btn").forEach(btn => {
      const mode = btn.dataset.sort
      const isActive = mode === currentSort
      btn.classList.toggle("active", isActive)
      
      const icon = mode === "date" ? "📅 时间" : "🔥 优先级"
      const arrow = isActive ? (currentOrder === "desc" ? " ↓" : " ↑") : ""
      btn.textContent = icon + arrow
    })
  }

  const updateDisplay = () => {
    const allItems = Array.from(todoContainer.querySelectorAll(".todo-item"))
    const totalPages = Math.ceil(allItems.length / pageSize)
    if (totalPages === 0) return
    
    allItems.forEach((item, idx) => {
      const isVisible = idx >= (currentPage - 1) * pageSize && idx < currentPage * pageSize
      item.style.display = isVisible ? "flex" : "none"
    })

    const pagination = document.querySelector(".todo-pagination")
    if (pagination) {
      pagination.innerHTML = \`
        <button class="pag-btn" \${currentPage === 1 ? "disabled" : ""} id="prev-page">Prev</button>
        <span class="pag-info">\${currentPage} / \${totalPages}</span>
        <button class="pag-btn" \${currentPage === totalPages ? "disabled" : ""} id="next-page">Next</button>
      \`
      
      pagination.querySelector("#prev-page")?.addEventListener("click", () => {
        if (currentPage > 1) { currentPage--; updateDisplay(); }
      })
      pagination.querySelector("#next-page")?.addEventListener("click", () => {
        if (currentPage < totalPages) { currentPage++; updateDisplay(); }
      })
    }
  }

  // 排序切换监听
  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const newMode = e.currentTarget.dataset.sort
      if (newMode === currentSort) {
        // 切换正反序
        currentOrder = currentOrder === "desc" ? "asc" : "desc"
      } else {
        // 切换模式，设置默认顺序
        currentSort = newMode
        currentOrder = newMode === "date" ? "desc" : "asc"
      }
      currentPage = 1
      sortItems(currentSort, currentOrder)
      updateSortUI()
    })
  })

  // 初始化
  sortItems(currentSort, currentOrder)
  updateSortUI()
})
`

export const TodoPage: QuartzComponent = ({ allFiles, fileData, cfg, tree }: QuartzComponentProps) => {
  const allTodos: FlatTodo[] = []
  
  for (const file of allFiles) {
    if (file.todos && file.todos.length > 0) {
      const fileDate = getDate(cfg, file) || new Date(0)
      for (const todo of file.todos) {
        allTodos.push({
          ...todo,
          file,
          displayDate: todo.created ? new Date(todo.created) : fileDate,
        })
      }
    }
  }

  // 初始服务端排序（按时间倒序）
  allTodos.sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1
    return b.displayDate.getTime() - a.displayDate.getTime()
  })

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
        <div class="todo-header-row">
          <h2>全站待办汇总</h2>
          <div class="todo-controls">
            <button class="sort-btn active" data-sort="date">📅 时间 ↓</button>
            <button class="sort-btn" data-sort="priority">🔥 优先级</button>
          </div>
        </div>
      </div>

      <ul class="todo-list">
        {allTodos.map((todo) => (
          <li 
            id={todo.id} 
            class={classNames(undefined, "todo-item", todo.checked ? "checked" : "unchecked")}
            data-date={todo.displayDate.toISOString()}
            data-priority={todo.priority || "999"}
          >
            <div class="todo-item-content">
              <input type="checkbox" checked={todo.checked} disabled />
              <span class="todo-text">
                {todo.content}
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
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div class="todo-pagination"></div>
    </div>
  )
}

TodoPage.css = style
TodoPage.afterDOMLoaded = todoPageScript

export default (() => TodoPage) satisfies QuartzComponentConstructor
