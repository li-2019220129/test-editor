class MyAIC {
  static targetEl = null;
  static skipAnimation = false;
  static strData = '';
  static md = null;
  static container = null;
  static btnStart = null;
  static btnReset = null;
  static chkSkip = null;
  static autoScroll = true;

  static htmlContent = `
    <style id="myaic-styles">
      #stream-output {
        border: 1px solid #ddd;
        padding: 15px;
        margin-top: 20px;
        min-height: 200px;
        max-height: 400px;
        background-color: #f0f8ff;
        font-family: monospace;
        white-space: pre-wrap;
        overflow-y: auto;
      }
      button {
        padding: 8px 15px;
        margin-right: 10px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover {
        background-color: #45a049;
      }
      /* 额外的图片样式 */
      #stream-output img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 10px 0;
      }
    </style>

    <div id="myaic-root">
      <div>
        <button id="start-stream">开始流式输出</button>
        <button id="reset">重置</button>
        <label><input type="checkbox" id="skip-animation" /> 跳过动画</label>
      </div>
      <div id="stream-output"></div>
    </div>
  `;

  static loadDependencies() {
    return new Promise((resolve, reject) => {
      const scripts = [
        'https://cdn.jsdelivr.net/npm/markdown-it/dist/markdown-it.min.js',
        'https://cdn.jsdelivr.net/npm/morphdom@2/dist/morphdom-umd.min.js'
      ];
      let loaded = 0;

      scripts.forEach(src => {
        if (document.querySelector(`script[src="${src}"]`)) {
          loaded++;
          if (loaded === scripts.length) resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
          loaded++;
          if (loaded === scripts.length) resolve();
        };
        script.onerror = () => reject(new Error(`加载脚本失败: ${src}`));
        document.head.appendChild(script);
      });
    });
  }

  static insertHtmlAfterTarget() {
    this.targetEl.insertAdjacentHTML('afterend', this.htmlContent);
  }

  static init(options = {}) {
    this.targetEl = options.targetEl || document.body;
    this.skipAnimation = options.skipAnimation || false;
    this.strData = '';
    this.autoScroll = true;

    this.loadDependencies()
      .then(() => {
        this.insertHtmlAfterTarget();
        this.md = window.markdownit();
        this.cacheDom();
        this.bindEvents();
      })
      .catch(err => {
        console.error('依赖加载失败', err);
      });
  }

  static cacheDom() {
    this.container = document.getElementById('stream-output');
    this.btnStart = document.getElementById('start-stream');
    this.btnReset = document.getElementById('reset');
    this.chkSkip = document.getElementById('skip-animation');
  }

  static bindEvents() {
    this.btnStart.addEventListener('click', () => this.startStream());
    this.btnReset.addEventListener('click', () => this.resetStream());
    this.chkSkip.addEventListener('change', () => {
      this.skipAnimation = this.chkSkip.checked;
    });

    this.container.addEventListener('scroll', () => {
      const isAtBottom = this.container.scrollHeight - this.container.scrollTop <= this.container.clientHeight + 5;
      this.autoScroll = isAtBottom;
    });
  }

  static replaceSpecialLinks(html) {
    return html.replace(/\[citation:(\d+)\]/g, (_, id) =>
      `<a href="/citation/${id}" class="citation" target="_blank">[引用:${id}]</a>`
    );
  }

  static scrollToBottom() {
    if (this.autoScroll) {
      this.container.scrollTop = this.container.scrollHeight;
    }
  }

  static getFullContent() {
    return `你好，欢迎使用逐字显示功能。这个功能可以像ChatGPT一样逐字显示文本内容。

这里演示图片：

![](https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f600.png)

下面是本地图片示例（请确保图片路径正确并可访问）：

![本地示例图片](/images/sample.png)

**这是一段加粗的文字**，看起来效果如何？

这里有一些特殊链接: [citation:456] 和另一个引用 [citation:789]

下面是一个列表:
* 第一个列表项
* 第二个列表项
* 第三个列表项 

这是一段代码示例:
\`\`\`javascript
function hello() {
  console.log('Hello World');
  return true;
}
\`\`\`

最后希望这个*逐字显示*效果能让您满意！`;
  }

  static startStream() {
    this.strData = '';
    const fullContent = this.getFullContent();
    this.container.textContent = '';

    if (this.skipAnimation) {
      const rendered = this.md.render(fullContent);
      const replaced = this.replaceSpecialLinks(rendered);
      this.container.innerHTML = replaced;
      this.scrollToBottom();
      return;
    }

    for (let i = 0; i < fullContent.length; i++) {
      setTimeout(() => {
        this.strData += fullContent[i];
        const rendered = this.md.render(this.strData);
        const replaced = this.replaceSpecialLinks(rendered);
        window.morphdom(this.container, replaced);
        this.scrollToBottom();
      }, i * 50);
    }
  }

  static resetStream() {
    this.strData = '';
    this.container.textContent = '';
  }
}

window.myaic = MyAIC;
