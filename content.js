class PromptInserter {
  constructor() {
    this.siteSelectors = [
      {
        host: 'chatgpt.com',
        selectors: [
          '#prompt-textarea',
          'div#prompt-textarea.ProseMirror',
          '[data-testid="composer-text-input"]',
          'textarea[data-testid="prompt-textarea"]',
          'div[contenteditable="true"][data-testid="prompt-textarea"]',
          'div[contenteditable="true"].ProseMirror'
        ]
      },
      {
        host: 'chat.openai.com',
        selectors: [
          '#prompt-textarea',
          'div#prompt-textarea.ProseMirror',
          '[data-testid="composer-text-input"]',
          'textarea[data-testid="prompt-textarea"]',
          'div[contenteditable="true"][data-testid="prompt-textarea"]',
          'div[contenteditable="true"].ProseMirror'
        ]
      },
      {
        host: 'claude.ai',
        selectors: [
          'div[contenteditable="true"].ProseMirror',
          '[data-testid="chat-input"] div[contenteditable="true"]',
          'div[role="textbox"][contenteditable="true"]'
        ]
      },
      {
        host: 'chat.deepseek.com',
        selectors: [
          '#chat-input',
          'textarea',
          'div[contenteditable="true"]',
          'div[role="textbox"]'
        ]
      },
      {
        host: 'gemini.google.com',
        selectors: [
          'rich-textarea div[contenteditable="true"]',
          'div[aria-label*="Enter a prompt"]',
          'div[contenteditable="true"]'
        ]
      },
      {
        host: 'tongyi.aliyun.com',
        selectors: [
          'textarea',
          'div[contenteditable="true"]',
          'div[role="textbox"]'
        ]
      },
      {
        host: 'doubao.com',
        selectors: [
          'textarea',
          'div[contenteditable="true"]',
          'div[role="textbox"]'
        ]
      },
      {
        host: 'kimi.moonshot.cn',
        selectors: [
          'textarea',
          'div[contenteditable="true"]',
          'div[role="textbox"]'
        ]
      },
      {
        host: 'yuanbao.tencent.com',
        selectors: [
          'textarea',
          'div[contenteditable="true"]',
          'div[role="textbox"]'
        ]
      }
    ];

    this.genericSelectors = [
      'textarea:not([readonly]):not([disabled])',
      'input[type="text"]:not([readonly]):not([disabled])',
      '[contenteditable="true"]',
      '[role="textbox"]'
    ];

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request?.action !== 'insert_prompt') {
        return false;
      }

      const result = this.insertPrompt(request.prompt);
      sendResponse(result);
      return false;
    });
  }

  insertPrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      return { success: false, error: 'Prompt 内容为空' };
    }

    const target = this.findBestInput();
    if (!target) {
      return { success: false, error: '未找到当前页面的 AI 输入框' };
    }

    try {
      this.writeValue(target, prompt);
      return { success: true };
    } catch (error) {
      return { success: false, error: '写入输入框失败，请使用复制功能' };
    }
  }

  findBestInput() {
    const activeTarget = this.getEditableElement(document.activeElement);
    if (activeTarget && this.isUsableInput(activeTarget)) {
      return activeTarget;
    }

    const selectors = [
      ...this.getCurrentSiteSelectors(),
      ...this.genericSelectors
    ];

    const candidates = [];
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        const editable = this.getEditableElement(element);
        if (editable && this.isUsableInput(editable) && !candidates.includes(editable)) {
          candidates.push(editable);
        }
      });
    });

    candidates.sort((a, b) => this.scoreInput(b) - this.scoreInput(a));
    return candidates[0] || null;
  }

  getCurrentSiteSelectors() {
    const site = this.siteSelectors.find(item => window.location.hostname.includes(item.host));
    return site?.selectors || [];
  }

  getEditableElement(element) {
    if (!element || element === document.body || element === document.documentElement) {
      return null;
    }

    if (this.isEditable(element)) {
      return element;
    }

    return element.closest?.('textarea, input[type="text"], [contenteditable="true"], [role="textbox"]') || null;
  }

  isEditable(element) {
    const tagName = element.tagName?.toLowerCase();
    return tagName === 'textarea'
      || (tagName === 'input' && element.type === 'text')
      || element.getAttribute('contenteditable') === 'true'
      || element.getAttribute('role') === 'textbox';
  }

  isUsableInput(element) {
    if (!this.isVisible(element)) {
      return false;
    }

    if (element.matches?.('[readonly], [disabled], [aria-disabled="true"]')) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    return rect.width >= 80 && rect.height >= 20;
  }

  isVisible(element) {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none'
      && style.visibility !== 'hidden'
      && Number(style.opacity) !== 0
      && rect.width > 0
      && rect.height > 0;
  }

  scoreInput(element) {
    const rect = element.getBoundingClientRect();
    const viewportBottomDistance = Math.abs(window.innerHeight - rect.bottom);
    let score = 0;

    if (element === document.activeElement) {
      score += 100;
    }

    if (element.matches?.('textarea, [contenteditable="true"], [role="textbox"]')) {
      score += 40;
    }

    if (rect.bottom > window.innerHeight * 0.45) {
      score += 20;
    }

    score += Math.max(0, 30 - viewportBottomDistance / 20);
    score += Math.min(20, rect.width / 40);

    return score;
  }

  writeValue(element, value) {
    element.focus();

    if (element.tagName?.toLowerCase() === 'textarea' || element.tagName?.toLowerCase() === 'input') {
      this.setNativeValue(element, value);
    } else {
      this.setContentEditableValue(element, value);
    }

    this.dispatchInputEvents(element, value);
    element.focus();
  }

  setNativeValue(element, value) {
    const prototype = element.tagName.toLowerCase() === 'textarea'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');

    if (descriptor?.set) {
      descriptor.set.call(element, value);
    } else {
      element.value = value;
    }
  }

  setContentEditableValue(element, value) {
    this.selectEditableContents(element);
    if (document.queryCommandSupported?.('insertText')) {
      document.execCommand('insertText', false, value);
    } else {
      element.textContent = value;
      this.moveCaretToEnd(element);
    }
  }

  selectEditableContents(element) {
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  moveCaretToEnd(element) {
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  dispatchInputEvents(element, value) {
    const inputEventOptions = {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: value
    };

    try {
      element.dispatchEvent(new InputEvent('beforeinput', inputEventOptions));
      element.dispatchEvent(new InputEvent('input', inputEventOptions));
    } catch (error) {
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    element.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

if (!window.promptTemplateHubInserter) {
  window.promptTemplateHubInserter = new PromptInserter();
}
