/* =========================================================================
   أَثَـر • ATHAR ENGINE: SPATIAL HARDWARE PINNING THEATER
   البطولة الوطنية للابتكار والروبوت — وزارة التربية والتعليم وتنمية الموارد البشرية
   ========================================================================= */

let activeTargetCompIdx = null; // المكون الجاري إسقاطه
let relocatingPinIdx = null;    // الدبوس الجاري نقله
let radialPinIdx = null;        // الدبوس النشط في القائمة الدائرية

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
    if (e.target.closest('.pin-specimen-node') || e.target.closest('.radial-menu-wheel')) return;

    const img = document.getElementById('robotImageEl');
    if (!img || !img.src || img.style.display === 'none') return;

    const rect = img.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = Math.max(1.5, Math.min(98.5, +((clickX / rect.width) * 100).toFixed(2)));
    const yPercent = Math.max(1.5, Math.min(98.5, +((clickY / rect.height) * 100).toFixed(2)));

    // نقل دبوس موجود
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

    // إسقاط دبوس جديد
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
// 3. رسم الدبابيس المقيدة والتعامل مع اللمس والضغط المطول
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

    // 1. النقر العادي: فحص
    node.onclick = e => {
      e.stopPropagation();
      openDrawer(pin.compIndex);
    };

    // 2. النقر الأيمن (Desktop): القائمة الدائرية
    node.oncontextmenu = e => {
      e.preventDefault();
      e.stopPropagation();
      openRadialMenu(idx, e.clientX, e.clientY);
    };

    // 3. الضغط المطول للهواتف (Long-press 400ms + Haptic Vibration)
    let holdTimer = null;
    let startX = 0, startY = 0;

    node.addEventListener('touchstart', e => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;

      holdTimer = setTimeout(() => {
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

    node.addEventListener('touchend', () => clearTimeout(holdTimer));
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
    showToast('انقر الآن على الموضع الجديد داخل الصورة لنقل هذا المؤشر');
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
// 5. نافذة اختيار المكون البديل الواعية (Reassignment Engine)
// =========================================================================

function openReassignModal(pinIdx) {
  const modal = document.getElementById('reassignModal');
  const stream = document.getElementById('reassignOptionsStream');
  if (!modal || !stream) return;
  stream.innerHTML = '';

  const currentCompIdx = state.h3.pins[pinIdx].compIndex;

  state.h3.catalog.forEach((item, cIdx) => {
    const isCurrent = (cIdx === currentCompIdx);
    const isPlacedElsewhere = state.h3.pins.some((p, i) => p.compIndex === cIdx && i !== pinIdx);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-append-atom';
    btn.style.cssText = `width:100%; justify-content:space-between; padding:10px 14px; background:${isCurrent ? 'var(--gold-soft)' : '#ffffff'}; border-color:${isCurrent ? 'var(--gold-primary)' : 'var(--border-whisper)'};`;
    
    btn.innerHTML = `
      <div style="text-align:right;">
        <strong style="font-size:12px; display:block; color:var(--ink-deep);">${String(cIdx + 1).padStart(2, '0')} • ${item.name || 'مكون بدون اسم'}</strong>
        <span style="font-size:10px; color:var(--ink-subtle); font-family:var(--font-code);">${item.model || '-'}</span>
      </div>
      <span style="font-size:10.5px; font-weight:700; color:${isCurrent ? 'var(--gold-deep)' : (isPlacedElsewhere ? 'var(--ink-subtle)' : 'var(--gold-primary)')};">
        ${isCurrent ? 'المعين حالياً ✓' : (isPlacedElsewhere ? 'مسقط مسبقاً' : 'اختيار كبديل ⇄')}
      </span>
    `;

    btn.onclick = () => {
      state.h3.pins[pinIdx].compIndex = cIdx;
      renderPins();
      closeReassignModal();
      if (typeof persistState === 'function') persistState();
      openDrawer(cIdx);
    };

    stream.appendChild(btn);
  });

  modal.style.display = 'flex';
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
