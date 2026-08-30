import { LocalizedString } from '../types';

export const paymentTranslations = {
  sdkNotAvailable: {
    en: "Pi SDK is not available. Please open this app in the Pi Browser.",
    fa: "سرویس Pi SDK در دسترس نیست. لطفاً این برنامه را در مرورگر Pi باز کنید.",
    ar: "Pi SDK غير متوفر. يرجى فتح هذا التطبيق في متصفح Pi.",
    tr: "Pi SDK mevcut değil. Lütfen bu uygulamayı Pi Tarayıcısı'nda açın.",
    zh: "Pi SDK 不可用。请在 Pi 浏览器中打开此应用。"
  } as LocalizedString,
  finalizeError: {
    en: "Failed to finalize transaction.",
    fa: "خطا در نهایی کردن تراکنش.",
    ar: "فشل في إنهاء المعاملة.",
    tr: "İşlem tamamlanamadı.",
    zh: "交易完成失败。"
  } as LocalizedString,
  approvalError: {
    en: "Server approval failed.",
    fa: "تایید سرور انجام نشد.",
    ar: "فشل موافقة الخادم.",
    tr: "Sunucu onayı başarısız oldu.",
    zh: "服务器批准失败。"
  } as LocalizedString,
  startError: {
    en: "Payment failed to start.",
    fa: "شروع پرداخت با خطا مواجه شد.",
    ar: "فشل بدء الدفع.",
    tr: "Ödeme başlatılamadı.",
    zh: "支付启动失败。"
  } as LocalizedString,
  completePurchase: {
    en: "Complete Purchase",
    fa: "تکمیل خرید",
    ar: "إتمام الشراء",
    tr: "Satın Almayı Tamamla",
    zh: "完成购买"
  } as LocalizedString,
  amount: {
    en: "Amount",
    fa: "مبلغ",
    ar: "المبلغ",
    tr: "Tutar",
    zh: "金额"
  } as LocalizedString,
  product: {
    en: "Product",
    fa: "محصول",
    ar: "المنتج",
    tr: "Ürün",
    zh: "产品"
  } as LocalizedString,
  premiumItem: {
    en: "PiDao Premium Item",
    fa: "محصول ویژه PiDao",
    ar: "منتج PiDao المميز",
    tr: "PiDao Premium Ürünü",
    zh: "PiDao 高级商品"
  } as LocalizedString,
  payWithPi: {
    en: "Pay with Pi",
    fa: "پرداخت با Pi",
    ar: "الدفع بـ Pi",
    tr: "Pi ile Öde",
    zh: "使用 Pi 支付"
  } as LocalizedString,
  processing: {
    en: "Processing...",
    fa: "در حال پردازش...",
    ar: "جاري المعالجة...",
    tr: "İşleniyor...",
    zh: "处理中..."
  } as LocalizedString,
  cancelReset: {
    en: "Cancel / Reset",
    fa: "لغو / بازنشانی",
    ar: "إلغاء / إعادة تعيين",
    tr: "İptal / Sıfırla",
    zh: "取消 / 重置"
  } as LocalizedString,
  doNotClose: {
    en: "Please do not close the Pi Browser...",
    fa: "لطفاً مرورگر Pi را نبندید...",
    ar: "يرجى عدم إغلاق متصفح Pi...",
    tr: "Lütfen Pi Tarayıcısını kapatmayın...",
    zh: "请勿关闭 Pi 浏览器..."
  } as LocalizedString
};
