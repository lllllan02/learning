import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import * as Component from "./quartz/components"
import * as Custom from "./quartz/custom"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "lllllan's blog", // 网站主标题
    pageTitleSuffix: "", // 网站标题后缀，通常用于 SEO
    enableSPA: true, // 是否启用单页面应用（SPA）模式，启用后页面跳转不刷新，体验更流畅
    enablePopovers: true, // 是否启用预览气泡，当鼠标悬停在链接上时显示内容预览
    analytics: {
      provider: "plausible", // 统计分析服务提供商
    },
    locale: "zh-CN", // 网站语言设置
    baseUrl: "blog.lllllan.cn", // 网站部署的基础 URL，用于生成 RSS 和站点地图
    ignorePatterns: ["private", "templates", ".obsidian"], // 构建时忽略的文件或文件夹模式
    defaultDateType: "modified", // 默认日期显示类型，可选 "created" (创建时间) 或 "modified" (修改时间)
    theme: {
      fontOrigin: "googleFonts", // 字体来源，可选 "googleFonts", "local" (本地) 或 "custom" (自定义)
      cdnCaching: true, // 是否启用 CDN 缓存以加速字体和资源加载
      typography: {
        header: "LXGW WenKai TC", // 标题使用的字体
        body: "LXGW WenKai TC", // 正文使用的字体
        code: "Fira Code", // 代码块使用的等宽字体
      },
      colors: {
        lightMode: {
          light: "#faf8f8", // 背景色
          lightgray: "#e5e5e5", // 边框色、搜索栏等较浅的灰色
          gray: "#b8b8b8", // 辅助文本、日期等中等灰色
          darkgray: "#4e4e4e", // 正文文本颜色
          dark: "#2b2b2b", // 标题、强调文本颜色
          secondary: "#284b63", // 链接颜色、次要强调色
          tertiary: "#84a59d", // 鼠标悬停色、第三强调色
          highlight: "rgba(143, 159, 169, 0.15)", // 内部链接背景色、高亮背景
          textHighlight: "#fff23688", // 文本搜索高亮色
        },
        darkMode: {
          light: "#161618", // 暗色模式背景色
          lightgray: "#393639", // 暗色模式边框色
          gray: "#646464", // 暗色模式辅助文本颜色
          darkgray: "#d4d4d4", // 暗色模式正文文本颜色
          dark: "#ebebec", // 暗色模式标题颜色
          secondary: "#7b97aa", // 暗色模式链接颜色
          tertiary: "#84a59d", // 暗色模式第三强调色
          highlight: "rgba(143, 159, 169, 0.15)", // 暗色模式高亮背景
          textHighlight: "#b3aa0288", // 暗色模式文本搜索高亮色
        },
      },
    },
  },
  plugins: {
    transformers: [
      // 转换插件：处理 Markdown 内容
      Plugin.FrontMatter(), // 解析文件顶部的 YAML 元数据
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"], // 获取创建/修改日期的优先级顺序
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }), // 代码块语法高亮
      Custom.CodeFold(), // 代码块折叠
      Custom.Highlight(), // 高亮
      Custom.Callout(), // 自定义标注
      Plugin.ObsidianFlavoredMarkdown({ 
        enableInHtmlEmbed: false,  // 禁用 HTML 嵌入
        highlight: false, // 禁用高亮
       }), // 支持 Obsidian 特有的 Markdown 语法（双链、标注等）
      Plugin.GitHubFlavoredMarkdown(), // 支持 GitHub 风格的 Markdown 语法
      Plugin.TableOfContents(), // 解析并生成目录数据
      Custom.CrawlLinks({ markdownLinkResolution: "shortest" }), // 解析链接，支持 Obsidian 短链接格式
      Plugin.Description(), // 自动生成页面描述（用于 SEO 和预览）
      Plugin.Latex({ renderEngine: "katex" }), // 支持数学公式 (KaTeX)
    ],
    filters: [
      // 过滤器插件：决定哪些文件会被包含在构建中
      Plugin.RemoveDrafts(), // 排除在 frontmatter 中标记为 draft: true 的文章
    ],
    emitters: [
      // 发射器插件：决定如何输出最终生成的页面和资源
      Plugin.AliasRedirects(), // 处理 frontmatter 中的 aliases 重定向
      Plugin.ComponentResources(), // 打包并输出组件所需的 JS 和 CSS 资源
      Plugin.ContentPage(), // 生成正文内容页面
      Plugin.FolderPage({
        pageBody: Component.Content(),
      }), // 生成文件夹索引页面
      Plugin.TagPage(), // 生成标签索引页面
      Plugin.ContentIndex({
        enableSiteMap: true, // 生成 sitemap.xml
        enableRSS: true, // 生成 index.xml (RSS Feed)
      }),
      Plugin.Assets(), // 处理静态资源（如图片）
      Plugin.Static(), // 处理 static 文件夹中的静态文件
      Plugin.Favicon(), // 处理网站图标
      Plugin.NotFoundPage(), // 生成 404 错误页面
      // Plugin.CustomOgImages(), // 生成自定义 OG 图片（社交分享预览图），默认开启会增加构建时间
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
