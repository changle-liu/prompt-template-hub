# Prompt 模版大全 Chrome 插件

一个轻量的 Chrome MV3 扩展，用于浏览、生成、复制并一键填入常用 AI 对话 prompt。

## 功能

- 多分类模板：日常对话、写作润色、翻译改写、学习辅导、代码开发、总结提炼、职场沟通、营销文案、角色扮演、决策分析。
- 快速检索：支持按分类和关键词筛选模板。
- 变量生成：根据模板字段填写内容，实时生成完整 prompt。
- 复制使用：可复制生成后的 prompt，也可复制模板原文。
- 一键填入：支持在 ChatGPT、Claude、DeepSeek、Gemini、通义千问、豆包、Kimi、腾讯元宝等网页中尝试填入当前输入框。
- 本地状态：保存常用模板、最近使用模板和最近生成内容。

## 本地加载

1. 打开 Chrome，进入 `chrome://extensions/`。
2. 开启右上角“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择 `PromptTemplateHub` 目录。

## 使用方式

1. 点击浏览器工具栏里的“Prompt 模版大全”图标。
2. 搜索或选择分类，点击一个模板。
3. 按字段填写内容，右侧会实时生成完整 prompt。
4. 点击“复制 Prompt”，或在支持的 AI 对话页面点击“填入当前页面”。

## 一键填入说明

网页 AI 产品经常调整 DOM 结构，因此一键填入采用“站点专用选择器 + 通用输入框兜底”的策略。若某个页面无法识别输入框，复制功能仍可正常使用。

当前优先适配：

- ChatGPT：`chatgpt.com`、`chat.openai.com`
- Claude：`claude.ai`
- DeepSeek：`chat.deepseek.com`
- Gemini：`gemini.google.com`
- 通义千问：`tongyi.aliyun.com`
- 豆包：`doubao.com`
- Kimi：`kimi.moonshot.cn`
- 腾讯元宝：`yuanbao.tencent.com`

## 文件结构

```text
PromptTemplateHub/
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.css
├── popup.js
├── data/
│   └── templates.js
└── readme.md
```
