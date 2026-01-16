import { PageLayout, SharedLayout } from "./quartz/cfg"
import { SimpleSlug } from "./quartz/util/path"
import * as Component from "./quartz/components"
import * as Custom from "./quartz/custom"

// 共享页面组件：定义在所有页面类型（内容页、列表页等）中都通用的组件
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(), // 页面 <head> 标签中的元数据
  header: [], // 页面顶部的标题栏组件
  afterBody: [
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "最近更新",
        limit: 1,
        linkToMore: "tags/" as SimpleSlug,
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
  ], // 正文内容下方的组件
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/lllllan02", 
      Font: "https://github.com/lxgw/LxgwWenKai",
    },
  }),
}

// 默认内容页面布局：定义文章正文页面的结构
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // 正文开始前的组件
    Component.ConditionalRender({
      component: Component.Breadcrumbs(), // 面包屑导航
      condition: (page) => page.fileData.slug !== "index", // 首页不显示面包屑
    }),
    Component.ArticleTitle(), // 文章标题
    Component.ContentMeta(), // 文章元数据（阅读时间、日期等）
    Component.TagList(), // 标签列表
  ],
  left: [
    // 页面左侧栏组件
    Component.PageTitle(), // 网站标题
    Component.MobileOnly(Component.Spacer()), // 移动端占位符
    Component.Flex({
      // 弹性布局容器
      components: [
        { Component: Component.Search(), grow: true }, // 搜索框
        { Component: Component.Darkmode() }, // 暗色模式切换开关
        { Component: Component.ReaderMode() }, // 阅读模式切换开关
      ],
    }),
    Custom.Explorer(),
  ],
  right: [
    // 页面右侧栏组件
    Custom.Graph(), // 交互式关系图谱
    Component.DesktopOnly(Component.TableOfContents()), // 文章目录（仅在桌面端显示）
    Custom.Backlinks(), // 反向链接（引用了当前页面的其他页面）
  ],
}

// 默认列表页面布局：定义文件夹索引页、标签页等列表页面的结构
export const defaultListPageLayout: PageLayout = defaultContentPageLayout
