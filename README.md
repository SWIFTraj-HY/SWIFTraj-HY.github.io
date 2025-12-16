1216 changelog: Homepage hero redesign
Replaced the old full-screen video hero with a new immersive layout.
Uses a looping aerial video as the hero background to convey real-world highway scenes.
Added a glassmorphism card on the right to showcase the trajectory heatmap image.
Positioned title and card in the lower half of the hero so that the upper half of the video remains clean and unobstructed.
Tuned responsive layout (grid columns, paddings, min-height) for better viewing on different screen sizes.

现在网站包含6个独立的页面，并通过 common.js 统一管理导航栏和页脚，方便您后续维护。
主要修改内容：
统一架构 (static/js/common.js)：
创建了统一的导航栏（Header）和页脚（Footer）。您只需要修改这个文件里的 injectFooter 函数，所有页面的联系方式和版权信息都会同步更新。
添加了 loadMarkdown 函数，用于动态加载 Markdown 内容。
页面实现 (6个 HTML 文件)：
首页 (index.html)：保留了顶部视频，重构了布局。包括数据总结（3列）、实验详情（Markdown）、数据处理（Markdown）、潜在用途（3列）。
数据描述 (data-description.html)：包含站点路网图占位符、站点描述（Markdown）和数据字段表格。
工具 (tools.html)：通过 Markdown (tools.md) 展示代码和使用步骤。
精选论文 (publications.html)：实现了左图右文的布局，包含论文链接和可点击展开的 BibTeX 引用格式。
下载 (download.html)：通过 Markdown (download.md) 展示下载链接和申请步骤。
贡献者 (contributors.html)：实现了团队成员的照片卡片网格布局。
内容管理 (static/md/ 文件夹)：
将需要经常编辑的长文本内容移动到了 Markdown 文件中，方便您直接修改文字，而无需触碰 HTML 代码。
创建了以下文件（已包含中文注释）：
home_experiment.md (首页实验介绍)
home_processing.md (首页数据处理)
data_site_desc.md (数据描述页-站点介绍)
tools.md (工具页内容)
download.md (下载页内容)
样式优化：
在 static/css/index.css 中添加了针对论文列表、贡献者卡片等新组件的样式。
您可以直接在浏览器中打开 index.html 查看效果。如果需要修改页面文字内容，请优先查看 static/md/ 下的对应文件。如果需要修改页脚联系方式，请修改 static/js/common.js。