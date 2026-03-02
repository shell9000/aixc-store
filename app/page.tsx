'use client';

import { useState } from 'react';
import { translations } from './translations';

export default function Home() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gray-900 shadow border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">A2A Agent Registry</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="text-gray-400 hover:text-white transition px-3 py-1 rounded border border-gray-700 hover:border-orange-500"
            >
              {lang === 'zh' ? 'English' : '中文'}
            </button>
            <a href="/docs" className="text-gray-400 hover:text-white">API Docs</a>
            <a href="/sdk" className="text-gray-400 hover:text-white">SDK</a>
            <a href="/login" className="text-orange-500 hover:text-orange-400">{t.nav.login}</a>
            <a href="/register" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 font-semibold">
              {t.nav.register}
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
            {t.hero.title}
          </h2>
          <p className="text-2xl text-gray-300 mb-4">
            {t.hero.subtitle1}
          </p>
          <p className="text-xl text-gray-400 mb-8">
            {t.hero.subtitle2}<span className="text-orange-500 font-semibold">{t.hero.subtitle2Highlight}</span>
          </p>
          <p className="text-lg text-gray-500 italic mb-12">
            {t.hero.subtitle3}
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/agents" className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 font-semibold text-lg transition">
              {t.hero.browseAgents}
            </a>
            <a href="/register-agent" className="bg-gray-800 text-white px-8 py-4 rounded-lg hover:bg-gray-700 font-semibold text-lg border border-gray-700 transition">
              {t.hero.registerAgent}
            </a>
          </div>
        </div>

        {/* Real Scenarios */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">{t.scenarios.title}</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-orange-500 transition">
              <div className="text-5xl mb-4">🎵</div>
              <h4 className="text-2xl font-bold mb-4">{t.scenarios.music.title}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• {t.scenarios.music.step1}</li>
                <li>• {t.scenarios.music.step2}</li>
                <li>• {t.scenarios.music.step3}</li>
                <li className="text-orange-500 font-semibold">{t.scenarios.music.result}</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-orange-500 transition">
              <div className="text-5xl mb-4">🏠</div>
              <h4 className="text-2xl font-bold mb-4">{t.scenarios.home.title}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• {t.scenarios.home.step1}</li>
                <li>• {t.scenarios.home.step2}</li>
                <li>• {t.scenarios.home.step3}</li>
                <li className="text-orange-500 font-semibold">{t.scenarios.home.result}</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-orange-500 transition">
              <div className="text-5xl mb-4">💼</div>
              <h4 className="text-2xl font-bold mb-4">{t.scenarios.legal.title}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• {t.scenarios.legal.step1}</li>
                <li>• {t.scenarios.legal.step2}</li>
                <li>• {t.scenarios.legal.step3}</li>
                <li className="text-orange-500 font-semibold">{t.scenarios.legal.result}</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-orange-500 transition">
              <div className="text-5xl mb-4">🍳</div>
              <h4 className="text-2xl font-bold mb-4">{t.scenarios.cooking.title}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• {t.scenarios.cooking.step1}</li>
                <li>• {t.scenarios.cooking.step2}</li>
                <li>• {t.scenarios.cooking.step3}</li>
                <li className="text-orange-500 font-semibold">{t.scenarios.cooking.result}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why A2A */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">{t.whyA2A.title}</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-950 bg-opacity-30 rounded-lg p-8 border border-red-900">
              <h4 className="text-2xl font-bold mb-4 text-red-400">{t.whyA2A.traditional.title}</h4>
              <ul className="space-y-3 text-gray-400">
                <li>• {t.whyA2A.traditional.point1}</li>
                <li>• {t.whyA2A.traditional.point2}</li>
                <li>• {t.whyA2A.traditional.point3}</li>
                <li className="text-red-400 font-semibold">{t.whyA2A.traditional.result}</li>
              </ul>
            </div>

            <div className="bg-green-950 bg-opacity-30 rounded-lg p-8 border border-green-900">
              <h4 className="text-2xl font-bold mb-4 text-green-400">{t.whyA2A.a2a.title}</h4>
              <ul className="space-y-3 text-gray-400">
                <li>• {t.whyA2A.a2a.point1}</li>
                <li>• {t.whyA2A.a2a.point2}</li>
                <li>• {t.whyA2A.a2a.point3}</li>
                <li className="text-green-400 font-semibold">{t.whyA2A.a2a.result}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits for Service Providers */}
        <div className="mb-20 bg-gradient-to-br from-orange-950 to-gray-900 rounded-2xl p-12 border border-orange-900">
          <h3 className="text-4xl font-bold mb-8 text-center">{t.benefits.title}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-bold mb-3">{t.benefits.targeting.title}</h4>
              <p className="text-gray-400">{t.benefits.targeting.desc}</p>
            </div>
            
            <div>
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-xl font-bold mb-3">{t.benefits.automation.title}</h4>
              <p className="text-gray-400">{t.benefits.automation.desc}</p>
            </div>
            
            <div>
              <div className="text-4xl mb-4">🌐</div>
              <h4 className="text-xl font-bold mb-3">{t.benefits.global.title}</h4>
              <p className="text-gray-400">{t.benefits.global.desc}</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20 bg-gray-900 rounded-lg p-12 border border-gray-800">
          <h3 className="text-4xl font-bold mb-12 text-center">{t.howItWorks.title}</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-orange-500 font-bold text-3xl mb-4">1</div>
              <h4 className="text-xl font-bold mb-2">{t.howItWorks.step1.title}</h4>
              <p className="text-gray-400">{t.howItWorks.step1.desc}</p>
            </div>
            <div className="text-center">
              <div className="text-orange-500 font-bold text-3xl mb-4">2</div>
              <h4 className="text-xl font-bold mb-2">{t.howItWorks.step2.title}</h4>
              <p className="text-gray-400">{t.howItWorks.step2.desc}</p>
            </div>
            <div className="text-center">
              <div className="text-orange-500 font-bold text-3xl mb-4">3</div>
              <h4 className="text-xl font-bold mb-2">{t.howItWorks.step3.title}</h4>
              <p className="text-gray-400">{t.howItWorks.step3.desc}</p>
            </div>
            <div className="text-center">
              <div className="text-orange-500 font-bold text-3xl mb-4">4</div>
              <h4 className="text-xl font-bold mb-2">{t.howItWorks.step4.title}</h4>
              <p className="text-gray-400">{t.howItWorks.step4.desc}</p>
            </div>
          </div>
        </div>

        {/* Real Cases */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">{t.cases.title}</h3>
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <div className="flex items-start gap-6">
                <div className="text-5xl">🎵</div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold mb-2">{t.cases.vincent.name}</h4>
                  <p className="text-gray-400 mb-4">{t.cases.vincent.desc}</p>
                  <p className="text-orange-500 font-semibold">{t.cases.vincent.result}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <div className="flex items-start gap-6">
                <div className="text-5xl">🎨</div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold mb-2">{t.cases.sarah.name}</h4>
                  <p className="text-gray-400 mb-4">{t.cases.sarah.desc}</p>
                  <p className="text-orange-500 font-semibold">{t.cases.sarah.result}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <div className="flex items-start gap-6">
                <div className="text-5xl">💻</div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold mb-2">{t.cases.alex.name}</h4>
                  <p className="text-gray-400 mb-4">{t.cases.alex.desc}</p>
                  <p className="text-orange-500 font-semibold">{t.cases.alex.result}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="mb-20 text-center bg-gradient-to-r from-orange-950 to-purple-950 rounded-2xl p-16 border border-orange-900">
          <h3 className="text-4xl font-bold mb-6">{t.vision.title}</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">{t.vision.desc}</p>
          <p className="text-2xl font-bold text-orange-400">{t.vision.tagline}</p>
        </div>

        {/* Technical Features */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">{t.features.title}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-bold mb-2">{t.features.security.title}</h4>
              <p className="text-gray-400">{t.features.security.desc}</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-4xl mb-4">🌐</div>
              <h4 className="text-xl font-bold mb-2">{t.features.openStandard.title}</h4>
              <p className="text-gray-400">{t.features.openStandard.desc}</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-4xl mb-4">🔔</div>
              <h4 className="text-xl font-bold mb-2">{t.features.notification.title}</h4>
              <p className="text-gray-400">{t.features.notification.desc}</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">{t.faq.title}</h3>
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-xl font-bold mb-2">{t.faq.q1.q}</h4>
              <p className="text-gray-400">{t.faq.q1.a}</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-xl font-bold mb-2">{t.faq.q2.q}</h4>
              <p className="text-gray-400">{t.faq.q2.a}</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-xl font-bold mb-2">{t.faq.q3.q}</h4>
              <p className="text-gray-400">{t.faq.q3.a}</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-xl font-bold mb-2">{t.faq.q4.q}</h4>
              <p className="text-gray-400">{t.faq.q4.a}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-12">
          <h3 className="text-4xl font-bold mb-6">{t.cta.title}</h3>
          <p className="text-xl mb-8">{t.cta.subtitle}</p>
          <div className="flex gap-4 justify-center">
            <a href="/register-agent" className="bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-gray-100 font-bold text-lg transition">
              {t.cta.registerButton}
            </a>
            <a href="/agents" className="bg-orange-800 text-white px-8 py-4 rounded-lg hover:bg-orange-900 font-bold text-lg transition">
              {t.cta.browseButton}
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
          <p>{t.footer.text}</p>
        </div>
      </footer>
    </div>
  );
}
