// src/i18n/translations/roadmap.ts

export interface LocalizedString {
  en: string;
  fa: string;
  ar: string;
  tr: string;
  zh: string;
}

export interface RoadmapStep {
  number: string;
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
}

export const roadmapTranslations = {
  header: {
    title: {
      en: "Project Roadmap",
      fa: "نقشه راه پروژه",
      ar: "خارطة طريق المشروع",
      tr: "Proje Yol Haritası",
      zh: "项目路线图"
    },
    intro: {
      en: "Our journey toward building a decentralized ecosystem.",
      fa: "مسیر ما برای ساخت یک اکوسیستم غیرمتمرکز.",
      ar: "رحلتنا نحو بناء نظام بيئي لامركزي.",
      tr: "Merkeziyetsiz bir ekosistem oluşturma yolculuğumuz.",
      zh: "我们迈向构建去中心化生态系统的旅程。"
    },
    kicker: {
      en: "Future Goals",
      fa: "اهداف آینده",
      ar: "الأهداف المستقبلية",
      tr: "Gelecek Hedefleri",
      zh: "未来目标"
    }
  },
  steps: [
    {
      number: "01",
      icon: "🚀",
      title: {
        en: "Launch Phase",
        fa: "فاز راه‌اندازی",
        ar: "مرحلة الإطلاق",
        tr: "Başlatma Aşaması",
        zh: "启动阶段"
      },
      description: {
        en: "Establishing the core infrastructure and initial network nodes.",
        fa: "ایجاد زیرساخت‌های اصلی و گره‌های اولیه شبکه.",
        ar: "تأسيس البنية التحتية الأساسية وعقد الشبكة الأولية.",
        tr: "Temel altyapının ve ilk ağ düğümlerinin kurulması.",
        zh: "建立核心基础设施和初始网络节点。"
      }
    },
    {
      number: "02",
      icon: "🌐",
      title: {
        en: "Ecosystem Growth",
        fa: "رشد اکوسیستم",
        ar: "نمو النظام البيئي",
        tr: "Ekosistem Büyümesi",
        zh: "生态系统增长"
      },
      description: {
        en: "Integrating new dApps and expanding cross-chain capabilities.",
        fa: "ادغام دی‌اپ‌های جدید و گسترش قابلیت‌های میان‌زنجیره‌ای.",
        ar: "دمج تطبيقات لامركزية جديدة وتوسيع قدرات الربط بين السلاسل.",
        tr: "Yeni dApp'lerin entegrasyonu ve zincirler arası yeteneklerin genişletilmesi.",
        zh: "集成新的去中心化应用并扩展跨链功能。"
      }
    },
    {
      number: "03",
      icon: "🏆",
      title: {
        en: "Global Adoption",
        fa: "پذیرش جهانی",
        ar: "التبني العالمي",
        tr: "Küresel Benimseme",
        zh: "全球采用"
      },
      description: {
        en: "Full decentralization and mass community integration.",
        fa: "غیرمتمرکزسازی کامل و ادغام گسترده جامعه.",
        ar: "اللامركزية الكاملة وتكامل المجتمع الجماعي.",
        tr: "Tam merkeziyetsizlik ve topluluk entegrasyonu.",
        zh: "完全去中心化和大规模社区整合。"
      }
    }
  ]
};
