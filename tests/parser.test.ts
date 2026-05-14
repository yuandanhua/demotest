/**
 * Markdown 解析器单元测试
 */

import { parseMarkdown, parseMarkdownBatch } from '../src/parser';

describe('parseMarkdown', () => {
  // AC1: parser.ts 模块导出 parseMarkdown 函数
  describe('函数导出和基本功能', () => {
    it('应该导出 parseMarkdown 函数', () => {
      expect(typeof parseMarkdown).toBe('function');
    });

    it('应该接收字符串输入并返回字符串', () => {
      const result = parseMarkdown('test');
      expect(typeof result).toBe('string');
    });

    it('应该抛出 TypeError 当输入不是字符串', () => {
      expect(() => parseMarkdown(null as any)).toThrow(TypeError);
      expect(() => parseMarkdown(undefined as any)).toThrow(TypeError);
      expect(() => parseMarkdown(123 as any)).toThrow(TypeError);
    });

    it('应该处理空字符串', () => {
      expect(parseMarkdown('')).toBe('');
    });
  });

  // AC2: 正确解析一级标题和二级标题
  describe('标题解析 (AC2)', () => {
    it('应该将 # 转换为 <h1>', () => {
      expect(parseMarkdown('# Hello World')).toContain('<h1');
      expect(parseMarkdown('# Hello World')).toContain('Hello World');
      expect(parseMarkdown('# Hello World')).toContain('</h1>');
    });

    it('应该将 ## 转换为 <h2>', () => {
      expect(parseMarkdown('## Section')).toContain('<h2');
      expect(parseMarkdown('## Section')).toContain('Section');
      expect(parseMarkdown('## Section')).toContain('</h2>');
    });

    it('应该正确解析多级标题', () => {
      const html = parseMarkdown('# Title\n## Subtitle\n### Sub-subtitle');
      expect(html).toContain('<h1');
      expect(html).toContain('<h2');
      expect(html).toContain('<h3');
    });

    it('标题应该支持内联格式', () => {
      expect(parseMarkdown('## **Bold** Title')).toContain('<strong>Bold</strong>');
    });
  });

  // AC3: 正确解析有序列表和无序列表
  describe('列表解析 (AC3)', () => {
    it('应该将 - 开头的行转换为 <ul>', () => {
      const html = parseMarkdown('- Item 1\n- Item 2\n- Item 3');
      expect(html).toContain('<ul>');
      expect(html).toContain('</ul>');
      expect(html).toContain('<li>');
      expect(html).toContain('</li>');
    });

    it('应该将 * 开头的行转换为 <ul>', () => {
      const html = parseMarkdown('* Item 1\n* Item 2');
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>Item 1</li>');
    });

    it('应该将数字开头的列表转换为 <ol>', () => {
      const html = parseMarkdown('1. First\n2. Second\n3. Third');
      expect(html).toContain('<ol>');
      expect(html).toContain('</ol>');
      expect(html).toContain('<li>');
    });

    it('应该支持嵌套列表', () => {
      const html = parseMarkdown('- Item 1\n  - Nested item\n- Item 2');
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>');
    });
  });

  // AC4: 正确解析代码块
  describe('代码块解析 (AC4)', () => {
    it('应该将 ``` 包裹的代码转换为 <pre><code>', () => {
      const html = parseMarkdown('```\nconst x = 1;\n```');
      expect(html).toContain('<pre>');
      expect(html).toContain('<code>');
      expect(html).toContain('</code>');
      expect(html).toContain('</pre>');
    });

    it('应该保留代码块中的内容', () => {
      const html = parseMarkdown('```\nconst x = 1;\n```');
      expect(html).toContain('const x = 1;');
    });

    it('应该支持带语言标识的代码块', () => {
      const html = parseMarkdown('```typescript\nconst x: number = 1;\n```');
      expect(html).toContain('<pre>');
      expect(html).toContain('<code');
    });

    it('应该支持行内代码', () => {
      const html = parseMarkdown('这是 `行内代码` 示例');
      expect(html).toContain('<code>');
    });
  });

  // AC5: 正确解析链接和图片
  describe('链接和图片解析 (AC5)', () => {
    it('应该将 [text](url) 转换为 <a> 标签', () => {
      const html = parseMarkdown('[OpenAI](https://openai.com)');
      expect(html).toContain('<a');
      expect(html).toContain('href="https://openai.com"');
      expect(html).toContain('>OpenAI</a>');
    });

    it('应该支持带标题的链接', () => {
      const html = parseMarkdown('[Link](https://example.com "Title")');
      expect(html).toContain('<a');
      expect(html).toContain('href="https://example.com"');
    });

    it('应该将 ![alt](url) 转换为 <img> 标签', () => {
      const html = parseMarkdown('![Logo](https://example.com/logo.png)');
      expect(html).toContain('<img');
      expect(html).toContain('src="https://example.com/logo.png"');
      expect(html).toContain('alt="Logo"');
    });

    it('图片标签应该是自闭合的', () => {
      const html = parseMarkdown('![alt](url.jpg)');
      expect(html).toMatch(/<img[^>]*>/);
    });

    it('应该支持相对路径链接和图片', () => {
      const html = parseMarkdown('[Home](/home)\n![](./image.png)');
      expect(html).toContain('href="/home"');
      expect(html).toContain('src="./image.png"');
    });
  });

  describe('段落和换行', () => {
    it('应该将段落包裹在 <p> 标签中', () => {
      const html = parseMarkdown('This is a paragraph.');
      expect(html).toContain('<p>');
      expect(html).toContain('</p>');
    });

    it('应该处理多个段落', () => {
      const html = parseMarkdown('First paragraph.\n\nSecond paragraph.');
      const pTags = (html.match(/<p>/g) || []).length;
      expect(pTags).toBe(2);
    });
  });

  describe('文本格式化', () => {
    it('应该将 **text** 转换为 <strong>', () => {
      expect(parseMarkdown('**bold**')).toContain('<strong>');
      expect(parseMarkdown('__bold__')).toContain('<strong>');
    });

    it('应该将 *text* 转换为 <em>', () => {
      expect(parseMarkdown('*italic*')).toContain('<em>');
      expect(parseMarkdown('_italic_')).toContain('<em>');
    });

    it('删除线是 GFM 扩展语法，禁用 GFM 后不转换', () => {
      // 删除线 ~~text~~ 是 GitHub Flavored Markdown 扩展语法
      // 由于我们在配置中禁用了 GFM，它会被保留为原文本
      expect(parseMarkdown('~~deleted~~')).toContain('~~deleted~~');
    });
  });

  describe('引用块', () => {
    it('应该将 > 开头的行转换为 <blockquote>', () => {
      const html = parseMarkdown('> This is a quote');
      expect(html).toContain('<blockquote>');
      expect(html).toContain('</blockquote>');
    });

    it('应该支持多行引用', () => {
      const html = parseMarkdown('> Line 1\n> Line 2');
      expect(html).toContain('<blockquote>');
    });
  });

  describe('分隔线', () => {
    it('应该将 --- 转换为 <hr>', () => {
      const html = parseMarkdown('---');
      expect(html).toContain('<hr');
    });

    it('应该将 *** 转换为 <hr>', () => {
      const html = parseMarkdown('***');
      expect(html).toContain('<hr');
    });
  });

  describe('组合测试', () => {
    it('应该正确解析包含多种元素的 Markdown', () => {
      const md = `# Document Title

This is a paragraph with **bold** and *italic* text.

## Features

- Feature 1
- Feature 2

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

[Link](https://example.com)`;
      const html = parseMarkdown(md);
      expect(html).toContain('<h1');
      expect(html).toContain('<h2');
      expect(html).toContain('<p>');
      expect(html).toContain('<strong>');
      expect(html).toContain('<em>');
      expect(html).toContain('<ul>');
      expect(html).toContain('<pre>');
      expect(html).toContain('<a href=');
    });
  });
});

