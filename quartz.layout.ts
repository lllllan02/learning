import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { FileTrieNode } from "./quartz/util/fileTrie"

// 排序函数
const explorerSortFn = (a: FileTrieNode, b: FileTrieNode) => {
  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    if (a.data?.order !== undefined && b.data?.order !== undefined) {
      return a.data.order - b.data.order
    }
    if (a.data?.order !== undefined) {
      return -1
    }
    if (b.data?.order !== undefined) {
      return 1
    }

    return a.displayName.localeCompare(b.displayName, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }

  if (!a.isFolder && b.isFolder) {
    return 1
  } else {
    return -1
  }
}

// 图谱配置
const graphConfig = {
  localGraph: {
    drag: true,
    zoom: true,
    depth: 1,
    scale: 1.1,
    repelForce: 0.9,
    centerForce: 0.3,
    linkDistance: 60,
    fontSize: 0.8,
    opacityScale: 8,
    showTags: true,
    removeTags: [],
    enableRadial: true,
  },
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,
    scale: 0.9,
    repelForce: 0.9,
    centerForce: 0.3,
    linkDistance: 60,
    fontSize: 0.8,
    opacityScale: 8,
    showTags: true,
    removeTags: [],
    enableRadial: true,
  },
}

// 共享页面组件
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/lllllan02",
    },
  }),
}

// 默认内容页面布局
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      sortFn: explorerSortFn,
    }),
  ],
  right: [
    Component.Graph(graphConfig),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// 默认列表页面布局
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      sortFn: explorerSortFn,
    }),
  ],
  right: [Component.Graph(graphConfig)],
}
