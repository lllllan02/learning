import { QuartzTransformerPlugin } from "../plugins/types"
import { capitalize } from "../util/lang"
// @ts-ignore
import calloutScript from "../components/scripts/callout.inline"
// @ts-ignore
import calloutStyle from "./styles/callout.scss"

export interface Options {
  renderDefaultTitles: boolean
}

const defaultOptions: Options = {
  renderDefaultTitles: true,
}

const calloutMapping: Record<string, string> = {
  note: "note", abstract: "abstract", summary: "abstract", tldr: "abstract",
  info: "info", todo: "todo", tip: "tip", hint: "tip", important: "tip",
  success: "success", check: "success", done: "success",
  question: "question", help: "question", faq: "question",
  warning: "warning", attention: "warning", caution: "warning",
  failure: "failure", missing: "failure", fail: "failure",
  danger: "danger", error: "danger", bug: "bug",
  example: "example", quote: "quote", cite: "quote",
}

function normalizeHex(color: string): string {
  let hex = color.trim().replace(/^#/, "")
  if (hex.length === 3) {
    hex = hex.split("").map(char => char + char).join("")
  }
  return hex.length === 6 ? `#${hex}` : color
}

export const Callout: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "Callout",
    textTransform(_ctx, src) {
      // 关键修复：
      // 1. 优先跳过代码块
      // 2. 调整结束标记匹配顺序：优先匹配紧随标题行的结束符 (?:[\n\r]\1)
      // 3. 这样可以防止正则表达式错误地吞噬后续内容
      const combinedRegex = /```[\s\S]*?```|^(:{3,})[\t ]*\[!([^\s|\]\[+-]+)(?:\|([^\]\n+-]*))?\]([+-])?[\t ]*(.*?)(?:[\n\r]\1|[\n\r]([\s\S]*?)[\n\r]\1)(?:\s|$)/gm
      
      const parseCallouts = (content: string): string => {
        return content.replace(combinedRegex, (match, _colons, type, metadata, collapse, title, body) => {
          if (match.startsWith("```")) return match

          let customIcon = ""
          let customColor = ""
          let calloutType = "note"

          const normalizedType = type.toLowerCase()
          if (normalizedType.startsWith("http") || normalizedType.startsWith("/")) {
            customIcon = type
            calloutType = "custom"
          } else {
            calloutType = calloutMapping[normalizedType] ?? normalizedType
          }

          if (metadata) {
            const parts = metadata.split("|")
            for (let part of parts) {
              part = part.trim()
              if (part.startsWith("#")) {
                customColor = normalizeHex(part)
              } else if (part.startsWith("icon:")) {
                customIcon = part.slice(5)
              } else if (part.startsWith("color:")) {
                customColor = normalizeHex(part.slice(6))
              } else if (part.startsWith("http") || part.startsWith("/")) {
                customIcon = part
              }
            }
          }

          const isCollapsible = collapse === "+" || collapse === "-"
          const isCollapsed = collapse === "-"
          const displayTitle = title?.trim() || (opts.renderDefaultTitles ? capitalize(calloutType === "custom" ? "Note" : type) : "")
          const collapseIcon = isCollapsible ? `<div class="fold-callout-icon"></div>` : ""
          
          const classNames = ["callout", calloutType]
          if (isCollapsible) classNames.push("is-collapsible")
          if (isCollapsed) classNames.push("is-collapsed")
          
          const styleAttr = customColor ? `style="--color: ${customColor}; --callout-color: ${customColor}; --border: ${customColor}44; --bg: ${customColor}15; --callout-border: ${customColor}44; --callout-bg: ${customColor}15;"` : ""
          const iconBg = customColor ? `background-color: var(--callout-color);` : ""
          const iconAttr = customIcon ? `style="mask-image: url('${customIcon}'); -webkit-mask-image: url('${customIcon}'); ${iconBg}"` : ""

          // 递归处理内容
          const processedBody = body ? parseCallouts(body.trim()) : ""
          const contentHtml = processedBody 
            ? `<div class="callout-content"><div class="callout-content-inner">\n\n${processedBody}\n\n</div></div>`
            : ""

          return `\n<blockquote class="${classNames.join(" ")}" data-callout="${calloutType}" data-callout-fold="${isCollapsible}" ${styleAttr}><div class="callout-title"><div class="callout-icon" ${iconAttr}></div><div class="callout-title-inner">${displayTitle}</div>${collapseIcon}</div>${contentHtml}</blockquote>\n`
        })
      }
      return parseCallouts(src)
    },
    externalResources() {
      return {
        css: [{ content: calloutStyle, inline: true }],
        js: [{ script: calloutScript, loadTime: "afterDOMReady", contentType: "inline" }],
      }
    },
  }
}
