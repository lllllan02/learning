import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../components/types"
import { FullSlug, resolveRelative } from "../../util/path"
import { getDate } from "../../components/Date"
import { classNames } from "../../util/lang"
import { i18n } from "../../i18n"
// @ts-ignore
import style from "./todo.scss"

export const todoPopoverScript = `
document.addEventListener("mouseenter", (e) => {
  const target = e.target
  if (target instanceof HTMLAnchorElement && target.hash.startsWith("#todo-idx-")) {
    const scrollPopover = () => {
      const popoverId = "popover-" + target.pathname
      const popover = document.getElementById(popoverId)
      if (popover) {
        const inner = popover.querySelector(".popover-inner")
        const anchorId = "popover-internal-" + target.hash.slice(1)
        const element = inner?.querySelector("#" + anchorId)
        if (element instanceof HTMLElement && inner instanceof HTMLElement) {
          inner.scroll({ top: element.offsetTop - 12, behavior: "instant" })
        }
      }
    }
    // 多次尝试滚动以确保在 Quartz 内容加载/渲染后依然有效
    scrollPopover()
    setTimeout(scrollPopover, 10)
    setTimeout(scrollPopover, 100)
  }
}, true)
`

interface Options {
  title?: string
  limit: number
}

const defaultOptions: Options = {
  limit: 1,
}

export const RecentTodo: QuartzComponent = ({ allFiles, fileData, cfg, displayClass, ...props }: QuartzComponentProps & Options) => {
  const filesWithTodos = allFiles.filter((file) => file.todos && file.todos.length > 0)
  
  if (filesWithTodos.length === 0) {
    return null
  }

  // Sort files by date (recent first)
  filesWithTodos.sort((a, b) => {
    const dateA = getDate(cfg, a) || new Date(0)
    const dateB = getDate(cfg, b) || new Date(0)
    return dateB.getTime() - dateA.getTime()
  })

  const filesToShow = filesWithTodos.slice(0, props.limit)

  return (
    <div class={classNames(displayClass, "recent-notes", "recent-todo")}>
      <h3>{props.title ?? "最新 TODO"}</h3>
      <ul class="recent-ul">
        {filesToShow.map((file) => {
          // Get the first unchecked todo if possible, otherwise just the first one
          const latestTodo = file.todos?.find((t) => !t.checked) || file.todos![0]
          return (
            <li class="recent-li">
              <div class="section">
                <div class="desc">
                  <h3>
                    <input type="checkbox" checked={latestTodo.checked} disabled />
                    <span>{latestTodo.content}</span>
                  </h3>
                </div>
            <p class="meta">
              来自{" "}
              <a
                href={resolveRelative(fileData.slug!, file.slug!) + `#${latestTodo.id}`}
                class="internal todo-link-ref"
              >
                {file.frontmatter?.title || file.slug}
              </a>
            </p>
              </div>
            </li>
          )
        })}
      </ul>
      <p>
        <a href={resolveRelative(fileData.slug!, "todo" as FullSlug)}>查看全部 TODO →</a>
      </p>
    </div>
  )
}

RecentTodo.css = style
RecentTodo.afterDOMLoaded = todoPopoverScript

export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }
  return (props: QuartzComponentProps) => <RecentTodo {...props} {...opts} />
}) satisfies QuartzComponentConstructor
