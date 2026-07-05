# MySkills

AI Agent Skills 集合 —— 包含 35 个技能包（`.agents/skills/`）、Claude skill 目录（`.claude/skills/`）和协作协议（`AGENTS.md`）。

## 一键安装

在任何目录下运行以下命令，即可将 skills 下载到当前目录：

```bash
curl -fsSL https://raw.githubusercontent.com/zixuandai0217/MySkills/main/install.sh | bash
```

## 安装到指定目录

```bash
curl -fsSL https://raw.githubusercontent.com/zixuandai0217/MySkills/main/install.sh | bash -s -- /path/to/target
```

## 工作原理

安装脚本通过 **一次 HTTP 请求** 下载整个仓库的 tarball 归档，本地解压后提取所需文件。无需调用 GitHub API，不受速率限制，通常 10 秒内即可完成安装。

- 仅需 `curl`（或 `wget`）+ `tar`，无其他依赖
- 内置失败重试（最多 3 次）
- 自动清理临时文件

## 安装内容

| 文件 | 说明 |
|------|------|
| `AGENTS.md` | Agent 协作与上下文优化协议 |
| `.agents/skills/` | 35 个技能包（见下方列表） |
| `.claude/skills/` | Claude Code 可用技能包；当前包含增强版 `drawio-skill` |

## 技能包列表

| 技能包 | 用途 |
|--------|------|
| `algorithmic-art` | 算法艺术生成 |
| `brainstorming` | 头脑风暴 |
| `brand-guidelines` | 品牌规范 |
| `canvas-design` | Canvas 设计 |
| `dispatching-parallel-agents` | 并行 Agent 调度 |
| `doc-coauthoring` | 文档协作 |
| `docx` | Word 文档处理 |
| `drawio-skill` | draw.io/diagrams.net 技术图、科研图、复刻图与导出 |
| `executing-plans` | 计划执行 |
| `finishing-a-development-branch` | 开发分支收尾 |
| `frontend-design` | 前端设计 |
| `humanizer` | 文本人性化润色 |
| `internal-comms` | 内部沟通 |
| `mcp-builder` | MCP Server 构建 |
| `pdf` | PDF 文档处理 |
| `pptx` | PowerPoint 演示文稿处理 |
| `pua` | 执行力督导协议 |
| `receiving-code-review` | 接收代码审查 |
| `requesting-code-review` | 发起代码审查 |
| `scientific-figure-making` | 科研图表制作 |
| `skill-creator` | 技能包创建 |
| `slack-gif-creator` | Slack GIF 制作 |
| `subagent-driven-development` | 子 Agent 驱动开发 |
| `systematic-debugging` | 系统化调试 |
| `test-driven-development` | 测试驱动开发 |
| `theme-factory` | 主题工厂 |
| `ui-ux-pro-max` | UI/UX 专业设计 |
| `using-git-worktrees` | Git Worktree 使用 |
| `using-superpowers` | 超能力调度入口 |
| `verification-before-completion` | 完成前验证 |
| `web-artifacts-builder` | Web 产物构建 |
| `webapp-testing` | Web 应用测试 |
| `writing-plans` | 计划撰写 |
| `writing-skills` | 写作技巧 |
| `xlsx` | Excel 表格处理 |
# Absolutely
