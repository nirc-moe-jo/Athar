/* =========================================================================
   أَثَـر • ATHAR ENGINE: SPATIAL HARDWARE PINNING THEATER (MASTER)
   البطولة الوطنية للابتكار والروبوت — وزارة التربية والتعليم وتنمية الموارد البشرية
   ========================================================================= */

let activeTargetCompIdx = null; // المكون الجاري إسقاطه
let relocatingPinIdx = null;    // الدبوس الجاري نقله
let radialPinIdx = null;        // الدبوس النشط في القائمة الدائرية
let suppressNextClick = false;  // حاجز ذكي لمنع فتح الدرج بعد انتهاء الضغط المطول

// =========================================================================
// 1. إدارة صورة النموذج النهائي وعرضها
// =========================================================================

function handleRobotImageUpload(input) {
  if (input.files && input.files[0]) {
    compressImageFile(input.files[0], 1200, 0.82, base64 => {
      state.h3.robotImg = base64;
      displayRobotImg(base64);
      if (typeof persistState === 'function') persistState();
    });
  }
}

function displayRobotImg(src) {
  const img = document.getElementById('robotImageEl');
  const emptyPrompt = document.getElementById('h3_empty_prompt');
  if (img && src) {
    img.src = src;
    img.style.display = 'block';
    if (emptyPrompt) emptyPrompt.style.display = 'none';
    renderPins();
  }
}

// =========================================================================
// 2. التقاط موضع النقر المقيد الصارم داخل أبعاد الصورة حصراً
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const tightFrame = document.getElementById('imageTightFrame');
  if (!tightFrame) return;

  tightFrame.addEventListener('click', e => {
    // تجاهل النقر إذا كان فوق الدبوس نفسه أو القائمة
    if (e.target.closest('.pin-specimen-node') || e.target.closest('.radial-menu-wheel')) return;

    const img = document.getElementById('robotImageEl');
    if (!img || !img.src || img.style.display === 'none') return;

    const rect = img.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // حساب نسبي مئوي محكوم بنطاق أمان [1.5% - 98.5%] لمنع خروج المؤشر
    const xPercent = Math.max(1.5, Math.min(98.5, +((clickX / rect.width) * 100).toFixed(2)));
    const yPercent = Math.max(1.5, Math.min(98.5, +((clickY / rect.height) * 100).toFixed(2)));

    // حالة 1: نقل دبوس موجود لموضع جديد
    if (relocatingPinIdx !== null) {
      if (state.h3.pins[relocatingPinIdx]) {
        state.h3.pins[relocatingPinIdx].x = xPercent;
        state.h3.pins[relocatingPinIdx].y = yPercent;
      }
      relocatingPinIdx = null;
      hideToast();
      renderPins();
      if (typeof persistState === 'function') persistState();
      return;
    }

    // حالة 2: إسقاط دبوس جديد بعد اختياره من الشريط
    if (activeTargetCompIdx !== null) {
      const existing = state.h3.pins.find(p => p.compIndex === activeTargetCompIdx);
      if (existing) {
        existing.x = xPercent;
        existing.y = yPercent;
      } else {
        state.h3.pins.push({ compIndex: activeTargetCompIdx, x: xPercent, y: yPercent });
      }
      
      const assignedIdx = activeTargetCompIdx;
      activeTargetCompIdx = null;
      hideToast();
      renderPins();
      if (typeof persistState === 'function') persistState();
      openDrawer(assignedIdx);
    }
  });
});

// =========================================================================
// 3. رسم الدبابيس المقيدة والتعامل المصفى مع اللمس
// =========================================================================

