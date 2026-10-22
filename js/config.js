/* =========================================================================
   أَثَـر • ATHAR ENGINE: CONFIG & STATE STORE (V2)
   البطولة الوطنية للابتكار والروبوت — وزارة التربية والتعليم وتنمية الموارد البشرية
   ========================================================================= */

// 1. مفتاح التخزين السحابي والمحلي المعتمد (V2 النظيف الخالي من البيانات التجريبية السابقة)
const STORAGE_KEY = 'ATHAR_MASTER_STUDIO_V2';

// 2. الحالة الشاملة المركزية للمشروع (Single Source of Truth)
// تبدأ المصفوفات فارغة تماماً حتى يضيف الطالب عنصره الأول بنقاء
let state = {
  h1: {
    narration: "",
    image: "",
    challenges: [{ challenge: "", analysis: "", solution: "" }],
    strategies: [
      { title: "", pros: [""], cons: [""] },
      { title: "", pros: [""], cons: [""] }
    ],
    adoptedIndex: null,
    statement: "",
    pillarAxis: "",
    pillarReason: ""
  },
  h2: {
    trials: [] // تبدأ فارغة؛ أول نقرة تضيف التجربة رقم 01 فقط
  },
  h3: {
    catalog: [], // تبدأ فارغة بدون أي مكون تجريبي مسبق
    robotImg: "",
    pins: [],
    evolution: [
      { img: "", note: "" },
      { img: "", note: "" },
      { img: "", note: "" },
      { img: "", note: "" }
    ]
  },
  h4: {
    flowImg: "",
    algoName: "",
    algoProblem: "",
    algoCode: "",
    algoLogic: "",
    fabItems: [], // تبدأ فارغة
    aiStudies: [] // تبدأ فارغة
  },
  h5: {
    teamSize: "3",
    activeFpKey: "sup",
    members: {
      sup: { name: "", role: "المشرف الأكاديمي", major: "", img: "" },
      st1: { name: "", role: "قائد الفريق", grade: "", branch: "", img: "" },
      st2: { name: "", role: "مبرمج المنظومة", grade: "", branch: "", img: "" },
      st3: { name: "", role: "مصمم الهيكل", grade: "", branch: "", img: "" }
    },
    footprints: {
      sup: { date: "", role: "", impact: "", lesson: "", quote: "" },
      st1: { date: "", role: "", impact: "", lesson: "", quote: "" },
      st2: { date: "", role: "", impact: "", lesson: "", quote: "" },
      st3: { date: "", role: "", impact: "", lesson: "", quote: "" }
    }
  }
};

// مفاتيح الأعضاء المعيارية
const memberKeys = ['sup', 'st1', 'st2', 'st3'];

// 3. بنك قبس البصيرة القرآني والنبوي الشريف
const INSIGHTS = [
  { 
    short: "﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾", 
    full: "﴿ فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ ۗ وَلَا تَعْجَلْ بِالْقُرْآنِ مِن قَبْلِ أَن يُقْضَىٰ إِلَيْكَ وَحْيُهُ ۖ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾", 
    src: "سورة طه · الآية 114" 
  },
  { 
    short: "« إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ »", 
    full: "« إِنَّ اللَّهَ تَعَالَى يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ »", 
    src: "حديث شريف · رواه البيهقي" 
  },
  { 
    short: "﴿ صُنْعَ اللَّهِ الَّذِي أَتْقَنَ كُلَّ شَيْءٍ ﴾", 
    full: "﴿ صُنْعَ اللَّهِ الَّذِي أَتْقَنَ كُلَّ شَيْءٍ ۚ إِنَّهُ خَبِيرٌ بِمَا تَفْعَلُونَ ﴾", 
    src: "سورة النمل · الآية 88" 
  },
  { 
    short: "﴿ إِنَّا لَا نُضِيعُ أَجْرَ مَنْ أَحْسَنَ عَمَلًا ﴾", 
    full: "﴿ إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ إِنَّا لَا نُضِيعُ أَجْرَ مَنْ أَحْسَنَ عَمَلًا ﴾", 
    src: "سورة الكهف · الآية 30" 
  }
];

