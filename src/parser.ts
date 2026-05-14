/**
 * Markdown 解析器模块
 * 使用 marked 库将 Markdown 文本转换为 HTML
 */

import { marked } from 'marked';

/**
 * 配置 marked 选项
 * 仅支持标准 Markdown 语法，不使用扩展语法
 */
marked.setOptions({
  gfm: false,           // 禁用 GitHub Flavored Markdown
  breaks: false,        // 不转换换行符为 <br>
  pedantic: false,      // 不使用严格模式
});

/**
 * 将 Markdown 文本解析为 HTML
 *
 * @param markdown - Markdown 格式的文本
 * @returns 解析后的 HTML 字符串
 *
 * @example
 * ```typescript
 * const html = parseMarkdown('# Hello World');
 * // 返回: '<h1>Hello World</h1>'
 * ```
 */
export function parseMarkdown(markdown: string): string {
  if (typeof markdown !== 'string') {
    throw new TypeError('Input must be a string');
  }

  // 使用 marked 将 Markdown 转换为 HTML
  return marked(markdown) as string;
}

/**
 * 批量解析多个 Markdown 文本
 *
 * @param markdowns - Markdown 文本数组
 * @returns 解析后的 HTML 字符串数组
 */
export function parseMarkdownBatch(markdowns: string[]): string[] {
  return markdowns.map(parseMarkdown);
}
