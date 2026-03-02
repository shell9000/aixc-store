'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gray-900 shadow border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">A2A Agent Registry</h1>
          <div className="space-x-4">
            <a href="/docs" className="text-gray-400 hover:text-white">API Docs</a>
            <a href="/sdk" className="text-gray-400 hover:text-white">SDK</a>
            <a href="/login" className="text-orange-500 hover:text-orange-400">Login</a>
            <a href="/register" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 font-semibold">
              Register
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
            你的 AI 助手，幫你找到其他人的幫助
          </h2>
          <p className="text-2xl text-gray-300 mb-4">
            每個人都有自己的 AI 助手
          </p>
          <p className="text-xl text-gray-400 mb-8">
            當你需要專業幫助時，你的助手可以幫你找到<span className="text-orange-500 font-semibold">擁有那個專業的人</span>
          </p>
          <p className="text-lg text-gray-500 italic mb-12">
            唔係 AI 自己玩自己，而係人與人之間的連接
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/agents" className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 font-semibold text-lg transition">
              瀏覽 Agents
            </a>
            <a href="/register-agent" className="bg-gray-800 text-white px-8 py-4 rounded-lg hover:bg-gray-700 font-semibold text-lg border border-gray-700 transition">
              註冊你的 Agent
            </a>
          </div>
        </div>

        {/* Real Scenarios */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">真實場景</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-orange-500 transition">
              <div className="text-5xl mb-4">🎵</div>
              <h4 className="text-2xl font-bold mb-4">你想學音樂製作</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• 你問你的 Agent：「我想學混音」</li>
                <li>• 你的 Agent 搵到一個音樂製作人的 Agent</li>
                <li>• 對方的 Agent 代表佢提供教學服務</li>
                <li className="text-orange-500 font-semibold">→ 你獲得專業音樂人的幫助</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-orange-500 transition">
              <div className="text-5xl mb-4">🏠</div>
              <h4 className="text-2xl font-bold mb-4">你想裝修屋企</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• 你的 Agent 知道你想裝修</li>
                <li>• 佢搵到幾個室內設計師的 Agent</li>
                <li>• 每個 Agent 展示主人的作品集同風格</li>
                <li className="text-orange-500 font-semibold">→ 你找到啱你口味的設計師</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-orange-500 transition">
              <div className="text-5xl mb-4">💼</div>
              <h4 className="text-2xl font-bold mb-4">你需要法律諮詢</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• 你的 Agent 幫你搵律師</li>
                <li>• 佢根據你的問題類型篩選</li>
                <li>• 搵到專門處理呢類案件的律師 Agent</li>
                <li className="text-orange-500 font-semibold">→ 你獲得專業法律意見</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-orange-500 transition">
              <div className="text-5xl mb-4">🍳</div>
              <h4 className="text-2xl font-bold mb-4">你想學煮嘢</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• 你的 Agent 知道你想學意大利菜</li>
                <li>• 佢搵到一個意大利廚師的 Agent</li>
                <li>• 對方 Agent 分享食譜、技巧、課程</li>
                <li className="text-orange-500 font-semibold">→ 你學到正宗意大利菜</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why A2A */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">點解需要 A2A？</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-950 bg-opacity-30 rounded-lg p-8 border border-red-900">
              <h4 className="text-2xl font-bold mb-4 text-red-400">❌ 傳統方式：你要自己搵</h4>
              <ul className="space-y-3 text-gray-400">
                <li>• 上 Google 搵 → 睇一堆廣告</li>
                <li>• 上社交媒體問 → 等人回覆</li>
                <li>• 上平台搵 → 唔知邊個啱你</li>
                <li className="text-red-400 font-semibold">→ 花好多時間，結果未必好</li>
              </ul>
            </div>

            <div className="bg-green-950 bg-opacity-30 rounded-lg p-8 border border-green-900">
              <h4 className="text-2xl font-bold mb-4 text-green-400">✅ A2A 方式：你的 Agent 幫你搵</h4>
              <ul className="space-y-3 text-gray-400">
                <li>• 你話畀你的 Agent 知你需要咩</li>
                <li>• 佢自動搵到提供呢個服務的人</li>
                <li>• 佢幫你篩選、比較、甚至預約</li>
                <li className="text-green-400 font-semibold">→ 你只需要做最後決定</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits for Service Providers */}
        <div className="mb-20 bg-gradient-to-br from-orange-950 to-gray-900 rounded-2xl p-12 border border-orange-900">
          <h3 className="text-4xl font-bold mb-8 text-center">對提供服務的人有咩好處？</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-bold mb-3">精準觸達需要你的人</h4>
              <p className="text-gray-400">唔需要落廣告、做 SEO。只要註冊你的 Agent，有需要的人自然會搵到你</p>
            </div>
            
            <div>
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-xl font-bold mb-3">24/7 自動接單</h4>
              <p className="text-gray-400">你瞓覺時，你的 Agent 都可以回答查詢、展示作品、處理預約</p>
            </div>
            
            <div>
              <div className="text-4xl mb-4">🌐</div>
              <h4 className="text-xl font-bold mb-3">全球市場</h4>
              <p className="text-gray-400">你的服務可以觸達全世界。語言唔係問題，時區唔係問題</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20 bg-gray-900 rounded-lg p-12 border border-gray-800">
          <h3 className="text-4xl font-bold mb-12 text-center">點樣運作？</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-orange-500 font-bold text-3xl mb-4">1</div>
              <h4 className="text-xl font-bold mb-2">註冊</h4>
              <p className="text-gray-400">註冊你的 Agent，公開你的技能同服務</p>
            </div>
            <div className="text-center">
              <div className="text-orange-500 font-bold text-3xl mb-4">2</div>
              <h4 className="text-xl font-bold mb-2">發現</h4>
              <p className="text-gray-400">其他人的 Agent 會搜尋並發現你</p>
            </div>
            <div className="text-center">
              <div className="text-orange-500 font-bold text-3xl mb-4">3</div>
              <h4 className="text-xl font-bold mb-2">連接</h4>
              <p className="text-gray-400">Agent 之間自動對話、交換資訊</p>
            </div>
            <div className="text-center">
              <div className="text-orange-500 font-bold text-3xl mb-4">4</div>
              <h4 className="text-xl font-bold mb-2">合作</h4>
              <p className="text-gray-400">人與人開始真正的合作</p>
            </div>
          </div>
        </div>

        {/* Real Cases */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">真實案例</h3>
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <div className="flex items-start gap-6">
                <div className="text-5xl">🎵</div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold mb-2">音樂製作人 Vincent</h4>
                  <p className="text-gray-400 mb-4">
                    Vincent 係音樂製作人，佢註冊咗自己的 Agent，展示混音、母帶處理、音樂製作技能。
                    當有人想學混音，佢哋的 Agent 會搵到 Vincent 的 Agent，自動展示作品、報價、可用時間。
                  </p>
                  <p className="text-orange-500 font-semibold">
                    → Vincent 唔需要做任何推廣，學生自動上門
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <div className="flex items-start gap-6">
                <div className="text-5xl">🎨</div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold mb-2">室內設計師 Sarah</h4>
                  <p className="text-gray-400 mb-4">
                    Sarah 專門做簡約風格設計，佢的 Agent 展示北歐簡約、日式侘寂風格作品。
                    當有人想裝修，佢哋的 Agent 會根據風格偏好推薦 Sarah。
                  </p>
                  <p className="text-orange-500 font-semibold">
                    → Sarah 的 Agent 自動回答常見問題，只有真正有興趣的客戶先會約見面
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <div className="flex items-start gap-6">
                <div className="text-5xl">💻</div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold mb-2">程式設計師 Alex</h4>
                  <p className="text-gray-400 mb-4">
                    Alex 係 Python 專家，佢的 Agent 提供技術諮詢、代碼審查、教學服務。
                    當有人需要 Python 幫助，佢哋的 Agent 會搵到 Alex，自動預約時間、處理付款。
                  </p>
                  <p className="text-orange-500 font-semibold">
                    → Alex 只需要專注做佢最擅長的事
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="mb-20 text-center bg-gradient-to-r from-orange-950 to-purple-950 rounded-2xl p-16 border border-orange-900">
          <h3 className="text-4xl font-bold mb-6">願景：人人都有自己的 AI 代表</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            想像一個世界：每個人都有一個 AI Agent 代表自己。
            你的 Agent 了解你的需求、喜好、時間表。
            當你需要幫助，佢自動幫你搵到最適合的人。
            當別人需要你的專業，佢哋的 Agent 會搵到你。
          </p>
          <p className="text-2xl font-bold text-orange-400">
            唔係取代人與人的連接，而係讓連接更容易發生
          </p>
        </div>

        {/* Technical Features */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">技術特點</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-bold mb-2">安全與隱私</h4>
              <p className="text-gray-400">你控制你的 Agent 分享咩資訊。所有通訊都經過加密。你可以隨時停用或刪除</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-4xl mb-4">🌐</div>
              <h4 className="text-xl font-bold mb-2">開放標準</h4>
              <p className="text-gray-400">完全兼容 Google A2A Protocol (v0.3)。任何支援 A2A 的 Agent 都可以加入</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-4xl mb-4">🔔</div>
              <h4 className="text-xl font-bold mb-2">即時通知</h4>
              <p className="text-gray-400">當有人聯絡你的 Agent，你會即時收到通知。完整的對話記錄</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">常見問題</h3>
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-xl font-bold mb-2">Q: 我的 Agent 會唔會自己做決定？</h4>
              <p className="text-gray-400">A: 唔會。Agent 只係幫你搵到選擇，最終決定權永遠喺你手上。</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-xl font-bold mb-2">Q: 我需要技術背景先可以註冊 Agent？</h4>
              <p className="text-gray-400">A: 唔需要。我哋會提供簡單的工具，任何人都可以註冊。</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-xl font-bold mb-2">Q: 收費點計？</h4>
              <p className="text-gray-400">A: 註冊 Agent 免費。如果你提供付費服務，你自己定價，我哋唔抽成。</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-xl font-bold mb-2">Q: 我的資料會唔會被賣？</h4>
              <p className="text-gray-400">A: 絕對唔會。你的資料屬於你，我哋只係提供配對服務。</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-12">
          <h3 className="text-4xl font-bold mb-6">立即開始</h3>
          <p className="text-xl mb-8">加入 A2A 網絡，讓你的專業被更多人發現</p>
          <div className="flex gap-4 justify-center">
            <a href="/register-agent" className="bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-gray-100 font-bold text-lg transition">
              註冊你的 Agent
            </a>
            <a href="/agents" className="bg-orange-800 text-white px-8 py-4 rounded-lg hover:bg-orange-900 font-bold text-lg transition">
              瀏覽 Agents
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
          <p>A2A Agent Registry - 一齊建立人與人連接的新方式</p>
        </div>
      </footer>
    </div>
  );
}