function renderPins() {
  const overlay = document.getElementById('pinsStrictOverlay');
  if (!overlay) return;
  overlay.innerHTML = '';

  if (!state.h3.pins) state.h3.pins = [];

  state.h3.pins.forEach((pin, idx) => {
    const num = String(pin.compIndex + 1).padStart(2, '0');
    const node = document.createElement('div');
    node.className = `pin-specimen-node ${relocatingPinIdx === idx ? 'is-relocating' : ''}`;
    node.style.left = `${pin.x}%`;
    node.style.top = `${pin.y}%`;
    node.innerHTML = `<div class="pin-core-disc">${num}</div>`;

    // 1. النقر العادي المباشر: فحص المكون مع تصفية النقرات الوهمية
    node.onclick = e => {
      e.stopPropagation();
      if (suppressNextClick) {
        suppressNextClick = false;
        return; // حجب النقرة الناتجة عن رفع الإصبع بعد الضغط المطول
      }
      openDrawer(pin.compIndex);
    };

    // 2. النقر الأيمن (Desktop): فتح القائمة الدائرية
    node.oncontextmenu = e => {
      e.preventDefault();
      e.stopPropagation();
      openRadialMenu(idx, e.clientX, e.clientY);
    };

    // 3. الضغط المطول المحصن للهواتف (Long-press 400ms + Haptic)
    let holdTimer = null;
    let startX = 0, startY = 0;

    node.addEventListener('touchstart', e => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;

      holdTimer = setTimeout(() => {
        suppressNextClick = true; // تفعيل حاجز النقرة فور فتح القائمة
        if (navigator.vibrate) navigator.vibrate(45);
        openRadialMenu(idx, touch.clientX, touch.clientY);
      }, 400);
    }, { passive: true });

    node.addEventListener('touchmove', e => {
      const touch = e.touches[0];
      if (Math.hypot(touch.clientX - startX, touch.clientY - startY) > 8) {
        clearTimeout(holdTimer);
      }
    }, { passive: true });

    node.addEventListener('touchend', () => {
      clearTimeout(holdTimer);
      setTimeout(() => { suppressNextClick = false; }, 350);
    });
    node.addEventListener('touchcancel', () => clearTimeout(holdTimer));

    overlay.appendChild(node);
  });

  renderBomChips();
}

// =========================================================================
// 4. القائمة الدائرية الشعاعية (The Radial Pie Menu)
// =========================================================================

function openRadialMenu(pinIdx, clientX, clientY) {
  radialPinIdx = pinIdx;
  const scrim = document.getElementById('radialScrim');
  const wheel = document.getElementById('radialWheel');
  const hubNum = document.getElementById('pieHubNum');

  if (hubNum && state.h3.pins[pinIdx]) {
    hubNum.innerText = String(state.h3.pins[pinIdx].compIndex + 1).padStart(2, '0');
  }

  const winW = window.innerWidth, winH = window.innerHeight;
  const posX = Math.max(110, Math.min(winW - 110, clientX));
  const posY = Math.max(110, Math.min(winH - 110, clientY));

  if (wheel) {
    wheel.style.left = `${posX}px`;
    wheel.style.top = `${posY}px`;
  }

  if (scrim) scrim.classList.add('visible');
}

function closeRadialMenu(e) {
  if (e && e.target !== document.getElementById('radialScrim')) return;
  const scrim = document.getElementById('radialScrim');
  if (scrim) scrim.classList.remove('visible');
  radialPinIdx = null;
}

function triggerRadialAction(act) {
  const idx = radialPinIdx;
  const scrim = document.getElementById('radialScrim');
  if (scrim) scrim.classList.remove('visible');
  if (idx === null || !state.h3.pins[idx]) return;

  if (act === 'relocate') {
    relocatingPinIdx = idx;
    // توجيه دقيق ومباشر للإجراء الفعلي
    showToast('انقر فوق المكان الجديد على صورة الروبوت لنقل الدبوس إليه مباشرة');
  } else if (act === 'inspect') {
    openDrawer(state.h3.pins[idx].compIndex);
  } else if (act === 'remove') {
    state.h3.pins.splice(idx, 1);
    renderPins();
    closeDrawer();
    if (typeof persistState === 'function') persistState();
  } else if (act === 'reassign') {
    openReassignModal(idx);
  }
}

// =========================================================================
// 5. محرك التبديل والمبادلة الذكي (The Smart Swap Engine)
// =========================================================================

function openReassignModal(pinIdx) {
  const modal = document.getElementById('reassignModal');
  const stream = document.getElementById('reassignOptionsStream');
  if (!modal || !stream) return;
  
  renderReassignList(pinIdx);
  modal.style.display = 'flex';
}

