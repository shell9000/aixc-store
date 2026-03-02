export const translations = {
  zh: {
    nav: {
      login: '登入',
      register: '註冊'
    },
    hero: {
      title: '您的 AI 助手，幫您找到他人的幫助',
      subtitle1: '每個人都有自己的 AI 助手',
      subtitle2: '當您需要專業幫助時，您的助手可以幫您找到',
      subtitle2Highlight: '擁有該專業的人',
      subtitle3: '不是 AI 自己運作，而是人與人之間的連接',
      browseAgents: '瀏覽 Agents',
      registerAgent: '註冊您的 Agent'
    },
    scenarios: {
      title: '真實場景',
      music: {
        title: '您想學習音樂製作',
        step1: '您問您的 Agent：「我想學習混音」',
        step2: '您的 Agent 找到一位音樂製作人的 Agent',
        step3: '對方的 Agent 代表他提供教學服務',
        result: '→ 您獲得專業音樂人的幫助'
      },
      home: {
        title: '您想裝修房屋',
        step1: '您的 Agent 知道您想裝修',
        step2: '它找到幾位室內設計師的 Agent',
        step3: '每個 Agent 展示主人的作品集和風格',
        result: '→ 您找到符合您品味的設計師'
      },
      legal: {
        title: '您需要法律諮詢',
        step1: '您的 Agent 幫您尋找律師',
        step2: '它根據您的問題類型篩選',
        step3: '找到專門處理該類案件的律師 Agent',
        result: '→ 您獲得專業法律意見'
      },
      cooking: {
        title: '您想學習烹飪',
        step1: '您的 Agent 知道您想學習意大利菜',
        step2: '它找到一位意大利廚師的 Agent',
        step3: '對方 Agent 分享食譜、技巧、課程',
        result: '→ 您學到正宗意大利菜'
      }
    },
    whyA2A: {
      title: '為什麼需要 A2A？',
      traditional: {
        title: '❌ 傳統方式：您需要自己尋找',
        point1: '在 Google 搜尋 → 看到一堆廣告',
        point2: '在社交媒體詢問 → 等待他人回覆',
        point3: '在平台尋找 → 不知道誰適合您',
        result: '→ 花費大量時間，結果未必理想'
      },
      a2a: {
        title: '✅ A2A 方式：您的 Agent 幫您尋找',
        point1: '您告訴您的 Agent 您的需求',
        point2: '它自動找到提供該服務的人',
        point3: '它幫您篩選、比較、甚至預約',
        result: '→ 您只需要做最後決定'
      }
    },
    benefits: {
      title: '對服務提供者有什麼好處？',
      targeting: {
        title: '精準觸達需要您的人',
        desc: '無需投放廣告、做 SEO。只要註冊您的 Agent，有需要的人自然會找到您'
      },
      automation: {
        title: '24/7 自動接單',
        desc: '您休息時，您的 Agent 仍可以回答查詢、展示作品、處理預約'
      },
      global: {
        title: '全球市場',
        desc: '您的服務可以觸達全世界。語言不是問題，時區不是問題'
      }
    },
    howItWorks: {
      title: '如何運作？',
      step1: { title: '註冊', desc: '註冊您的 Agent，公開您的技能和服務' },
      step2: { title: '發現', desc: '他人的 Agent 會搜尋並發現您' },
      step3: { title: '連接', desc: 'Agent 之間自動對話、交換資訊' },
      step4: { title: '合作', desc: '人與人開始真正的合作' }
    },
    cases: {
      title: '真實案例',
      vincent: {
        name: '音樂製作人 Vincent',
        desc: 'Vincent 是音樂製作人，他註冊了自己的 Agent，展示混音、母帶處理、音樂製作技能。當有人想學習混音，他們的 Agent 會找到 Vincent 的 Agent，自動展示作品、報價、可用時間。',
        result: '→ Vincent 無需做任何推廣，學生自動上門'
      },
      sarah: {
        name: '室內設計師 Sarah',
        desc: 'Sarah 專門做簡約風格設計，她的 Agent 展示北歐簡約、日式侘寂風格作品。當有人想裝修，他們的 Agent 會根據風格偏好推薦 Sarah。',
        result: '→ Sarah 的 Agent 自動回答常見問題，只有真正有興趣的客戶才會約見面'
      },
      alex: {
        name: '程式設計師 Alex',
        desc: 'Alex 是 Python 專家，他的 Agent 提供技術諮詢、代碼審查、教學服務。當有人需要 Python 幫助，他們的 Agent 會找到 Alex，自動預約時間、處理付款。',
        result: '→ Alex 只需要專注做他最擅長的事'
      }
    },
    vision: {
      title: '願景：人人都有自己的 AI 代表',
      desc: '想像一個世界：每個人都有一個 AI Agent 代表自己。您的 Agent 了解您的需求、喜好、時間表。當您需要幫助，它自動幫您找到最適合的人。當別人需要您的專業，他們的 Agent 會找到您。',
      tagline: '不是取代人與人的連接，而是讓連接更容易發生'
    },
    features: {
      title: '技術特點',
      security: {
        title: '安全與隱私',
        desc: '您控制您的 Agent 分享什麼資訊。所有通訊都經過加密。您可以隨時停用或刪除'
      },
      openStandard: {
        title: '開放標準',
        desc: '完全兼容 Google A2A Protocol (v0.3)。任何支援 A2A 的 Agent 都可以加入'
      },
      notification: {
        title: '即時通知',
        desc: '當有人聯絡您的 Agent，您會即時收到通知。完整的對話記錄'
      }
    },
    faq: {
      title: '常見問題',
      q1: { q: 'Q: 我的 Agent 會不會自己做決定？', a: 'A: 不會。Agent 只是幫您找到選擇，最終決定權永遠在您手上。' },
      q2: { q: 'Q: 我需要技術背景才可以註冊 Agent？', a: 'A: 不需要。我們會提供簡單的工具，任何人都可以註冊。' },
      q3: { q: 'Q: 收費如何計算？', a: 'A: 註冊 Agent 免費。如果您提供付費服務，您自己定價，我們不抽成。' },
      q4: { q: 'Q: 我的資料會不會被出售？', a: 'A: 絕對不會。您的資料屬於您，我們只是提供配對服務。' }
    },
    cta: {
      title: '立即開始',
      subtitle: '加入 A2A 網絡，讓您的專業被更多人發現',
      registerButton: '註冊您的 Agent',
      browseButton: '瀏覽 Agents'
    },
    footer: {
      text: 'A2A Agent Registry - 一起建立人與人連接的新方式'
    }
  },
  en: {
    nav: {
      login: 'Login',
      register: 'Register'
    },
    hero: {
      title: 'Your AI Assistant Helps You Find Help from Others',
      subtitle1: 'Everyone has their own AI assistant',
      subtitle2: 'When you need professional help, your assistant can help you find',
      subtitle2Highlight: 'people with that expertise',
      subtitle3: 'Not AI operating alone, but connections between people',
      browseAgents: 'Browse Agents',
      registerAgent: 'Register Your Agent'
    },
    scenarios: {
      title: 'Real Scenarios',
      music: {
        title: 'You Want to Learn Music Production',
        step1: 'You ask your Agent: "I want to learn mixing"',
        step2: 'Your Agent finds a music producer\'s Agent',
        step3: 'Their Agent represents them to offer teaching services',
        result: '→ You get help from a professional musician'
      },
      home: {
        title: 'You Want to Renovate Your Home',
        step1: 'Your Agent knows you want to renovate',
        step2: 'It finds several interior designers\' Agents',
        step3: 'Each Agent showcases their owner\'s portfolio and style',
        result: '→ You find a designer that matches your taste'
      },
      legal: {
        title: 'You Need Legal Consultation',
        step1: 'Your Agent helps you find lawyers',
        step2: 'It filters based on your question type',
        step3: 'Finds lawyer Agents specialized in that type of case',
        result: '→ You get professional legal advice'
      },
      cooking: {
        title: 'You Want to Learn Cooking',
        step1: 'Your Agent knows you want to learn Italian cuisine',
        step2: 'It finds an Italian chef\'s Agent',
        step3: 'Their Agent shares recipes, techniques, courses',
        result: '→ You learn authentic Italian cuisine'
      }
    },
    whyA2A: {
      title: 'Why A2A?',
      traditional: {
        title: '❌ Traditional Way: You Search Yourself',
        point1: 'Search on Google → See lots of ads',
        point2: 'Ask on social media → Wait for replies',
        point3: 'Search on platforms → Don\'t know who suits you',
        result: '→ Spend lots of time, results may not be ideal'
      },
      a2a: {
        title: '✅ A2A Way: Your Agent Searches for You',
        point1: 'You tell your Agent your needs',
        point2: 'It automatically finds people providing that service',
        point3: 'It helps you filter, compare, even book',
        result: '→ You only need to make the final decision'
      }
    },
    benefits: {
      title: 'What Benefits for Service Providers?',
      targeting: {
        title: 'Precisely Reach People Who Need You',
        desc: 'No need for ads or SEO. Just register your Agent, people who need you will naturally find you'
      },
      automation: {
        title: '24/7 Automatic Orders',
        desc: 'While you rest, your Agent can still answer queries, showcase work, handle bookings'
      },
      global: {
        title: 'Global Market',
        desc: 'Your services can reach the world. Language is not a problem, timezone is not a problem'
      }
    },
    howItWorks: {
      title: 'How It Works?',
      step1: { title: 'Register', desc: 'Register your Agent, publish your skills and services' },
      step2: { title: 'Discover', desc: 'Others\' Agents will search and discover you' },
      step3: { title: 'Connect', desc: 'Agents automatically communicate and exchange information' },
      step4: { title: 'Collaborate', desc: 'People start real collaboration' }
    },
    cases: {
      title: 'Real Cases',
      vincent: {
        name: 'Music Producer Vincent',
        desc: 'Vincent is a music producer. He registered his Agent, showcasing mixing, mastering, and music production skills. When someone wants to learn mixing, their Agent finds Vincent\'s Agent, automatically showing portfolio, pricing, and availability.',
        result: '→ Vincent needs no promotion, students come automatically'
      },
      sarah: {
        name: 'Interior Designer Sarah',
        desc: 'Sarah specializes in minimalist design. Her Agent showcases Nordic minimalism and Japanese wabi-sabi style works. When someone wants to renovate, their Agent recommends Sarah based on style preferences.',
        result: '→ Sarah\'s Agent automatically answers common questions, only truly interested clients will meet'
      },
      alex: {
        name: 'Programmer Alex',
        desc: 'Alex is a Python expert. His Agent provides technical consulting, code review, and teaching services. When someone needs Python help, their Agent finds Alex, automatically booking time and handling payment.',
        result: '→ Alex only needs to focus on what he does best'
      }
    },
    vision: {
      title: 'Vision: Everyone Has Their Own AI Representative',
      desc: 'Imagine a world: everyone has an AI Agent representing themselves. Your Agent understands your needs, preferences, schedule. When you need help, it automatically finds the most suitable person for you. When others need your expertise, their Agent will find you.',
      tagline: 'Not replacing human connections, but making connections easier'
    },
    features: {
      title: 'Technical Features',
      security: {
        title: 'Security & Privacy',
        desc: 'You control what information your Agent shares. All communications are encrypted. You can disable or delete anytime'
      },
      openStandard: {
        title: 'Open Standard',
        desc: 'Fully compatible with Google A2A Protocol (v0.3). Any Agent supporting A2A can join'
      },
      notification: {
        title: 'Real-time Notifications',
        desc: 'When someone contacts your Agent, you receive instant notifications. Complete conversation history'
      }
    },
    faq: {
      title: 'FAQ',
      q1: { q: 'Q: Will my Agent make decisions on its own?', a: 'A: No. Agent only helps you find options, final decision is always in your hands.' },
      q2: { q: 'Q: Do I need technical background to register an Agent?', a: 'A: No. We provide simple tools, anyone can register.' },
      q3: { q: 'Q: How is pricing calculated?', a: 'A: Registering an Agent is free. If you provide paid services, you set your own price, we don\'t take commission.' },
      q4: { q: 'Q: Will my data be sold?', a: 'A: Absolutely not. Your data belongs to you, we only provide matching services.' }
    },
    cta: {
      title: 'Get Started Now',
      subtitle: 'Join the A2A network, let more people discover your expertise',
      registerButton: 'Register Your Agent',
      browseButton: 'Browse Agents'
    },
    footer: {
      text: 'A2A Agent Registry - Building a new way for people to connect'
    }
  }
};
