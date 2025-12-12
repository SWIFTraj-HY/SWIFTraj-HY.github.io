# Markdown 内容管理指南

## 概述

本项目已经完全采用 Markdown 驱动的内容管理系统。**页面中的所有文本内容都从 Markdown 文件加载并渲染**，包括：

- 📋 页面标题
- 👥 作者信息
- 🔗 项目链接
- 🎬 视频描述
- 📝 摘要
- 📖 详细内容（方法、实验、结果等）

## 文件结构

```
open-vehicle-trajectory/
├── page-content.md          # 主要页面内容（所有内容在这里编辑）
├── content.md              # 额外的独立内容（可选）
├── index.html              # HTML 框架（通常不需要修改）
├── static/
│   ├── css/
│   │   └── index.css       # 样式文件（包含 Markdown 渲染样式）
│   └── js/
│       └── index.js        # JavaScript 加载和渲染逻辑
└── MARKDOWN_USAGE.md       # 本使用指南
```

## 如何使用

### 1. 编辑内容

只需编辑 `page-content.md` 文件即可更新整个网站的内容。该文件采用特定的章节结构：

```markdown
# 标题                    → 显示在页面顶部
## 作者信息               → 显示作者、单位
## 项目链接               → 自动转换为按钮
## 视频简介               → 视频下方的描述
## 摘要                   → Abstract 部分
---
## 方法概述               → 主要内容区域开始
## 实验结果
...其他章节...
```

### 2. 内容区域映射

| Markdown 章节 | HTML 位置 | 说明 |
|--------------|-----------|------|
| `# 标题` | 页面顶部横幅 | 第一个 h1 标题 |
| `## 作者信息` | 作者区域 | 支持上标、链接 |
| `## 项目链接` | 按钮组 | 自动识别图标 |
| `## 视频简介` | 视频下方 | 视频描述文字 |
| `## 摘要` | Abstract 部分 | 论文摘要 |
| 其他章节 | 详细内容区域 | 所有其他内容 |

### 3. 链接自动转按钮

在 `## 项目链接` 部分，Markdown 链接会自动转换为样式化的按钮：

```markdown
## 项目链接
- [📄 论文](https://arxiv.org/pdf/xxx.pdf)          → PDF 图标
- [💻 代码](https://github.com/xxx/xxx)             → GitHub 图标
- [📚 arXiv](https://arxiv.org/abs/xxx)             → arXiv 图标
- [📦 补充材料](static/pdfs/supplementary.pdf)      → PDF 图标
```

## 支持的 Markdown 语法

### 基础语法

- **标题**: `# H1`, `## H2`, `### H3` 等
- **粗体**: `**粗体文本**`
- **斜体**: `*斜体文本*`
- **上标**: `<sup>1</sup>` 用于作者标注
- **链接**: `[文本](URL)`
- **列表**: 
  - 无序: `- 项目`
  - 有序: `1. 项目`
  - 任务列表: `- [ ] 未完成`, `- [x] 已完成`

### 高级语法

#### 代码块
\`\`\`python
def hello():
    print("Hello World")
\`\`\`

#### 表格
```
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据 | 数据 | 数据 |
```

#### 引用
```
> 💡 **重要提示**: 这是一个强调的引用块
```

#### 分隔线
```
---
```

## 实时预览

### 启动本地服务器

```bash
# 方法1: Python
python -m http.server 8000

# 方法2: Node.js
npx http-server -p 8000
```

然后访问: `http://localhost:8000/index.html`

### 查看更改

1. 编辑 `page-content.md`
2. 保存文件
3. 刷新浏览器 (F5 或 Ctrl+R)
4. 内容自动更新

## 自定义样式

### 修改 Markdown 渲染样式

在 `static/css/index.css` 中找到 `.markdown-body` 相关样式：

```css
.markdown-body {
  font-size: 16px;        /* 修改字体大小 */
  line-height: 1.8;       /* 修改行高 */
  color: var(--text-primary);
}

.markdown-body h1 {
  font-size: 2em;         /* 修改标题大小 */
  /* 其他样式... */
}
```

### 特定区域样式

```css
/* 作者信息区域 */
#md-authors .markdown-body p {
  font-size: 1.1em;
}

/* 摘要区域 */
#md-abstract.markdown-body {
  font-size: 1.05em;
  line-height: 1.9;
}
```

## 高级功能

### 添加新的内容区域

1. **在 HTML 中添加容器**:
```html
<div id="md-new-section" class="markdown-body">
  <p>加载中...</p>
</div>
```

2. **在 `index.js` 中添加渲染逻辑**:
```javascript
// 在 extractSections 函数中添加
const newSectionMatch = markdown.match(/##\s+新章节\s*\n([\s\S]*?)(?=\n##|$)/);
if (newSectionMatch) {
    sections.newSection = newSectionMatch[1].trim();
}

// 在 loadMarkdownContent 函数中添加
const newSectionContainer = document.getElementById('md-new-section');
if (newSectionContainer && sections.newSection) {
    const html = marked.parse(sections.newSection);
    newSectionContainer.innerHTML = html;
}
```

3. **在 `page-content.md` 中添加内容**:
```markdown
## 新章节
这里是新章节的内容...
```

### 使用多个 Markdown 文件

如果需要将内容分散到多个文件：

```javascript
// 加载额外的 Markdown 文件
const response2 = await fetch('another-content.md');
const anotherMarkdown = await response2.text();
const anotherHtml = marked.parse(anotherMarkdown);
document.getElementById('another-container').innerHTML = anotherHtml;
```

## 最佳实践

### ✅ 推荐做法

1. **保持结构清晰**: 使用明确的章节标题
2. **使用语义化标记**: 正确使用标题级别 (H1 > H2 > H3)
3. **添加适当的空行**: 在不同章节之间使用 `---` 分隔
4. **使用相对路径**: 图片和链接使用相对路径
5. **定期备份**: 保存 `page-content.md` 的版本历史

### ❌ 避免做法

1. 不要在 Markdown 中直接写 HTML（除非必要）
2. 不要使用过深的标题嵌套 (>H6)
3. 不要在表格中使用复杂的格式
4. 避免使用绝对路径

## 故障排除

### 内容没有显示

1. **检查浏览器控制台**: 按 F12 打开开发者工具
2. **查看网络请求**: 确认 `page-content.md` 返回 200 状态
3. **检查 Markdown 语法**: 确保没有格式错误
4. **清除缓存**: Ctrl+Shift+R 强制刷新

### 样式不正确

1. 检查 CSS 文件是否正确加载
2. 确认 `.markdown-body` 类是否应用
3. 检查浏览器兼容性

### 链接按钮没有图标

1. 确认链接文本包含关键词（论文、代码、arXiv 等）
2. 检查 Font Awesome 库是否加载
3. 查看 `renderLinks` 函数的图标映射逻辑

## 示例内容模板