function renderReassignList(pinIdx) {
  const stream = document.getElementById('reassignOptionsStream');
  if (!stream) return;
  stream.innerHTML = '';

  const currentCompIdx = state.h3.pins[pinIdx].compIndex;

  state.h3.catalog.forEach((item, cIdx) => {
    const isCurrent = (cIdx === currentCompIdx);
    const isPlacedElsewhere = state.h3.pins.some((p, i) => p.compIndex === cIdx && i !== pinIdx);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-append-atom';
    btn.style.cssText = `width:100%; justify-content:space-between; padding:10px 14px; background:${isCurrent ? 'var(--gold-soft)' : '#ffffff'}; border-color:${isCurrent ? 'var(--gold-primary)' : 'var(--border-whisper)'}; margin-bottom:4px;`;

    btn.innerHTML = `
      <div style="text-align:right;">
        <strong style="font-size:12px; display:block; color:var(--ink-deep);">${String(cIdx + 1).padStart(2, '0')} • ${item.name || 'مكون بدون اسم'}</strong>
        <span style="font-size:10px; color:var(--ink-subtle); font-family:var(--font-code);">${item.model || '-'}</span>
      </div>
      <span style="font-size:10.5px; font-weight:700; color:${isCurrent ? 'var(--gold-deep)' : (isPlacedElsewhere ? 'var(--gold-primary)' : 'var(--emerald-serene)')};">
        ${isCurrent ? 'المعين حالياً ✓' : (isPlacedElsewhere ? 'مسقط مسبقاً • خيارات المبادلة ⇄' : 'اختيار كبديل +')}
      </span>
    `;

    btn.onclick = () => {
      if (isCurrent) return;

      if (isPlacedElsewhere) {
        // عرض شاشة الخيارات الذكية (المبادلة أو استبدال هذا وحذف النقطة المستبدل بها)
        showSwapOptionsView(pinIdx, cIdx);
      } else {
        // تعيين فوري لمكون غير مسقط
        state.h3.pins[pinIdx].compIndex = cIdx;
        renderPins();
        closeReassignModal();
        if (typeof persistState === 'function') persistState();
        openDrawer(cIdx);
      }
    };

    stream.appendChild(btn);
  });
}

// عرض خيارات التبديل الذكية عند اختيار مكون مسقط مسبقاً
function showSwapOptionsView(pinIdx, targetCompIdx) {
  const stream = document.getElementById('reassignOptionsStream');
  if (!stream) return;

  const currentCompIdx = state.h3.pins[pinIdx].compIndex;
  const currentItem = state.h3.catalog[currentCompIdx] || { name: 'المكون الحالي' };
  const targetItem = state.h3.catalog[targetCompIdx] || { name: 'المكون المختار' };
  const otherPinIdx = state.h3.pins.findIndex(p => p.compIndex === targetCompIdx);

  stream.innerHTML = `
    <div style="background:var(--gold-soft); border:1px solid var(--gold-border); border-radius:var(--radius-sm); padding:12px; display:flex; flex-direction:column; gap:6px;">
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="font-size:16px;">⇄</span>
        <strong style="font-size:12.5px; color:var(--gold-deep);">المكون [${targetItem.name || 'المكون'}] مسقط مسبقاً على النموذج</strong>
      </div>
      <p style="font-size:11px; color:var(--ink-soft); line-height:1.6; margin:0;">
        حدد الإجراء المطلوب لتنفيذ عملية التبديل لهذا الدبوس:
      </p>
    </div>

    <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
      <!-- الخيار الأول: مبادلة الموضعين بين الدبوسين -->
      <button type="button" class="btn-append-atom" id="btnSwapBoth" style="width:100%; justify-content:space-between; padding:12px 14px; background:#ffffff; border-color:var(--gold-primary);">
        <div style="text-align:right;">
          <strong style="font-size:12px; color:var(--ink-deep); display:block;">🔄 مبادلة الموضعين (استبدال هذا مكان هذا)</strong>
          <span style="font-size:10px; color:var(--ink-subtle);">يأخذ هذا الدبوس [${targetItem.name}]، وينتقل [${currentItem.name}] إلى موضع النقطة الأخرى.</span>
        </div>
        <span style="font-size:11px; font-weight:700; color:var(--gold-primary);">مبادلة</span>
      </button>

      <!-- الخيار الثاني: استبدال هذا مع إزالة النقطة المستبدل بها -->
      <button type="button" class="btn-append-atom" id="btnRemoveReplacedPoint" style="width:100%; justify-content:space-between; padding:12px 14px; background:#ffffff; border-color:var(--border-whisper);">
        <div style="text-align:right;">
          <strong style="font-size:12px; color:var(--ink-deep); display:block;">✕ استبدال هذا المكون مع إزالة النقطة المستبدل بها</strong>
          <span style="font-size:10px; color:var(--ink-subtle);">يُعيّن [${targetItem.name}] لهذا الدبوس، وتُحذف النقطة المستبدل بها من على النموذج.</span>
        </div>
        <span style="font-size:11px; font-weight:700; color:var(--red-alert);">إزالة المستبدل بها</span>
      </button>

      <!-- زر رجوع للقائمة -->
      <button type="button" class="btn-append-atom" id="btnBackToList" style="width:100%; justify-content:center; padding:8px; background:transparent; border-style:dashed;">
        <span>← تراجع واختيار مكون آخر</span>
      </button>
    </div>
  `;

  // 1. تنفيذ مبادلة الموضعين (استبدال هذا مكان هذا)
  document.getElementById('btnSwapBoth').onclick = () => {
    if (otherPinIdx !== -1) {
      state.h3.pins[pinIdx].compIndex = targetCompIdx;
      state.h3.pins[otherPinIdx].compIndex = currentCompIdx;
      renderPins();
      closeReassignModal();
      if (typeof persistState === 'function') persistState();
      openDrawer(targetCompIdx);
    }
  };

  // 2. تنفيذ استبدال هذا المكون مع إزالة النقطة المستبدل بها
  document.getElementById('btnRemoveReplacedPoint').onclick = () => {
    if (otherPinIdx !== -1) {
      state.h3.pins[pinIdx].compIndex = targetCompIdx;
      state.h3.pins.splice(otherPinIdx, 1); // إزالة النقطة المستبدل بها
      renderPins();
      closeReassignModal();
      if (typeof persistState === 'function') persistState();
      openDrawer(targetCompIdx);
    }
  };

  // الرجوع للقائمة
  document.getElementById('btnBackToList').onclick = () => {
    renderReassignList(pinIdx);
  };
}

