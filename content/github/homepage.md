---
title: GitHub 个人主页美化指南
date: 2026-01-15
tags:
  - GitHub
  - 主页
---
![[assets/Pasted image 20260115111928.png]]
如果你想打造一个像我这样的 [GitHub 主页](https://github.com/lllllan02/lllllan02)，可以参考以下步骤：

## 1. 核心原理：特殊仓库

GitHub 有一个“彩蛋”功能：如果你创建一个与你 **用户名同名** 的公开仓库，该仓库下的 `README.md` 文件内容就会自动展示在你的个人主页。

- **仓库名**：`your-username` (例如 `lllllan02/lllllan02`)
- **权限**：Public
- **关键文件**：`README.md`

## 2. 动态打字效果：Typing SVG

在主页顶部看到的动态打字效果，是使用 [Readme Typing SVG](https://github.com/DenverCoder1/readme-typing-svg) 实现的。

### 配置方式
你可以直接在 `README.md` 中嵌入一个特定的 URL 图片链接：

```markdown
[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=F7F7F7&width=435&lines=Hello+World!;Welcome+to+my+profile)](https://git.io/typing-svg)
```

**关键参数解释：**
- `lines`: 要显示的文字，用 `;` 分隔多行。
- `font`: 字体选择。
- `color`: 文字颜色（十六进制）。
- `width`: 画布宽度。

## 3. 3D 贡献图：GitHub Profile 3D Contrib

将平面的“绿格子”变为立体的 3D 效果，使用的是 [yoshi389111/github-profile-3d-contrib](https://github.com/yoshi389111/github-profile-3d-contrib)。

### 配置流程

1. **创建 Workflow 文件**：在仓库中新建 `.github/workflows/profile-3d.yml`。
2. **编写配置**：使用 GitHub Actions 定时生成 3D 图像。

```yaml
name: GitHub-Profile-3D-Contrib

on:
  schedule: # 每 24 小时运行一次
    - cron: "0 18 * * *"
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    name: generate-github-profile-3d-contrib
    steps:
      - uses: actions/checkout@v3
      - uses: yoshi389111/github-profile-3d-contrib@0.7.1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          USERNAME: ${{ github.repository_owner }}
      - name: Commit & Push
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add -A .
          git commit -m "generated"
          git push
```

3. **在 README 中引用**：
生成的图片默认保存在 `profile-3d-contrib` 目录下，在 `README.md` 中引用即可：

```markdown
![](./profile-3d-contrib/profile-green-animate.svg)
```

## 4. 个人介绍与布局

主页的其他部分通常包含：
- **自我介绍**：使用 Markdown 语法编写，可以使用加粗、引用等突出重点。
- **技能图标**：可以结合 [Simple Icons](https://simpleicons.org/) 展示你的技术栈。
- **友链/项目**：整理你的社交链接或代表作。

## 5. 进阶玩法：[[github/star/metrics|Metrics]] 统计图

如果你还想加入更多数据统计（如：最常使用的语言、代码提交习惯、GitHub 成就等），推荐使用 [lowlighter/metrics](https://github.com/lowlighter/metrics)。

---

通过以上几步，你就能拥有一个属于自己的、极具个性化的 GitHub 门户页面。快去试试吧！
