const PROMPT_TEMPLATE_CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'create', name: '内容创作' },
  { id: 'work', name: '职场提效' },
  { id: 'learn', name: '知识学习' },
  { id: 'code', name: '编程开发' },
  { id: 'chat', name: '日常对话' },
  { id: 'design', name: '创意设计' }
];

const PROMPT_TEMPLATES = [
  {
    id: 'chat-clear-answer',
    category: 'chat',
    title: '清晰直接回答',
    description: '适合让 AI 快速给出可执行、少废话的回答。',
    tags: ['问答', '简洁', '建议'],
    variables: [
      { key: '你的问题', type: 'textarea', placeholder: '例如：我该如何规划一次三天两晚的杭州旅行？', required: true },
      { key: '回答语气', type: 'text', placeholder: '例如：直接、友好、像资深顾问' }
    ],
    body: '请用{{回答语气|清晰直接}}的语气回答下面的问题。\n\n要求：\n1. 先给结论，再给理由。\n2. 如果有多个选项，请按推荐顺序排列。\n3. 避免空泛建议，尽量给出可执行步骤。\n\n问题：\n{{你的问题}}'
  },
  {
    id: 'chat-brainstorm',
    category: 'chat',
    title: '头脑风暴',
    description: '围绕一个主题生成多角度想法。',
    tags: ['创意', '发散', '点子'],
    variables: [
      { key: '主题', type: 'text', placeholder: '例如：低预算周末活动', required: true },
      { key: '目标人群', type: 'text', placeholder: '例如：年轻上班族' },
      { key: '想法数量', type: 'text', placeholder: '例如：12' }
    ],
    body: '请围绕"{{主题}}"做一次头脑风暴。\n\n背景：目标人群是{{目标人群|普通用户}}。\n输出 {{想法数量|10}} 个想法，每个想法包含：\n- 一句话概述\n- 适用场景\n- 为什么值得尝试\n- 可能的风险或限制'
  },
  {
    id: 'roleplay-expert',
    category: 'chat',
    title: '专家角色咨询',
    description: '让 AI 以特定专家身份给建议。',
    tags: ['角色', '专家', '咨询'],
    variables: [
      { key: '专家角色', type: 'text', placeholder: '例如：产品经理、健身教练、法律顾问、职业规划师', required: true },
      { key: '我的情况', type: 'textarea', placeholder: '描述背景、目标和限制', required: true },
      { key: '希望得到的结果', type: 'text', placeholder: '例如：行动计划、风险评估、方案对比' }
    ],
    body: '请你扮演一位经验丰富的{{专家角色}}，基于下面情况给我建议。\n\n我的情况：\n{{我的情况}}\n\n我希望得到：{{希望得到的结果|清晰可执行的建议}}\n\n请先追问最多 3 个必要问题；如果信息已经足够，请直接给出分步骤建议、风险提醒和下一步行动。'
  },
  {
    id: 'decision-compare',
    category: 'chat',
    title: '方案对比决策',
    description: '对多个选择做结构化比较，帮助决策。',
    tags: ['决策', '对比', '分析'],
    variables: [
      { key: '要做的决策', type: 'text', placeholder: '例如：是否换工作、选择哪套技术方案', required: true },
      { key: '可选方案', type: 'textarea', placeholder: '列出 A/B/C 方案', required: true },
      { key: '评价标准', type: 'textarea', placeholder: '例如：成本、风险、收益、长期价值' }
    ],
    body: '请帮我分析这个决策：{{要做的决策}}\n\n可选方案：\n{{可选方案}}\n\n评价标准：\n{{评价标准|成本、收益、风险、时间投入、长期价值}}\n\n请输出：\n1. 决策矩阵。\n2. 每个方案的优缺点。\n3. 最推荐方案及理由。\n4. 需要补充确认的信息。\n5. 降低决策风险的下一步。'
  },
  {
    id: 'writing-polish',
    category: 'create',
    title: '中文润色',
    description: '提升表达的清晰度、专业度和流畅度。',
    tags: ['润色', '中文', '表达'],
    variables: [
      { key: '原文', type: 'textarea', placeholder: '粘贴需要润色的内容', required: true },
      { key: '目标风格', type: 'text', placeholder: '例如：专业、自然、简洁、有说服力' }
    ],
    body: '请润色下面这段文字，使其更{{目标风格|清晰、自然、专业}}。\n\n要求：\n1. 保留原意，不添加未经提供的信息。\n2. 优化逻辑、措辞和句式。\n3. 先给润色版，再列出 3 条主要修改原因。\n\n原文：\n{{原文}}'
  },
  {
    id: 'writing-outline',
    category: 'create',
    title: '文章大纲',
    description: '为文章、公众号、博客或演讲稿生成结构化大纲。',
    tags: ['大纲', '文章', '结构'],
    variables: [
      { key: '主题', type: 'text', placeholder: '例如：普通人如何开始使用 AI 提效', required: true },
      { key: '读者', type: 'text', placeholder: '例如：职场新人' },
      { key: '篇幅', type: 'text', placeholder: '例如：1500 字' }
    ],
    body: '请为主题"{{主题}}"设计一份文章大纲。\n\n目标读者：{{读者|普通读者}}\n目标篇幅：{{篇幅|中等篇幅}}\n\n请输出：\n1. 标题备选 5 个。\n2. 核心观点。\n3. 分段大纲，每段包含目的、要点和示例方向。\n4. 开头和结尾建议。'
  },
  {
    id: 'writing-bilingual',
    category: 'create',
    title: '双语翻译',
    description: '翻译文本并解释关键表达。',
    tags: ['翻译', '双语', '英文'],
    variables: [
      { key: '待翻译文本', type: 'textarea', placeholder: '粘贴需要翻译的内容', required: true },
      { key: '目标语言', type: 'text', placeholder: '例如：英文、中文、日文' },
      { key: '使用场景', type: 'text', placeholder: '例如：商务邮件、技术文档、日常聊天' }
    ],
    body: '请将下面内容翻译成{{目标语言|英文}}，使用场景是{{使用场景|通用沟通}}。\n\n要求：\n1. 先给自然流畅的译文。\n2. 再给逐句对照。\n3. 最后解释 3-5 个关键表达或容易误译的地方。\n\n原文：\n{{待翻译文本}}'
  },
  {
    id: 'marketing-copy',
    category: 'create',
    title: '营销文案',
    description: '为产品、活动或内容生成多版本文案。',
    tags: ['营销', '文案', '卖点'],
    variables: [
      { key: '产品/服务/活动', type: 'text', placeholder: '例如：AI 写作课程', required: true },
      { key: '目标用户', type: 'text', placeholder: '例如：想提升效率的职场人' },
      { key: '核心卖点', type: 'textarea', placeholder: '列出优势、痛点、差异点' }
    ],
    body: '请为"{{产品/服务/活动}}"生成营销文案。\n\n目标用户：{{目标用户|潜在用户}}\n核心卖点：\n{{核心卖点|请根据产品名称合理推断}}\n\n请输出：\n1. 5 个吸引人的标题。\n2. 3 版短文案：理性版、情绪版、社交媒体版。\n3. 1 段适合落地页首屏的文案。\n4. 可能的用户顾虑和回应。'
  },
  {
    id: 'summary-meeting',
    category: 'work',
    title: '会议纪要',
    description: '把会议记录整理成结论、行动项和风险。',
    tags: ['总结', '会议', '行动项'],
    variables: [
      { key: '会议原始记录', type: 'textarea', placeholder: '粘贴会议转写或笔记', required: true },
      { key: '输出格式偏好', type: 'text', placeholder: '例如：简洁、正式、适合发群里' }
    ],
    body: '请将下面会议记录整理成{{输出格式偏好|清晰正式}}的会议纪要。\n\n请包含：\n1. 会议主题和背景。\n2. 关键结论。\n3. 行动项：负责人、事项、截止时间，如信息缺失请标注"待确认"。\n4. 风险与待决策事项。\n5. 适合直接发送的简短版本。\n\n会议记录：\n{{会议原始记录}}'
  },
  {
    id: 'summary-long-text',
    category: 'work',
    title: '长文提炼',
    description: '从长文中提取核心信息和可行动结论。',
    tags: ['总结', '长文', '提炼'],
    variables: [
      { key: '长文内容', type: 'textarea', placeholder: '粘贴文章、报告或资料', required: true },
      { key: '关注重点', type: 'text', placeholder: '例如：商业价值、技术方案、执行建议' }
    ],
    body: '请总结下面内容，重点关注{{关注重点|核心观点和可行动信息}}。\n\n输出结构：\n1. 100 字以内摘要。\n2. 5 条关键要点。\n3. 重要数据或事实。\n4. 可执行建议。\n5. 仍需确认的问题。\n\n内容：\n{{长文内容}}'
  },
  {
    id: 'workplace-email',
    category: 'work',
    title: '职场邮件',
    description: '生成清晰得体的商务邮件或消息。',
    tags: ['邮件', '沟通', '职场'],
    variables: [
      { key: '收件人/对象', type: 'text', placeholder: '例如：客户、直属领导、跨部门同事' },
      { key: '沟通目的', type: 'textarea', placeholder: '例如：申请延期、确认需求、推动对方反馈', required: true },
      { key: '语气', type: 'text', placeholder: '例如：礼貌坚定、简洁正式、亲切' }
    ],
    body: '请帮我写一封发给{{收件人/对象|对方}}的职场邮件/消息。\n\n沟通目的：\n{{沟通目的}}\n\n语气要求：{{语气|礼貌、清晰、专业}}\n\n请输出：\n1. 邮件标题。\n2. 正文。\n3. 如果适合，再给一个更短的即时消息版本。'
  },
  {
    id: 'workplace-weekly',
    category: 'work',
    title: '周报生成',
    description: '把工作内容整理成有重点的周报。',
    tags: ['周报', '汇报', '职场'],
    variables: [
      { key: '本周工作', type: 'textarea', placeholder: '列出本周完成和推进中的事项', required: true },
      { key: '问题与风险', type: 'textarea', placeholder: '例如：依赖未确认、资源不足' },
      { key: '下周计划', type: 'textarea', placeholder: '列出下周计划' }
    ],
    body: '请根据下面信息生成一份专业周报。\n\n本周工作：\n{{本周工作}}\n\n问题与风险：\n{{问题与风险|暂无}}\n\n下周计划：\n{{下周计划|请根据本周工作推导}}\n\n要求：突出成果、进展、风险和下一步，不要写成流水账。'
  },
  {
    id: 'study-tutor',
    category: 'learn',
    title: '循序渐进讲解',
    description: '把复杂概念讲清楚，并用例子辅助理解。',
    tags: ['学习', '解释', '例子'],
    variables: [
      { key: '概念或知识点', type: 'text', placeholder: '例如：闭包、边际成本、Transformer 注意力机制', required: true },
      { key: '我的水平', type: 'text', placeholder: '例如：零基础、大学生、有编程经验' }
    ],
    body: '请以{{我的水平|初学者}}能理解的方式讲解"{{概念或知识点}}"。\n\n请按以下结构输出：\n1. 一句话解释。\n2. 用生活类比说明。\n3. 分步骤讲解关键原理。\n4. 给一个具体例子。\n5. 列出常见误区。\n6. 出 3 道自测题并附答案。'
  },
  {
    id: 'coding-debug',
    category: 'code',
    title: '代码 Debug 助手',
    description: '分析错误原因并给出修复方案。',
    tags: ['代码', '调试', '错误'],
    variables: [
      { key: '语言/框架', type: 'text', placeholder: '例如：JavaScript、Python、React' },
      { key: '相关代码', type: 'textarea', placeholder: '粘贴代码片段', required: true },
      { key: '错误信息或现象', type: 'textarea', placeholder: '粘贴报错、日志或描述', required: true }
    ],
    body: '你是一名资深{{语言/框架|软件}}工程师。请帮我分析下面的问题。\n\n相关代码：\n{{相关代码}}\n\n错误信息或现象：\n{{错误信息或现象}}\n\n请输出：\n1. 最可能的根因，按可能性排序。\n2. 如何验证每个判断。\n3. 推荐修复方案。\n4. 如果需要，请给出修改后的关键代码。\n5. 补充可能需要的测试用例。'
  },
  {
    id: 'coding-review',
    category: 'code',
    title: '代码审查',
    description: '从正确性、可维护性、性能和安全角度审查代码。',
    tags: ['代码', 'Review', '质量'],
    variables: [
      { key: '语言/框架', type: 'text', placeholder: '例如：TypeScript + React' },
      { key: '待审查代码', type: 'textarea', placeholder: '粘贴代码或 diff', required: true }
    ],
    body: '请以资深工程师的标准审查下面的{{语言/框架|代码}}。\n\n重点关注：\n- 是否存在 bug 或边界条件问题\n- 可读性和可维护性\n- 性能风险\n- 安全风险\n- 缺失的测试\n\n请先列出高优先级问题，再给出改进建议。\n\n代码：\n{{待审查代码}}'
  },
  {
    id: 'design-image-prompt',
    category: 'design',
    title: '图像生成提示词',
    description: '为 Midjourney、Stable Diffusion 等工具生成详细的英文画面描述。',
    tags: ['图像', 'Midjourney', 'AI绘画'],
    variables: [
      { key: '画面主题', type: 'text', placeholder: '例如：赛博朋克城市雨夜、极简产品摄影', required: true },
      { key: '风格偏好', type: 'text', placeholder: '例如：写实、插画、电影感、日系动漫' },
      { key: '画面比例', type: 'text', placeholder: '例如：16:9、1:1、9:16' }
    ],
    body: '请为 AI 图像生成工具撰写一段详细的英文 prompt。\n\n画面主题：{{画面主题}}\n风格偏好：{{风格偏好|写实、电影感}}\n画面比例：{{画面比例|16:9}}\n\n要求：\n1. 描述主体、环境、光线、色调、构图和氛围。\n2. 加入适当的画质与镜头参数（如 cinematic lighting、8K、shallow depth of field）。\n3. 输出完整英文 prompt，末尾附上 Midjourney 参数建议（--ar、--v 等）。\n4. 附一行中文说明各关键词的作用。'
  },
  {
    id: 'zhiz-新人-onboarding-方案',
    category: 'work',
    title: '新人 Onboarding 方案',
    description: '帮你设计分阶段的新员工入职计划与配套清单。',
    tags: ['入职方案', 'Onboarding', '新员工', '团队管理'],
    variables: [
      { key: '岗位', type: 'text', placeholder: '职位名称', required: true },
      { key: '部门', type: 'text', placeholder: '所属部门', required: true },
      { key: '团队规模', type: 'text', placeholder: '人数', required: true },
      { key: '入职环境', type: 'text', placeholder: '线下办公/远程/混合', required: true }
    ],
    body: '你是一位人力资源和团队管理专家，擅长设计高效的新员工入职计划。请为以下岗位设计 Onboarding 方案：\n\n岗位：{{岗位}}\n部门：{{部门}}\n团队规模：{{团队规模}}\n入职环境：{{入职环境}}\n\n请设计 30-60-90 天 Onboarding 计划：\n\n**第 1 周：破冰和环境熟悉**\n- 必读文档清单\n- 必装工具和权限\n- 会面安排\n\n**Day 1-30：学习和融入**\n- 学习目标和里程碑\n- Buddy/导师机制\n- 每周 1:1 主题建议\n\n**Day 31-60：上手和参与**\n- 独立任务目标\n- 反馈收集节点\n\n**Day 61-90：独立和产出**\n- 独立交付目标\n- 转正评估标准\n\n**Onboarding Checklist（可打勾版本）**'
  },
  {
    id: 'zhiz-faq-知识库生成器',
    category: 'work',
    title: 'FAQ 知识库生成器',
    description: '根据产品文档自动生成分类清晰的常见问题库。',
    tags: ['FAQ', '知识库', '客户服务', '帮助文档'],
    variables: [
      { key: '产品/服务', type: 'text', placeholder: '名称', required: true },
      { key: '业务描述', type: 'textarea', placeholder: '核心功能和使用场景', required: true },
      { key: '常见问题来源', type: 'textarea', placeholder: '客服记录/用户反馈/社区提问', required: true },
      { key: '用户类型', type: 'text', placeholder: '新手/进阶/企业客户', required: true }
    ],
    body: '你是一位客户服务和知识管理专家，擅长构建高效的 FAQ 知识库。请根据以下产品信息生成 FAQ：\n\n产品/服务：{{产品/服务}}\n业务描述：{{业务描述}}\n常见问题来源：{{常见问题来源}}\n用户类型：{{用户类型}}\n\n请生成结构化 FAQ：\n\n**分类 1：快速入门**\nQ1: ...\nA1: ...\n\n**分类 2：功能使用**\nQ2-Q5: ...\n\n**分类 3：付费与账户**\nQ6-Q8: ...\n\n**分类 4：故障排查**\nQ9-Q12: ...\n\n每条 FAQ 要求：\n1. 问题简洁（一句话）\n2. 回答分步骤，配操作截图建议\n3. 标注关联 FAQ（延伸阅读）\n4. 添加搜索标签（便于检索）\n\n至少 15 条 FAQ，覆盖用户生命周期。'
  },
  {
    id: 'zhiz-招聘-jd-撰写专家',
    category: 'work',
    title: '招聘 JD 撰写专家',
    description: '撰写突出岗位价值与成长空间的招聘描述。',
    tags: ['招聘', 'JD撰写', 'HR', '人才管理'],
    variables: [
      { key: '岗位名称', type: 'text', placeholder: '职位', required: true },
      { key: '所属部门', type: 'text', placeholder: '部门', required: true },
      { key: '汇报对象', type: 'text', placeholder: '向谁汇报', required: true },
      { key: '工作地点', type: 'textarea', placeholder: '城市/远程', required: true },
      { key: '薪资范围', type: 'text', placeholder: '如愿意公开', required: true },
      { key: '公司简介', type: 'textarea', placeholder: '一段话描述公司', required: true },
      { key: '核心职责', type: 'textarea', placeholder: '这个岗位主要做什么？', required: true }
    ],
    body: '你是一位 HR 招聘专家和雇主品牌顾问，擅长撰写有吸引力的职位描述。请撰写以下岗位的 JD：\n\n岗位名称：{{岗位名称}}\n所属部门：{{所属部门}}\n汇报对象：{{汇报对象}}\n工作地点：{{工作地点}}\n薪资范围：{{薪资范围}}\n公司简介：{{公司简介}}\n核心职责：{{核心职责}}\n\n请生成专业 JD：\n1. 岗位亮点（为什么优秀人才应该加入）\n2. 核心职责（5-8 条，动词开头）\n3. 任职要求 — 必须（Must Have）\n4. 任职要求 — 加分项（Nice to Have）\n5. 我们提供（公司福利和成长空间）\n6. 团队介绍\n7. 面试流程说明\n\n风格要求：真诚避免套话，突出成长空间，吸引被动候选人。'
  },
  {
    id: 'zhiz-邮件营销模板生成',
    category: 'create',
    title: '邮件营销模板生成',
    description: '生成覆盖主题到转化跟踪的完整营销邮件方案。',
    tags: ['邮件营销', 'EDM', '转化优化', '用户运营'],
    variables: [
      { key: '邮件类型', type: 'textarea', placeholder: '新品发布/促销活动/内容推送/欢迎邮件/召回邮件/节日营销', required: true },
      { key: '产品/品牌', type: 'text', placeholder: '名称', required: true },
      { key: '目标受众', type: 'text', placeholder: '用户特征', required: true },
      { key: '核心目的', type: 'text', placeholder: '点击/购买/注册/下载', required: true }
    ],
    body: '你是一位邮件营销专家，精通邮件文案、用户心理和转化优化。请生成营销邮件模板：\n\n邮件类型：{{邮件类型}}\n产品/品牌：{{产品/品牌}}\n目标受众：{{目标受众}}\n核心目的：{{核心目的}}\n\n请提供完整的邮件方案：\n1. 5 个主题行方案（A/B 测试用）\n2. 预览文字（Preview Text）\n3. 邮件正文（HTML 结构建议）\n4. CTA 按钮文案与位置建议\n5. 发送时间建议\n6. 用户分群策略\n7. 跟踪指标定义（打开率/点击率/转化率）\n\n参考行业平均打开率和点击率给出优化建议。'
  },
  {
    id: 'zhiz-指标体系定义专家',
    category: 'work',
    title: '指标体系定义专家',
    description: '搭建北极星指标与分层指标体系，明确核心数据。',
    tags: ['指标体系', '数据治理', '北极星指标', '数据产品'],
    variables: [
      { key: '产品名称', type: 'text', placeholder: '名称', required: true },
      { key: '产品类型', type: 'textarea', placeholder: '电商/SaaS/社交/内容/工具/游戏', required: true },
      { key: '业务阶段', type: 'text', placeholder: '探索/增长/成熟/转型', required: true },
      { key: '当前痛点', type: 'textarea', placeholder: '数据分析上遇到的问题', required: true }
    ],
    body: '你是一位数据产品专家，精通指标体系设计和数据治理。请帮我搭建指标体系：\n\n产品名称：{{产品名称}}\n产品类型：{{产品类型}}\n业务阶段：{{业务阶段}}\n当前痛点：{{当前痛点}}\n\n请搭建分层指标体系：\n\n**Layer 1: 北极星指标（NSM）**\n- 指标定义 + 计算公式\n- 为什么选这个指标\n\n**Layer 2: 核心指标（5-8 个）**\n| 指标名称 | 计算公式 | 数据源 | 更新频率 | 负责人 |\n\n**Layer 3: 业务过程指标**\n- 按模块/功能分组的详细指标\n\n**Layer 4: 诊断指标**\n- 用于定位问题的下钻指标\n\n附加：指标字典模板、数据看板设计建议、指标异常告警规则。'
  },
  {
    id: 'zhiz-变更日志生成器',
    category: 'work',
    title: '变更日志生成器',
    description: '按规范自动生成版本更新日志条目。',
    tags: ['CHANGELOG', '版本管理', '开源', '文档'],
    variables: [
      { key: '版本号', type: 'textarea', placeholder: 'X.Y.Z', required: true },
      { key: '发布日期', type: 'text', placeholder: '日期', required: true },
      { key: '变更内容', type: 'textarea', placeholder: '列出本版本的所有修改，可以是零散的', required: true }
    ],
    body: '你是一位开源项目维护者，精通 Keep a Changelog 规范。请根据以下变更内容生成 CHANGELOG 条目：\n\n版本号：{{版本号}}\n发布日期：{{发布日期}}\n\n变更内容：\n{{变更内容}}\n\n请按以下分类整理：\n## {{版本号}} - YYYY-MM-DD\n### Added（新功能）\n### Fixed（Bug 修复）\n### Changed（变更）\n### Deprecated（废弃）\n### Removed（移除）\n### Security（安全）\n\n要求：每条变更一行，简洁清晰，面向用户而非开发者。'
  },
  {
    id: 'zhiz-治愈系情感对话伙伴',
    category: 'chat',
    title: '治愈系情感对话伙伴',
    description: '提供温暖倾听与情绪疏导，陪你理清内心困扰。',
    tags: ['情感支持', '心理健康', '倾诉', '治愈'],
    variables: [
      { key: '今天我想和你聊聊', type: 'text', placeholder: '你的困惑或烦恼', required: true }
    ],
    body: '你是一位温柔、充满同理心的情感支持伙伴。在我们的对话中：\n\n1. 首先倾听并完全理解我的感受，不急于给建议\n2. 用温暖的语言回应，让我感到被理解和接纳\n3. 通过提问帮助我理清思绪\n4. 当我准备好时，提供实用的建议和视角转换\n5. 尊重我的情绪，不评判，不说教\n\n今天我想和你聊聊：{{今天我想和你聊聊}}'
  },
  {
    id: 'zhiz-事实核查助手',
    category: 'create',
    title: '事实核查助手',
    description: '逐条核查文章数据与引用，并给出修正建议。',
    tags: ['事实核查', '信息验证', '编辑', '内容质量'],
    variables: [
      { key: '待核查内容', type: 'textarea', placeholder: '粘贴需要核实的文章或段落', required: true }
    ],
    body: '你是一位严谨的事实核查编辑，拥有新闻学和数据验证背景。请对以下内容进行事实核查：\n\n待核查内容：\n{{待核查内容}}\n\n请逐条检查：\n1. 数据/统计的准确性和时效性\n2. 引用来源是否可靠\n3. 因果关系是否成立\n4. 是否存在以偏概全或幸存者偏差\n5. 是否有常见谣言或误解\n6. 概念使用是否准确\n\n输出格式：\n| 原文声明 | 核查结果 | 正确信息 | 建议修改 |\n\n最后给出整体可信度评分（1-10分）和修改建议。'
  },
  {
    id: 'zhiz-抖音短视频脚本生成器',
    category: 'create',
    title: '抖音短视频脚本生成器',
    description: '生成含开场钩子与行动号召的短视频脚本。',
    tags: ['抖音', '短视频', '脚本', '内容创作'],
    variables: [
      { key: '视频主题', type: 'text', placeholder: '主题', required: true },
      { key: '视频时长', type: 'text', placeholder: '15秒/30秒/1分钟/3分钟', required: true },
      { key: '目标受众', type: 'textarea', placeholder: '受众描述', required: true },
      { key: '视频目的', type: 'text', placeholder: '引流/涨粉/卖货/科普/娱乐', required: true }
    ],
    body: '你是一位抖音爆款内容创作专家，精通短视频脚本创作。请生成一个抖音视频脚本：\n\n视频主题：{{视频主题}}\n视频时长：{{视频时长}}\n目标受众：{{目标受众}}\n视频目的：{{视频目的}}\n\n脚本格式：\n【开头3秒钩子】\n（吸引眼球，引发好奇或共鸣）\n\n【主体内容】\n时间轴 | 画面 | 台词/文字 | 配乐\n\n【结尾引导】\n（点赞/关注/评论/购买引导）\n\n【字幕文案】\n\n【话题标签推荐】\n\n注：突出视觉效果和节奏感，注意前3秒必须抓住眼球。'
  },
  {
    id: 'zhiz-环境问题排查助手',
    category: 'code',
    title: '环境问题排查助手',
    description: '定位开发环境故障并提供可执行的修复步骤。',
    tags: ['环境配置', '问题排查', '开发环境', '运维'],
    variables: [
      { key: '问题描述', type: 'textarea', placeholder: '具体的环境报错或异常现象', required: true },
      { key: '操作系统', type: 'text', placeholder: 'macOS/Windows/Linux/WSL', required: true },
      { key: '相关软件', type: 'textarea', placeholder: 'Node.js/Python/Docker/数据库等版本', required: true },
      { key: '最近变更', type: 'text', placeholder: '最近做了什么操作可能导致问题', required: true }
    ],
    body: '你是一位开发环境和运维问题排查专家。请帮我解决以下环境问题：\n\n问题描述：{{问题描述}}\n操作系统：{{操作系统}}\n相关软件：{{相关软件}}\n最近变更：{{最近变更}}\n\n请按以下步骤排查：\n1. 问题诊断（根据描述判断可能原因）\n2. 环境检查命令（验证各组件状态）\n3. 常见原因排查清单\n4. 逐步修复方案\n5. 环境配置最佳实践\n6. 预防措施和环境管理建议\n\n提供可直接复制执行的命令行操作。'
  },
  {
    id: 'zhiz-绩效评估报告生成',
    category: 'work',
    title: '绩效评估报告生成',
    description: '生成含行为证据与发展计划的绩效评估报告。',
    tags: ['绩效评估', '人才发展', 'HR管理', '团队管理'],
    variables: [
      { key: '员工姓名/岗位', type: 'textarea', placeholder: '信息', required: true },
      { key: '评估周期', type: 'text', placeholder: '季度/半年/年度', required: true },
      { key: '核心职责', type: 'textarea', placeholder: '列出主要工作内容', required: true },
      { key: '关键成果', type: 'text', placeholder: '完成了什么', required: true },
      { key: '待改善项', type: 'text', placeholder: '需要提升的地方', required: true }
    ],
    body: '你是一位 HR 绩效管理专家，擅长撰写公正、有建设性的绩效评估报告。请生成绩效评估：\n\n员工姓名/岗位：{{员工姓名/岗位}}\n评估周期：{{评估周期}}\n核心职责：{{核心职责}}\n关键成果：{{关键成果}}\n待改善项：{{待改善项}}\n\n请生成绩效评估报告：\n\n**一、整体评价（一段话总结）**\n\n**二、能力维度评分**\n| 能力维度 | 评分(1-5) | 行为证据 | 改进建议 |\n- 专业能力\n- 执行力\n- 协作沟通\n- 创新思维\n- 领导力（如适用）\n\n**三、关键成果回顾（OKR/KPI 达成情况）**\n\n**四、发展建议**\n- 短期改善目标（30天）\n- 中期成长计划（90天）\n- 推荐学习资源\n\n**五、员工自评引导问题**\n\n语言专业客观，以事实为依据，避免主观判断。'
  },
  {
    id: 'zhiz-竞品分析报告生成器',
    category: 'work',
    title: '竞品分析报告生成器',
    description: '对比你与竞品差异，输出机会与差距分析。',
    tags: ['竞品分析', '市场研究', '商业策略', '产品'],
    variables: [
      { key: '我们的产品', type: 'textarea', placeholder: '产品名称和描述', required: true },
      { key: '竞品1', type: 'text', placeholder: '名称及网址', required: true },
      { key: '竞品2', type: 'text', placeholder: '名称及网址', required: true },
      { key: '竞品3', type: 'text', placeholder: '名称及网址', required: true }
    ],
    body: '你是一位商业分析师，专注于竞品研究。请生成一份专业的竞品分析报告：\n\n我们的产品：{{我们的产品}}\n竞品1：{{竞品1}}\n竞品2：{{竞品1}}\n竞品3：{{竞品1}}\n\n分析维度：\n1. 产品定位与差异化\n2. 功能对比矩阵\n3. 定价策略分析\n4. 用户评价分析（优点/痛点）\n5. 营销策略\n6. 技术栈推测\n7. SWOT 分析\n8. 机会与威胁\n9. 改进建议\n\n用表格和图表（文字版）呈现关键对比数据。'
  },
  {
    id: 'zhiz-数据库架构设计师',
    category: 'code',
    title: '数据库架构设计师',
    description: '按业务场景设计表结构、索引与分库方案。',
    tags: ['数据库设计', 'SQL', 'ER图', '索引优化'],
    variables: [
      { key: '业务场景', type: 'textarea', placeholder: '描述核心业务逻辑', required: true },
      { key: '核心实体', type: 'textarea', placeholder: '列出主要实体', required: true },
      { key: '数据量预估', type: 'textarea', placeholder: '预计数据规模', required: true },
      { key: '查询模式', type: 'text', placeholder: '主要查询场景', required: true }
    ],
    body: '你是一位数据库架构师，精通关系型数据库设计和 NoSQL 方案选型。请根据业务需求设计数据库方案：\n\n业务场景：{{业务场景}}\n核心实体：{{核心实体}}\n数据量预估：{{数据量预估}}\n查询模式：{{查询模式}}\n\n请提供：\n1. ER 图设计（用文字描述实体关系）\n2. 表结构定义（含字段、类型、约束）\n3. 索引设计策略\n4. 范式分析（适当反范式优化）\n5. 分表分库建议（如数据量大）\n6. 完整的 DDL 语句\n7. 典型查询的 SQL 示例\n8. 数据迁移和版本管理建议'
  },
  {
    id: 'zhiz-设计规范文档生成',
    category: 'design',
    title: '设计规范文档生成',
    description: '生成涵盖色板字体与组件的设计系统规范。',
    tags: ['设计规范', 'Design System', '组件库', 'UI规范'],
    variables: [
      { key: '产品名称', type: 'text', placeholder: '名称', required: true },
      { key: '产品类型', type: 'text', placeholder: 'Web/App/跨平台', required: true },
      { key: '品牌色', type: 'text', placeholder: '主色调，如有', required: true },
      { key: '参考风格', type: 'text', placeholder: 'Material/Ant Design/Apple HIG/自定义', required: true }
    ],
    body: '你是一位设计系统（Design System）专家，擅长建立和维护设计规范。请为以下产品生成设计规范文档：\n\n产品名称：{{产品名称}}\n产品类型：{{产品类型}}\n品牌色：{{品牌色}}\n参考风格：{{参考风格}}\n\n请生成完整的设计规范文档：\n1. 色彩系统（主色/辅助色/中性色/语义色 + 暗色模式适配）\n2. 字体层级（标题 H1-H6、正文、标注的字号/字重/行高）\n3. 间距系统（4px 或 8px 基准网格）\n4. 圆角规范\n5. 阴影层级\n6. 图标规范\n7. 组件样式指南（按钮/输入框/卡片/导航等）\n8. 响应式断点\n9. 动效规范\n10. 无障碍（A11y）要求\n\n使用 Token 命名体系（如 color-primary-500)。'
  },
  {
    id: 'zhiz-高效会议纪要生成器',
    category: 'work',
    title: '高效会议纪要生成器',
    description: '从会议记录提取决策与行动项并整理成纪要。',
    tags: ['会议纪要', '效率', '职场', '文档'],
    variables: [
      { key: '你是一位专业的会议记录专家。请将以下会议', type: 'textarea', placeholder: '粘贴会议内容', required: true }
    ],
    body: '你是一位专业的会议记录专家。请将以下会议录音/记录整理成专业的会议纪要：\n\n{{你是一位专业的会议记录专家。请将以下会议}}\n\n会议纪要格式：\n📅 会议基本信息（时间、地点、参会人）\n\n🎯 会议目的\n\n💡 主要讨论内容\n（分点列出，每点控制在3行以内）\n\n✅ 决策事项\n（明确的结论和决策）\n\n📋 行动项目\n| 任务 | 负责人 | 截止时间 | 优先级 |\n\n🔔 待确认事项\n\n📝 下次会议安排'
  },
  {
    id: 'zhiz-技术演示文稿生成',
    category: 'work',
    title: '技术演示文稿生成',
    description: '生成含要点与备注的技术演讲幻灯片大纲。',
    tags: ['演示文稿', '技术演讲', 'PPT', '汇报'],
    variables: [
      { key: '演讲主题', type: 'text', placeholder: '主题', required: true },
      { key: '目标受众', type: 'text', placeholder: '技术团队/管理层/客户/公众', required: true },
      { key: '演讲时长', type: 'text', placeholder: '5分钟/15分钟/30分钟/45分钟', required: true },
      { key: '演讲目的', type: 'textarea', placeholder: '技术分享/方案评审/成果汇报/教学', required: true }
    ],
    body: '你是一位技术演讲和 Presentation 设计专家。请帮我生成技术演示文稿的内容：\n\n演讲主题：{{演讲主题}}\n目标受众：{{目标受众}}\n演讲时长：{{演讲时长}}\n演讲目的：{{演讲目的}}\n\n请生成完整的 Slide 大纲：\n1. 每页 Slide 的标题 + 要点\n2. 每页建议的视觉元素（图表/代码/截图/动画）\n3. 演讲者备注（该说什么）\n4. 开场和结尾设计\n5. Q&A 预设问题和回答\n\n遵循「10-20-30 法则」：不超过10页核心内容，20分钟讲完，30pt 以上字号。'
  },
  {
    id: 'zhiz-投资组合分析顾问',
    category: 'work',
    title: '投资组合分析顾问',
    description: '评估资产配置风险并给出多元化优化建议。',
    tags: ['投资', '理财', '资产配置', '财务规划'],
    variables: [
      { key: '当前资产配置', type: 'textarea', placeholder: '列出各类资产及比例，如：A股30%，美股20%，债券20%，黄金10%，…', required: true },
      { key: '-投资期限', type: 'text', placeholder: '短期<3年/中期3-10年/长期>10年', required: true },
      { key: '-风险承受能力', type: 'text', placeholder: '保守/稳健/积极', required: true },
      { key: '-年龄', type: 'text', placeholder: '年龄', required: true },
      { key: '-主要理财目标', type: 'text', placeholder: '退休/买房/子女教育/财富增值', required: true }
    ],
    body: '你是一位拥有 CFA 认证的投资顾问，专注于个人理财和资产配置。请分析我的投资组合：\n\n当前资产配置：\n{{当前资产配置}}\n\n个人信息：\n- 投资期限：{{-投资期限}}\n- 风险承受能力：{{-风险承受能力}}\n- 年龄：{{-年龄}}\n- 主要理财目标：{{-主要理财目标}}\n\n请提供：\n1. 当前组合风险评估\n2. 预期收益率分析\n3. 优化建议\n4. 再平衡策略\n5. 市场风险提示'
  },
  {
    id: 'zhiz-合规文案审核助手',
    category: 'create',
    title: '合规文案审核助手',
    description: '检查营销文案是否触犯广告法与合规红线。',
    tags: ['合规审核', '广告法', '法律风控', '文案'],
    variables: [
      { key: '待审核文案', type: 'textarea', placeholder: '粘贴需要审核的营销文案', required: true },
      { key: '行业', type: 'text', placeholder: '美妆/医疗/食品/金融/教育/电商/科技', required: true },
      { key: '投放渠道', type: 'text', placeholder: 'APP/网站/电商详情页/朋友圈/户外广告', required: true }
    ],
    body: '你是一位广告法合规审核专家，精通中国《广告法》和各行业合规要求。请审核以下文案：\n\n待审核文案：\n{{待审核文案}}\n\n行业：{{行业}}\n投放渠道：{{投放渠道}}\n\n请逐一检查：\n1. 是否包含绝对化用语（最、第一、唯一等）\n2. 是否涉及虚假宣传（效果承诺、无依据的数据）\n3. 是否侵犯他人权益（肖像权、著作权、商标权）\n4. 是否违反行业特殊规定\n5. 是否存在引人误解的表述\n\n输出：\n| 问题文案 | 风险等级 | 法规依据 | 修改建议 |\n\n提供合规版文案。'
  },
  {
    id: 'zhiz-代码语言转换器',
    category: 'code',
    title: '代码语言转换器',
    description: '将代码转换为目标语言并保留原有业务逻辑。',
    tags: ['代码转换', '多语言', '迁移', '跨平台'],
    variables: [
      { key: '源语言', type: 'text', placeholder: '源语言', required: true },
      { key: '目标语言', type: 'text', placeholder: '目标语言', required: true },
      { key: '代码', type: 'textarea', placeholder: '粘贴代码', required: true }
    ],
    body: '你是一位精通多语言编程的技术专家。请将以下代码从 {{源语言}} 转换为 {{目标语言}}：\n\n源代码：\n```{{源语言}}\n{{代码}}\n```\n\n转换要求：\n1. 保持功能完全一致\n2. 使用目标语言的惯用写法（idiom）\n3. 遵循目标语言的命名规范\n4. 利用目标语言的特性优化（如语法糖、标准库）\n5. 保留原有注释并翻译\n6. 添加类型注解（如目标语言支持）\n\n请输出：\n- 转换后的完整代码\n- 两种语言的关键差异说明\n- 需要注意的陷阱和兼容性问题'
  },
  {
    id: 'zhiz-自动化脚本生成器',
    category: 'code',
    title: '自动化脚本生成器',
    description: '根据任务描述生成可运行的自动化脚本。',
    tags: ['自动化', '脚本', 'Shell', '运维'],
    variables: [
      { key: '任务描述', type: 'textarea', placeholder: '描述要自动化的操作', required: true },
      { key: '运行环境', type: 'text', placeholder: 'macOS/Linux/Windows', required: true },
      { key: '脚本语言偏好', type: 'text', placeholder: 'Bash/Python/Node.js/PowerShell', required: true }
    ],
    body: '你是一位自动化运维专家，精通 Shell、Python、Node.js 脚本编写。请根据任务需求生成自动化脚本：\n\n任务描述：{{任务描述}}\n运行环境：{{运行环境}}\n脚本语言偏好：{{脚本语言偏好}}\n\n脚本要求：\n1. 详细的使用说明（注释头）\n2. 参数解析（支持命令行参数）\n3. 错误处理和日志输出\n4. 幂等性设计（可重复执行不出错）\n5. 进度显示（如耗时操作）\n6. 干运行模式（--dry-run）\n7. 恢复/回滚机制\n\n输出可直接复制执行的完整脚本，附带使用示例。'
  },
  {
    id: 'zhiz-自动化脚本生成器-2',
    category: 'code',
    title: '自动化脚本生成器',
    description: '根据任务描述生成可运行的自动化脚本。',
    tags: ['自动化', '脚本', 'Shell', '运维'],
    variables: [
      { key: '任务描述', type: 'textarea', placeholder: '描述要自动化的操作', required: true },
      { key: '运行环境', type: 'text', placeholder: 'macOS/Linux/Windows', required: true },
      { key: '脚本语言偏好', type: 'text', placeholder: 'Bash/Python/Node.js/PowerShell', required: true }
    ],
    body: '你是一位自动化运维专家，精通 Shell、Python、Node.js 脚本编写。请根据任务需求生成自动化脚本：\n\n任务描述：{{任务描述}}\n运行环境：{{运行环境}}\n脚本语言偏好：{{脚本语言偏好}}\n\n脚本要求：\n1. 详细的使用说明（注释头）\n2. 参数解析（支持命令行参数）\n3. 错误处理和日志输出\n4. 幂等性设计（可重复执行不出错）\n5. 进度显示（如耗时操作）\n6. 干运行模式（--dry-run）\n7. 恢复/回滚机制\n\n输出可直接复制执行的完整脚本，附带使用示例。'
  },
  {
    id: 'zhiz-商业计划书一键生成',
    category: 'work',
    title: '商业计划书一键生成',
    description: '将创业想法整理为完整的商业计划书框架。',
    tags: ['创业', '商业计划', '融资', '市场分析'],
    variables: [
      { key: '项目名称', type: 'text', placeholder: '项目名称', required: true },
      { key: '核心产品/服务', type: 'textarea', placeholder: '描述', required: true },
      { key: '目标市场', type: 'text', placeholder: '目标用户群体', required: true },
      { key: '预计启动资金', type: 'text', placeholder: '金额', required: true }
    ],
    body: '你是一位顶级创业顾问，曾帮助多家公司成功融资。请根据以下信息生成一份专业的商业计划书：\n\n项目名称：{{项目名称}}\n核心产品/服务：{{核心产品/服务}}\n目标市场：{{目标市场}}\n预计启动资金：{{预计启动资金}}\n\n商业计划书需包含：\n1. 执行摘要（投资人最关注的部分）\n2. 问题与解决方案\n3. 市场规模分析（TAM/SAM/SOM）\n4. 商业模式（收入来源）\n5. 竞争分析\n6. 营销获客策略\n7. 核心团队\n8. 财务预测（3年）\n9. 融资需求和资金用途'
  },
  {
    id: 'zhiz-智能字数调控器',
    category: 'create',
    title: '智能字数调控器',
    description: '在保留核心信息前提下精准扩写或压缩文章。',
    tags: ['字数调控', '文字编辑', '内容精简', '写作'],
    variables: [
      { key: '原文', type: 'textarea', placeholder: '粘贴文字', required: true },
      { key: '场景', type: 'textarea', placeholder: '社交媒体/摘要/论文/演讲稿/产品描述', required: true },
      { key: 'X', type: 'text', placeholder: 'X', required: true },
      { key: 'Y', type: 'text', placeholder: 'Y', required: true }
    ],
    body: '你是一位文字编辑专家，擅长在不损失核心信息的前提下精准调控文章字数。请调整以下内容的字数：\n\n原文：\n{{原文}}\n\n当前字数：约 {{X}} 字\n目标字数：约 {{Y}} 字\n场景：{{场景}}\n\n调整策略：\n- 扩容：补充细节、添加论据、增加案例\n- 缩减：删除冗余、合并同类项、简化表达\n\n要求：\n1. 核心论点完整保留\n2. 逻辑连贯，过渡自然\n3. 标注修改部分\n4. 最终字数误差在 ±5% 以内'
  },
  {
    id: 'zhiz-ai-对话追问纠偏助手',
    category: 'work',
    title: 'AI 对话追问纠偏助手',
    description: '当回答跑偏时生成精准追问以拉回正题。',
    tags: ['AI交互', '追问技巧', 'Prompt优化', '效率'],
    variables: [
      { key: '原始需求', type: 'text', placeholder: '你最初想要什么', required: true },
      { key: 'AI的回答摘要', type: 'text', placeholder: 'AI 给出了什么', required: true },
      { key: '不满意之处', type: 'text', placeholder: '哪些方面不对/不够/偏题', required: true }
    ],
    body: '你是一位 AI 交互优化专家，擅长引导 AI 给出更精准的回答。当 AI 的回答偏离预期时，请帮我生成有效的追问/纠偏 Prompt：\n\n原始需求：{{原始需求}}\nAI 的回答摘要：{{AI的回答摘要}}\n不满意之处：{{不满意之处}}\n\n请生成一段追问 Prompt，包含：\n1. 明确指出当前回答的具体问题\n2. 重新强调核心需求（更精确的措辞）\n3. 补充遗漏的约束条件\n4. 提供正确方向的示例或参考\n5. 设定更具体的输出格式要求\n\n直接输出可复制使用的追问 Prompt。'
  },
  {
    id: 'zhiz-产品需求文档-prd-生成器',
    category: 'work',
    title: '产品需求文档(PRD)生成器',
    description: '将产品想法整理为结构完整的需求文档。',
    tags: ['PRD', '产品管理', '需求文档', '产品经理'],
    variables: [
      { key: '产品名称', type: 'text', placeholder: '名称', required: true },
      { key: '产品定位', type: 'textarea', placeholder: '一句话描述', required: true },
      { key: '核心功能', type: 'text', placeholder: '列举主要功能', required: true },
      { key: '目标用户', type: 'textarea', placeholder: '描述用户画像', required: true }
    ],
    body: '你是一位资深产品经理，擅长撰写专业的产品需求文档。请根据以下产品想法生成完整的 PRD：\n\n产品名称：{{产品名称}}\n产品定位：{{产品定位}}\n核心功能：{{核心功能}}\n目标用户：{{目标用户}}\n\n PRD 结构：\n## 1. 产品概述\n## 2. 用户研究与需求分析\n## 3. 功能规格\n   - 功能描述\n   - 用户故事\n   - 验收标准\n## 4. 非功能需求\n## 5. 数据埋点需求\n## 6. 发布计划\n## 7. 风险与依赖\n\n请用专业的产品语言撰写，并考虑边界情况。'
  },
  {
    id: 'zhiz-风险评估矩阵生成',
    category: 'work',
    title: '风险评估矩阵生成',
    description: '识别业务风险并输出热力图与应对预案。',
    tags: ['风险评估', '项目管理', '风控', '决策分析'],
    variables: [
      { key: '项目名称', type: 'text', placeholder: '名称', required: true },
      { key: '项目类型', type: 'text', placeholder: '软件开发/产品上线/组织变革/投资决策', required: true },
      { key: '项目周期', type: 'text', placeholder: '时间范围', required: true },
      { key: '关键干系人', type: 'textarea', placeholder: '列出利益相关方', required: true }
    ],
    body: '你是一位风险管理专家，精通项目风险识别和评估方法论。请对以下项目进行风险评估：\n\n项目名称：{{项目名称}}\n项目类型：{{项目类型}}\n项目周期：{{项目周期}}\n关键干系人：{{关键干系人}}\n\n请进行系统化风险评估：\n\n**风险识别（按来源分类）：**\n1. 技术风险\n2. 市场风险\n3. 运营风险\n4. 财务风险\n5. 人力风险\n6. 合规风险\n\n**风险评估矩阵：**\n| 风险编号 | 风险描述 | 发生概率(1-5) | 影响程度(1-5) | 风险等级 | 应对策略 | 责任人 |\n\n**应对策略类型：** 规避/转移/缓解/接受\n\n输出风险热力图（高/中/低分布）和 Top 5 风险详细应对预案。'
  },
  {
    id: 'zhiz-全栈性能调优专家',
    category: 'code',
    title: '全栈性能调优专家',
    description: '诊断前后端性能瓶颈并给出优化方案。',
    tags: ['性能优化', '前端优化', '后端调优', '瓶颈分析'],
    variables: [
      { key: '问题描述', type: 'textarea', placeholder: '描述性能问题现象', required: true },
      { key: '技术栈', type: 'text', placeholder: '使用的技术栈', required: true },
      { key: '当前指标', type: 'textarea', placeholder: '如有性能数据', required: true },
      { key: '相关代码，如有', type: 'textarea', placeholder: '粘贴相关代码，如有', required: true }
    ],
    body: '你是一位全栈性能优化专家，精通前端渲染、网络传输和后端性能调优。请分析以下代码/系统的性能问题：\n\n问题描述：{{问题描述}}\n技术栈：{{技术栈}}\n当前指标：{{当前指标}}\n\n```\n{{相关代码，如有}}\n```\n\n请从以下角度分析并优化：\n1. 性能瓶颈定位\n2. 时间复杂度/空间复杂度分析\n3. 网络请求优化（缓存、压缩、懒加载）\n4. 渲染性能优化（重排重绘、虚拟化）\n5. 内存泄漏排查\n6. 优化后的代码实现\n7. 性能对比预估'
  },
  {
    id: 'zhiz-冥想引导词生成器',
    category: 'chat',
    title: '冥想引导词生成器',
    description: '生成个性化冥想引导语，帮助放松与助眠。',
    tags: ['冥想', '正念', '减压', '心理健康'],
    variables: [
      { key: '冥想类型', type: 'text', placeholder: '减压放松/睡前冥想/专注提升/焦虑缓解/自我疗愈', required: true },
      { key: '时长', type: 'text', placeholder: '5/10/15/20', required: true },
      { key: '当前状态', type: 'textarea', placeholder: '描述你此刻的状态', required: true },
      { key: '特殊需求', type: 'text', placeholder: '如有', required: true }
    ],
    body: '你是一位冥想导师，擅长引导正念冥想和身体扫描练习。请生成一段冥想引导词：\n\n冥想类型：{{冥想类型}}\n时长：{{时长}}分钟\n当前状态：{{当前状态}}\n特殊需求：{{特殊需求}}\n\n引导词要求：\n- 语调平和、温柔\n- 指导自然的呼吸节奏\n- 渐进式放松身体各部分\n- 运用正向意象和隐喻\n- 结尾要温和地引导回归现实\n- 适当加入停顿提示'
  },
  {
    id: 'zhiz-异步方案设计师',
    category: 'code',
    title: '异步方案设计师',
    description: '设计并发控制与重试机制，规避竞态问题。',
    tags: ['异步编程', '并发控制', 'Promise', '错误处理'],
    variables: [
      { key: '场景描述', type: 'textarea', placeholder: '描述你的异步需求', required: true },
      { key: '技术环境', type: 'text', placeholder: 'Node.js/浏览器/全栈', required: true },
      { key: '并发要求', type: 'text', placeholder: '串行/并行/限制并发数', required: true }
    ],
    body: '你是一位异步编程专家，精通 Promise、async/await、并发控制和错误处理。请为以下场景设计异步方案：\n\n场景描述：{{场景描述}}\n技术环境：{{技术环境}}\n并发要求：{{并发要求}}\n\n请提供：\n1. 异步流程设计（流程图描述）\n2. 并发控制策略（Promise.all/allSettled/race/限流）\n3. 错误处理和重试机制\n4. 超时控制\n5. 取消机制（AbortController）\n6. 竞态条件防护\n7. 完整的代码实现\n8. 异常场景测试用例'
  },
  {
    id: 'zhiz-品牌故事撰写专家',
    category: 'create',
    title: '品牌故事撰写专家',
    description: '提炼品牌使命愿景并撰写有感染力的故事。',
    tags: ['品牌故事', '品牌策略', '价值观', '文案'],
    variables: [
      { key: '品牌名称', type: 'text', placeholder: '名称', required: true },
      { key: '所在行业', type: 'text', placeholder: '行业', required: true },
      { key: '创始背景', type: 'text', placeholder: '为什么创立这个品牌？解决什么问题？', required: true },
      { key: '核心产品/服务', type: 'text', placeholder: '主要做什么', required: true },
      { key: '目标客群', type: 'text', placeholder: '服务谁', required: true },
      { key: '差异化优势', type: 'text', placeholder: '与竞品的核心区别', required: true }
    ],
    body: '你是一位品牌策略顾问，精通品牌叙事和价值提炼。请为以下品牌撰写品牌故事：\n\n品牌名称：{{品牌名称}}\n所在行业：{{所在行业}}\n创始背景：{{创始背景}}\n核心产品/服务：{{核心产品/服务}}\n目标客群：{{目标客群}}\n差异化优势：{{差异化优势}}\n\n请输出：\n1. 品牌起源故事（300-500字叙事版）\n2. 品牌使命宣言（一句话）\n3. 品牌愿景（一句话）\n4. 核心价值观（3-5 个关键词 + 解释）\n5. 品牌调性关键词\n6. 适用于官网「关于我们」的版本\n7. 适用于融资 BP 的精简版\n\n故事要真实、有温度，避免空洞的口号。'
  },
  {
    id: 'zhiz-a-b-测试方案设计',
    category: 'work',
    title: 'A/B 测试方案设计',
    description: '设计含假设与样本量计算的完整实验方案。',
    tags: ['A/B测试', '增长实验', '数据驱动', '转化优化'],
    variables: [
      { key: '测试对象', type: 'text', placeholder: '要测试什么——页面/文案/功能/流程', required: true },
      { key: '优化目标', type: 'text', placeholder: '要提升什么指标', required: true },
      { key: '当前数据', type: 'textarea', placeholder: '基线转化率/当前数据', required: true },
      { key: '可调资源', type: 'text', placeholder: '流量/时间/技术', required: true }
    ],
    body: '你是一位增长实验设计专家，精通 A/B 测试方法论和统计分析。请帮我设计 A/B 测试方案：\n\n测试对象：{{测试对象}}\n优化目标：{{优化目标}}\n当前数据：{{当前数据}}\n可调资源：{{可调资源}}\n\n请输出完整方案：\n1. 测试假设（H0 和 H1 明确定义）\n2. 变量设计（控制组 vs 实验组的差异点）\n3. 样本量计算（置信水平95%，统计功效80%）\n4. 用户分流策略（随机分组方法）\n5. 核心指标和护栏指标定义\n6. 测试时长估算\n7. 预期影响和最小可检测效应\n8. 数据收集和埋点需求\n9. 结果判定标准\n10. 常见陷阱提醒（辛普森悖论、新奇效应等）\n\n提供统计显著性判定公式。'
  },
  {
    id: 'zhiz-git-操作指南助手',
    category: 'code',
    title: 'Git 操作指南助手',
    description: '解决分支合并与历史修改等 Git 难题。',
    tags: ['Git', '版本控制', '分支管理', '开发工具'],
    variables: [
      { key: '问题描述', type: 'textarea', placeholder: '描述你的 Git 操作需求或遇到的问题', required: true },
      { key: '当前状态', type: 'text', placeholder: '当前分支、暂存区情况', required: true }
    ],
    body: '你是一位 Git 版本控制专家，精通各种 Git 工作流和高级操作。请帮我解决以下 Git 问题：\n\n问题描述：{{问题描述}}\n当前状态：{{当前状态}}\n\n请提供：\n1. 具体的 Git 命令序列\n2. 每条命令的详细解释\n3. 执行前的注意事项（数据风险提醒）\n4. 备份/回退方案\n5. 操作后的验证方法\n\n适用场景：\n- 分支管理（合并、变基、Cherry-pick）\n- 历史修改（修改提交、交互式 Rebase）\n- 冲突解决策略\n- 工作区暂存（Stash）\n- 子模块和大文件管理'
  },
  {
    id: 'zhiz-职业发展规划顾问',
    category: 'learn',
    title: '职业发展规划顾问',
    description: '根据背景目标制定职业发展路径与行动计划。',
    tags: ['职业规划', '个人成长', '学习路径', '职场'],
    variables: [
      { key: '当前职位', type: 'text', placeholder: '当前职位', required: true },
      { key: '工作年限', type: 'textarea', placeholder: '年限', required: true },
      { key: '技能特长', type: 'text', placeholder: '技能', required: true },
      { key: '目标职位', type: 'text', placeholder: '目标', required: true },
      { key: '时间规划', type: 'text', placeholder: '时间范围', required: true }
    ],
    body: '你是一位经验丰富的职业发展顾问，曾帮助数千人实现职业跨越。请根据以下信息为我制定职业发展规划：\n\n当前职位：{{当前职位}}\n工作年限：{{工作年限}}\n技能特长：{{技能特长}}\n目标职位：{{目标职位}}\n时间规划：{{时间规划}}\n\n请提供：\n1. 差距分析（当前vs目标所需）\n2. 90天行动计划\n3. 6个月里程碑\n4. 1年目标\n5. 推荐学习资源和证书\n6. 可能遇到的挑战和应对策略'
  },
  {
    id: 'zhiz-ux-体验审查专家',
    category: 'design',
    title: 'UX 体验审查专家',
    description: '按可用性原则审查产品体验并输出优化建议。',
    tags: ['UX审查', '可用性', '用户体验', '产品设计'],
    variables: [
      { key: '审查对象', type: 'text', placeholder: '产品名称/页面/功能', required: true },
      { key: '产品类型', type: 'text', placeholder: 'Web应用/App/小程序/SaaS后台', required: true },
      { key: '核心用户流程', type: 'textarea', placeholder: '描述主要任务流程', required: true },
      { key: '已知问题', type: 'textarea', placeholder: '用户反馈或数据上暴露的问题', required: true }
    ],
    body: '你是一位 UX 设计专家，精通可用性测试和用户体验优化。请审查以下产品/页面的用户体验：\n\n审查对象：{{审查对象}}\n产品类型：{{产品类型}}\n核心用户流程：{{核心用户流程}}\n已知问题：{{已知问题}}\n\n��基于尼尔森十大可用性原则进行审查：\n1. 系统状态可见性\n2. 系统与现实匹配\n3. 用户控制与自由\n4. 一致性和标准化\n5. 错误预防\n6. 识别而非回忆\n7. 灵活性与效率\n8. 审美与最小化设计\n9. 容错性\n10. 帮助与文档\n\n输出：可用性问题清单（严重/中等/轻微）+ 优化建议 + 竞品参考。'
  },
  {
    id: 'zhiz-周报自动生成器',
    category: 'work',
    title: '周报自动生成器',
    description: '将工作要点整理为格式规范的周报摘要。',
    tags: ['周报', '工作汇报', '效率', '职场'],
    variables: [
      { key: '本周完成的工作', type: 'textarea', placeholder: '逐条列出工作内容，可以是零散的', required: true },
      { key: '遇到的问题', type: 'textarea', placeholder: '列出', required: true },
      { key: '下周计划', type: 'textarea', placeholder: '列出', required: true },
      { key: '数据指标如有', type: 'textarea', placeholder: '列出', required: true }
    ],
    body: '你是一位高效的职场助理。请将以下工作内容整理成一份专业的周报：\n\n本周完成的工作：\n{{本周完成的工作}}\n\n遇到的问题：\n{{遇到的问题}}\n\n下周计划：\n{{遇到的问题}}\n\n数据指标（如有）：\n{{遇到的问题}}\n\n周报格式：\n本周工作总结\n一、重点工作完成情况\n（STAR法则，突出成果）\n\n二、问题与解决方案\n\n三、数据指标\n\n四、下周工作计划\n（优先级排列）\n\n要求简洁专业，重点突出，字数控制在300-500字。'
  },
  {
    id: 'zhiz-自动化测试生成器',
    category: 'code',
    title: '自动化测试生成器',
    description: '为代码生成覆盖多场景的单元测试用例。',
    tags: ['自动化测试', '单元测试', 'Jest', 'TDD'],
    variables: [
      { key: '测试框架', type: 'text', placeholder: 'Jest/Vitest/Mocha/PyTest/JUnit', required: true },
      { key: '测试类型', type: 'text', placeholder: '单元测试/集成测试/E2E', required: true },
      { key: '需要测试的代码', type: 'textarea', placeholder: '粘贴需要测试的代码', required: true }
    ],
    body: '你是一位测试工程师，精通单元测试、集成测试和 E2E 测试。请为以下代码生成测试用例：\n\n```\n{{需要测试的代码}}\n```\n\n测试框架：{{测试框架}}\n测试类型：{{测试类型}}\n\n请生成：\n1. 正常场景测试（Happy Path）\n2. 边界值测试\n3. 异常场景测试（错误输入、超时、网络失败）\n4. 并发/竞态测试（如适用）\n5. Mock/Stub 使用建议\n6. 测试覆盖率目标\n\n每个测试用例含描述、输入、预期输出。输出可直接运行的测试代码。'
  },
  {
    id: 'zhiz-苏格拉底式辩论教练',
    category: 'learn',
    title: '苏格拉底式辩论教练',
    description: '通过追问引导你深度思考并锻炼论证能力。',
    tags: ['辩论', '批判性思维', '哲学', '思维训练'],
    variables: [
      { key: '你是苏格拉底的化身，擅长通过提问引导思考', type: 'text', placeholder: '主题/观点', required: true }
    ],
    body: '你是苏格拉底的化身，擅长通过提问引导思考。我想深入探讨：{{你是苏格拉底的化身，擅长通过提问引导思考}}\n\n请扮演辩论教练的角色：\n1. 不直接给出答案，而是通过层层追问引导我思考\n2. 挑战我的假设，问"你为什么这么认为？"\n3. 当我的逻辑出现漏洞时，温和地指出\n4. 帮助我看到不同的视角\n5. 在对话结束时，总结我们发现的关键洞见\n\n从一个开放性问题开始对话。'
  },
  {
    id: 'zhiz-任务拆解大师',
    category: 'code',
    title: '任务拆解大师',
    description: '把复杂需求拆成可执行的小任务并标注依赖。',
    tags: ['任务拆解', '项目管理', '需求分析', '架构'],
    variables: [
      { key: '需求描述', type: 'textarea', placeholder: '描述你的大需求', required: true },
      { key: '技术栈', type: 'text', placeholder: '如有偏好，否则由你推荐', required: true }
    ],
    body: '你是一位拥有 15 年经验的项目经理和系统架构师。请将以下复杂需求拆解为可独立执行的原子任务：\n\n需求描述：{{需求描述}}\n技术栈：{{技术栈}}\n\n拆解要求：\n1. 梳理核心功能模块\n2. 每个模块拆为原子任务（可独立开发测试）\n3. 标注任务间依赖关系\n4. 以 P0/P1/P2 标注优先级\n5. 给出最优执行顺序\n6. 每个任务附带「任务卡片」：目标、输入、输出、预估工时\n\n输出 Markdown 格式的任务清单。'
  },
  {
    id: 'zhiz-okr-目标设定助手',
    category: 'work',
    title: 'OKR 目标设定助手',
    description: '制定可衡量目标并附评分标准与复盘模板。',
    tags: ['OKR', '目标管理', '绩效', '团队管理'],
    variables: [
      { key: '角色/团队', type: 'text', placeholder: '个人/团队/部门', required: true },
      { key: '所属部门', type: 'text', placeholder: '产品/技术/运营/市场/销售', required: true },
      { key: '时间周期', type: 'text', placeholder: '本季度/下季度', required: true },
      { key: '公司级目标', type: 'text', placeholder: '如有，需对齐', required: true },
      { key: '当前重点', type: 'text', placeholder: '目前最关注的事情', required: true },
      { key: 'Objective1', type: 'textarea', placeholder: '目标描述', required: true },
      { key: '-KR1', type: 'text', placeholder: '可量化的关键结果', required: true }
    ],
    body: '你是一位 OKR 教练，擅长帮助团队制定有挑战性又可衡量的目标。请帮我制定 OKR：\n\n角色/团队：{{角色/团队}}\n所属部门：{{所属部门}}\n时间周期：{{时间周期}}\n公司级目标：{{公司级目标}}\n当前重点：{{当前重点}}\n\n请输出结构化 OKR：\n\n**Objective 1: {{Objective1}}**\n- KR1: {{-KR1}} → 基线值 → 目标值\n- KR2: ...\n- KR3: ...\n\n（2-3 个 Objective，每个 2-4 个 KR）\n\n附加输出：\n1. OKR 评分标准（0-1.0 打分规则）\n2. 与公司目标的对齐关系\n3. 季度中期检查清单\n4. 复盘模板\n5. 常见陷阱提醒\n\n确保 KR 符合 SMART 原则且有挑战性。'
  },
  {
    id: 'zhiz-组件架构设计师',
    category: 'code',
    title: '组件架构设计师',
    description: '设计可复用前端组件并定义完整接口文档。',
    tags: ['组件设计', '前端架构', '可复用', 'Design System'],
    variables: [
      { key: '组件需求', type: 'textarea', placeholder: '描述组件功能和使用场景', required: true },
      { key: '框架', type: 'text', placeholder: 'React/Vue/Web Components', required: true },
      { key: '设计系统', type: 'text', placeholder: '如有参考的设计系统', required: true }
    ],
    body: '你是一位前端组件设计专家，擅长构建可复用、可扩展的组件体系。请设计以下组件：\n\n组件需求：{{组件需求}}\n框架：{{框架}}\n设计系统：{{设计系统}}\n\n设计要求：\n1. Props / API 接口设计\n2. 组件拆分（容器组件 vs 展示组件）\n3. 插槽/children 的灵活性设计\n4. 状态管理和事件处理\n5. 样式方案（CSS Modules / Styled / Tailwind）\n6. TypeScript 类型定义\n7. 无障碍（ARIA 属性）\n8. 完整的组件代码实现\n9. 使用示例和文档'
  },
  {
    id: 'zhiz-文章大纲生成器',
    category: 'create',
    title: '文章大纲生成器',
    description: '构建逻辑严密的文章结构并规划关键词布局。',
    tags: ['文章大纲', '内容策划', '写作结构', 'SEO'],
    variables: [
      { key: '文章主题', type: 'text', placeholder: '主题', required: true },
      { key: '文章类型', type: 'text', placeholder: '教程/观点文/案例分析/深度报道/清单文', required: true },
      { key: '目标读者', type: 'textarea', placeholder: '描述读者画像', required: true },
      { key: '预计字数', type: 'text', placeholder: '字数范围', required: true }
    ],
    body: '你是一位资深内容策划人，擅长构建逻辑严密、吸引力强的文章结构。请为以下主题生成大纲：\n\n文章主题：{{文章主题}}\n文章类型：{{文章类型}}\n目标读者：{{目标读者}}\n预计字数：{{预计字数}}\n\n大纲要求：\n1. 引言/钩子设计（如何开头吸引读者）\n2. 主体目录（3-7个核心章节）\n3. 每个章节的要点列表\n4. 论据/案例/数据建议\n5. 过渡语和衔接设计\n6. 结尾/行动号召\n7. 推荐的配图/图表位置\n\n大纲需兼顾 SEO 友好性（含关键词布局建议）。'
  },
  {
    id: 'zhiz-用户故事撰写助手',
    category: 'work',
    title: '用户故事撰写助手',
    description: '按规范编写用户故事、验收标准与拆分建议。',
    tags: ['用户故事', '敏捷', '需求分析', '产品管理'],
    variables: [
      { key: '功能描述', type: 'textarea', placeholder: '概述要实现的功能', required: true },
      { key: '产品名称', type: 'text', placeholder: '产品名', required: true },
      { key: '用户角色', type: 'text', placeholder: '使用这个功能的用户类型', required: true },
      { key: '角色', type: 'text', placeholder: '角色', required: true },
      { key: '行为', type: 'text', placeholder: '行为', required: true },
      { key: '收益', type: 'text', placeholder: '收益', required: true },
      { key: '前提条件', type: 'text', placeholder: '前提条件', required: true },
      { key: '操作', type: 'text', placeholder: '操作', required: true },
      { key: '预期结果', type: 'text', placeholder: '预期结果', required: true }
    ],
    body: '你是一位敏捷教练和产品经理，精通用户故事编写和需求拆分。请帮我编写用户故事：\n\n功能描述：{{功能描述}}\n产品名称：{{产品名称}}\n用户角色：{{用户角色}}\n\n请按以下格式编写：\n\n**User Story:**\nAs a {{角色}}, I want {{行为}}, so that {{收益}}.\n\n**验收标准 (Acceptance Criteria):**\n- Given {{前提条件}}, When {{操作}}, Then {{预期结果}}\n- （至少 3 条）\n\n**附加信息：**\n1. INVEST 检查（Independent/Negotiable/Valuable/Estimable/Small/Testable）\n2. 故事点估算和拆分建议（如太大则拆为子故事）\n3. 技术注意事项\n4. 边界情况和异常场景\n5. UI/UX 需求备注\n\n确保故事小到可在一个 Sprint 内完成。'
  },
  {
    id: 'zhiz-报错信息分析师',
    category: 'code',
    title: '报错信息分析师',
    description: '解析错误堆栈并给出分步修复方案。',
    tags: ['报错分析', '错误排查', '堆栈追踪', '调试'],
    variables: [
      { key: '运行环境', type: 'textarea', placeholder: '语言/框架/版本', required: true },
      { key: '触发操作', type: 'text', placeholder: '做了什么操作导致报错', required: true },
      { key: '完整的错误信息和堆栈', type: 'textarea', placeholder: '粘贴完整的错误信息和堆栈', required: true }
    ],
    body: '你是一位全栈错误诊断专家，精通各类编程语言和框架的错误体系。请帮我分析以下报错信息：\n\n报错内容：\n```\n{{完整的错误信息和堆栈}}\n```\n\n运行环境：{{运行环境}}\n触发操作：{{触发操作}}\n\n请提供：\n1. 错误类型解析（是什么类型的错误）\n2. 错误原因分析（为什么会发生）\n3. 堆栈追踪解读（关键调用链）\n4. 解决方案（分步骤，附代码）\n5. 类似错误的预防建议\n6. 相关文档或参考链接'
  },
  {
    id: 'zhiz-小说故事情节生成器',
    category: 'create',
    title: '小说故事情节生成器',
    description: '根据人设背景生成情节对话与场景描写。',
    tags: ['小说创作', '故事生成', '写作助手', '创意写作'],
    variables: [
      { key: '故事类型', type: 'text', placeholder: '玄幻/现代/科幻/历史/悬疑', required: true },
      { key: '主要人物', type: 'text', placeholder: '姓名、性格、背景', required: true },
      { key: '故事背景', type: 'text', placeholder: '时代、地点、世界观', required: true },
      { key: '当前场景', type: 'textarea', placeholder: '描述当前情节节点', required: true },
      { key: '我想要', type: 'text', placeholder: '对话/场景描写/情节发展/角色内心活动', required: true },
      { key: '-字数', type: 'text', placeholder: '500/1000/2000', required: true }
    ],
    body: '你是一位获奖小说家，擅长各种文学风格。请根据以下设定生成故事内容：\n\n故事类型：{{故事类型}}\n主要人物：{{主要人物}}\n故事背景：{{故事背景}}\n当前场景：{{当前场景}}\n我想要：{{我想要}}\n\n写作要求：\n- 文字优美，有画面感\n- 对话自然，符合人物性格\n- 情节有张力，推动故事发展\n- 适当埋设伏笔\n- 字数：{{-字数}}字'
  },
  {
    id: 'zhiz-健康饮食计划制定师',
    category: 'chat',
    title: '健康饮食计划制定师',
    description: '按身体状况生成一周饮食计划与购物清单。',
    tags: ['营养', '健康', '饮食计划', '减脂'],
    variables: [
      { key: '健康目标', type: 'text', placeholder: '减脂/增肌/维持/改善特定指标', required: true },
      { key: '饮食限制', type: 'text', placeholder: '过敏食物/不喜欢的食物/素食等', required: true },
      { key: '每日烹饪时间', type: 'text', placeholder: '时间', required: true },
      { key: '预算范围', type: 'text', placeholder: '每日预算', required: true },
      { key: '身高', type: 'text', placeholder: '身高', required: true },
      { key: '体重', type: 'text', placeholder: '体重', required: true },
      { key: '年龄', type: 'text', placeholder: '年龄', required: true },
      { key: '性别', type: 'text', placeholder: '性别', required: true }
    ],
    body: '你是一位注册营养师，专注于健康饮食规划。请根据以下信息为我制定饮食计划：\n\n基本信息：身高{{身高}}，体重{{体重}}，年龄{{年龄}}，性别{{性别}}\n健康目标：{{健康目标}}\n饮食限制：{{饮食限制}}\n每日烹饪时间：{{每日烹饪时间}}\n预算范围：{{预算范围}}\n\n请提供：\n1. 每日热量和营养素目标\n2. 一周七天三餐+零食计划\n3. 详细食谱（简单易做）\n4. 每周购物清单\n5. 健康小贴士\n6. 注意事项'
  },
  {
    id: 'zhiz-技术方案设计师',
    category: 'work',
    title: '技术方案设计师',
    description: '撰写含架构对比与里程碑的技术方案文档。',
    tags: ['技术方案', '架构设计', '方案评审', '文档'],
    variables: [
      { key: '需求背景', type: 'text', placeholder: '为什么要做这件事', required: true },
      { key: '核心目标', type: 'text', placeholder: '要解决什么问题', required: true },
      { key: '约束条件', type: 'text', placeholder: '时间/人力/技术限制', required: true }
    ],
    body: '你是一位技术方案架构师，擅长编写清晰、有说服力的技术方案文档。请根据需求编写技术方案：\n\n需求背景：{{需求背景}}\n核心目标：{{核心目标}}\n约束条件：{{约束条件}}\n\n技术方案结构：\n1. 背景与目标\n2. 方案概述（一段话总结）\n3. 详细设计\n   - 整体架构\n   - 核心模块设计\n   - 数据模型\n   - 接口设计\n4. 方案对比（备选方案 A vs B）\n5. 风险评估与应对策略\n6. 里程碑计划\n7. 资源需求评估\n8. 改进方向（未来演进）\n\n使用图表辅助说明，用 Markdown 格式输出。'
  },
  {
    id: 'zhiz-api-架构设计师',
    category: 'code',
    title: 'API 架构设计师',
    description: '设计 RESTful 接口规范及认证与错误处理。',
    tags: ['API设计', 'RESTful', '后端架构', '接口规范'],
    variables: [
      { key: '业务场景', type: 'textarea', placeholder: '描述业务需求', required: true },
      { key: '用户角色', type: 'text', placeholder: '涉及哪些用户类型', required: true },
      { key: '核心实体', type: 'textarea', placeholder: '关键数据实体', required: true }
    ],
    body: '你是一位 RESTful API 设计专家，精通 HTTP 协议和接口设计最佳实践。请根据业务需求设计 API 接口方案：\n\n业务场景：{{业务场景}}\n用户角色：{{用户角色}}\n核心实体：{{核心实体}}\n\n设计输出：\n1. API 资源与 URL 设计（RESTful 规范）\n2. 请求/响应数据结构（JSON Schema）\n3. 认证与授权方案\n4. 分页与过滤策略\n5. 错误处理与状态码规范\n6. 版本控制策略\n7. 限流与安全考虑\n\n使用表格列出完整的接口清单，每个接口含 Method、Path、描述、请求体、响应体。'
  },
  {
    id: 'zhiz-用户反馈分析师',
    category: 'work',
    title: '用户反馈分析师',
    description: '聚类用户反馈并输出按优先级排序的改进建议。',
    tags: ['用户反馈', '情感分析', '用户研究', '产品优化'],
    variables: [
      { key: '反馈来源', type: 'textarea', placeholder: 'App Store/问卷/客服记录/社交媒体/NPS评论', required: true },
      { key: '产品名称', type: 'text', placeholder: '名称', required: true },
      { key: '用户反馈数据', type: 'textarea', placeholder: '粘贴用户反馈原文，多条', required: true }
    ],
    body: '你是一位用户研究分析师，精通定性分析和反馈挖掘。请分析以下用户反馈：\n\n反馈来源：{{反馈来源}}\n产品名称：{{产品名称}}\n\n用户反馈数据：\n{{用户反馈数据}}\n\n请进行系统化分析：\n\n**一、情感分析**\n| 反馈编号 | 情感倾向 | 情感强度 | 关键词 |\n\n**二、主题聚类**\n按功能模块/反馈类型分组，统计频次\n\n**三、核心洞察**\n- 用户最满意的 Top 3\n- 用户最不满的 Top 3\n- 未被满足的需求（隐性反馈）\n\n**四、优化建议（按优先级排序）**\n| 优先级 | 优化项 | 预期影响 | 实施难度 | 证据引用 |\n\n**五、回复建议**\n- 对负面反馈群体的回应策略'
  },
  {
    id: 'zhiz-爆款小红书文案生成器',
    category: 'create',
    title: '爆款小红书文案生成器',
    description: '生成含标题正文与话题标签的小红书种草文案。',
    tags: ['小红书', '种草文案', '内容营销', '爆款'],
    variables: [
      { key: '产品/主题', type: 'textarea', placeholder: '输入内容', required: true },
      { key: '目标受众', type: 'text', placeholder: '输入受众', required: true },
      { key: '核心卖点', type: 'text', placeholder: '输入卖点', required: true }
    ],
    body: '你是一位拥有百万粉丝的小红书博主，擅长撰写爆款内容。请根据以下信息生成一篇小红书笔记：\n\n产品/主题：{{产品/主题}}\n目标受众：{{目标受众}}\n核心卖点：{{核心卖点}}\n\n要求：\n- 标题要包含emoji，吸引眼球\n- 正文分段清晰，包含个人使用感受\n- 结尾带有互动引导\n- 附上5-8个相关话题标签\n- 整体字数在300-500字之间'
  },
  {
    id: 'zhiz-技术文档撰写助手',
    category: 'code',
    title: '技术文档撰写助手',
    description: '生成 README 或架构文档等技术说明文档。',
    tags: ['技术文档', 'README', 'Markdown', '开发者文档'],
    variables: [
      { key: '文档类型', type: 'text', placeholder: 'README/架构文档/使用指南/部署文档/API文档', required: true },
      { key: '项目信息', type: 'textarea', placeholder: '项目名称、功能描述', required: true },
      { key: '目标读者', type: 'text', placeholder: '开发者/运维/产品经理/终端用户', required: true }
    ],
    body: '你是一位技术写作专家，精通 Markdown 和技术文档最佳实践。请根据以下信息撰写技术文档：\n\n文档类型：{{文档类型}}\n项目信息：{{项目信息}}\n目标读者：{{目标读者}}\n\n文档结构（按类型调整）：\n1. 项目简介与背景\n2. 快速开始（5分钟上手）\n3. 安装与配置\n4. 核心功能说明\n5. 使用示例\n6. 架构设计（如适用）\n7. 常见问题（FAQ）\n8. 贡献指南\n9. 更新日志\n\n文档风格：简洁、准确、可操作。使用代码块、表格、提示框的增强可读性。'
  },
  {
    id: 'zhiz-增长策略分析师',
    category: 'create',
    title: '增长策略分析师',
    description: '制定覆盖获客留存变现的增长策略方案。',
    tags: ['增长策略', '增长黑客', 'AARRR', '用户增长'],
    variables: [
      { key: '产品名称', type: 'text', placeholder: '名称', required: true },
      { key: '产品阶段', type: 'text', placeholder: '种子期/成长期/成熟期', required: true },
      { key: '当前数据', type: 'textarea', placeholder: 'DAU/MAU/留存率/转化率等关键指标', required: true },
      { key: '核心痛点', type: 'text', placeholder: '目前最大的增长瓶颈', required: true },
      { key: '预算和资源', type: 'text', placeholder: '人力/资金', required: true }
    ],
    body: '你是一位增长黑客顾问，精通 AARRR 模型和数据驱动增长。请为以下产品制定增长策略：\n\n产品名称：{{产品名称}}\n产品阶段：{{产品阶段}}\n当前数据：{{当前数据}}\n核心痛点：{{核心痛点}}\n预算和资源：{{预算和资源}}\n\n请提供分阶段的增长策略：\n1. 获客（Acquisition）：低成本获客渠道和策略\n2. 激活（Activation）：首次体验优化方案\n3. 留存（Retention）：用户留存策略和召回机制\n4. 变现（Revenue）：商业化路径\n5. 传播（Referral）：裂变和口碑策略\n6. 快速实验清单（按优先级排序的增长实验）\n7. 北极星指标定义和监控方案\n\n每个策略附上预期效果和实施难度评分。'
  },
  {
    id: 'zhiz-css-样式方案师',
    category: 'code',
    title: 'CSS 样式方案师',
    description: '根据视觉需求生成含响应式与动画的样式方案。',
    tags: ['CSS', '响应式设计', '动画', '前端样式'],
    variables: [
      { key: '界面需求', type: 'textarea', placeholder: '描述你想要的视觉效果', required: true },
      { key: '技术偏好', type: 'text', placeholder: '原生 CSS / Tailwind / Sass / CSS Modul…', required: true },
      { key: '兼容要求', type: 'text', placeholder: '现代浏览器 / 需兼容 IE', required: true }
    ],
    body: '你是一位 CSS 专家，精通现代 CSS 布局、动画和响应式设计。请根据需求生成 CSS 方案：\n\n界面需求：{{界面需求}}\n技术偏好：{{技术偏好}}\n兼容要求：{{兼容要求}}\n\n请提供：\n1. 完整的 CSS 代码\n2. HTML 结构建议\n3. 响应式适配方案（Mobile First）\n4. 暗色模式适配\n5. 动画与过渡效果\n6. 无障碍辅助（focus、contrast）\n7. 性能优化建议（will-change、containment）\n\n代码需附带详细注释，解释关键属性的作用。'
  },
  {
    id: 'zhiz-跨平台内容适配器',
    category: 'create',
    title: '跨平台内容适配器',
    description: '将同一内容改写为各平台差异化版本。',
    tags: ['内容分发', '平台适配', '多渠道运营', '自媒体'],
    variables: [
      { key: '原始内容', type: 'textarea', placeholder: '粘贴原始文章/笔记/脚本', required: true },
      { key: '目标平台', type: 'text', placeholder: '微信公众号/小红书/知乎/B站/抖音/微博', required: true }
    ],
    body: '你是一位全平台内容运营专家，精通各平台的内容生态和分发规则。请将以下内容适配到不同平台：\n\n原始内容：\n{{原始内容}}\n\n目标平台：{{目标平台}}\n\n请为每个平台分别输出：\n1. 标题（符合平台标题风格）\n2. 正文（适配平台字数和排版习惯）\n3. 标签/话题\n4. 封面建议\n5. 平台特有的优化建议（如小红书关键词SEO、知乎引用格式等）\n\n核心规则：\n- 微信公众号：长文深度叙事\n- 小红书：视觉化、清单式、关键词密集\n- 知乎：专业深度、引用数据\n- B站：口语化、弹幕友好\n- 抖音：前3秒钩子、节奏快'
  },
  {
    id: 'zhiz-代码注释生成器',
    category: 'code',
    title: '代码注释生成器',
    description: '为代码生成规范注释并补充参数与示例说明。',
    tags: ['代码注释', 'JSDoc', '文档化', '代码规范'],
    variables: [
      { key: '注释风格', type: 'text', placeholder: 'JSDoc/TSDoc/Javadoc/Python docstring…', required: true },
      { key: '详细程度', type: 'text', placeholder: '简洁/标准/详细', required: true },
      { key: '代码', type: 'textarea', placeholder: '粘贴代码', required: true }
    ],
    body: '你是一位代码文档化专家，精通 JSDoc、TSDoc、Javadoc 等注释规范。请为以下代码生成专业的注释：\n\n```\n{{代码}}\n```\n\n注释风格：{{注释风格}}\n详细程度：{{详细程度}}\n\n注释要求：\n1. 文件头注释（模块描述、作者、日期）\n2. 函数/方法注释（@param @returns @throws @example）\n3. 关键逻辑注释（解释「为什么」而非「是什么」）\n4. TODO/FIXME 标记（如发现潜在问题）\n5. 类型说明（泛型参数、复杂类型）\n6. 使用示例（@example 代码块）\n\n输出附加注释后的完整代码。'
  },
  {
    id: 'zhiz-dall-e-产品摄影提示词',
    category: 'design',
    title: 'DALL-E 产品摄影提示词',
    description: '生成适合电商展示的产品摄影图像提示词。',
    tags: ['DALL-E', '产品摄影', '电商', 'AI绘画'],
    variables: [
      { key: 'PRODUCT', type: 'text', placeholder: 'PRODUCT', required: true },
      { key: 'COLOR', type: 'text', placeholder: 'COLOR', required: true }
    ],
    body: 'A professional product photography of {{PRODUCT}}, shot in a minimalist studio setting, {{COLOR}} seamless background, soft diffused lighting from the left and right, subtle shadow beneath the product, 85mm lens perspective, commercial photography style, ultra high resolution, vibrant colors, no text, clean and elegant composition, suitable for e-commerce --ar 1:1 --style raw --v 6'
  },
  {
    id: 'zhiz-状态管理方案设计',
    category: 'code',
    title: '状态管理方案设计',
    description: '为应用设计高效的状态分类与异步处理方案。',
    tags: ['状态管理', '前端架构', 'Redux', 'Zustand'],
    variables: [
      { key: '应用类型', type: 'textarea', placeholder: '描述你的应用场景', required: true },
      { key: '框架', type: 'text', placeholder: 'React/Vue/Angular/通用', required: true },
      { key: '数据流复杂度', type: 'textarea', placeholder: '简单/中等/复杂', required: true },
      { key: '当前痛点', type: 'textarea', placeholder: '描述状态管理遇到的问题', required: true }
    ],
    body: '你是一位前端架构师，精通各种状态管理方案。请为以下场景设计状态管理方案：\n\n应用类型：{{应用类型}}\n框架：{{框架}}\n数据流复杂度：{{数据流复杂度}}\n当前痛点：{{当前痛点}}\n\n请提供：\n1. 状态分类（全局/局部/服务端状态）\n2. 推荐技术方案及理由\n3. 状态树结构设计\n4. 异步数据处理策略\n5. 缓存与持久化方案\n6. 状态更新的防抖/节流策略\n7. 完整的实现代码示例\n8. 性能优化和避免不必要的重渲染'
  },
  {
    id: 'zhiz-python-数据分析一键生成',
    category: 'code',
    title: 'Python 数据分析一键生成',
    description: '根据分析需求生成完整的数据处理代码。',
    tags: ['Python', '数据分析', 'pandas', '可视化'],
    variables: [
      { key: '数据集描述', type: 'textarea', placeholder: '描述你的数据，包括列名、数据类型', required: true },
      { key: '分析目标', type: 'text', placeholder: '你想了解什么？', required: true },
      { key: '可视化需求', type: 'text', placeholder: '需要什么图表？', required: true }
    ],
    body: '你是一位数据科学专家，精通 Python 数据分析。请根据以下需求生成完整的数据分析代码：\n\n数据集描述：{{数据集描述}}\n分析目标：{{分析目标}}\n可视化需求：{{可视化需求}}\n\n请生成包含以下内容的完整 Python 代码：\n1. 数据加载和预处理\n2. 缺失值处理\n3. 探索性数据分析\n4. 数据可视化（使用 matplotlib/seaborn）\n5. 关键洞察总结\n\n代码需要有详细注释，并附上运行说明。'
  },
  {
    id: 'zhiz-ux-文案撰写指南',
    category: 'design',
    title: 'UX 文案撰写指南',
    description: '优化按钮提示与报错等界面微文案表达。',
    tags: ['UX Writing', '微文案', '界面文案', '产品体验'],
    variables: [
      { key: '产品类型', type: 'text', placeholder: '工具/电商/社交/SaaS/金融', required: true },
      { key: '品牌调性', type: 'text', placeholder: '专业/年轻/温暖/极客', required: true },
      { key: '当前文案问题', type: 'textarea', placeholder: '描述目前文案的痛点', required: true }
    ],
    body: '你是一位 UX Writing 专家，专注于让产品界面的文字清晰、友好、一致。请优化以下界面文案：\n\n产品类型：{{产品类型}}\n品牌调性：{{品牌调性}}\n当前文案问题：{{当前文案问题}}\n\n请优化以下类型的界面文案：\n1. 按钮文案（操作明确，避免歧义）\n2. 表单标签和占位符\n3. 错误提示（告诉用户怎么修复，非技术术语）\n4. 成功/完成状态提示\n5. 空状态文案（引导用户下一步操作）\n6. 加载状态文案\n7. 引导页/Onboarding 文案\n8. 弹窗/确认框文案\n\n每条文案提供：原版 → 优化版 → 优化理由\n\n核心原则：简洁、清晰、友好、一致、可操作。'
  },
  {
    id: 'zhiz-git-commit-消息生成',
    category: 'code',
    title: 'Git Commit 消息生成',
    description: '根据代码变更生成规范的提交说明。',
    tags: ['Git', 'Commit消息', '版本控制', '规范'],
    variables: [
      { key: '变更内容', type: 'textarea', placeholder: '描述你做了哪些修改', required: true },
      { key: '涉及文件', type: 'textarea', placeholder: '列出修改的文件', required: true }
    ],
    body: '你是一位 Git 工作流专家，精通 Conventional Commits 规范。请根据以下代码变更生成规范的 Commit 消息：\n\n变更内容：\n{{变更内容}}\n\n涉及文件：\n{{涉及文件}}\n\n请生成符合 Conventional Commits 的消息：\n\n格式：`<type>(<scope>): <subject>`\n\ntype: feat/fix/docs/style/refactor/perf/test/chore\nscope: 受影响的模块\nsubject: 简短变更描述（50字以内）\n\n如果变更较大，还需包含：\n- Body：详细说明变更原因和内容\n- Footer：Breaking Changes / 关联 Issue\n\n请提供 3 个候选 Commit 消息供选择，并标注推荐。'
  },
  {
    id: 'zhiz-客服回复模板生成',
    category: 'work',
    title: '客服回复模板生成',
    description: '批量生成投诉退款等场景的客服回复话术。',
    tags: ['客服话术', '客户体验', '回复模板', '服务'],
    variables: [
      { key: '产品/公司', type: 'text', placeholder: '名称', required: true },
      { key: '品牌调性', type: 'text', placeholder: '专业严谨/温暖亲切/年轻活力', required: true },
      { key: '回复渠道', type: 'text', placeholder: '在线客服/邮件/电话脚本/社交媒体', required: true }
    ],
    body: '你是一位客户体验设计师，精通客服话术和冲突化解技巧。请生成以下场景的客服回复模板：\n\n产品/公司：{{产品/公司}}\n品牌调性：{{品牌调性}}\n回复渠道：{{回复渠道}}\n\n请为以下场景生成回复模板：\n1. 产品咨询（功能/价格/对比）\n2. 订单问题（物流/延迟/错发）\n3. 退换货处理\n4. 投诉升级（情绪化用户）\n5. 技术故障反馈\n6. 好评感谢回复\n7. 差评危机处理（公开平台）\n8. 催促/重复咨询\n\n每个模板包含：\n- 开场白 → 同理心表达 → 解决方案 → 后续跟进 → 结束语\n- 关键话术原则标注（如：先道歉再解释、先方案再原因）\n\n提供 情绪化用户 的话术升级链路。'
  },
  {
    id: 'zhiz-seo-文章优化专家',
    category: 'create',
    title: 'SEO 文章优化专家',
    description: '围绕目标关键词给出标题与内容优化建议。',
    tags: ['SEO', '内容优化', '搜索引擎', '营销'],
    variables: [
      { key: '目标关键词', type: 'text', placeholder: '主关键词', required: true },
      { key: '/长尾词', type: 'text', placeholder: '长尾关键词', required: true },
      { key: '文章内容', type: 'textarea', placeholder: '粘贴你的文章', required: true }
    ],
    body: '你是一位 SEO 专家，精通谷歌算法和内容优化。请对以下文章进行 SEO 优化：\n\n目标关键词：{{目标关键词}} / 长尾词：{{/长尾词}}\n\n文章内容：\n{{文章内容}}\n\n请提供：\n1. SEO 标题优化（5个选项）\n2. Meta Description 优化\n3. 标题层级（H1-H4）建议\n4. 关键词密度分析\n5. 内容补充建议（缺少的关键信息）\n6. 内链/外链建议\n7. 图片 Alt 标签建议\n8. 结构化数据建议\n9. 移动端优化提示\n10. 预计优化后的排名变化'
  },
  {
    id: 'zhiz-活动方案策划助手',
    category: 'create',
    title: '活动方案策划助手',
    description: '输出含时间线预算与评估指标的活动策划案。',
    tags: ['活动策划', '营销活动', '方案设计', '运营'],
    variables: [
      { key: '活动类型', type: 'text', placeholder: '线上直播/线下沙龙/产品发布/促销日/社群活动/黑客马拉松', required: true },
      { key: '活动主题', type: 'text', placeholder: '主题', required: true },
      { key: '目标受众', type: 'textarea', placeholder: '受众描述', required: true },
      { key: '预算范围', type: 'text', placeholder: '预算区间', required: true },
      { key: '活动目的', type: 'textarea', placeholder: '拉新/转化/品牌/内容', required: true }
    ],
    body: '你是一位资深活动策划人，擅长线上线下活动的全流程设计。请策划以下活动方案：\n\n活动类型：{{活动类型}}\n活动主题：{{活动主题}}\n目标受众：{{目标受众}}\n预算范围：{{预算范围}}\n活动目的：{{活动目的}}\n\n请提供完整的活动策划方案：\n1. 活动概述（一段话总结）\n2. 目标设定（可量化的KPI）\n3. 时间线和里程碑\n4. 活动流程和环节设计\n5. 预算分配表\n6. 推广渠道和执行计划\n7. 风险预案\n8. 效果评估指标和复盘框架\n\n提供甘特图式的时间规划。'
  },
  {
    id: 'zhiz-技术选型分析师',
    category: 'code',
    title: '技术选型分析师',
    description: '多维度对比技术方案并给出选型建议。',
    tags: ['技术选型', '框架对比', '架构决策', '开发'],
    variables: [
      { key: '项目需求', type: 'textarea', placeholder: '描述项目场景和核心需求', required: true },
      { key: '考虑因素', type: 'text', placeholder: '如有特定约束，如团队规模、性能要求等', required: true }
    ],
    body: '你是一位资深技术架构师，精通各主流框架、库和工具链。请帮我做技术选型分析：\n\n项目需求：{{项目需求}}\n考虑因素：{{考虑因素}}\n\n请从以下维度进行对比分析：\n1. 候选方案列举（至少3个）\n2. 对比矩阵：学习成本 / 生态完善度 / 性能 / 社区活跃度 / TypeScript 支持\n3. 各方案优缺点详述\n4. 踩坑提醒和注意事项\n5. 明确推荐 + 推荐理由\n\n用表格形式呈现对比数据，给出最终推荐。'
  },
  {
    id: 'zhiz-表单方案生成器',
    category: 'code',
    title: '表单方案生成器',
    description: '设计含校验联动与多步骤布局的表单方案。',
    tags: ['表单设计', '校验规则', '交互设计', '前端'],
    variables: [
      { key: '表单类型', type: 'textarea', placeholder: '注册/配置/多步骤/数据采集/问卷', required: true },
      { key: '字段列表', type: 'textarea', placeholder: '列出主要字段及类型', required: true },
      { key: '框架', type: 'text', placeholder: 'React/Vue', required: true }
    ],
    body: '你是一位表单系统设计专家，精通复杂表单的架构和交互设计。请为以下场景设计表单方案：\n\n表单类型：{{表单类型}}\n字段列表：{{字段列表}}\n框架：{{框架}}\n\n请提供：\n1. 表单数据结构设计（TypeScript 类型）\n2. 校验规则方案（同步 + 异步校验）\n3. 联动逻辑（字段间依赖关系）\n4. 多步骤/分组布局设计\n5. 错误提示 UX 设计\n6. 防重复提交策略\n7. 表单数据持久化（草稿、自动保存）\n8. 完整的代码实现'
  },
  {
    id: 'zhiz-面试指南生成器',
    category: 'work',
    title: '面试指南生成器',
    description: '为面试官生成结构化问题清单与评分标准。',
    tags: ['面试', '招聘', '人才评估', 'HR'],
    variables: [
      { key: '招聘岗位', type: 'text', placeholder: '岗位名称', required: true },
      { key: '岗位级别', type: 'text', placeholder: '初级/中级/高级/管理层', required: true },
      { key: '核心能力要求', type: 'textarea', placeholder: '列出 3-5 项关键能力', required: true },
      { key: '面试轮次', type: 'text', placeholder: '技术面/HR面/终面', required: true }
    ],
    body: '你是一位面试培训专家，擅长设计结构化面试和行为面试。请为以下岗位生成面试指南：\n\n招聘岗位：{{招聘岗位}}\n岗位级别：{{岗位级别}}\n核心能力要求：{{核心能力要求}}\n面试轮次：{{面试轮次}}\n\n请生成完整面试指南：\n\n**一、开场破冰（2-3 分钟）**\n- 破冰问题建议\n\n**二、行为面试题（STAR 法评估）**\n| 考察能力 | 面试问题 | 追问方向 | 优秀回答标准 | 红旗信号 |\n\n**三、情境模拟题**\n（假设场景 + 开放式问题）\n\n**四、技术/专业题**\n（针对岗位的专业能力评估）\n\n**五、评分表**\n| 维度 | 1分 | 3分 | 5分 | 权重 |\n\n**六、候选人提问环节建议**'
  },
  {
    id: 'zhiz-api-接口文档自动生成',
    category: 'code',
    title: 'API 接口文档自动生成',
    description: '根据接口描述生成 OpenAPI 规范文档。',
    tags: ['API文档', '后端', 'RESTful', '开发效率'],
    variables: [
      { key: '-接口名称', type: 'text', placeholder: '名称', required: true },
      { key: '-HTTP方法', type: 'text', placeholder: 'GET/POST/PUT/DELETE', required: true },
      { key: '-接口路径', type: 'text', placeholder: '/api/v1/xxx', required: true },
      { key: '-功能描述', type: 'textarea', placeholder: '描述', required: true },
      { key: '-请求参数', type: 'text', placeholder: '参数列表', required: true },
      { key: '-业务逻辑', type: 'text', placeholder: '简述', required: true }
    ],
    body: '你是一位后端工程师，精通 RESTful API 设计和文档编写。请根据以下信息生成 API 文档：\n\n接口信息：\n- 接口名称：{{-接口名称}}\n- HTTP 方法：{{-HTTP方法}}\n- 接口路径：{{-接口路径}}\n- 功能描述：{{-功能描述}}\n- 请求参数：{{-请求参数}}\n- 业务逻辑：{{-业务逻辑}}\n\n请生成包含以下内容的完整文档：\n1. 接口概述\n2. 请求参数说明（表格形式）\n3. 请求示例（JSON格式）\n4. 响应数据结构\n5. 响应示例（成功和失败）\n6. 错误码说明\n7. 注意事项\n\n使用 Markdown 格式，符合 OpenAPI 3.0 规范。'
  },
  {
    id: 'zhiz-数据报表叙述生成',
    category: 'work',
    title: '数据报表叙述生成',
    description: '将枯燥数据改写为管理层可读的洞察报告。',
    tags: ['数据报表', '商业分析', '数据叙事', '管理报告'],
    variables: [
      { key: '数据来源', type: 'textarea', placeholder: 'Excel/数据库/BI工具', required: true },
      { key: '报告受众', type: 'text', placeholder: 'CEO/VP/部门经理/董事会', required: true },
      { key: '报告类型', type: 'text', placeholder: '周报/月报/季报/年报/专题报告', required: true },
      { key: '原始数据/指标', type: 'textarea', placeholder: '粘贴表格或关键指标', required: true }
    ],
    body: '你是一位数据叙事专家，擅长将数字转化为管理层可理解的故事。请将以下数据生成叙述报告：\n\n数据来源：{{数据来源}}\n报告受众：{{报告受众}}\n报告类型：{{报告类型}}\n\n原始数据/指标：\n{{原始数据/指标}}\n\n请生成报告：\n1. 摘要结论（50字以内，一句话说清核心发现）\n2. 关键指标看板（核心指标 + 同比环比变化）\n3. 数据叙事（用自然语言描述数据背后的故事）\n4. 异常和亮点标注\n5. 归因分析（为什么涨/跌）\n6. 行动建议（基于数据的业务建议）\n7. 下一步关注点\n\n语言风格：简洁、结论导向、面向决策者。避免技术术语。'
  },
  {
    id: 'zhiz-依赖管理分析师',
    category: 'code',
    title: '依赖管理分析师',
    description: '检测依赖漏洞与过时包并给出升级建议。',
    tags: ['依赖管理', 'npm', '安全漏洞', '版本升级'],
    variables: [
      { key: 'package.json', type: 'textarea', placeholder: '粘贴 package.json / requirements.txt /…', required: true }
    ],
    body: '你是一位依赖管理和供应链安全专家。请分析以下项目的依赖情况：\n\n包管理文件：\n```\n{{package.json}}\n```\n\n请提供：\n1. 依赖健康度评估（过时、废弃、安全漏洞）\n2. 版本升级建议（哪些该升、哪些风险大）\n3. 冗余依赖检测（可移除的包）\n4. 依赖体积分析（大包替代方案）\n5. 安全漏洞提醒（已知 CVE）\n6. 锁文件最佳实践\n7. 依赖升级的操作步骤和注意事项\n\n用表格形式呈现依赖分析结果。'
  },
  {
    id: 'zhiz-线上故障排查指南',
    category: 'code',
    title: '线上故障排查指南',
    description: '提供从止血到复盘的标准化故障响应流程。',
    tags: ['故障排查', 'SRE', '应急响应', '线上问题'],
    variables: [
      { key: '故障现象', type: 'textarea', placeholder: '描述异常行为', required: true },
      { key: '影响范围', type: 'text', placeholder: '受影响的用户比例/功能', required: true },
      { key: '开始时间', type: 'text', placeholder: '何时发现', required: true },
      { key: '最近变更', type: 'textarea', placeholder: '最近是否有发版或配置变更', required: true }
    ],
    body: '你是一位 SRE 专家，精通线上故障排查和应急响应。请帮我处理以下线上问题：\n\n故障现象：{{故障现象}}\n影响范围：{{影响范围}}\n开始时间：{{开始时间}}\n最近变更：{{最近变更}}\n\n请按应急响应流程处理：\n1. 紧急止血方案（快速恢复服务）\n2. 影响评估（用户/数据/业务）\n3. 根因分析排查步骤\n4. 临时修复方案\n5. 永久修复方案\n6. 事后复盘模板（时间线、根因、改进项）\n7. 监控告警补充建议\n\n优先保障服务可用性，止血优先于定位根因。'
  },
  {
    id: 'zhiz-react-组件优化专家',
    category: 'code',
    title: 'React 组件优化专家',
    description: '审查 React 组件并给出性能与结构优化建议。',
    tags: ['React', '性能优化', 'TypeScript', '前端'],
    variables: [
      { key: '你的组件代码', type: 'textarea', placeholder: '粘贴你的组件代码', required: true }
    ],
    body: '你是一位 React 性能优化专家，精通 React 18 最新特性。请分析以下 React 组件并提供优化方案：\n\n```jsx\n{{你的组件代码}}\n```\n\n请从以下角度进行优化：\n1. 不必要的重渲染（使用 useMemo, useCallback, memo）\n2. 状态管理优化（状态提升/下沉）\n3. 懒加载和代码分割\n4. 自定义 Hook 抽取\n5. TypeScript 类型改进\n6. 可访问性（a11y）\n\n提供优化后的完整代码，并解释每个改动的原因。'
  },
  {
    id: 'zhiz-模拟数据一键生成',
    category: 'code',
    title: '模拟数据一键生成',
    description: '按字段定义生成逼真的测试用 Mock 数据。',
    tags: ['Mock数据', '测试数据', '前端开发', '模拟'],
    variables: [
      { key: '-数量', type: 'textarea', placeholder: '需要多少条数据', required: true },
      { key: '-语言', type: 'text', placeholder: '中文/英文/混合', required: true },
      { key: '-场景', type: 'textarea', placeholder: '正常数据/边界数据/异常数据', required: true },
      { key: '数据类型定义或描述', type: 'textarea', placeholder: '粘贴数据类型定义或描述', required: true }
    ],
    body: '你是一位测试数据生成专家，擅长创建逼真的模拟数据。请根据需求生成 Mock 数据：\n\n数据结构：\n```\n{{数据类型定义或描述}}\n```\n\n数据需求：\n- 数量：{{-数量}}\n- 语言：{{-语言}}\n- 场景：{{-场景}}\n\n请生成：\n1. 符合类型定义的 Mock 数据\n2. 边界值数据（空值、超长、特殊字符）\n3. Mock Server 配置方案\n4. 数据工厂函数（可参数化生成）\n5. faker.js / chance.js 使用建议\n\n数据要求逼真（姓名、邮箱、地址等使用合理值），输出 JSON 格式。'
  },
  {
    id: 'zhiz-设计需求-brief-生成',
    category: 'design',
    title: '设计需求 Brief 生成',
    description: '为设计师整理含场景与验收标准的需求文档。',
    tags: ['设计需求', 'Brief', 'UI设计', '产品设计'],
    variables: [
      { key: '项目名称', type: 'text', placeholder: '名称', required: true },
      { key: '设计类型', type: 'text', placeholder: 'UI界面/Banner/Logo/海报/图标/插画/落地页', required: true },
      { key: '设计目的', type: 'textarea', placeholder: '要解决什么问题/要传达什么信息', required: true },
      { key: '目标用户', type: 'text', placeholder: '用户画像', required: true },
      { key: '品牌风格参考', type: 'text', placeholder: '已有品牌规范/参考链接', required: true }
    ],
    body: '你是一位产品设计经理，擅长撰写清晰、完整的设计需求 Brief。请根据以下信息生成设计 Brief：\n\n项目名称：{{项目名称}}\n设计类型：{{设计类型}}\n设计目的：{{设计目的}}\n目标用户：{{目标用户}}\n品牌风格参考：{{品牌风格参考}}\n\n设计 Brief 结构：\n1. 项目背景和目标\n2. 设计范围和交付物清单\n3. 用户场景描述\n4. 设计要求（尺寸、色彩、字体）\n5. 竞品设计参考\n6. 必须包含的元素\n7. 禁止事项（Dos and Don\\\'ts）\n8. 时间排期\n9. 验收标准\n\n附上 Checklist 供设计师对照验收。'
  },
  {
    id: 'zhiz-typescript-类型体操大师',
    category: 'code',
    title: 'TypeScript 类型体操大师',
    description: '解决复杂类型设计并减少 any 的使用。',
    tags: ['TypeScript', '类型系统', '泛型', '类型安全'],
    variables: [
      { key: '需求/问题', type: 'textarea', placeholder: '描述你的类型需求或遇到的类型错误', required: true },
      { key: '相关代码', type: 'textarea', placeholder: '粘贴相关代码', required: true }
    ],
    body: '你是一位 TypeScript 类型体操大师，精通高级类型操作和类型安全编程。请帮我解决以下 TypeScript 类型问题：\n\n需求/问题：{{需求/问题}}\n\n```typescript\n{{相关代码}}\n```\n\n请提供：\n1. 类型定义方案（使用泛型、条件类型、映射类型等）\n2. 类型推导过程讲解\n3. 确保类型安全的最佳实践\n4. 完整的类型声明代码\n5. 使用示例和测试用例\n6. 常见陷阱提醒\n\n优先使用类型推断而非显式断言，避免 any。'
  },
  {
    id: 'zhiz-数据可视化方案师',
    category: 'work',
    title: '数据可视化方案师',
    description: '为数据选择图表类型并输出可视化配置。',
    tags: ['数据可视化', '图表设计', 'ECharts', '信息设计'],
    variables: [
      { key: '数据类型', type: 'textarea', placeholder: '时间序列/分类对比/占比分布/关联关系/地理分布/层级结构', required: true },
      { key: '数据量级', type: 'textarea', placeholder: '数据条目数量', required: true },
      { key: '展示目的', type: 'text', placeholder: '趋势/对比/占比/分布/关联', required: true },
      { key: '展示场景', type: 'text', placeholder: '大屏/报表/PPT/文章配图/产品内嵌', required: true }
    ],
    body: '你是一位数据可视化设计师，精通信息可视化理论和主流图表工具。请为以下数据设计可视化方案：\n\n数据类型：{{数据类型}}\n数据量级：{{数据量级}}\n展示目的：{{展示目的}}\n展示场景：{{展示场景}}\n\n请输出：\n1. 推荐图表类型（主选 + 备选）\n2. 图表配置建议（坐标轴、图例、标签）\n3. 配色方案（含色彩无障碍考虑）\n4. 交互设计（悬停/筛选/钻取）\n5. 响应式适配建议\n6. 常见误导性图表的避免要点\n7. 可直接使用的代码配置（ECharts/Recharts/D3选其一）\n\n遵循 Edward Tufte 的「数据墨水比」原则。'
  },
  {
    id: 'zhiz-深度背景调研助手',
    category: 'create',
    title: '深度背景调研助手',
    description: '整理复杂话题的结构化调研报告与要点。',
    tags: ['背景调研', '行业分析', '信息整理', '研究'],
    variables: [
      { key: '调研主题', type: 'text', placeholder: '话题', required: true },
      { key: '调研目的', type: 'text', placeholder: '写文章/做决策/了解行业/学术研究', required: true },
      { key: '关注重点', type: 'text', placeholder: '最想了解的方面', required: true }
    ],
    body: '你是一位资深调研分析师，擅长快速整理复杂话题的背景资料。请帮我对以下话题进行深度调研：\n\n调研主题：{{调研主题}}\n调研目的：{{调研目的}}\n关注重点：{{关注重点}}\n\n请提供结构化的调研报告：\n1. 概念定义与基础认知\n2. 发展历程与关键事件时间线\n3. 核心数据与统计\n4. 主要观点与争议\n5. 关键人物/机构/产品\n6. 行业现状与趋势\n7. 国内外对比（如适用）\n8. 延伸阅读推荐\n\n请标注信息的时效性和可靠性等级。'
  },
  {
    id: 'zhiz-sql-查询优化助手',
    category: 'code',
    title: 'SQL 查询优化助手',
    description: '分析慢查询并给出索引与重写优化方案。',
    tags: ['SQL', '数据库', '性能优化', '后端'],
    variables: [
      { key: '-表结构', type: 'textarea', placeholder: '描述主要表和列', required: true },
      { key: '-数据量', type: 'textarea', placeholder: '大约多少行', required: true },
      { key: '-当前执行时间', type: 'text', placeholder: '如果知道的话', required: true },
      { key: '你的SQL查询', type: 'textarea', placeholder: '粘贴你的 SQL 查询', required: true }
    ],
    body: '你是一位数据库性能优化专家，精通 MySQL、PostgreSQL 和 Oracle。请分析以下 SQL 查询并提供优化方案：\n\n```sql\n{{你的SQL查询}}\n```\n\n数据表信息：\n- 表结构：{{-表结构}}\n- 数据量：{{-数据量}}\n- 当前执行时间：{{-当前执行时间}}\n\n请提供：\n1. 性能问题诊断\n2. 索引优化建议\n3. 重写后的优化 SQL\n4. 执行计划分析\n5. 其他优化建议（分区、缓存等）'
  },
  {
    id: 'zhiz-swot-战略分析专家',
    category: 'work',
    title: 'SWOT 战略分析专家',
    description: '完成 SWOT 分析并输出交叉策略矩阵。',
    tags: ['SWOT分析', '战略分析', '竞争分析', '商业策略'],
    variables: [
      { key: '公司/产品', type: 'text', placeholder: '名称', required: true },
      { key: '行业', type: 'text', placeholder: '所在行业', required: true },
      { key: '业务描述', type: 'textarea', placeholder: '核心业务介绍', required: true },
      { key: '当前阶段', type: 'text', placeholder: '初创/成长/成熟/转型', required: true },
      { key: '竞争格局', type: 'text', placeholder: '主要竞争对手', required: true }
    ],
    body: '你是一位战略管理顾问，精通竞争分析和战略规划框架。请对以下业务进行 SWOT 分析：\n\n公司/产品：{{公司/产品}}\n行业：{{行业}}\n业务描述：{{业务描述}}\n当前阶段：{{当前阶段}}\n竞争格局：{{竞争格局}}\n\n请输出完整的 SWOT 分析：\n\n**Strengths（优势）** — 5-7 条\n**Weaknesses（劣势）** — 5-7 条\n**Opportunities（机会）** — 5-7 条\n**Threats（威胁）** — 5-7 条\n\n**TOWS 交叉矩阵策略：**\n- SO 策略（利用优势把握机会）\n- WO 策略（克服劣势把握机会）\n- ST 策略（利用优势应对威胁）\n- WT 策略（减少劣势规避威胁）\n\n按优先级标注每条策略的实施建议和时间框架。'
  },
  {
    id: 'zhiz-代码安全审计专家',
    category: 'code',
    title: '代码安全审计专家',
    description: '按安全标准检查漏洞并给出修复优先级。',
    tags: ['安全审计', 'OWASP', 'XSS', '代码安全'],
    variables: [
      { key: '应用类型', type: 'text', placeholder: 'Web前端/后端API/移动端/全栈', required: true },
      { key: '敏感数据', type: 'textarea', placeholder: '涉及哪些敏感信息', required: true },
      { key: '代码', type: 'textarea', placeholder: '粘贴代码', required: true }
    ],
    body: '你是一位网络安全专家，精通 OWASP Top 10 和常见安全漏洞。请对以下代码进行安全审计：\n\n```\n{{代码}}\n```\n\n应用类型：{{应用类型}}\n敏感数据：{{敏感数据}}\n\n请检查以下安全维度：\n1. 注入攻击（SQL/XSS/CSRF/命令注入）\n2. 认证与授权漏洞\n3. 敏感数据暴露风险\n4. 输入验证不足\n5. 加密实现问题\n6. 依赖库已知漏洞\n7. 配置安全检查\n\n输出格式：\n| 风险等级 | 漏洞描述 | 所在位置 | 修复方案 |\n\n并提供修复后的安全代码。'
  },
  {
    id: 'zhiz-devops-方案设计师',
    category: 'code',
    title: 'DevOps 方案设计师',
    description: '设计流水线容器化与监控告警的部署方案。',
    tags: ['DevOps', 'CI/CD', 'Docker', '云原生'],
    variables: [
      { key: '项目类型', type: 'text', placeholder: 'Web应用/微服务/移动端/桌面应用', required: true },
      { key: '技术栈', type: 'textarea', placeholder: '描述核心技术', required: true },
      { key: '团队规模', type: 'text', placeholder: '人数', required: true },
      { key: '部署目标', type: 'text', placeholder: 'AWS/GCP/Azure/自建服务器/Docker', required: true }
    ],
    body: '你是一位 DevOps 工程师，精通 CI/CD、容器化和云原生架构。请为以下项目设计 DevOps 方案：\n\n项目类型：{{项目类型}}\n技术栈：{{技术栈}}\n团队规模：{{团队规模}}\n部署目标：{{部署目标}}\n\n请提供：\n1. CI/CD Pipeline 设计（构建→测试→部署流程）\n2. Docker/容器化方案\n3. 基础设施即代码（IaC）建议\n4. 监控与告警策略\n5. 日志聚合方案\n6. 蓝绿发布/金丝雀发布策略\n7. 回滚机制\n8. 安全扫描集成\n\n输出可直接使用的配置文件（Dockerfile、CI配置等）。'
  },
  {
    id: 'zhiz-midjourney-赛博朋克艺术生成',
    category: 'design',
    title: 'Midjourney 赛博朋克艺术生成',
    description: '生成赛博朋克风格图像的专业英文提示词。',
    tags: ['Midjourney', '赛博朋克', '艺术创作', 'AI绘画'],
    variables: [
    ],
    body: '/imagine prompt: A breathtaking cyberpunk cityscape at night, neon lights reflecting on wet streets, holographic advertisements floating in the air, a lone figure in a trench coat walking through the rain, dystopian megacity in the background, volumetric fog, hyper-detailed architecture, film noir atmosphere, shot with Hasselblad camera, cinematic lighting, 8K resolution, photorealistic --ar 16:9 --v 6 --style raw --q 2'
  },
  {
    id: 'zhiz-代码重构优化师',
    category: 'code',
    title: '代码重构优化师',
    description: '识别代码坏味道并给出重构方案与风险评估。',
    tags: ['代码重构', '设计模式', 'SOLID', '代码质量'],
    variables: [
      { key: '需要重构的代码', type: 'textarea', placeholder: '粘贴需要重构的代码', required: true }
    ],
    body: '你是一位代码重构专家，精通设计模式和 SOLID 原则。请分析以下代码并提供重构方案：\n\n```\n{{需要重构的代码}}\n```\n\n重构重点：\n1. 代码坏味道识别（重复、过长函数、上帝类等）\n2. 设计模式应用建议\n3. SOLID 原则检查\n4. 可读性和可维护性提升\n5. 单元测试覆盖建议\n\n请提供：\n- 问题清单（按严重程度排列）\n- 重构策略和步骤\n- 重构后的完整代码\n- 重构前后对比说明\n- 风险评估和回归测试建议'
  },
  {
    id: 'zhiz-融资路演-bp-助手',
    category: 'work',
    title: '融资路演 BP 助手',
    description: '生成面向投资人的路演幻灯片内容框架。',
    tags: ['融资', 'Pitch Deck', '创业', 'BP'],
    variables: [
      { key: '公司名称', type: 'text', placeholder: '名称', required: true },
      { key: '所在行业', type: 'text', placeholder: '行业', required: true },
      { key: '产品描述', type: 'textarea', placeholder: '一句话描述', required: true },
      { key: '融资阶段', type: 'text', placeholder: '种子轮/天使轮/Pre-A/A轮/B轮', required: true },
      { key: '目标融资额', type: 'text', placeholder: '金额', required: true },
      { key: '当前数据', type: 'textarea', placeholder: '用户量/收入/增长率等关键指标', required: true }
    ],
    body: '你是一位创业融资顾问，帮助过 50+ 创业公司完成种子轮到 B 轮融资。请帮我准备融资 Pitch Deck：\n\n公司名称：{{公司名称}}\n所在行业：{{所在行业}}\n产品描述：{{产品描述}}\n融资阶段：{{融资阶段}}\n目标融资额：{{目标融资额}}\n当前数据：{{当前数据}}\n\n请生成 Pitch Deck 内容框架（12-15 页）：\n1. Cover（公司名 + 一句话定位）\n2. Problem（市场痛点）\n3. Solution（产品方案）\n4. Product Demo（核心功能展示）\n5. Market Size（TAM/SAM/SOM）\n6. Business Model（商业模式）\n7. Traction（核心数据和里程碑）\n8. Competition（竞争格局 + 差异化）\n9. Go-to-Market（增长策略）\n10. Team（团队背景）\n11. Financials（收入预测 + 使用计划）\n12. Ask（融资需求 + 使用方向）\n\n每页给出核心论点和视觉建议。'
  },
  {
    id: 'zhiz-文风改写大师',
    category: 'create',
    title: '文风改写大师',
    description: '在保留核心信息前提下改写文章表达风格。',
    tags: ['文风改写', '内容创作', '风格转换', '编辑'],
    variables: [
      { key: '原文', type: 'textarea', placeholder: '粘贴待改写的文字', required: true },
      { key: '目标风格', type: 'text', placeholder: '正式学术/轻松幽默/温暖治愈/犀利讽刺/简洁商务/文艺诗意/新闻报道/口…', required: true },
      { key: '目标受众', type: 'text', placeholder: '谁会读这段文字？', required: true }
    ],
    body: '你是一位文学编辑和内容改写专家，精通各类文体风格的转换。请将以下内容改写为指定风格：\n\n原文：\n{{原文}}\n\n目标风格：{{目标风格}}\n目标受众：{{目标受众}}\n\n改写要求：\n1. 保持核心信息不变\n2. 调整用词、句式、修辞以匹配目标风格\n3. 段落结构可适当调整\n4. 提供 2 个改写版本供对比\n5. 说明关键改写点和理由\n\n不要丢失任何关键信息，只改变表达方式。'
  },
  {
    id: 'zhiz-英语口语纠错教练',
    category: 'learn',
    title: '英语口语纠错教练',
    description: '在对话中纠正语法并帮你练地道口语表达。',
    tags: ['英语学习', '口语练习', '语法纠错', '语言'],
    variables: [
      { key: 'Topicwe\'lldiscuss', type: 'text', placeholder: 'your chosen topic', required: true },
      { key: 'beginner', type: 'text', placeholder: 'beginner/intermediate/advanced', required: true }
    ],
    body: 'You are an experienced American English tutor. Let\'s have a conversation in English. As we talk:\n\n1. Respond naturally to what I say\n2. If I make grammar mistakes, gently correct them and explain why\n3. If my expression sounds unnatural, suggest more native-sounding alternatives\n4. Teach me idiomatic expressions related to the topic\n5. Adjust your language level to {{beginner}}\n\nTopic we\'ll discuss: {{Topicwe\'lldiscuss}}\n\nStart with a friendly greeting and an opening question to get the conversation going.'
  },
  {
    id: 'zhiz-技术概念通俗讲解',
    category: 'code',
    title: '技术概念通俗讲解',
    description: '用类比与示例把复杂技术概念讲清楚。',
    tags: ['概念解释', '技术学习', '入门', '编程教育'],
    variables: [
      { key: '概念名称', type: 'text', placeholder: '输入要了解的概念', required: true },
      { key: '我的基础', type: 'text', placeholder: '初学者/有一定基础/中级/高级', required: true },
      { key: '应用场景', type: 'text', placeholder: '我为什么需要了解这个概念', required: true }
    ],
    body: '你是一位出色的技术布道者，擅长用通俗易懂的方式解释复杂概念。请帮我理解以下技术概念：\n\n概念名称：{{概念名称}}\n我的基础：{{我的基础}}\n应用场景：{{应用场景}}\n\n请用以下方式解释：\n1. 一句话概括（电梯演讲版）\n2. 生活类比（用日常事物打比方）\n3. 核心原理（渐进式深入）\n4. 关键术语解释\n5. 代码示例（最小可运行示例）\n6. 常见误解和易混淆概念\n7. 深入学习路线图\n\n用中文解释，必要时保留英文术语。'
  },
  {
    id: 'zhiz-广告文案创意生成器',
    category: 'create',
    title: '广告文案创意生成器',
    description: '为产品创作多版本不同类型的广告文案。',
    tags: ['广告文案', '创意', '营销', '转化率'],
    variables: [
      { key: '产品/服务', type: 'text', placeholder: '名称', required: true },
      { key: '产品特点', type: 'text', placeholder: '核心卖点 1-3 个', required: true },
      { key: '目标用户', type: 'text', placeholder: '用户画像', required: true },
      { key: '竞品参考', type: 'text', placeholder: '竞品名称', required: true },
      { key: '投放渠道', type: 'textarea', placeholder: '信息流/搜索/开屏/短视频/朋友圈', required: true }
    ],
    body: '你是一位 4A 广告公司的资深创意总监。请为以下产品创作广告文案：\n\n产品/服务：{{产品/服务}}\n产品特点：{{产品特点}}\n目标用户：{{目标用户}}\n竞品参考：{{竞品参考}}\n投放渠道：{{投放渠道}}\n\n请创作 4 套文案，每套包含：\n1. 痛点切入型：直击用户焦虑\n2. 利益驱动型：突出直接好处\n3. 情感共鸣型：建立情感连接\n4. 故事叙事型：用故事打动人\n\n每套文案包含：主标题、副标题、正文（50-100字）、CTA按钮文案。\n按预期转化率排序（由高到低）。'
  },
  {
    id: 'zhiz-正则表达式生成器',
    category: 'code',
    title: '正则表达式生成器',
    description: '根据匹配需求生成正则并附解释与测试用例。',
    tags: ['正则表达式', '文本匹配', '数据提取', '开发工具'],
    variables: [
      { key: '匹配需求', type: 'textarea', placeholder: '描述你要匹配的内容', required: true },
      { key: '目标语言', type: 'text', placeholder: 'JavaScript/Python/Java/Go/其他', required: true }
    ],
    body: '你是一位正则表达式专家，精通 PCRE、JavaScript、Python 正则语法。请根据需求生成正则表达式：\n\n匹配需求：{{匹配需求}}\n目标语言：{{目标语言}}\n\n请提供：\n1. 完整的正则表达式\n2. 逐段解释每个部分的作用\n3. 正面用例（应匹配的内容，5个以上）\n4. 反面用例（不应匹配的内容，5个以上）\n5. 边界情况和注意事项\n6. 性能提示（回溯、贪婪/非贪婪选择）\n7. 可直接运行的测试代码'
  },
  {
    id: 'zhiz-创意选题生成器',
    category: 'create',
    title: '创意选题生成器',
    description: '按领域平台批量生成可执行的内容选题。',
    tags: ['选题策划', '内容创意', '自媒体', '运营'],
    variables: [
      { key: '领域/赛道', type: 'textarea', placeholder: '你的内容方向', required: true },
      { key: '平台', type: 'text', placeholder: '微信公众号/知乎/小红书/B站/博客/Newsletter', required: true },
      { key: '受众画像', type: 'textarea', placeholder: '描述你的目标读者', required: true },
      { key: '近期热点', type: 'text', placeholder: '如有想蹭的热点', required: true }
    ],
    body: '你是一位内容策划总监，拥有丰富的选题经验和敏锐的内容嗅觉。请帮我生成选题创意：\n\n领域/赛道：{{领域/赛道}}\n平台：{{平台}}\n受众画像：{{受众画像}}\n近期热点：{{近期热点}}\n\n请生成 15 个选题，分为：\n1. 热点借势型 × 3\n2. 干货教程型 × 3\n3. 观点输出型 × 3\n4. 情感共鸣型 × 3\n5. 盘点清单型 × 3\n\n每个选题包含：标题雏形、角度切入点、预估流量等级（S/A/B/C）。'
  },
  {
    id: 'zhiz-全能代码审查专家',
    category: 'code',
    title: '全能代码审查专家',
    description: '深度审查代码安全性能并给出改进示例。',
    tags: ['代码审查', '安全', '性能优化', '最佳实践'],
    variables: [
      { key: '在此粘贴您的代码', type: 'textarea', placeholder: '在此粘贴您的代码', required: true }
    ],
    body: '你是一位拥有10年以上经验的资深软件工程师。请对以下代码进行全面审查，包括：\n1. 代码质量和可读性\n2. 潜在的安全漏洞\n3. 性能优化建议\n4. 最佳实践和设计模式\n\n请用中文回答，并为每个问题提供具体的改进示例。\n\n待审查代码：\n```\n{{在此粘贴您的代码}}\n```'
  },
  {
    id: 'zhiz-数据分析报告生成器',
    category: 'work',
    title: '数据分析报告生成器',
    description: '将原始数据整理为含趋势洞察的分析报告。',
    tags: ['数据分析', '报表', '业务洞察', '可视化'],
    variables: [
      { key: '数据描述', type: 'textarea', placeholder: '描述数据内容和来源', required: true },
      { key: '原始数据/关键指标', type: 'textarea', placeholder: '粘贴数据或列出核心指标', required: true },
      { key: '分析目的', type: 'textarea', placeholder: '想从数据中了解什么？', required: true }
    ],
    body: '你是一位资深数据分析师，擅长从数据中提取业务洞察。请分析以下数据并生成报告：\n\n数据描述：{{数据描述}}\n原始数据/关键指标：\n{{原始数据/关键指标}}\n分析目的：{{分析目的}}\n\n请生成数据分析报告：\n1. 数据概览（样本量、时间范围、维度描述）\n2. 关键发现（Top 3-5 洞察）\n3. 趋势分析（变化方向和速率）\n4. 异常检测（突变点和可能原因）\n5. 对比分析（环比/同比/分群对比）\n6. 相关性分析（变量间关系）\n7. 结论和行动建议\n8. 可视化图表建议（推荐用什么图表展示哪些数据）\n\n用「So What」原则：每个数据发现都必须指向可行动的建议。'
  },
  {
    id: 'zhiz-智能出题生成器',
    category: 'learn',
    title: '智能出题生成器',
    description: '按知识点难度生成多种题型的考试题目。',
    tags: ['出题', '教育评估', '知识检验', '学习'],
    variables: [
      { key: '学科/领域', type: 'text', placeholder: '科目或技能领域', required: true },
      { key: '知识点范围', type: 'text', placeholder: '具体的知识点或章节', required: true },
      { key: '难度级别', type: 'text', placeholder: '入门/中等/困难/专家', required: true },
      { key: '题目数量', type: 'text', placeholder: '数量', required: true },
      { key: '题型分布', type: 'text', placeholder: '选择题/填空题/判断题/简答题/编程题/案例分析', required: true }
    ],
    body: '你是一位教育评估专家，擅长根据教学目标设计考题。请根据以下要求生成题目：\n\n学科/领域：{{学科/领域}}\n知识点范围：{{知识点范围}}\n难度级别：{{难度级别}}\n题目数量：{{题目数量}}\n题型分布：{{题型分布}}\n\n请生成题目集：\n\n**选择题**\n1. 题目 ... （A/B/C/D）\n   答案：X\n   解析：...\n\n**简答题**\n1. 题目 ...\n   参考答案：...\n   评分要点：...\n\n**综合应用题**\n1. 题目 ...\n   参考答案：...\n   评分标准：...\n\n要求：\n1. 符合布鲁姆教育目标分类法（知识→理解→应用→分析→评价→创造）\n2. 每题标注考察的知识点和认知层次\n3. 提供详细解析，而非仅给答案'
  },
  {
    id: 'zhiz-爆款标题生成器',
    category: 'create',
    title: '爆款标题生成器',
    description: '为内容生成多种风格的吸睛标题备选方案。',
    tags: ['标题优化', '内容营销', '点击率', '创作'],
    variables: [
      { key: '内容主题', type: 'textarea', placeholder: '描述文章/视频主题', required: true },
      { key: '内容类型', type: 'textarea', placeholder: '公众号/知乎/B站/抖音/YouTube/博客', required: true },
      { key: '目标受众', type: 'textarea', placeholder: '描述目标读者', required: true },
      { key: '核心卖点', type: 'text', placeholder: '最想传达的价值', required: true }
    ],
    body: '你是一位内容营销专家，深谙注意力经济和标题心理学。请为以下内容生成吸引眼球的标题：\n\n内容主题：{{内容主题}}\n内容类型：{{内容类型}}\n目标受众：{{目标受众}}\n核心卖点：{{核心卖点}}\n\n请生成 10 个标题，分为以下风格：\n1. 数据型（含数字的）× 2\n2. 悬念型（引发好奇的）× 2\n3. 痛点型（直击需求的）× 2\n4. 结果型（展示效果的）× 2\n5. 争议型（引发讨论的）× 2\n\n每个标题附注：标题类型、预期点击率评分（1-10分）、适用场景。'
  },
  {
    id: 'zhiz-bug-排查诊断专家',
    category: 'code',
    title: 'Bug 排查诊断专家',
    description: '定位缺陷根因并给出排查步骤与预防措施。',
    tags: ['Bug排查', '调试', '问题定位', '开发'],
    variables: [
      { key: '问题现象', type: 'textarea', placeholder: '详细描述 Bug 表现', required: true },
      { key: '期望行为', type: 'text', placeholder: '应该是什么样的', required: true },
      { key: '复现步骤', type: 'text', placeholder: '如何触发 Bug', required: true },
      { key: '环境信息', type: 'textarea', placeholder: '浏览器/操作系统/Node版本', required: true },
      { key: '可疑代码', type: 'textarea', placeholder: '粘贴可疑代码', required: true }
    ],
    body: '你是一位经验丰富的调试专家，擅长从蛛丝马迹中定位 Bug 根因。请帮我排查以下问题：\n\n问题现象：{{问题现象}}\n期望行为：{{期望行为}}\n复现步骤：{{复现步骤}}\n环境信息：{{环境信息}}\n\n相关代码：\n```\n{{可疑代码}}\n```\n\n请按以下步骤排查：\n1. 问题分类（逻辑/状态/异步/环境/兼容性）\n2. 可能原因列举（按概率排序）\n3. 定位根因的调试步骤\n4. 修复方案（附修复代码）\n5. 防止复现的预防措施\n6. 相关测试用例补充'
  },
  {
    id: 'zhiz-智能摘要提炼器',
    category: 'learn',
    title: '智能摘要提炼器',
    description: '将长文提炼为指定风格的结构化摘要。',
    tags: ['摘要', '信息提炼', '学术', '速读'],
    variables: [
      { key: '原文', type: 'textarea', placeholder: '粘贴需要摘要的长文/论文/报告', required: true },
      { key: '目标字数', type: 'text', placeholder: '100字/300字/500字', required: true },
      { key: '摘要风格', type: 'text', placeholder: '学术摘要/商业摘要/新闻导语/社媒分享', required: true }
    ],
    body: '你是一位信息提炼和学术摘要专家。请将以下长文提炼为结构化摘��：\n\n原文：\n{{原文}}\n\n摘要要求：\n目标字数：{{目标字数}}\n摘要风格：{{摘要风格}}\n\n请输出：\n1. **核心结论**（一句话，不超过 30 字）\n2. **结构化摘要**（按目标字数）\n   - 背景/问题\n   - 方法/途径\n   - 关键发现/结论\n   - 意义/影响\n3. **关键词提取**（5-8 个）\n4. **速读要点**（Bullet Points 版本，3-5 条）\n5. **金句摘录**（原文中值得引用的表述）\n\n确保摘要独立可读，即使不看原文也能完整理解。'
  },
  {
    id: 'zhiz-算法题解教练',
    category: 'code',
    title: '算法题解教练',
    description: '从暴力到最优逐步讲解算法题解题思路。',
    tags: ['算法', '数据结构', 'LeetCode', '编程面试'],
    variables: [
      { key: '题目描述', type: 'textarea', placeholder: '粘贴题目', required: true },
      { key: '编程语言', type: 'text', placeholder: 'Python/JavaScript/Java/C++/Go', required: true }
    ],
    body: '你是一位算法竞赛教练，精通数据结构与算法。请帮我分析和解答以下算法题：\n\n题目描述：\n{{题目描述}}\n\n编程语言：{{编程语言}}\n\n请提供：\n1. 题目分析（识别题型和考察知识点）\n2. 解题思路（从暴力到最优，逐步优化）\n3. 关键数据结构选择及理由\n4. 最优解代码实现（含详细注释）\n5. 时间/空间复杂度分析\n6. 测试用例验证（含边界情况）\n7. 举一反三（类似题目推荐）\n\n先讲思路，再给代码，帮助真正理解而非死记答案。'
  },
  {
    id: 'zhiz-文案润色大师',
    category: 'create',
    title: '文案润色大师',
    description: '润色草稿文案，优化表达节奏与说服力。',
    tags: ['文案润色', '内容编辑', '广告文案', '品牌'],
    variables: [
      { key: '原始文案', type: 'textarea', placeholder: '粘贴待润色的文字', required: true },
      { key: '文案用途', type: 'textarea', placeholder: '广告/产品描述/品牌文案/社交媒体/官网文案', required: true },
      { key: '品牌调性', type: 'text', placeholder: '专业/年轻/高端/亲切/极客', required: true }
    ],
    body: '你是一位资深文案编辑，拥有 10 年广告和内容创作经验。请润色以下文案：\n\n原始文案：\n{{原始文案}}\n\n文案用途：{{文案用途}}\n品牌调性：{{品牌调性}}\n\n润色方向：\n1. 修正语法和标点错误\n2. 优化句式节奏感（长短句搭配）\n3. 增强修辞和感染力\n4. 删除冗余表达\n5. 强化核心卖点\n6. 确保文案与品牌调性一致\n\n输出：\n- 润色后完整文案\n- 修改点一览（标注修改理由）\n- 备选表达建议'
  },
  {
    id: 'zhiz-需求扩写专家',
    category: 'code',
    title: '需求扩写专家',
    description: '把模糊需求扩写为清晰完整的专业提示词。',
    tags: ['Prompt工程', '需求分析', '提示词优化', '效率'],
    variables: [
      { key: '原始需求', type: 'textarea', placeholder: '在此输入你的需求描述', required: true }
    ],
    body: '你是一位专业的 Prompt 工程师和需求分析专家。请帮我将以下模糊的需求描述扩写为结构清晰、逻辑完整的专业 Prompt：\n\n原始需求：{{原始需求}}\n\n扩写要求：\n1. 提炼核心意图，消除歧义\n2. 补全隐含需求和边界条件\n3. 添加明确的角色设定（Role）\n4. 定义清晰的任务目标（Task）\n5. 指定输出格式和质量标准（Output）\n6. 设置验收条件（Acceptance Criteria）\n\n直接输出优化后的完整 Prompt，无需解释优化过程。'
  },
  {
    id: 'zhiz-学术论文写作助手',
    category: 'learn',
    title: '学术论文写作助手',
    description: '辅助完成论文各章节的撰写与结构优化。',
    tags: ['论文写作', '学术', '研究方法', '文献综述'],
    variables: [
      { key: '论文类型', type: 'textarea', placeholder: '本科毕业论文/硕士论文/期刊论文/会议论文', required: true },
      { key: '研究领域', type: 'text', placeholder: '学科方向', required: true },
      { key: '论文阶段', type: 'textarea', placeholder: '选题/开题/文献综述/正文/修改', required: true },
      { key: '当前进度', type: 'text', placeholder: '已完成的部分', required: true }
    ],
    body: '你是一位学术写作顾问，拥有跨学科的论文指导经验。请辅助论文写作：\n\n论文类型：{{论文类型}}\n研究领域：{{研究领域}}\n论文阶段：{{论文阶段}}\n当前进度：{{当前进度}}\n\n请根据论文阶段提供帮助：\n\n**选题阶段：**\n- 5 个选题建议（含研究价值和可行性评估）\n- 研究问题聚焦\n\n**文献综述：**\n- 综述框架建议\n- 关键词和检索策略\n- 文献分类和梳理方法\n\n**正文写作：**\n- 章节结构建议\n- 学术表达润色\n- 论证逻辑检查\n\n**通用要求：**\n1. 遵循学术规范（引用格式、注释）\n2. 语言客观、严谨、有逻辑\n3. 标注需要补充数据/引用的位置\n4. 检查逻辑漏洞和论证不足'
  },
  {
    id: 'zhiz-多语言翻译专家',
    category: 'work',
    title: '多语言翻译专家',
    description: '提供多语言直译意译双版本及术语统一处理。',
    tags: ['翻译', '多语言', '本地化', '技术翻译'],
    variables: [
      { key: '原文', type: 'textarea', placeholder: '粘贴待翻译内容', required: true },
      { key: '翻译方向', type: 'text', placeholder: '中→英 / 英→中 / 其他', required: true },
      { key: '文体风格', type: 'text', placeholder: '技术文档/商务正式/日常口语/文学/营销', required: true }
    ],
    body: '你是一位精通中英日韩多语言的翻译专家，同时擅长技术翻译和文学翻译。请翻译以下内容：\n\n原文：\n{{原文}}\n\n翻译方向：{{翻译方向}}\n文体风格：{{文体风格}}\n\n翻译要求：\n1. 准确传达原意，不遗漏、不增添\n2. 符合目标语言的表达习惯（本地化）\n3. 术语统一，首次出现附注原文\n4. 保留原文格式（标题、列表、代码块）\n5. 提供 2 个翻译版本（直译 + 意译）\n6. 标注翻译难点和处理说明\n\n如有专业术语，请提供术语表。'
  },
  {
    id: 'zhiz-年度工作总结撰写助手',
    category: 'create',
    title: '年度工作总结撰写助手',
    description: '将工作亮点整理为条理清晰的年度总结。',
    tags: ['工作总结', '职场', '写作', '年终汇报'],
    variables: [
      { key: '-姓名', type: 'text', placeholder: '姓名', required: true },
      { key: '-职位', type: 'text', placeholder: '职位', required: true },
      { key: '-部门', type: 'text', placeholder: '部门', required: true },
      { key: '-汇报对象', type: 'text', placeholder: '直接上级', required: true },
      { key: '本年度亮点工作', type: 'textarea', placeholder: '逐条列出，尽量包含数据', required: true },
      { key: '遇到的挑战及解决方案', type: 'textarea', placeholder: '描述', required: true },
      { key: '明年工作计划', type: 'textarea', placeholder: '大方向', required: true }
    ],
    body: '你是一位职场写作专家，擅长将工作成果转化为有说服力的文字。请帮我撰写年度工作总结：\n\n基本信息：\n- 姓名：{{-姓名}}\n- 职位：{{-职位}}\n- 部门：{{-部门}}\n- 汇报对象：{{-汇报对象}}\n\n本年度亮点工作：\n{{本年度亮点工作}}\n\n遇到的挑战及解决方案：\n{{遇到的挑战及解决方案}}\n\n明年工作计划：\n{{明年工作计划}}\n\n要求：\n- 总字数1500-2000字\n- 用STAR法则展现成果\n- 数据化表达，突出亮点\n- 结尾展现对公司的忠诚和期待'
  },
  {
    id: 'zhiz-社交媒体内容生成器',
    category: 'create',
    title: '社交媒体内容生成器',
    description: '生成适配各平台风格的社媒文案与标签。',
    tags: ['社交媒体', '运营', '内容营销', '自媒体'],
    variables: [
      { key: '内容主题', type: 'textarea', placeholder: '要发布的内容', required: true },
      { key: '目标平台', type: 'text', placeholder: '微信朋友圈/小红书/微博/抖音/Twitter/Instagram/Li…', required: true },
      { key: '推广目的', type: 'text', placeholder: '品牌曝光/引流转化/互动获赞/知识分享', required: true }
    ],
    body: '你是一位社交媒体运营专家，精通各平台内容策略和用户心理。请为以下内容生成社媒文案：\n\n内容主题：{{内容主题}}\n目标平台：{{目标平台}}\n推广目的：{{推广目的}}\n\n请为每个平台分别生成：\n1. 正文文案（适配平台字数限制和风格）\n2. 推荐标签/话题（3-5 个）\n3. 引导互动的话术\n4. 配图/视频建议\n5. 最佳发布时间建议\n6. 评论区运营策略（前 3 条自评内容）\n\n注意：不同平台用户行为差异很大，文案风格必须差异化。'
  },
  {
    id: 'zhiz-个性化学习计划生成',
    category: 'learn',
    title: '个性化学习计划生成',
    description: '按目标与时间制定分阶段学习路线图。',
    tags: ['学习计划', '自学路线', '教育', '个人成长'],
    variables: [
      { key: '学习目标', type: 'text', placeholder: '想学什么/达到什么水平', required: true },
      { key: '当前水平', type: 'text', placeholder: '零基础/入门/中级/进阶', required: true },
      { key: '可用时间', type: 'text', placeholder: '每天/每周可投入的学习时间', required: true },
      { key: '学习周期', type: 'text', placeholder: '计划多长时间达成目标', required: true },
      { key: '学习风格偏好', type: 'text', placeholder: '视频/书籍/实践/课程/社群', required: true }
    ],
    body: '你是一位教育技术和学习设计专家，擅长制定个性化学习方案。请为我制定学习计划：\n\n学习目标：{{学习目标}}\n当前水平：{{当前水平}}\n可用时间：{{可用时间}}\n学习周期：{{学习周期}}\n学习风格偏好：{{学习风格偏好}}\n\n请生成个性化学习路线图：\n\n**阶段 1: 基础构建（第 1-X 周）**\n- 学习目标\n- 推荐资源（免费 + 付费各 1-2 个）\n- 每日学习安排\n- 阶段检验方式\n\n**阶段 2: 能力进阶**\n...\n\n**阶段 3: 实战和产出**\n...\n\n附加：\n1. 学习效率提升技巧（番茄钟/间隔重复/费曼学习法）\n2. 里程碑检查清单\n3. 遇到瓶颈期的应对策略\n4. 社群和学习伙伴推荐'
  }
];
