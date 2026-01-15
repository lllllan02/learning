import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { FileTrieNode } from "./quartz/util/fileTrie"

// 排序函数：用于定义文件树（Explorer）中文件和文件夹的显示顺序
const explorerSortFn = (a: FileTrieNode, b: FileTrieNode) => {
  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    // 如果都是文件或都是文件夹，按 order 属性排序
    if (a.data?.order !== undefined && b.data?.order !== undefined) {
      return a.data.order - b.data.order
    }
    if (a.data?.order !== undefined) {
      return -1
    }
    if (b.data?.order !== undefined) {
      return 1
    }

    // 如果没有 order，按名称字母顺序排序
    return a.displayName.localeCompare(b.displayName, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }

  // 文件夹排在文件前面
  if (!a.isFolder && b.isFolder) {
    return 1
  } else {
    return -1
  }
}

// 图谱配置：定义本地图谱和全局图谱的交互与视觉样式
const graphConfig = {
  localGraph: {
    drag: true, // 是否允许拖拽节点
    zoom: true, // 是否允许缩放
    depth: 1, // 本地图谱显示的链接深度
    scale: 1.1, // 初始缩放比例
    repelForce: 0.9, // 节点间的斥力系数
    centerForce: 0.3, // 节点向中心的向心力系数
    linkDistance: 60, // 链接的默认距离
    fontSize: 0.8, // 标签字体大小
    opacityScale: 8, // 节点透明度缩放系数
    showTags: true, // 是否显示标签节点
    removeTags: [], // 要在图谱中隐藏的标签
    enableRadial: true, // 是否启用径向布局
  },
  globalGraph: {
    drag: true, // 是否允许拖拽节点
    zoom: true, // 是否允许缩放
    depth: -1, // 全局图谱显示所有深度的链接
    scale: 0.9, // 初始缩放比例
    repelForce: 0.9, // 节点间的斥力系数
    centerForce: 0.3, // 节点向中心的向心力系数
    linkDistance: 60, // 链接的默认距离
    fontSize: 0.8, // 标签字体大小
    opacityScale: 8, // 节点透明度缩放系数
    showTags: true, // 是否显示标签节点
    removeTags: [], // 要在图谱中隐藏的标签
    enableRadial: true, // 是否启用径向布局
  },
}

// 共享页面组件：定义在所有页面类型（内容页、列表页等）中都通用的组件
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(), // 页面 <head> 标签中的元数据
  header: [], // 页面顶部的标题栏组件
  afterBody: [], // 正文内容下方的组件
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/lllllan02", // 页脚显示的链接
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
    Component.Explorer({
      sortFn: explorerSortFn, // 文件排序函数
    }),
  ],
  right: [
    // 页面右侧栏组件
    Component.CustomGraph(graphConfig), // 交互式关系图谱
    Component.DesktopOnly(Component.TableOfContents()), // 文章目录（仅在桌面端显示）
    Component.Backlinks(), // 反向链接（引用了当前页面的其他页面）
  ],
}

// 默认列表页面布局：定义文件夹索引页、标签页等列表页面的结构
export const defaultListPageLayout: PageLayout = defaultContentPageLayout
