import { QuartzEmitterPlugin } from "../../plugins/types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug, pathToRoot } from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { TodoPage } from "./TodoPage"
import { write } from "../../plugins/emitters/helpers"
import { defaultProcessedContent } from "../../plugins/vfile"

export const TodoEmitter: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: TodoPage,
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "TodoEmitter",
    getQuartzComponents() {
      return [
        Head,
        Header,
        Body,
        ...header,
        ...beforeBody,
        pageBody,
        ...afterBody,
        ...left,
        ...right,
        Footer,
      ]
    },
    async *emit(ctx, content, resources) {
      const allFiles = content.map((c) => c[1].data)
      const cfg = ctx.cfg.configuration
      const slug = "todo" as FullSlug
      
      // 查找是否有名为 todo.md 的文件
      const todoFile = content.find((c) => c[1].data.slug === slug)
      
      const externalResources = pageResources(pathToRoot(slug), resources)
      let tree, fileData

      if (todoFile) {
        tree = todoFile[0]
        fileData = todoFile[1].data
      } else {
        const processed = defaultProcessedContent({
          slug,
          frontmatter: { title: "TODO 事项汇总", tags: [] },
        })
        tree = processed[0]
        fileData = processed[1].data
      }

      const componentData: QuartzComponentProps = {
        ctx,
        fileData,
        externalResources,
        cfg,
        children: [],
        tree,
        allFiles,
      }

      console.log(`[TodoEmitter] Found ${allFiles.length} files, ${allFiles.filter(f => f.todos?.length).length} with todos`)

      const pageContent = renderPage(cfg, slug, componentData, opts, externalResources)
      yield write({
        ctx,
        content: pageContent,
        slug,
        ext: ".html",
      })
    },
    async *partialEmit(ctx, content, resources, _changeEvents) {
      const allFiles = content.map((c) => c[1].data)
      const cfg = ctx.cfg.configuration
      const slug = "todo" as FullSlug
      const todoFile = content.find((c) => c[1].data.slug === slug)
      
      const externalResources = pageResources(pathToRoot(slug), resources)
      let tree, fileData

      if (todoFile) {
        tree = todoFile[0]
        fileData = todoFile[1].data
      } else {
        const processed = defaultProcessedContent({
          slug,
          frontmatter: { title: "TODO 事项汇总", tags: [] },
        })
        tree = processed[0]
        fileData = processed[1].data
      }

      const componentData: QuartzComponentProps = {
        ctx,
        fileData,
        externalResources,
        cfg,
        children: [],
        tree,
        allFiles,
      }

      const pageContent = renderPage(cfg, slug, componentData, opts, externalResources)
      yield write({
        ctx,
        content: pageContent,
        slug,
        ext: ".html",
      })
    },
  }
}
