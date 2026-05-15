import {
  renderTemplate,
  renderPage,
  renderBatch
} from '../src/template';

describe('HTML 模板引擎', () => {
  describe('renderTemplate', () => {
    it('应该生成完整的 HTML 文档', () => {
      const content = '<h1>Hello World</h1>';
      const result = renderTemplate(content);

      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<html');
      expect(result).toContain('</html>');
      expect(result).toContain('<head>');
      expect(result).toContain('<body>');
      expect(result).toContain(content);
    });

    it('应该设置正确的字符编码和视口', () => {
      const result = renderTemplate('content');

      expect(result).toContain('<meta charset="UTF-8">');
      expect(result).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    });

    it('应该使用默认标题', () => {
      const result = renderTemplate('content');
      expect(result).toContain('<title>My Blog</title>');
    });

    it('应该使用自定义标题', () => {
      const result = renderTemplate('content', { title: 'Custom Title' });
      expect(result).toContain('<title>Custom Title</title>');
    });

    it('应该使用默认语言', () => {
      const result = renderTemplate('content');
      expect(result).toContain('lang="zh-CN"');
    });

    it('应该使用自定义语言', () => {
      const result = renderTemplate('content', { language: 'en-US' });
      expect(result).toContain('lang="en-US"');
    });

    it('应该包含描述元标签', () => {
      const result = renderTemplate('content', {
        description: 'A custom description'
      });
      expect(result).toContain('<meta name="description" content="A custom description">');
    });
  });

  describe('CSS 样式验证', () => {
    it('应该包含基础样式', () => {
      const result = renderTemplate('content');
      expect(result).toContain('<style>');
      expect(result).toContain('font-family:');
      expect(result).toContain('-apple-system');
    });

    it('应该包含标题样式', () => {
      const result = renderTemplate('content');
      expect(result).toContain('h1, h2, h3');
      expect(result).toContain('border-bottom:');
      expect(result).toContain('font-weight: 600');
    });

    it('应该包含代码块样式', () => {
      const result = renderTemplate('content');
      expect(result).toContain('pre {');
      expect(result).toContain('background:');
      expect(result).toContain('border-radius:');
    });

    it('应该包含行内代码样式', () => {
      const result = renderTemplate('content');
      expect(result).toContain('code {');
      expect(result).toContain('font-family:');
      expect(result).toContain('monospace');
    });

    it('应该包含引用块样式', () => {
      const result = renderTemplate('content');
      expect(result).toContain('blockquote {');
      expect(result).toContain('border-left:');
      expect(result).toContain('padding-left:');
    });

    it('应该包含链接样式', () => {
      const result = renderTemplate('content');
      expect(result).toContain('a {');
      expect(result).toContain('color:');
      expect(result).toContain('text-decoration:');
    });

    it('应该包含图片样式', () => {
      const result = renderTemplate('content');
      expect(result).toContain('img {');
      expect(result).toContain('max-width: 100%');
      expect(result).toContain('height: auto');
    });

    it('应该包含移动端响应式样式', () => {
      const result = renderTemplate('content');
      expect(result).toContain('@media (max-width: 600px)');
      expect(result).toContain('padding: 10px');
    });
  });

  describe('renderPage', () => {
    it('应该渲染完整的页面', () => {
      const result = renderPage('Test Page', '<p>Content</p>');

      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<title>Test Page</title>');
      expect(result).toContain('<p>Content</p>');
    });

    it('应该接受额外的选项', () => {
      const result = renderPage('Page', 'Content', {
        language: 'en',
        description: 'Test description'
      });

      expect(result).toContain('lang="en"');
      expect(result).toContain('Test description');
    });
  });

  describe('renderBatch', () => {
    it('应该批量渲染多个页面', () => {
      const pages = [
        { title: 'Page 1', content: '<h1>Content 1</h1>' },
        { title: 'Page 2', content: '<h1>Content 2</h1>' },
        { title: 'Page 3', content: '<h1>Content 3</h1>' }
      ];

      const results = renderBatch(pages);

      expect(results).toHaveLength(3);
      expect(results[0]).toContain('<title>Page 1</title>');
      expect(results[0]).toContain('<h1>Content 1</h1>');
      expect(results[1]).toContain('<title>Page 2</title>');
      expect(results[1]).toContain('<h1>Content 2</h1>');
      expect(results[2]).toContain('<title>Page 3</title>');
      expect(results[2]).toContain('<h1>Content 3</h1>');
    });

    it('应该支持每页自定义选项', () => {
      const pages = [
        {
          title: 'EN Page',
          content: 'English content',
          options: { language: 'en-US' }
        },
        {
          title: 'ZH Page',
          content: '中文内容',
          options: { language: 'zh-CN' }
        }
      ];

      const results = renderBatch(pages);

      expect(results[0]).toContain('lang="en-US"');
      expect(results[1]).toContain('lang="zh-CN"');
    });

    it('应该处理空数组', () => {
      const results = renderBatch([]);
      expect(results).toHaveLength(0);
    });
  });

  describe('边界情况', () => {
    it('应该处理空内容', () => {
      const result = renderTemplate('');
      expect(result).toContain('<body>');
      expect(result).toContain('</body>');
    });

    it('应该处理特殊字符', () => {
      const content = '<p>Test & "quotes" & \'apostrophes\'</p>';
      const result = renderTemplate(content);
      expect(result).toContain(content);
    });

    it('应该处理 HTML 实体', () => {
      const content = '<p>&lt;div&gt;Hello&lt;/div&gt;</p>';
      const result = renderTemplate(content);
      expect(result).toContain(content);
    });

    it('应该处理长内容', () => {
      const longContent = '<p>' + 'A'.repeat(10000) + '</p>';
      const result = renderTemplate(longContent);
      expect(result).toContain(longContent);
    });
  });

  describe('真实场景测试', () => {
    it('应该正确渲染博客文章', () => {
      const blogContent = `
        <h1>My First Blog Post</h1>
        <p>This is my first blog post about programming.</p>
        <h2>Getting Started</h2>
        <p>Let's begin with some code:</p>
        <pre><code>console.log("Hello, World!");</code></pre>
        <blockquote>Keep learning and coding!</blockquote>
      `;

      const result = renderTemplate(blogContent, {
        title: 'My First Blog Post',
        description: 'My first blog post about programming'
      });

      expect(result).toContain('My First Blog Post');
      expect(result).toContain('<h1>My First Blog Post</h1>');
      expect(result).toContain('<h2>Getting Started</h2>');
      expect(result).toContain('<pre><code>');
      expect(result).toContain('<blockquote>');
    });

    it('应该处理包含多种元素的页面', () => {
      const complexContent = `
        <h1>Main Title</h1>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
        <p>Some text with <a href="#">link</a></p>
        <img src="image.jpg" alt="Test Image">
        <hr>
        <p>Final paragraph</p>
      `;

      const result = renderTemplate(complexContent);

      expect(result).toContain('<h1>Main Title</h1>');
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>Item 1</li>');
      expect(result).toContain('<a href="#">link</a>');
      expect(result).toContain('<img src="image.jpg"');
      expect(result).toContain('<hr');
      expect(result).toContain('<p>Final paragraph</p>');
    });
  });
});