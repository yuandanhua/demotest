/**
 * HTML 模板引擎
 * 将 Markdown 解析器输出的 HTML 内容包裹在完整的 HTML 页面中
 */

export interface TemplateOptions {
  title?: string;
  language?: string;
  description?: string;
}

export function renderTemplate(
  content: string,
  options: TemplateOptions = {}
): string {
  const {
    title = "My Blog",
    language = "zh-CN",
    description = "A modern blog built with markpub"
  } = options;

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <title>${title}</title>
  <style>
    /* 基础样式 */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                   "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #fff;
    }

    /* 标题样式 */
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
      color: #24292e;
      border-bottom: 1px solid #eaecef;
      padding-bottom: 8px;
    }

    h1 {
      font-size: 2em;
      border-bottom: 2px solid #eaecef;
    }

    h2 {
      font-size: 1.5em;
      border-bottom: 1px solid #eaecef;
    }

    /* 段落和列表 */
    p {
      margin-bottom: 16px;
    }

    ul, ol {
      margin-bottom: 16px;
      padding-left: 2em;
    }

    li {
      margin-bottom: 4px;
    }

    /* 代码样式 */
    pre {
      background: #f6f8fa;
      border-radius: 6px;
      padding: 16px;
      overflow: auto;
      margin-bottom: 16px;
    }

    code {
      background: #f6f8fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 85%;
    }

    pre code {
      background: transparent;
      padding: 0;
      border-radius: 0;
    }

    /* 引用块 */
    blockquote {
      border-left: 4px solid #dfe2e5;
      padding-left: 16px;
      color: #6a737d;
      margin-bottom: 16px;
    }

    /* 链接 */
    a {
      color: #0366d6;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    /* 图片 */
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 16px 0;
    }

    /* 分隔线 */
    hr {
      border: none;
      border-top: 1px solid #e1e4e8;
      height: 1px;
      margin: 24px 0;
    }

    /* 表格 */
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }

    table th,
    table td {
      border: 1px solid #dfe2e5;
      padding: 6px 13px;
    }

    table th {
      background: #f6f8fa;
      font-weight: 600;
    }

    /* 移动端响应式 */
    @media (max-width: 600px) {
      body {
        padding: 10px;
      }

      h1 {
        font-size: 1.75em;
      }

      h2 {
        font-size: 1.25em;
      }

      pre {
        padding: 12px;
      }
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
}

export function renderPage(
  title: string,
  content: string,
  options: Omit<TemplateOptions, 'title'> = {}
): string {
  return renderTemplate(content, { ...options, title });
}

/**
 * 批量渲染多个页面
 */
export function renderBatch(
  pages: Array<{ title: string; content: string; options?: TemplateOptions }>
): string[] {
  return pages.map(page =>
    renderPage(page.title, page.content, page.options)
  );
}