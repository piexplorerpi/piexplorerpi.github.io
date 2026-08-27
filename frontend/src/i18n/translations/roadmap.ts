/**
 * Structure: Each key represents a single roadmap item.
 * All translations for that specific item are kept together.
 */

export const roadmapTranslations = {
  // --- General Header Info ---
  header: {
    title: {
      en: "Development Roadmap",
      fa: "نقشه راه توسعه",
      ar: "خارطة طريق التطوير",
      tr: "Geliştirme Yol Haritası",
      zh: "开发路线图"
    },
    intro: {
      en: "Our journey towards a decentralized Pi ecosystem explorer.",
      fa: "مسیر ما به سوی یک اکسپلورر غیرمتمرکز در اکوسیستم Pi.",
      ar: "رحلتنا نحو مستكشف لامركزي لنظام Pi البيئي.",
      tr: "Merkeziyetsiz Pi ekosistemi gezginine doğru yolculuğumuz.",
      zh: "我们迈向去中心化 Pi 生态系统浏览器的旅程。"
    },
    kicker: {
      en: "Pi Explorer",
      fa: "پای اکسپلورر",
      ar: "مستكشف باي",
      tr: "Pi Explorer",
      zh: "Pi Explorer"
    }
  },

  // --- Roadmap Steps ---
  steps: [
    {
      number: "01",
      icon: "🌱",
      content: {
        title: {
          en: "Phase 1: Foundation",
          fa: "فاز ۱: زیرساخت (فعلی)",
          ar: "المرحلة 1: التأسيس",
          tr: "Aşama 1: Temel",
          zh: "第一阶段：基础建设"
        },
        description: {
          en: "Core Architecture (Vite, TS, Tailwind), Supabase Schema, and Pi SDK Integration.",
          fa: "راه‌اندازی معماری اصلی، طراحی دیتابیس Supabase و ادغام Pi SDK.",
          ar: "البنية التحتية الأساسية، تصميم مخطط Supabase، وتكامل Pi SDK.",
          tr: "Temel Mimari (Vite, TS, Tailwind), Supabase Şeması ve Pi SDK Entegrasyonu.",
          zh: "核心架构 (Vite, TS, Tailwind), Supabase Schema 和 Pi SDK 集成。"
        }
      }
    },
    {
      number: "02",
      icon: "🗳️",
      content: {
        title: {
          en: "Phase 2: Community Engagement",
          fa: "فاز ۲: تعامل با جامعه",
          ar: "المرحلة 2: مشاركة المجتمع",
          tr: "Aşama 2: Topluluk Katılımı",
          zh: "第二阶段：社区参与"
        },
        description: {
          en: "Advanced Voting, User Profiles, i18n Integration, and dApp Search Engine.",
          fa: "الگوریتم‌های رای‌گیری، پروفایل کاربری، پشتیبانی از چندزبانی و موتور جستجو.",
          ar: "التصويت المتقدم، ملفات تعريف المستخدم، تكامل i18n، ومحرك البحث عن dApps.",
          tr: "Gelişmiş Oylama, Kullanıcı Profilleri, i18n Entegrasyonu ve dApp Arama Motoru.",
          zh: "高级投票、用户资料、多语言 (i18n) 集成以及 dApp 搜索引擎。"
        }
      }
    },
    {
      number: "03",
      icon: "📊",
      content: {
        title: {
          en: "Phase 3: Advanced Analytics",
          fa: "فاز ۳: تحلیل‌های پیشرفته",
          ar: "المرحلة 3: التحليلات المتقدمة",
          tr: "Aşama 3: Gelişmiş Analitik",
          zh: "第三阶段：高级分析"
        },
        description: {
          en: "Tokenomics Dashboard, Real-time Blockchain Explorer, and DePIN Node Tracking.",
          fa: "داشبورد توکنومیک، اکسپلورر لحظه‌ای بلاک‌چین و ردیابی نودهای DePIN.",
          ar: "لوحة تحكم اقتصاد الرموز، مستكشف البلوكشين في الوقت الفعلي، وتتبع عقد DePIN.",
          tr: "Tokenomics Paneli, Gerçek Zamanlı Blockchain Gezgini ve DePIN Düğüm Takibi.",
          zh: "代币经济仪表板、实时区块链浏览器和 DePIN 节点追踪。"
        }
      }
    },
    {
      number: "04",
      icon: "🌐",
      content: {
        title: {
          en: "Phase 4: Decentralization",
          fa: "فاز ۴: تمرکززدایی و گسترش",
          ar: "المرحلة 4: اللامركزية والتوسع",
          tr: "Aşama 4: Merkeziyetsizlik ve Genişleme",
          zh: "第四阶段：去中心化与扩张"
        },
        description: {
          en: "Full DAO Governance, Cross-chain Research (QRL), and PWA Mobile App.",
          fa: "حاکمیت کامل DAO، تحقیق بر روی زنجیره‌های دیگر (QRL) و نسخه موبایل (PWA).",
          ar: "حكم DAO الكامل، أبحاث عبر السلاسل (QRL)، وتطبيق موبایل (PWA).",
          tr: "Tam DAO Yönetişimi, Zincirler Arası Araştırma (QRL) ve PWA Mobil Uygulaması.",
          zh: "完全 DAO 治理、跨链研究 (QRL) 和 PWA 优化移动应用。"
        }
      }
    }
  ]
};