describe('parseMarkdownBatch', () => {
  it('应该批量解析多个 Markdown', () => {
    const inputs = ['# Title 1', '# Title 2', '# Title 3'];
    const results = parseMarkdownBatch(inputs);
    expect(results).toHaveLength(3);
    results.forEach(html => {
      expect(html).toContain('<h1');
    });
  });

  it('应该保持输入输出的顺序', () => {
    const inputs = ['# A', '## B', '### C'];
    const results = parseMarkdownBatch(inputs);
    expect(results[0]).toContain('<h1');
    expect(results[1]).toContain('<h2');
    expect(results[2]).toContain('<h3');
  });

  it('应该处理空数组', () => {
    expect(parseMarkdownBatch([])).toEqual([]);
  });
});

describe('边界情况', () => {
  it('应该处理只有空白符的输入', () => {
    expect(parseMarkdown('   ')).not.toBeNull();
    expect(parseMarkdown('\n\n\n')).not.toBeNull();
  });

  it('应该处理特殊字符', () => {
    // marked 默认允许内联 HTML
    const html = parseMarkdown('<div>');
    expect(html).toContain('<div>');
  });

  it('应该保留 & 符号', () => {
    // marked 会尝试处理 HTML 实体
    const html = parseMarkdown('&amp;');
    expect(html).toContain('&amp;');
  });
});
