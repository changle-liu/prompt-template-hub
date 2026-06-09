const DEFAULT_STATE = {
  selectedTemplateId: '',
  selectedSource: 'builtin',
  favoriteTemplateIds: [],
  myTemplates: [],
  recentTemplateIds: [],
  lastGeneratedPrompt: '',
  draftValuesByTemplateId: {},
  promptDraftByTemplateId: {},
  createdAt: new Date().toISOString()
};

chrome.runtime.onInstalled.addListener(async details => {
  if (details.reason !== 'install') {
    return;
  }

  const existing = await chrome.storage.local.get('promptTemplateHubState');
  if (!existing.promptTemplateHubState) {
    await chrome.storage.local.set({ promptTemplateHubState: DEFAULT_STATE });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request?.action !== 'get_extension_status') {
    return false;
  }

  sendResponse({
    success: true,
    tabId: sender.tab?.id,
    version: chrome.runtime.getManifest().version
  });
  return false;
});