// =========================================================================
// 4. الأدوات الهندسية المشتركة (Utility Functions)
// =========================================================================

// تأمين النصوص لمنع تكسر القوالب الحقلية
const esc = str => String(str || '').replace(/[&<>"']/g, m => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[m]));

// تأخير زمني مخصص للمؤثرات الحركية
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// محرك ضغط الصور المسبق عبر Canvas (يدعم WebP و PNG و JPEG)
function compressImageFile(file, maxDimension, quality, callback) {
  if (!file || !file.type.match(/^image\/(png|jpeg|jpg|webp)$/i)) return;
  
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      const max = maxDimension || 1200;
      if (w > max || h > max) {
        if (w > h) { h = Math.round((h * max) / w); w = max; }
        else { w = Math.round((w * max) / h); h = max; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, w);
      canvas.height = Math.max(1, h);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      
      // تصدير الصورة المضغوطة بصيغة WebP فائقة الخفة والكفاءة
      callback(canvas.toDataURL('image/webp', quality || 0.82));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// نظام التأكيد على الحذف من خطوتين
function armDel(initId, confId) {
  const initEl = document.getElementById(initId);
  const confEl = document.getElementById(confId);
  if (initEl) initEl.style.display = 'none';
  if (confEl) confEl.classList.add('active');
}

function disarmDel(initId, confId) {
  const initEl = document.getElementById(initId);
  const confEl = document.getElementById(confId);
  if (initEl) initEl.style.display = 'inline-block';
  if (confEl) confEl.classList.remove('active');
}

// =========================================================================
// 5. إدارة النوافذ المنبثقة التفاعلية (Modals Controller)
// =========================================================================

function openInsightModal() {
  const it = INSIGHTS[window.currentInsightIndex || 0];
  const qEl = document.getElementById('modalFullQuote');
  const sEl = document.getElementById('modalQuoteSource');
  if (qEl) qEl.innerText = it.full;
  if (sEl) sEl.innerText = it.src;
  const modal = document.getElementById('insightModal');
  if (modal) modal.style.display = 'flex';
}

function closeInsightModal() {
  const modal = document.getElementById('insightModal');
  if (modal) modal.style.display = 'none';
}

function openNotifModal() {
  const modal = document.getElementById('notifModal');
  if (modal) modal.style.display = 'flex';
}

function closeNotifModal() {
  const modal = document.getElementById('notifModal');
  if (modal) modal.style.display = 'none';
}

function openDrawioGuideModal() {
  const modal = document.getElementById('drawioModal');
  if (modal) modal.style.display = 'flex';
}

function closeDrawioGuideModal() {
  const modal = document.getElementById('drawioModal');
  if (modal) modal.style.display = 'none';
}

// محرك التلميحات الذكي المانع للفيضان خارج الشاشة
function initTooltips() {
  const tooltipEl = document.getElementById('masterTooltip');
  if (!tooltipEl) return;

  document.body.addEventListener('click', e => {
    const btn = e.target.closest('.beacon-btn');
    if (btn) {
      const text = btn.getAttribute('data-tip');
      tooltipEl.textContent = text;
      tooltipEl.classList.add('visible');
      
      const rect = btn.getBoundingClientRect();
      let left = Math.max(14, Math.min(window.innerWidth - 264, rect.left + rect.width / 2 - 125));
      let top = rect.bottom + 8;
      if (top + 60 > window.innerHeight) top = rect.top - 68;
      
      tooltipEl.style.left = `${left}px`;
      tooltipEl.style.top = `${top}px`;
    } else if (tooltipEl.classList.contains('visible')) {
      tooltipEl.classList.remove('visible');
    }
  });

  window.addEventListener('scroll', () => {
    if (tooltipEl.classList.contains('visible')) tooltipEl.classList.remove('visible');
  }, { passive: true });
}
