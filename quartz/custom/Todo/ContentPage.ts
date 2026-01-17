import { ContentPage } from "../../plugins/emitters/contentPage"
import { QuartzEmitterPlugin } from "../../plugins/types"
import { FullPageLayout } from "../../cfg"

// 这是一个包装器，它调用原生的 ContentPage，但过滤掉了 "todo" 路径
export const CustomContentPage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  const contentPage = ContentPage(userOpts)
  return {
    ...contentPage,
    name: "CustomContentPage",
    async *emit(ctx, content, resources) {
      // 过滤掉 slug 为 "todo" 的文件，不让原生 ContentPage 处理它
      const filteredContent = content.filter(([_, file]) => file.data.slug !== "todo")
      yield* contentPage.emit(ctx, filteredContent, resources)
    },
    async *partialEmit(ctx, content, resources, changeEvents) {
      const filteredContent = content.filter(([_, file]) => file.data.slug !== "todo")
      const filteredChanges = changeEvents.filter(c => c.file?.data.slug !== "todo")
      if (contentPage.partialEmit) {
        yield* contentPage.partialEmit(ctx, filteredContent, resources, filteredChanges)
      }
    }
  }
}
