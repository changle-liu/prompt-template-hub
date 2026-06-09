class PromptTemplatePopup {
  constructor() {
    this.categories = PROMPT_TEMPLATE_CATEGORIES;
    this.templates = PROMPT_TEMPLATES;
    this.activeCategory = 'all';
    this.searchTerm = '';
    this.selectedTemplate = this.templates[0];
    this.selectedSource = 'builtin';
    this.isEditorExpanded = false;
    this.currentTab = null;
    this.state = {
      selectedTemplateId: '',
      selectedSource: 'builtin',
      favoriteTemplateIds: [],
      myTemplates: [],
      recentTemplateIds: [],
      lastGeneratedPrompt: '',
      draftValuesByTemplateId: {},
      promptDraftByTemplateId: {}
    };

    this.elements = {
      siteStatus: document.getElementById('site-status'),
      searchInput: document.getElementById('search-input'),
      categoryList: document.getElementById('category-list'),
      templateCount: document.getElementById('template-count'),
      templateList: document.getElementById('template-list'),
      selectedCategory: document.getElementById('selected-category'),
      selectedTitle: document.getElementById('selected-title'),
      selectedDescription: document.getElementById('selected-description'),
      addToMyBtn: document.getElementById('add-to-my-btn'),
      newTemplateBtn: document.getElementById('new-template-btn'),
      templateEditor: document.getElementById('template-editor'),
      editTitle: document.getElementById('edit-title'),
      editDescription: document.getElementById('edit-description'),
      editCategory: document.getElementById('edit-category'),
      editTags: document.getElementById('edit-tags'),
      editVariables: document.getElementById('edit-variables'),
      variableEditorList: document.getElementById('variable-editor-list'),
      addVariableBtn: document.getElementById('add-variable-btn'),
      editBody: document.getElementById('edit-body'),
      variableForm: document.getElementById('variable-form'),
      promptPreview: document.getElementById('prompt-preview'),
      copyBtn: document.getElementById('copy-btn'),
      insertBtn: document.getElementById('insert-btn'),
      resetBtn: document.getElementById('reset-btn'),
      rawCopyBtn: document.getElementById('raw-copy-btn'),
      editTemplateBtn: document.getElementById('edit-template-btn'),
      saveTemplateBtn: document.getElementById('save-template-btn'),
      deleteTemplateBtn: document.getElementById('delete-template-btn'),
      deleteConfirmModal: document.getElementById('delete-confirm-modal'),
      deleteConfirmMessage: document.getElementById('delete-confirm-message'),
      cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
      confirmDeleteBtn: document.getElementById('confirm-delete-btn'),
      toast: document.getElementById('toast')
    };
  }

  async init() {
    await this.loadState();
    await this.loadCurrentTab();
    this.bindEvents();
    this.renderEditorCategoryOptions();
    this.renderCategories();
    this.selectInitialTemplate();
    this.renderTemplateList();
    this.renderSelectedTemplate();
    this.updateSiteStatus();
  }

  async loadState() {
    const result = await chrome.storage.local.get('promptTemplateHubState');
    if (result.promptTemplateHubState) {
      this.state = { ...this.state, ...result.promptTemplateHubState };
    }

    if (!Array.isArray(this.state.myTemplates)) {
      this.state.myTemplates = [];
    }

    this.selectedSource = this.state.selectedSource || 'builtin';
    if (this.selectedSource === 'custom') {
      this.activeCategory = 'my';
    }
  }

  async saveState() {
    await chrome.storage.local.set({
      promptTemplateHubState: {
        ...this.state,
        updatedAt: new Date().toISOString()
      }
    });
  }

  async loadCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tab || null;
  }

  bindEvents() {
    this.elements.searchInput.addEventListener('input', event => {
      this.searchTerm = event.target.value.trim().toLowerCase();
      this.renderTemplateList();
    });

    this.elements.variableForm.addEventListener('input', () => {
      this.persistVariableDraft();
      this.updatePromptPreview();
    });

    this.elements.promptPreview.addEventListener('input', () => {
      this.persistPromptDraft(this.elements.promptPreview.value);
    });

    this.elements.templateEditor.addEventListener('input', () => {
      this.handleTemplateEditorChange();
    });

    this.elements.templateEditor.addEventListener('change', () => {
      this.handleTemplateEditorChange();
    });

    this.elements.templateEditor.addEventListener('click', event => {
      if (event.target.dataset.action === 'remove-variable') {
        event.preventDefault();
        event.target.closest('.variable-editor-row')?.remove();
        this.handleTemplateEditorChange();
      }
    });

    this.elements.copyBtn.addEventListener('click', () => {
      this.copyText(this.getCurrentPrompt(), '已复制生成后的 Prompt');
    });

    this.elements.rawCopyBtn.addEventListener('click', () => {
      if (!this.selectedTemplate) {
        return;
      }
      const message = this.isCustomTemplate(this.selectedTemplate) ? '已复制模板正文' : '已复制模板原文';
      this.copyText(this.selectedTemplate.body, message);
    });

    this.elements.insertBtn.addEventListener('click', () => {
      this.insertPromptIntoCurrentPage();
    });

    this.elements.resetBtn.addEventListener('click', () => {
      this.elements.variableForm.reset();
      this.persistVariableDraft();
      this.updatePromptPreview();
      this.showToast('已清空输入');
    });

    this.elements.addToMyBtn.addEventListener('click', () => {
      this.addSelectedTemplateToMyTemplates();
    });

    this.elements.newTemplateBtn.addEventListener('click', () => {
      this.createNewTemplate();
    });

    this.elements.addVariableBtn.addEventListener('click', () => {
      this.addVariableEditorRow({
        key: '',
        type: 'textarea',
        placeholder: '',
        required: false
      });
      this.handleTemplateEditorChange();
    });

    this.elements.editTemplateBtn.addEventListener('click', () => {
      this.toggleTemplateEditor();
    });

    this.elements.saveTemplateBtn.addEventListener('click', () => {
      this.saveCurrentCustomTemplate();
    });

    this.elements.deleteTemplateBtn.addEventListener('click', () => {
      this.deleteCurrentCustomTemplate();
    });

    this.elements.cancelDeleteBtn.addEventListener('click', () => {
      this.hideDeleteConfirmModal();
    });

    this.elements.confirmDeleteBtn.addEventListener('click', () => {
      this.confirmDeleteCurrentCustomTemplate();
    });

    this.elements.deleteConfirmModal.addEventListener('click', event => {
      if (event.target === this.elements.deleteConfirmModal) {
        this.hideDeleteConfirmModal();
      }
    });
  }

  selectInitialTemplate() {
    const selectedTemplate = this.findTemplateById(this.state.selectedTemplateId, this.selectedSource);
    const [recentId] = this.state.recentTemplateIds;
    const recentTemplate = this.findTemplateById(recentId);
    this.selectedTemplate = selectedTemplate || recentTemplate || this.templates[0];
    this.selectedSource = this.selectedTemplate?.isCustom ? 'custom' : 'builtin';
    this.state.selectedSource = this.selectedSource;
    if (this.selectedSource === 'builtin' && this.activeCategory === 'my' && !this.state.myTemplates.length) {
      this.activeCategory = 'all';
    }
  }

  renderCategories() {
    this.elements.categoryList.innerHTML = '';

    const categories = [
      { id: 'my', name: `我的模板 (${this.state.myTemplates.length})` },
      ...this.categories
    ];

    categories.forEach(category => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `category-chip category-chip--${category.id}${category.id === this.activeCategory ? ' active' : ''}`;
      button.textContent = category.name;
      button.addEventListener('click', () => {
        this.activeCategory = category.id;
        if (category.id === 'my') {
          this.selectedSource = 'custom';
          this.state.selectedSource = 'custom';
        } else {
          this.selectedSource = 'builtin';
          this.state.selectedSource = 'builtin';
        }
        this.selectTemplateForActiveCategory();
        this.saveState();
        this.renderCategories();
        this.renderTemplateList();
        this.renderSelectedTemplate();
      });

      this.elements.categoryList.appendChild(button);
    });
  }

  renderTemplateList() {
    const filteredTemplates = this.getFilteredTemplates();
    this.elements.templateCount.textContent = `${filteredTemplates.length} 个`;
    this.elements.templateList.innerHTML = '';

    if (filteredTemplates.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = this.activeCategory === 'my'
        ? '还没有我的模板。点击“新建模板”，或从模板库添加一个模板。'
        : '没有找到匹配的模板，请换个关键词试试。';
      this.elements.templateList.appendChild(empty);
      return;
    }

    filteredTemplates.forEach(template => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `template-card${template.id === this.selectedTemplate?.id ? ' active' : ''}`;
      card.addEventListener('click', () => {
        this.selectedTemplate = template;
        this.selectedSource = template.isCustom ? 'custom' : 'builtin';
        this.isEditorExpanded = false;
        this.state.selectedTemplateId = template.id;
        this.state.selectedSource = this.selectedSource;
        this.saveState();
        this.rememberRecentTemplate(template.id);
        this.renderTemplateList();
        this.renderSelectedTemplate();
      });

      const titleRow = document.createElement('div');
      titleRow.className = 'template-card-title';

      const title = document.createElement('span');
      title.textContent = template.title;

      const sourceMark = document.createElement('span');
      sourceMark.textContent = template.isCustom ? '我的' : '';

      const description = document.createElement('p');
      description.textContent = template.description;

      const tagRow = document.createElement('div');
      tagRow.className = 'tag-row';
      (template.tags || []).forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagRow.appendChild(tagElement);
      });

      titleRow.append(title, sourceMark);
      card.append(titleRow, description, tagRow);
      this.elements.templateList.appendChild(card);
    });
  }

  getFilteredTemplates() {
    const templates = this.activeCategory === 'my' ? this.state.myTemplates : this.templates;
    return templates.filter(template => {
      const categoryMatched = this.activeCategory === 'all'
        || this.activeCategory === 'my'
        || template.category === this.activeCategory;
      const searchableText = [
        template.title,
        template.description,
        this.getCategoryName(template.category),
        ...(template.tags || [])
      ].join(' ').toLowerCase();
      const searchMatched = !this.searchTerm || searchableText.includes(this.searchTerm);
      return categoryMatched && searchMatched;
    });
  }

  selectTemplateForActiveCategory() {
    const filteredTemplates = this.getFilteredTemplates();
    if (!filteredTemplates.length) {
      return;
    }

    const selectedTemplateVisible = filteredTemplates.some(template => template.id === this.selectedTemplate?.id);
    if (selectedTemplateVisible) {
      return;
    }

    this.selectedTemplate = filteredTemplates[0];
    this.selectedSource = this.selectedTemplate.isCustom ? 'custom' : 'builtin';
    this.isEditorExpanded = false;
    this.state.selectedTemplateId = this.selectedTemplate.id;
    this.state.selectedSource = this.selectedSource;
  }

  renderSelectedTemplate() {
    if (!this.selectedTemplate) {
      return;
    }

    this.elements.selectedCategory.textContent = this.getCategoryName(this.selectedTemplate.category);
    this.elements.selectedTitle.textContent = this.selectedTemplate.title;
    this.elements.selectedDescription.textContent = this.selectedTemplate.description;
    this.renderTemplateEditor();
    this.renderActionButtons();
    this.renderVariableForm();
    this.restorePromptPreview();
  }

  renderTemplateEditor() {
    const isCustom = this.isCustomTemplate(this.selectedTemplate);
    this.elements.templateEditor.classList.toggle('hidden', !isCustom || !this.isEditorExpanded);

    if (!isCustom) {
      return;
    }

    this.elements.editTitle.value = this.selectedTemplate.title || '';
    this.elements.editDescription.value = this.selectedTemplate.description || '';
    this.elements.editCategory.value = this.selectedTemplate.category || 'chat';
    this.elements.editTags.value = (this.selectedTemplate.tags || []).join(', ');
    this.elements.editVariables.value = this.serializeVariables(this.selectedTemplate.variables || []);
    this.renderVariableEditorRows(this.selectedTemplate.variables || []);
    this.elements.editBody.value = this.selectedTemplate.body || '';
  }

  handleTemplateEditorChange() {
    this.syncVariableEditorValue();
    this.applyEditorDraftToSelectedTemplate();
    this.elements.selectedCategory.textContent = this.getCategoryName(this.selectedTemplate.category);
    this.elements.selectedTitle.textContent = this.selectedTemplate.title || '未命名模板';
    this.elements.selectedDescription.textContent = this.selectedTemplate.description || '自定义 prompt 模板';
    this.renderVariableForm();
    this.updatePromptPreview();
    this.renderTemplateList();
  }

  renderVariableEditorRows(variables) {
    this.elements.variableEditorList.innerHTML = '';
    variables.forEach(variable => {
      this.addVariableEditorRow(variable);
    });
  }

  addVariableEditorRow(variable) {
    const row = document.createElement('div');
    row.className = 'variable-editor-row';

    const nameField = this.createVariableEditorField('变量名');
    const nameInput = document.createElement('input');
    nameInput.dataset.variableField = 'name';
    nameInput.placeholder = '例如：主题';
    nameInput.value = this.getVariableName(variable);
    nameField.appendChild(nameInput);

    const placeholderField = this.createVariableEditorField('变量描述');
    const placeholderInput = document.createElement('input');
    placeholderInput.dataset.variableField = 'placeholder';
    placeholderInput.placeholder = '例如：请输入主题';
    placeholderInput.value = variable.placeholder || '';
    placeholderField.appendChild(placeholderInput);

    const requiredLabel = document.createElement('label');
    requiredLabel.className = 'variable-required';

    const requiredInput = document.createElement('input');
    requiredInput.type = 'checkbox';
    requiredInput.dataset.variableField = 'required';
    requiredInput.checked = Boolean(variable.required);

    const requiredText = document.createElement('span');
    requiredText.textContent = '必填';
    requiredLabel.append(requiredInput, requiredText);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'variable-remove-btn';
    removeButton.dataset.action = 'remove-variable';
    removeButton.textContent = '删除';

    row.append(nameField, placeholderField, requiredLabel, removeButton);
    this.elements.variableEditorList.appendChild(row);
  }

  createVariableEditorField(labelText) {
    const field = document.createElement('label');
    field.className = 'variable-editor-field';

    const label = document.createElement('span');
    label.textContent = labelText;
    field.appendChild(label);

    return field;
  }

  syncVariableEditorValue() {
    this.elements.editVariables.value = this.serializeVariables(this.collectVariableEditorRows());
  }

  collectVariableEditorRows() {
    return Array.from(this.elements.variableEditorList.querySelectorAll('.variable-editor-row'))
      .map(row => {
        const getField = field => row.querySelector(`[data-variable-field="${field}"]`);
        const key = (getField('name')?.value || '').trim();
        return {
          key,
          type: 'textarea',
          placeholder: (getField('placeholder')?.value || '').trim(),
          required: Boolean(getField('required')?.checked)
        };
      })
      .filter(variable => variable.key);
  }

  renderActionButtons() {
    const isCustom = this.isCustomTemplate(this.selectedTemplate);
    this.elements.addToMyBtn.classList.toggle('hidden', isCustom);
    this.elements.editTemplateBtn.classList.toggle('hidden', !isCustom);
    this.elements.editTemplateBtn.textContent = this.isEditorExpanded ? '保存' : '编辑';
    this.elements.saveTemplateBtn.classList.toggle('hidden', !isCustom || !this.isEditorExpanded);
    this.elements.deleteTemplateBtn.classList.toggle('hidden', !isCustom);
    this.elements.rawCopyBtn.textContent = isCustom ? '复制模板正文' : '复制模板原文';
  }

  toggleTemplateEditor() {
    if (!this.isCustomTemplate(this.selectedTemplate)) {
      return;
    }

    this.isEditorExpanded = !this.isEditorExpanded;
    this.renderTemplateEditor();
    this.renderActionButtons();
  }

  renderVariableForm() {
    this.elements.variableForm.innerHTML = '';
    const draftValues = this.getCurrentVariableDraft();

    (this.selectedTemplate.variables || []).forEach(variable => {
      const field = document.createElement('div');
      field.className = 'field';

      const label = document.createElement('label');
      label.htmlFor = `field-${variable.key}`;
      label.textContent = `${this.getVariableName(variable)}${variable.required ? ' *' : ''}`;

      const input = document.createElement('textarea');

      input.id = `field-${variable.key}`;
      input.name = variable.key;
      input.placeholder = variable.placeholder || '';
      input.required = Boolean(variable.required);
      input.dataset.key = variable.key;
      input.value = draftValues[variable.key] || '';

      field.append(label, input);
      this.elements.variableForm.appendChild(field);
    });
  }

  updatePromptPreview() {
    const prompt = this.renderPromptFromTemplate();
    this.elements.promptPreview.value = prompt;
    this.persistPromptDraft(prompt);
  }

  restorePromptPreview() {
    const promptDraft = this.state.promptDraftByTemplateId[this.selectedTemplate.id];
    if (typeof promptDraft === 'string') {
      this.elements.promptPreview.value = promptDraft;
      return;
    }

    this.updatePromptPreview();
  }

  renderPromptFromTemplate() {
    if (!this.selectedTemplate) {
      return '';
    }

    const values = new FormData(this.elements.variableForm);
    return (this.selectedTemplate.body || '').replace(/\{\{([^{}|]+)(?:\|([^}]+))?\}\}/g, (_, rawKey, fallback) => {
      const key = rawKey.trim();
      const value = String(values.get(key) || '').trim();
      return value || fallback || `{{${key}}}`;
    });
  }

  getVariableName(variable) {
    return variable.label || variable.key || '';
  }

  getCurrentPrompt() {
    return this.elements.promptPreview.value.trim();
  }

  getCurrentVariableDraft() {
    return this.state.draftValuesByTemplateId[this.selectedTemplate.id] || {};
  }

  persistVariableDraft() {
    if (!this.selectedTemplate) {
      return;
    }

    const values = {};
    const formData = new FormData(this.elements.variableForm);
    (this.selectedTemplate.variables || []).forEach(variable => {
      values[variable.key] = String(formData.get(variable.key) || '');
    });

    this.state.draftValuesByTemplateId = {
      ...this.state.draftValuesByTemplateId,
      [this.selectedTemplate.id]: values
    };
  }

  persistPromptDraft(prompt) {
    if (!this.selectedTemplate) {
      return;
    }

    this.state.selectedTemplateId = this.selectedTemplate.id;
    this.state.selectedSource = this.selectedSource;
    this.state.lastGeneratedPrompt = prompt;
    this.state.promptDraftByTemplateId = {
      ...this.state.promptDraftByTemplateId,
      [this.selectedTemplate.id]: prompt
    };
    this.saveState();
  }

  async copyText(text, successMessage) {
    if (!text) {
      this.showToast('没有可复制的内容', true);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      this.showToast(successMessage);
    } catch (error) {
      this.elements.promptPreview.focus();
      this.elements.promptPreview.select();
      const copied = document.execCommand('copy');
      this.showToast(copied ? successMessage : '复制失败，请手动复制', !copied);
    }
  }

  async insertPromptIntoCurrentPage() {
    const prompt = this.getCurrentPrompt();
    if (!prompt) {
      this.showToast('请先生成 Prompt', true);
      return;
    }

    if (!this.currentTab?.id) {
      this.showToast('无法获取当前标签页', true);
      return;
    }

    try {
      const response = await this.sendInsertMessage(prompt);

      if (response?.success) {
        this.showToast('已填入当前页面输入框');
        this.rememberRecentTemplate(this.selectedTemplate.id);
      } else {
        this.showToast(response?.error || '未找到可填入的输入框，请使用复制功能', true);
      }
    } catch (error) {
      this.showToast('当前页面暂不支持一键填入，请使用复制功能', true);
    }
  }

  async sendInsertMessage(prompt) {
    try {
      return await chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'insert_prompt',
        prompt
      });
    } catch (error) {
      await chrome.scripting.executeScript({
        target: { tabId: this.currentTab.id },
        files: ['content.js']
      });

      return chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'insert_prompt',
        prompt
      });
    }
  }

  renderEditorCategoryOptions() {
    this.elements.editCategory.innerHTML = '';
    this.categories
      .filter(category => category.id !== 'all')
      .forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        this.elements.editCategory.appendChild(option);
      });
  }

  async addSelectedTemplateToMyTemplates() {
    if (!this.selectedTemplate || this.isCustomTemplate(this.selectedTemplate)) {
      return;
    }

    const now = new Date().toISOString();
    const copiedTemplate = {
      ...this.cloneTemplate(this.selectedTemplate),
      id: this.createTemplateId(),
      title: `${this.selectedTemplate.title} 副本`,
      sourceTemplateId: this.selectedTemplate.id,
      isCustom: true,
      createdAt: now,
      updatedAt: now
    };

    this.state.myTemplates = [copiedTemplate, ...this.state.myTemplates];
    this.selectedTemplate = copiedTemplate;
    this.selectedSource = 'custom';
    this.isEditorExpanded = false;
    this.activeCategory = 'my';
    this.state.selectedTemplateId = copiedTemplate.id;
    this.state.selectedSource = 'custom';
    await this.saveState();

    this.renderCategories();
    this.renderTemplateList();
    this.renderSelectedTemplate();
    this.showToast('已添加到我的模板，点击“编辑”可修改内容');
  }

  async createNewTemplate() {
    const now = new Date().toISOString();
    const template = {
      id: this.createTemplateId(),
      category: 'chat',
      title: '未命名模板',
      description: '',
      tags: [],
      variables: [
        {
          key: '变量名',
          type: 'textarea',
          placeholder: '变量描述',
          required: true
        }
      ],
      body: '请围绕{{变量名}}生成回答。',
      isCustom: true,
      createdAt: now,
      updatedAt: now
    };

    this.state.myTemplates = [template, ...this.state.myTemplates];
    this.selectedTemplate = template;
    this.selectedSource = 'custom';
    this.isEditorExpanded = true;
    this.activeCategory = 'my';
    this.state.selectedTemplateId = template.id;
    this.state.selectedSource = 'custom';
    await this.saveState();

    this.renderCategories();
    this.renderTemplateList();
    this.renderSelectedTemplate();
    this.showToast('已新建我的模板，请编辑后保存');
  }

  async saveCurrentCustomTemplate() {
    if (!this.isCustomTemplate(this.selectedTemplate)) {
      return;
    }

    this.applyEditorDraftToSelectedTemplate();
    if (!this.selectedTemplate.title.trim() || !this.selectedTemplate.body.trim()) {
      this.showToast('模板标题和正文不能为空', true);
      return;
    }

    this.state.myTemplates = this.state.myTemplates.map(template => (
      template.id === this.selectedTemplate.id
        ? { ...this.cloneTemplate(this.selectedTemplate), updatedAt: new Date().toISOString() }
        : template
    ));
    this.isEditorExpanded = false;
    await this.saveState();

    this.renderCategories();
    this.renderTemplateList();
    this.renderSelectedTemplate();
    this.showToast('模板已保存');
  }

  async deleteCurrentCustomTemplate() {
    if (!this.isCustomTemplate(this.selectedTemplate)) {
      return;
    }

    this.showDeleteConfirmModal();
  }

  showDeleteConfirmModal() {
    const templateTitle = this.selectedTemplate?.title || '未命名模板';
    this.elements.deleteConfirmMessage.textContent = `确定要删除“${templateTitle}”吗？删除后无法恢复。`;
    this.elements.deleteConfirmModal.classList.remove('hidden');
    this.elements.cancelDeleteBtn.focus();
  }

  hideDeleteConfirmModal() {
    this.elements.deleteConfirmModal.classList.add('hidden');
  }

  async confirmDeleteCurrentCustomTemplate() {
    if (!this.isCustomTemplate(this.selectedTemplate)) {
      this.hideDeleteConfirmModal();
      return;
    }

    const templateId = this.selectedTemplate.id;
    this.state.myTemplates = this.state.myTemplates.filter(template => template.id !== templateId);
    delete this.state.draftValuesByTemplateId[templateId];
    delete this.state.promptDraftByTemplateId[templateId];

    this.selectedTemplate = this.state.myTemplates[0] || this.templates[0];
    this.selectedSource = this.selectedTemplate.isCustom ? 'custom' : 'builtin';
    this.isEditorExpanded = false;
    this.activeCategory = this.state.myTemplates.length ? 'my' : 'all';
    this.state.selectedTemplateId = this.selectedTemplate.id;
    this.state.selectedSource = this.selectedSource;
    await this.saveState();

    this.renderCategories();
    this.renderTemplateList();
    this.renderSelectedTemplate();
    this.hideDeleteConfirmModal();
    this.showToast('模板已删除');
  }

  applyEditorDraftToSelectedTemplate() {
    if (!this.isCustomTemplate(this.selectedTemplate)) {
      return;
    }

    this.selectedTemplate = {
      ...this.selectedTemplate,
      title: this.elements.editTitle.value.trim(),
      description: this.elements.editDescription.value.trim(),
      category: this.elements.editCategory.value || 'chat',
      tags: this.parseTags(this.elements.editTags.value),
      variables: this.parseVariables(this.elements.editVariables.value),
      body: this.elements.editBody.value,
      updatedAt: new Date().toISOString()
    };
  }

  parseTags(value) {
    return value
      .split(/[,，]/)
      .map(tag => tag.trim())
      .filter(Boolean);
  }

  serializeVariables(variables) {
    return variables.map(variable => [
      variable.key || '',
      variable.type || 'text',
      variable.placeholder || '',
      variable.required ? 'required' : ''
    ].join(' | ')).join('\n');
  }

  parseVariables(value) {
    return value
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split('|').map(part => part.trim());
        const isOldFormat = parts.length >= 5;
        const [key, type, placeholder, required] = isOldFormat
          ? [parts[1] || parts[0], parts[2], parts[3], parts[4]]
          : parts;
        return {
          key: key || '变量',
          type: type === 'textarea' ? 'textarea' : 'text',
          placeholder: placeholder || '',
          required: required === 'required' || required === 'true' || required === '必填'
        };
      })
      .filter(variable => variable.key);
  }

  cloneTemplate(template) {
    return JSON.parse(JSON.stringify(template));
  }

  createTemplateId() {
    return `my-template-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  findTemplateById(templateId, source) {
    if (!templateId) {
      return null;
    }

    const pools = source === 'custom'
      ? [this.state.myTemplates]
      : source === 'builtin'
        ? [this.templates]
        : [this.state.myTemplates, this.templates];

    for (const pool of pools) {
      const matched = pool.find(template => template.id === templateId);
      if (matched) {
        return matched;
      }
    }

    return null;
  }

  isCustomTemplate(template) {
    return Boolean(template?.isCustom);
  }

  async rememberRecentTemplate(templateId) {
    this.state.recentTemplateIds = [
      templateId,
      ...this.state.recentTemplateIds.filter(id => id !== templateId)
    ].slice(0, 8);
    await this.saveState();
  }

  getCategoryName(categoryId) {
    return this.categories.find(category => category.id === categoryId)?.name || categoryId;
  }

  updateSiteStatus() {
    if (!this.currentTab?.url) {
      this.elements.siteStatus.textContent = '未识别当前页面';
      return;
    }

    const supportedSites = [
      ['chatgpt.com', 'ChatGPT'],
      ['chat.openai.com', 'ChatGPT'],
      ['claude.ai', 'Claude'],
      ['chat.deepseek.com', 'DeepSeek'],
      ['gemini.google.com', 'Gemini'],
      ['tongyi.aliyun.com', '通义千问'],
      ['doubao.com', '豆包'],
      ['kimi.moonshot.cn', 'Kimi'],
      ['yuanbao.tencent.com', '腾讯元宝']
    ];

    const matched = supportedSites.find(([host]) => this.currentTab.url.includes(host));
    this.elements.siteStatus.textContent = matched
      ? `${matched[1]}：当前页面支持一键填入`
      : '当前页面可复制使用';
  }

  showToast(message, isError = false) {
    this.elements.toast.textContent = message;
    this.elements.toast.classList.toggle('error', isError);

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.elements.toast.textContent = '';
      this.elements.toast.classList.remove('error');
    }, 2600);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const popup = new PromptTemplatePopup();
  popup.init();
});
