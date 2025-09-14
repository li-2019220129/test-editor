;(function (global) {
  class SearchPlugin {
    constructor(options = {}) {
      this.config = Object.assign({
        lang: 'en',
        translations: {
          en: { historyTitle: 'Search History', hotTitle: 'Hot Searches', clear: 'Clear' },
          zh: { historyTitle: '搜索历史', hotTitle: '热门搜索', clear: '清空' }
        },
        maxHistory: 10,
        hotList: [],
        storageKey: 'search_history',
        selector: 'input[type="text"]'
      }, options);

      this.history = this.loadHistory();
      this.init();
    }

    init() {
      const inputs = document.querySelectorAll(this.config.selector);
      inputs.forEach(input => {
        input.addEventListener('focus', () => this.showDropdown(input));
        input.addEventListener('blur', () => setTimeout(() => this.hideDropdown(), 200));
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && input.value.trim()) {
            this.saveHistory(input.value.trim());
          }
        });
      });
    }

    renderDropdown() {
      const t = this.config.translations[this.config.lang];
      const wrapper = document.createElement('div');
      wrapper.className = 'search-plugin-dropdown';

      // 历史
      if (this.history.length) {
        const historyBox = document.createElement('div');
        historyBox.className = 'history-box';
        historyBox.innerHTML = `<div class="title">${t.historyTitle} <span class="clear-btn">${t.clear}</span></div>`;
        this.history.forEach(item => {
          const el = document.createElement('div');
          el.className = 'history-item';
          el.textContent = item;
          el.addEventListener('click', () => {
            this.activeInput.value = item;
          });
          historyBox.appendChild(el);
        });
        historyBox.querySelector('.clear-btn').addEventListener('click', () => this.clearHistory());
        wrapper.appendChild(historyBox);
      }

      // 热门
      if (this.config.hotList.length) {
        const hotBox = document.createElement('div');
        hotBox.className = 'hot-box';
        hotBox.innerHTML = `<div class="title">${t.hotTitle}</div>`;
        this.config.hotList.forEach(item => {
          const el = document.createElement('a');
          el.className = 'hot-item';
          el.textContent = item.text;
          if (item.link) el.href = item.link;
          hotBox.appendChild(el);
        });
        wrapper.appendChild(hotBox);
      }

      return wrapper;
    }

    showDropdown(input) {
      this.activeInput = input;
      this.hideDropdown();
      const dropdown = this.renderDropdown();
      dropdown.style.position = 'absolute';
      dropdown.style.top = input.offsetTop + input.offsetHeight + 'px';
      dropdown.style.left = input.offsetLeft + 'px';
      dropdown.style.width = input.offsetWidth + 'px';
      dropdown.style.border = '1px solid #ccc';
      dropdown.style.background = '#fff';
      dropdown.style.zIndex = 9999;
      input.parentNode.appendChild(dropdown);
      this.dropdown = dropdown;
    }

    hideDropdown() {
      if (this.dropdown && this.dropdown.parentNode) {
        this.dropdown.parentNode.removeChild(this.dropdown);
        this.dropdown = null;
      }
    }

    saveHistory(value) {
      this.history = this.history.filter(v => v !== value);
      this.history.unshift(value);
      if (this.history.length > this.config.maxHistory) {
        this.history.pop();
      }
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.history));
    }

    loadHistory() {
      return JSON.parse(localStorage.getItem(this.config.storageKey) || '[]');
    }

    clearHistory() {
      this.history = [];
      localStorage.removeItem(this.config.storageKey);
      this.refresh();
    }

    // 🔥 新增：更新配置并刷新
    updateConfig(newConfig) {
      this.config = Object.assign(this.config, newConfig);
      this.refresh();
    }

    refresh() {
      if (this.activeInput) {
        this.showDropdown(this.activeInput);
      }
    }
  }

  global.SearchPlugin = SearchPlugin;
})(window);