function closeReassignModal() {
  const modal = document.getElementById('reassignModal');
  if (modal) modal.style.display = 'none';
}

// =========================================================================
// 6. شريط شرائح الـ BOM ودرج الفحص السريع
// =========================================================================

function renderBomChips() {
  const deck = document.getElementById('bomChipsDeck');
  if (!deck) return;
  deck.innerHTML = '';

  if (!state.h3.catalog || state.h3.catalog.length === 0) {
    deck.innerHTML = '<span style="font-size:11px; color:var(--ink-subtle); padding:4px;">بانتظار إدراج المكونات في قائمة العتاد أعلاه...</span>';
    return;
  }

  state.h3.catalog.forEach((item, i) => {
    const pin = state.h3.pins.find(p => p.compIndex === i);
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `bom-chip-token ${pin ? 'is-located' : ''} ${activeTargetCompIdx === i ? 'is-active-target' : ''}`;
    chip.innerHTML = `<span>${String(i + 1).padStart(2, '0')}</span> <span>${item.name || 'مكون'}</span> <span>${pin ? '✓' : '＋'}</span>`;

    chip.onclick = () => {
      if (!state.h3.robotImg) {
        document.getElementById('h3_robot_file')?.click();
        return;
      }

      if (pin) {
        openDrawer(i);
      } else {
        activeTargetCompIdx = i;
        relocatingPinIdx = null;
        showToast(`انقر الآن فوق موضع [${item.name || 'المكون'}] على الصورة لتثبيته`);
        renderBomChips();
      }
    };

    deck.appendChild(chip);
  });
}

function openDrawer(compIdx) {
  const item = state.h3.catalog ? state.h3.catalog[compIdx] : null;
  if (!item) return;

  const drawer = document.getElementById('inspectDrawer');
  if (!drawer) return;
  drawer.style.display = 'flex';

  document.getElementById('drawerNum').innerText = String(compIdx + 1).padStart(2, '0');
  document.getElementById('drawerTitle').innerText = item.name || 'مكون بدون اسم';
  document.getElementById('drawerModel').innerText = item.model || '-';
  document.getElementById('drawerReason').innerText = item.reason || 'لم تُدون مسوغات بعد';
  document.getElementById('drawerCost').innerText = `${item.cost || '0.00'} د.أ (الكمية: ${item.qty || '1'})`;
  document.getElementById('drawerUpgrade').innerText = item.upgrade || 'لا توجد خطة ترقية مسجلة';
}

function closeDrawer() {
  const drawer = document.getElementById('inspectDrawer');
  if (drawer) drawer.style.display = 'none';
}

function showToast(msg) {
  const toast = document.getElementById('targetToast');
  if (toast) {
    toast.innerText = msg;
    toast.style.display = 'block';
  }
}

function hideToast() {
  const toast = document.getElementById('targetToast');
  if (toast) toast.style.display = 'none';
}
