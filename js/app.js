/* =========================================================================
   أَثَـر • ATHAR ENGINE: MASTER ORCHESTRATOR & APPLICATION BRAIN
   البطولة الوطنية للابتكار والروبوت — وزارة التربية والتعليم وتنمية الموارد البشرية
   ========================================================================= */

let activeHorizonIndex = 0;
window.currentInsightIndex = 0;

// =========================================================================
// 1. محرك التنقل المشهدي المركّز (Horizon Studio Viewport Switching)
// =========================================================================

function switchHorizon(index) {
  activeHorizonIndex = index;

  // إظهار الأفق المختار وإخفاء باقي الآفاق لمنع التشتت والإجهاد المعرفي
  document.querySelectorAll('.horizon-pane').forEach((pane, i) => {
    pane.classList.toggle('active', i === index);
  });

  // تحديث حالة الأزرار في الشريط السفلي العائم
  document.querySelectorAll('.dock-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  // تحديث عنوان الأفق في رادار الرأس
  const horizonTitles = [
    "الأفق 01: أساس المشروع والمشكلة",
    "الأفق 02: مسار التجريب والتطوير",
    "الأفق 03: التصميم والعتاد المادي",
    "الأفق 04: الابتكار التقني والتحقق",
    "الأفق 05: هوية الفريق وبصمة الصانع"
  ];
  const radarLabel = document.getElementById('radarHorizonLabel');
  if (radarLabel) radarLabel.innerText = horizonTitles[index];

  // انزلاق سلس ومريح لأعلى الصفحة
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // إعادة تدقيق مؤشرات الإنجاز
  triggerProgressAudit();
}

// =========================================================================
// 2. محرك قبس البصيرة القرآني والنبوي المتدفق (Insight Marquee Engine)
// =========================================================================

async function runInsightEngine() {
  const textEl = document.getElementById('insightText');
  const vpEl = document.getElementById('insightViewport');
  if (!textEl || !vpEl) return;

  while (true) {
    const item = INSIGHTS[window.currentInsightIndex];
    textEl.style.opacity = '0';
    textEl.style.right = '0px';
    textEl.textContent = item.short;

    await sleep(50);
    textEl.style.opacity = '1';
    await sleep(2200);

    // حساب فيضان النص وتمريره أفقياً بنعومة إذا تجاوز العرض
    const overflow = textEl.scrollWidth - vpEl.clientWidth;
    if (overflow > 6) {
      const duration = overflow / 28;
      textEl.style.transition = `right ${duration}s linear`;
      textEl.style.right = `-${overflow + 8}px`;
      await sleep(duration * 1000);
    }

    await sleep(3500);
    textEl.style.transition = 'opacity 0.4s';
    textEl.style.opacity = '0';
    await sleep(400);

    window.currentInsightIndex = (window.currentInsightIndex + 1) % INSIGHTS.length;
  }
}

// =========================================================================
// 3. الأفق 01: أساس المشروع، التحديات، والمسارات البديلة
// =========================================================================

function evaluateOriginWords() {
  const narrationEl = document.getElementById('h1_narration');
  if (!narrationEl) return;

  const text = narrationEl.value.trim();
  const count = text ? text.split(/\s+/).filter(Boolean).length : 0;
  
  const digitEl = document.getElementById('originWordDigit');
  const wrapEl = document.getElementById('originMeterWrap');
  if (digitEl) digitEl.innerText = count;
  if (wrapEl) wrapEl.className = (count >= 50 && count <= 100) ? 'word-meter in-range' : 'word-meter out-range';

  state.h1.narration = narrationEl.value;
  persistState();
}

function renderChallenges() {
  const stream = document.getElementById('h1_challenges_stream');
  if (!stream) return;
  stream.innerHTML = '';

  state.h1.challenges.forEach((ch, idx) => {
    const row = document.createElement('div');
    row.style.cssText = "background:#fff; border:1px solid var(--border-whisper); border-radius:var(--radius-sm); padding:10px; display:flex; flex-direction:column; gap:8px;";
    row.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-family:var(--font-code); font-size:11px; font-weight:700;">التحدي ${String(idx+1).padStart(2,'0')}</span>
        ${state.h1.challenges.length > 1 ? `
          <div>
            <button type="button" class="btn-discrete-del" onclick="armDel('ch_del_${idx}', 'ch_conf_${idx}')" id="ch_del_${idx}">استبعاد</button>
            <div class="confirm-deck" id="ch_conf_${idx}">
              <button type="button" class="btn-affirm" onclick="removeChallenge(${idx})">تأكيد</button>
              <button type="button" class="btn-cancel" onclick="disarmDel('ch_del_${idx}', 'ch_conf_${idx}')">تراجع</button>
            </div>
          </div>
        ` : ''}
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:6px;">
        <input type="text" placeholder="توصيف العائق الفني..." value="${esc(ch.challenge)}" oninput="state.h1.challenges[${idx}].challenge=this.value; persistState();">
        <input type="text" placeholder="السبب الجذري للعائق..." value="${esc(ch.analysis)}" oninput="state.h1.challenges[${idx}].analysis=this.value; persistState();">
        <input type="text" placeholder="المعالجة الهندسية المقترحة..." value="${esc(ch.solution)}" oninput="state.h1.challenges[${idx}].solution=this.value; persistState();">
      </div>
    `;
    stream.appendChild(row);
  });

  const countEl = document.getElementById('h1_ch_count');
  if (countEl) countEl.innerText = `${String(state.h1.challenges.length).padStart(2,'0')} تحديات`;
}

function appendChallengeRow() {
  state.h1.challenges.push({ challenge: "", analysis: "", solution: "" });
  renderChallenges();
  persistState();
}

function removeChallenge(idx) {
  state.h1.challenges.splice(idx, 1);
  renderChallenges();
  persistState();
}

function renderStrategies() {
  const stream = document.getElementById('h1_strategies_stream');
  if (!stream) return;
  stream.innerHTML = '';

  state.h1.strategies.forEach((st, sIdx) => {
    const isAdopted = (state.h1.adoptedIndex === sIdx);
    const card = document.createElement('div');
    card.style.cssText = `background:#fff; border:1.5px solid ${isAdopted ? 'var(--gold-primary)' : 'var(--border-whisper)'}; border-radius:var(--radius-sm); padding:12px; display:flex; flex-direction:column; gap:8px;`;
    
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-family:var(--font-code); font-size:11px; font-weight:700;">المسار ${String(sIdx+1).padStart(2,'0')} ${isAdopted ? '• [المعتمد للمشروع]' : ''}</span>
        ${state.h1.strategies.length > 2 ? `
          <div>
            <button type="button" class="btn-discrete-del" onclick="armDel('st_del_${sIdx}', 'st_conf_${sIdx}')" id="st_del_${sIdx}">استبعاد</button>
            <div class="confirm-deck" id="st_conf_${sIdx}">
              <button type="button" class="btn-affirm" onclick="removeStrategy(${sIdx})">تأكيد</button>
              <button type="button" class="btn-cancel" onclick="disarmDel('st_del_${sIdx}', 'st_conf_${sIdx}')">تراجع</button>
            </div>
          </div>
        ` : ''}
      </div>
      <input type="text" placeholder="مسمى المسار الاستراتيجي البديل..." value="${esc(st.title)}" oninput="state.h1.strategies[${sIdx}].title=this.value; updateAdoptedView(); persistState();" style="font-weight:600;">
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px;">
        <div>
          <span style="font-size:10px; color:var(--emerald-serene); font-weight:700;">نقاط القوة والمكاسب:</span>
          ${st.pros.map((p, pIdx) => `<input type="text" style="margin-top:3px;" placeholder="مكسب تشغيلي..." value="${esc(p)}" oninput="state.h1.strategies[${sIdx}].pros[${pIdx}]=this.value; persistState();">`).join('')}
        </div>
        <div>
          <span style="font-size:10px; color:var(--red-alert); font-weight:700;">نقاط الضعف والمحددات:</span>
          ${st.cons.map((c, cIdx) => `<input type="text" style="margin-top:3px;" placeholder="محدد أو مخاطرة..." value="${esc(c)}" oninput="state.h1.strategies[${sIdx}].cons[${cIdx}]=this.value; persistState();">`).join('')}
        </div>
      </div>
    `;
    stream.appendChild(card);
  });

  const countEl = document.getElementById('h1_st_count');
  if (countEl) countEl.innerText = `${String(state.h1.strategies.length).padStart(2,'0')} مسارات`;
  updateAdoptedView();
}

function appendStrategyNode() {
  state.h1.strategies.push({ title: "", pros: [""], cons: [""] });
  renderStrategies();
  persistState();
}

function removeStrategy(idx) {
  state.h1.strategies.splice(idx, 1);
  if (state.h1.adoptedIndex === idx) state.h1.adoptedIndex = null;
  else if (state.h1.adoptedIndex > idx) state.h1.adoptedIndex--;
  renderStrategies();
  persistState();
}

function updateAdoptedView() {
  const v = document.getElementById('h1_adopted_view');
  if (!v) return;

  if (state.h1.adoptedIndex !== null && state.h1.strategies[state.h1.adoptedIndex]) {
    v.innerText = `المسار ${state.h1.adoptedIndex + 1}: ${state.h1.strategies[state.h1.adoptedIndex].title || 'مسار معتمد'}`;
  } else {
    v.innerText = 'لم يتم تحديد المسار المعتمد بعد';
  }
}

function openAdoptedPickerModal() {
  const stream = document.getElementById('adoptedOptionsStream');
  if (!stream) return;
  stream.innerHTML = '';

  state.h1.strategies.forEach((st, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-append-atom';
    btn.style.cssText = "width:100%; justify-content:space-between; padding:10px 14px;";
    btn.innerHTML = `<strong>المسار ${idx+1}: ${st.title || '(بدون عنوان)'}</strong> <span>اعتماد ✓</span>`;
    btn.onclick = () => {
      state.h1.adoptedIndex = idx;
      updateAdoptedView();
      renderStrategies();
      closeAdoptedPickerModal();
      persistState();
    };
    stream.appendChild(btn);
  });

  const modal = document.getElementById('adoptedPickerModal');
  if (modal) modal.style.display = 'flex';
}

function closeAdoptedPickerModal() {
  const modal = document.getElementById('adoptedPickerModal');
  if (modal) modal.style.display = 'none';
}

// ============================================================
// 4. الأفق 02: مسار التجريب ودورات التطوير المستمر
// ============================================================

function renderTrials() {
  const stream = document.getElementById('h2_trials_stream');
  if (!stream) return;
  stream.innerHTML = '';

  if (!state.h2.trials || state.h2.trials.length === 0) {
    stream.innerHTML = `
      <div class="empty-stream-card">
        <span>لا توجد تجارب مسجلة بعد.</span>
        <span style="font-size:10px;">اضغط على زر "+ إدراج تجربة جديدة" لتوثيق المحاولة الأولى.</span>
      </div>
    `;
    const countEl = document.getElementById('h2_trials_count');
    if (countEl) countEl.innerText = '00 تجارب مسجلة';
    return;
  }

  state.h2.trials.forEach((t, idx) => {
    const card = document.createElement('div');
    card.style.cssText = "background:#fff; border:1px solid var(--border-whisper); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:12px;";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-whisper); padding-bottom:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-family:var(--font-code); font-size:12px; font-weight:700;">التجربة ${String(idx+1).padStart(2,'0')}</span>
          <input type="date" value="${t.date||''}" onchange="state.h2.trials[${idx}].date=this.value; persistState();" style="width:auto; padding:2px 8px; font-size:11px;">
        </div>
        <div>
          <button type="button" class="btn-discrete-del" onclick="armDel('tr_del_${idx}', 'tr_conf_${idx}')" id="tr_del_${idx}">استبعاد التجربة</button>
          <div class="confirm-deck" id="tr_conf_${idx}">
            <button type="button" class="btn-affirm" onclick="removeTrial(${idx})">تأكيد</button>
            <button type="button" class="btn-cancel" onclick="disarmDel('tr_del_${idx}', 'tr_conf_${idx}')">تراجع</button>
          </div>
        </div>
      </div>
      <input type="text" placeholder="عنوان التجربة (مثال: اختبار استجابة الحساس الليزري في الظلام)..." value="${esc(t.title)}" oninput="state.h2.trials[${idx}].title=this.value; persistState();" style="font-weight:600;">
      <textarea rows="2" placeholder="هدف المحاولة وتوزيع أدوار الفريق في الاختبار..." oninput="state.h2.trials[${idx}].goal=this.value; persistState();">${esc(t.goal)}</textarea>
      
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">
        <div style="background:var(--emerald-bg); border:1px solid rgba(15,118,110,0.2); border-radius:var(--radius-sm); padding:10px;">
          <span style="font-size:11px; font-weight:700; color:var(--emerald-serene);">ما الذي نجح؟</span>
          <input type="text" style="margin:4px 0;" placeholder="الجزء أو السلوك الذي أدى وظيفته بدقة..." value="${esc(t.passT)}" oninput="state.h2.trials[${idx}].passT=this.value; persistState();">
          <textarea rows="2" placeholder="قرار الفريق للبناء على هذا النجاح واستثماره..." oninput="state.h2.trials[${idx}].passD=this.value; persistState();">${esc(t.passD)}</textarea>
        </div>
        <div style="background:var(--red-bg); border:1px solid rgba(185,28,28,0.2); border-radius:var(--radius-sm); padding:10px;">
          <span style="font-size:11px; font-weight:700; color:var(--red-alert);">ما الذي لم ينجح؟</span>
          <input type="text" style="margin:4px 0;" placeholder="موضع العائق وأسبابه الجذرية..." value="${esc(t.failT)}" oninput="state.h2.trials[${idx}].failT=this.value; persistState();">
          <textarea rows="2" placeholder="قرار الفريق الإجرائي لتجاوز هذا الخلل..." oninput="state.h2.trials[${idx}].failD=this.value; persistState();">${esc(t.failD)}</textarea>
        </div>
      </div>

      <div>
        <span style="font-size:11px; font-weight:600; color:var(--ink-deep);">القرار للمحاولة القادمة:</span>
        <input type="text" placeholder="الخطة الإجرائية المترتبة مباشرة للتنفيذ في الجولة التالية..." value="${esc(t.nextV)}" oninput="state.h2.trials[${idx}].nextV=this.value; persistState();">
      </div>
    `;
    stream.appendChild(card);
  });

  const countEl = document.getElementById('h2_trials_count');
  if (countEl) countEl.innerText = `${String(state.h2.trials.length).padStart(2,'0')} تجارب مسجلة`;
}

function appendTrialCard() {
  if (!state.h2.trials) state.h2.trials = [];
  state.h2.trials.push({
    date: new Date().toISOString().slice(0, 10),
    title: "",
    goal: "",
    summary: "",
    resImg: "",
    act1Img: "",
    act2Img: "",
    passT: "",
    passD: "",
    failT: "",
    failD: "",
    nextV: ""
  });
  renderTrials();
  persistState();
}

function removeTrial(idx) {
  state.h2.trials.splice(idx, 1);
  renderTrials();
  persistState();
}

// ============================================================
// 5. الأفق 03: جدول المكونات ومراحل التطور الزمني للتصميم
// ============================================================

function renderCatalog() {
  const stream = document.getElementById('h3_catalog_stream');
  if (!stream) return;
  stream.innerHTML = '';
  let sum = 0;

  if (!state.h3.catalog || state.h3.catalog.length === 0) {
    stream.innerHTML = `
      <div class="empty-stream-card">
        <span>لم يتم إدراج أي مكون في قائمة العتاد بعد.</span>
        <span style="font-size:10px;">اضغط على زر "+ إدراج مكون جديد" بالأسفل لبدء بناء القائمة.</span>
      </div>
    `;
    const costEl = document.getElementById('h3_total_cost');
    if (costEl) costEl.innerText = '0.00 د.أ';
    if (typeof renderBomChips === 'function') renderBomChips();
    if (typeof renderPins === 'function') renderPins();
    return;
  }

  state.h3.catalog.forEach((item, idx) => {
    const cost = parseFloat(item.cost) || 0;
    const qty = parseInt(item.qty, 10) || 1;
    sum += cost * qty;

    const row = document.createElement('div');
    row.style.cssText = "background:#fff; border:1px solid var(--border-whisper); border-radius:var(--radius-sm); padding:10px; display:flex; flex-direction:column; gap:8px;";
    row.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-family:var(--font-code); font-size:11px; font-weight:700;">المكون ${String(idx+1).padStart(2,'0')}</span>
        <div>
          <button type="button" class="btn-discrete-del" onclick="armDel('cat_del_${idx}', 'cat_conf_${idx}')" id="cat_del_${idx}">استبعاد</button>
          <div class="confirm-deck" id="cat_conf_${idx}">
            <button type="button" class="btn-affirm" onclick="removeCatalogItem(${idx})">تأكيد</button>
            <button type="button" class="btn-cancel" onclick="disarmDel('cat_del_${idx}', 'cat_conf_${idx}')">تراجع</button>
          </div>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:6px;">
        <input type="text" placeholder="اسم المكون (مثال: محرك سيرفو)..." value="${esc(item.name)}" oninput="state.h3.catalog[${idx}].name=this.value; renderBomChips(); persistState();">
        <input type="text" placeholder="الطراز: MG996R Metal Gear..." value="${esc(item.model)}" oninput="state.h3.catalog[${idx}].model=this.value; persistState();">
        <input type="number" step="0.5" placeholder="الكلفة: 0.00" value="${item.cost}" oninput="state.h3.catalog[${idx}].cost=this.value; renderCatalog(); persistState();">
        <input type="number" min="1" placeholder="الكمية: 1" value="${item.qty}" oninput="state.h3.catalog[${idx}].qty=this.value; renderCatalog(); persistState();">
      </div>
      <input type="text" placeholder="مسوغات الاختيار الهندسية وصلتها بالتحديات..." value="${esc(item.reason)}" oninput="state.h3.catalog[${idx}].reason=this.value; persistState();">
    `;
    stream.appendChild(row);
  });

  const costEl = document.getElementById('h3_total_cost');
  if (costEl) costEl.innerText = `${sum.toFixed(2)} د.أ`;

  if (typeof renderBomChips === 'function') renderBomChips();
  if (typeof renderPins === 'function') renderPins();
}

function appendCatalogRow() {
  if (!state.h3.catalog) state.h3.catalog = [];
  state.h3.catalog.push({ name: "", model: "", cost: "", qty: "1", reason: "", upgrade: "", link: "" });
  renderCatalog();
  persistState();
}

function removeCatalogItem(idx) {
  state.h3.catalog.splice(idx, 1);
  state.h3.pins = state.h3.pins.filter(p => p.compIndex !== idx).map(p => ({
    ...p,
    compIndex: p.compIndex > idx ? p.compIndex - 1 : p.compIndex
  }));
  renderCatalog();
  persistState();
}

// مراحل التطور الزمني للتصميم (4 محطات محصنة بالكامل مع رفع الصور)
function renderEvolution() {
  const grid = document.getElementById('h3_evolution_grid');
  if (!grid) return;
  grid.innerHTML = '';

  // ضمان وجود المحطات الأربع دائماً
  if (!state.h3.evolution || !Array.isArray(state.h3.evolution) || state.h3.evolution.length < 4) {
    state.h3.evolution = [
      { img: "", note: "" }, { img: "", note: "" }, { img: "", note: "" }, { img: "", note: "" }
    ];
  }

  const titles = [
    "المحطة 01: المفهوم الأولي",
    "المحطة 02: المحاولة الثانية",
    "المحطة 03: التحسين الثالث",
    "المحطة 04: الاعتماد النهائي"
  ];

  state.h3.evolution.forEach((evo, idx) => {
    const card = document.createElement('div');
    card.style.cssText = "background:#ffffff; border:1px solid var(--border-whisper); border-radius:var(--radius-sm); padding:12px; display:flex; flex-direction:column; gap:8px;";
    
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-whisper); padding-bottom:6px;">
        <strong style="font-size:11.5px; color:var(--gold-deep);">${titles[idx]}</strong>
        ${evo.img ? `
          <button type="button" class="btn-discrete-del" onclick="removeEvoImage(${idx})" style="color:var(--red-alert); font-size:10px;">إزالة الصورة</button>
        ` : ''}
      </div>

      <div class="media-shelf" style="min-height:110px; padding:10px; cursor:pointer;" onclick="document.getElementById('evo_file_${idx}').click()">
        <input type="file" id="evo_file_${idx}" accept="image/png, image/jpeg, image/webp" style="display:none;" onchange="handleEvoUpload(${idx}, this)">
        
        ${evo.img ? `
          <img src="${evo.img}" style="display:block; max-height:120px; width:100%; object-fit:contain; border-radius:4px;" alt="${titles[idx]}">
        ` : `
          <div class="upload-placeholder-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span class="upload-main-text" style="font-size:11px;">اضغط لرفع صورة المحطة</span>
            <span class="upload-sub-text">PNG, JPEG, WebP</span>
          </div>
        `}
      </div>

      <input type="text" placeholder="أبرز التحسينات المضافة في هذا النموذج..." value="${esc(evo.note)}" oninput="state.h3.evolution[${idx}].note=this.value; persistState();" style="font-size:11px; padding:6px 8px;">
    `;

    grid.appendChild(card);
  });
}

function handleEvoUpload(idx, input) {
  if (input.files && input.files[0]) {
    compressImageFile(input.files[0], 900, 0.82, base64 => {
      state.h3.evolution[idx].img = base64;
      renderEvolution();
      persistState();
    });
  }
}

function removeEvoImage(idx) {
  state.h3.evolution[idx].img = "";
  renderEvolution();
  persistState();
}

// ============================================================
// 6. الأفق 04: التصنيع الرقمي، الخوارزميات، والتحقق البشري
// ============================================================

function renderFab() {
  const stream = document.getElementById('h4_fab_stream');
  if (!stream) return;
  stream.innerHTML = '';

  if (!state.h4.fabItems || state.h4.fabItems.length === 0) {
    stream.innerHTML = `
      <div class="empty-stream-card">
        <span>لم تسجل أي قطع مصنعة رقمياً بعد.</span>
        <span style="font-size:10px;">اضغط على "+ إضافة ابتكار تصنيع جديد" لإضافة أول مجسم.</span>
      </div>
    `;
    const countEl = document.getElementById('h4_fab_count');
    if (countEl) countEl.innerText = '00 ابتكارات';
    return;
  }

  state.h4.fabItems.forEach((fab, idx) => {
    const card = document.createElement('div');
    card.style.cssText = "background:#fff; border:1px solid var(--border-whisper); border-radius:var(--radius-sm); padding:14px; display:flex; flex-direction:column; gap:8px;";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-family:var(--font-code); font-size:11px; font-weight:700;">ابتكار التصنيع ${String(idx+1).padStart(2,'0')}</span>
        <button type="button" class="btn-discrete-del" onclick="removeFabItem(${idx})">استبعاد</button>
      </div>
      <input type="text" placeholder="اسم القطعة المبتكرة (مثال: ذراع توجيه ثلاثي الأبعاد)..." value="${esc(fab.title)}" oninput="state.h4.fabItems[${idx}].title=this.value; persistState();" style="font-weight:600;">
      <input type="text" placeholder="المعضلة الميكانيكية التي حلها هذا التصميم المخصص..." value="${esc(fab.problem)}" oninput="state.h4.fabItems[${idx}].problem=this.value; persistState();">
      
      <div class="dual-media-grid">
        <div class="media-shelf" onclick="document.getElementById('cad_f_${idx}').click()">
          <input type="file" id="cad_f_${idx}" accept="image/png, image/jpeg, image/webp" style="display:none;" onchange="handleSubImgUpload('h4', 'fabItems', ${idx}, 'cadImg', this)">
          ${fab.cadImg ? `
            <img src="${fab.cadImg}" style="display:block;">
          ` : `
            <div class="upload-placeholder-content">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <span class="upload-main-text">المخطط الهندسي الرقمي (CAD)</span>
              <span class="upload-sub-text">اضغط للرفع • PNG, JPEG, WebP</span>
            </div>
          `}
        </div>

        <div class="media-shelf" onclick="document.getElementById('real_f_${idx}').click()">
          <input type="file" id="real_f_${idx}" accept="image/png, image/jpeg, image/webp" style="display:none;" onchange="handleSubImgUpload('h4', 'fabItems', ${idx}, 'realImg', this)">
          ${fab.realImg ? `
            <img src="${fab.realImg}" style="display:block;">
          ` : `
            <div class="upload-placeholder-content">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span class="upload-main-text">القطعة بعد التصنيع الفعلي</span>
              <span class="upload-sub-text">اضغط للرفع • PNG, JPEG, WebP</span>
            </div>
          `}
        </div>
      </div>
      <textarea rows="2" placeholder="مسوغات الشكل والأبعاد وتوزيع الكتل ومراكز الارتكاز..." oninput="state.h4.fabItems[${idx}].geoReason=this.value; persistState();">${esc(fab.geoReason)}</textarea>
      <textarea rows="2" placeholder="مسوغات اختيار الخامة (PLA, ABS, ألمنيوم...) ومقاومة الإجهاد..." oninput="state.h4.fabItems[${idx}].matReason=this.value; persistState();">${esc(fab.matReason)}</textarea>
    `;
    stream.appendChild(card);
  });

  const countEl = document.getElementById('h4_fab_count');
  if (countEl) countEl.innerText = `${String(state.h4.fabItems.length).padStart(2,'0')} ابتكارات`;
}

function appendFabItem() {
  if (!state.h4.fabItems) state.h4.fabItems = [];
  state.h4.fabItems.push({ title: "", problem: "", cadImg: "", realImg: "", geoReason: "", matReason: "" });
  renderFab();
  persistState();
}

function removeFabItem(idx) {
  state.h4.fabItems.splice(idx, 1);
  renderFab();
  persistState();
}

function renderAiStudies() {
  const stream = document.getElementById('h4_ai_stream');
  if (!stream) return;
  stream.innerHTML = '';

  if (!state.h4.aiStudies || state.h4.aiStudies.length === 0) {
    stream.innerHTML = `
      <div class="empty-stream-card">
        <span>لم تسجل أي دراسة لأداة متقدمة بعد.</span>
        <span style="font-size:10px;">اضغط على "+ إضافة دراسة حالة" لتوثيق أمانة الاستعانة بالأدوات.</span>
      </div>
    `;
    const countEl = document.getElementById('h4_ai_count');
    if (countEl) countEl.innerText = '00 دراسات';
    return;
  }

  state.h4.aiStudies.forEach((ai, idx) => {
    const card = document.createElement('div');
    card.style.cssText = "background:#fff; border:1px solid var(--border-whisper); border-radius:var(--radius-sm); padding:14px; display:flex; flex-direction:column; gap:8px;";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-family:var(--font-code); font-size:11px; font-weight:700;">دراسة الحالة ${String(idx+1).padStart(2,'0')}</span>
        <button type="button" class="btn-discrete-del" onclick="removeAiItem(${idx})">استبعاد</button>
      </div>
      <input type="text" placeholder="التحدي الفني المعالج (مثال: تصفية إشارة الحساس البرمجية)..." value="${esc(ai.challenge)}" oninput="state.h4.aiStudies[${idx}].challenge=this.value; persistState();">
      <input type="text" placeholder="اسم الأداة المستخدمة (مثال: ChatGPT, Claude, Copilot)..." value="${esc(ai.tool)}" oninput="state.h4.aiStudies[${idx}].tool=this.value; persistState();">
      <textarea rows="2" class="prompt-box" placeholder="التوجيه الدقيق الموجه للأداة (Prompt)..." oninput="state.h4.aiStudies[${idx}].prompt=this.value; persistState();">${esc(ai.prompt)}</textarea>
      <textarea rows="2" class="output-box" placeholder="المخرج أو الكود الأولي المقترح من الأداة..." oninput="state.h4.aiStudies[${idx}].output=this.value; persistState();">${esc(ai.output)}</textarea>
      <div style="background:var(--gold-soft); border:1px solid var(--gold-border); border-radius:var(--radius-sm); padding:10px;">
        <span style="font-size:10.5px; font-weight:700; color:var(--gold-deep);">التحقق والتقويم والتكييف البشري (أصالة العمل):</span>
        <textarea rows="2" placeholder="بيان مواضع الفحص البشري والخلل المكتشف في مخرج الأداة وكيف قام الفريق بتعديله واختباره واقعياً..." oninput="state.h4.aiStudies[${idx}].verification=this.value; persistState();">${esc(ai.verification)}</textarea>
      </div>
    `;
    stream.appendChild(card);
  });

  const countEl = document.getElementById('h4_ai_count');
  if (countEl) countEl.innerText = `${String(state.h4.aiStudies.length).padStart(2,'0')} دراسات`;
}

function appendAiItem() {
  if (!state.h4.aiStudies) state.h4.aiStudies = [];
  state.h4.aiStudies.push({ challenge: "", tool: "", prompt: "", output: "", verification: "" });
  renderAiStudies();
  persistState();
}

function removeAiItem(idx) {
  state.h4.aiStudies.splice(idx, 1);
  renderAiStudies();
  persistState();
}

// ============================================================
// 7. الأفق 05: هوية الفريق وبصمات الأثر والرسالة المستدامة
// ============================================================

function adjustTeamSize(size) {
  state.h5.teamSize = size;
  renderIdentity();
  persistState();
}

function renderIdentity() {
  const activeKeys = memberKeys.filter(k => !(k === 'st3' && state.h5.teamSize === '2'));
  if (!activeKeys.includes(state.h5.activeFpKey)) state.h5.activeFpKey = 'sup';

  const pDeck = document.getElementById('h5_profiles_deck');
  if (!pDeck) return;
  pDeck.innerHTML = '';

  activeKeys.forEach(k => {
    const m = state.h5.members[k];
    const card = document.createElement('div');
    card.className = 'member-profile-card';
    card.innerHTML = `
      <div class="avatar-vault" onclick="document.getElementById('av_f_${k}').click()">
        <input type="file" id="av_f_${k}" accept="image/png, image/jpeg, image/webp" style="display:none;" onchange="handleAvatarUpload('${k}', this)">
        ${m.img ? `<img src="${m.img}" style="display:block;">` : `<span style="font-size:11px; color:var(--ink-subtle);">+ صورة</span>`}
      </div>
      <span style="font-size:10px; font-weight:700; color:var(--gold-primary);">${k==='sup'?'المشرف الأكاديمي':'طالب مبتكر'}</span>
      <input type="text" placeholder="الاسم الكامل..." value="${esc(m.name)}" oninput="state.h5.members['${k}'].name=this.value; renderFpTabs(); persistState();" style="font-weight:600;">
      <input type="text" placeholder="الدور التخصصي..." value="${esc(m.role)}" oninput="state.h5.members['${k}'].role=this.value; renderFpTabs(); persistState();">
      ${k !== 'sup' ? `
        <select class="field-select" onchange="state.h5.members['${k}'].grade=this.value; persistState();">
          <option value="">تحديد الصف الدراسي...</option>
          ${['الصف السابع','الصف الثامن','الصف التاسع','الصف العاشر','الصف الحادي عشر','الصف الثاني عشر'].map(g=>`<option value="${g}" ${m.grade===g?'selected':''}>${g}</option>`).join('')}
        </select>
      ` : `
        <input type="text" placeholder="التخصص الأكاديمي..." value="${esc(m.major)}" oninput="state.h5.members['sup'].major=this.value; persistState();">
      `}
    `;
    pDeck.appendChild(card);
  });

  renderFpTabs();
  renderFpPanes();
}

function renderFpTabs() {
  const activeKeys = memberKeys.filter(k => !(k === 'st3' && state.h5.teamSize === '2'));
  const tabsBar = document.getElementById('h5_fp_tabs');
  if (!tabsBar) return;
  tabsBar.innerHTML = '';

  activeKeys.forEach(k => {
    const m = state.h5.members[k];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `footprint-tab-btn ${state.h5.activeFpKey === k ? 'active' : ''}`;
    btn.innerText = m.name || m.role || k;
    btn.onclick = () => {
      state.h5.activeFpKey = k;
      renderFpTabs();
      renderFpPanes();
    };
    tabsBar.appendChild(btn);
  });
}

function renderFpPanes() {
  const curKey = state.h5.activeFpKey;
  const m = state.h5.members[curKey];
  const fp = state.h5.footprints[curKey];
  const container = document.getElementById('h5_fp_panes');
  if (!container || !m || !fp) return;

  container.innerHTML = `
    <div class="stage-card" style="background:#fff;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong>${m.name || 'عضو الفريق'} • ${m.role}</strong>
        <input type="date" value="${fp.date||''}" onchange="state.h5.footprints['${curKey}'].date=this.value; persistState();" style="width:auto; font-size:11px;">
      </div>
      <input type="text" placeholder="مهمتي الرئيسية والمسؤولية المباشرة..." value="${esc(fp.role)}" oninput="state.h5.footprints['${curKey}'].role=this.value; persistState();">
      <textarea rows="2" placeholder="أهم مساهمة وفارق أفتخر به في نجاح المنظومة..." oninput="state.h5.footprints['${curKey}'].impact=this.value; persistState();">${esc(fp.impact)}</textarea>
      <textarea rows="2" placeholder="الدرس والتحول المهاري والفكري المكتسب..." oninput="state.h5.footprints['${curKey}'].lesson=this.value; persistState();">${esc(fp.lesson)}</textarea>
      <textarea rows="2" placeholder="الرسالة والأثر المستدام المراد تركه..." oninput="state.h5.footprints['${curKey}'].quote=this.value; persistState();">${esc(fp.quote)}</textarea>
    </div>
  `;
}

function handleAvatarUpload(k, input) {
  if (input.files && input.files[0]) {
    compressImageFile(input.files[0], 400, 0.8, base64 => {
      state.h5.members[k].img = base64;
      renderIdentity();
      persistState();
    });
  }
}

// ============================================================
// 8. وسائط الأفق 01 و 04 والمساعدات العامة
// ============================================================

function handleShelfUpload(stateProp, imgId, promptId, delContainerId, input) {
  if (input.files && input.files[0]) {
    compressImageFile(input.files[0], 1200, 0.82, base64 => {
      if (stateProp === 'h1_img') state.h1.image = base64;
      else if (stateProp === 'h4_flow') state.h4.flowImg = base64;

      const img = document.getElementById(imgId);
      const prompt = document.getElementById(promptId);
      const del = document.getElementById(delContainerId);
      if (img) { img.src = base64; img.style.display = 'block'; }
      if (prompt) prompt.style.display = 'none';
      if (del) del.style.display = 'block';
      persistState();
    });
  }
}

function handleSubImgUpload(section, subArray, idx, key, input) {
  if (input.files && input.files[0]) {
    compressImageFile(input.files[0], 800, 0.8, base64 => {
      state[section][subArray][idx][key] = base64;
      if (subArray === 'fabItems') renderFab();
      persistState();
    });
  }
}

function confirmShelfDel(stateProp, imgId, promptId, delContainerId, inputId) {
  if (stateProp === 'h1_img') state.h1.image = "";
  else if (stateProp === 'h4_flow') state.h4.flowImg = "";

  const img = document.getElementById(imgId);
  const prompt = document.getElementById(promptId);
  const del = document.getElementById(delContainerId);
  const input = document.getElementById(inputId);

  if (img) { img.src = ""; img.style.display = 'none'; }
  if (prompt) prompt.style.display = 'block';
  if (del) del.style.display = 'none';
  if (input) input.value = '';

  persistState();
}

// ============================================================
// 9. محرك قياس التقدم والتدقيق الهندسي المحصّن والتراكمي (Progress Radar)
// ============================================================

function triggerProgressAudit() {
  const has = s => Boolean(String(s || '').trim());

  // 1. تدقيق أفق 01 (الأساس)
  let h1_score = 0;
  const h1_words = (state.h1.narration || '').trim().split(/\s+/).filter(Boolean).length;
  if (h1_words >= 50) h1_score += 25;
  else if (h1_words > 0) h1_score += Math.round((h1_words / 50) * 20);

  if (state.h1.challenges && state.h1.challenges.some(c => has(c.challenge) && has(c.analysis))) h1_score += 25;
  if (state.h1.strategies && state.h1.strategies.some(s => has(s.title))) h1_score += 25;
  if (state.h1.adoptedIndex !== null && has(state.h1.statement)) h1_score += 25;
  
  const h1_ok = h1_score >= 95;
  updateBadgeSafe('badge_h0', h1_ok ? 'مكتمل ومستوفٍ ✓' : `${h1_score}% منجز`);
  updateDockCheckSafe('dock_chk_0', h1_ok);

  // 2. تدقيق أفق 02 (التجريب)
  let h2_score = 0;
  if (state.h2.trials && state.h2.trials.length > 0) {
    let t_scores = state.h2.trials.map(t => {
      let s = 0;
      if (has(t.title)) s += 25;
      if (has(t.goal)) s += 25;
      if (has(t.passT) || has(t.failT)) s += 25;
      if (has(t.nextV)) s += 25;
      return s;
    });
    h2_score = Math.round(t_scores.reduce((a, b) => a + b, 0) / state.h2.trials.length);
  }
  const h2_ok = h2_score >= 90;
  updateBadgeSafe('badge_h1', h2_ok ? 'مكتمل ومستوفٍ ✓' : `${h2_score}% منجز`);
  updateDockCheckSafe('dock_chk_1', h2_ok);

  // 3. تدقيق أفق 03 (التجسيد)
  let h3_score = 0;
  if (state.h3.catalog && state.h3.catalog.some(c => has(c.name) && has(c.reason))) h3_score += 35;
  if (Boolean(state.h3.robotImg)) h3_score += 35;
  if (state.h3.pins && state.h3.pins.length > 0) h3_score += 30;

  const h3_ok = h3_score >= 95;
  updateBadgeSafe('badge_h2', h3_ok ? 'مكتمل ومستوفٍ ✓' : `${h3_score}% منجز`);
  updateDockCheckSafe('dock_chk_2', h3_ok);

  // 4. تدقيق أفق 04 (الابتكار)
  let h4_score = 0;
  if (Boolean(state.h4.flowImg)) h4_score += 25;
  if (has(state.h4.algoCode) && has(state.h4.algoName)) h4_score += 25;
  if (state.h4.fabItems && state.h4.fabItems.some(f => has(f.title) && has(f.problem))) h4_score += 25;
  if (state.h4.aiStudies && state.h4.aiStudies.some(a => has(a.tool) && has(a.verification))) h4_score += 25;

  const h4_ok = h4_score >= 95;
  updateBadgeSafe('badge_h3', h4_ok ? 'مكتمل ومستوفٍ ✓' : `${h4_score}% منجز`);
  updateDockCheckSafe('dock_chk_3', h4_ok);

  // 5. تدقيق أفق 05 (الهوية)
  let h5_score = 0;
  const activeKeys = memberKeys.filter(k => !(k === 'st3' && state.h5.teamSize === '2'));
  let mem_scores = activeKeys.map(k => {
    let s = 0;
    const m = state.h5.members[k] || {};
    const fp = state.h5.footprints[k] || {};
    if (has(m.name)) s += 40;
    if (has(m.role)) s += 20;
    if (has(fp.impact) || has(fp.quote)) s += 40;
    return s;
  });
  h5_score = Math.round(mem_scores.reduce((a, b) => a + b, 0) / activeKeys.length);

  const h5_ok = h5_score >= 90;
  updateBadgeSafe('badge_h5', h5_ok ? 'مكتمل ومستوفٍ ✓' : `${h5_score}% منجز`);
  updateDockCheckSafe('dock_chk_4', h5_ok);

  // حساب المعدل العام التراكمي للمنظومة
  const overallPct = Math.round((h1_score + h2_score + h3_score + h4_score + h5_score) / 5);

  const pctEl = document.getElementById('radarPercentDigit');
  const barEl = document.getElementById('radarFillBar');
  if (pctEl) pctEl.innerText = `${overallPct}%`;
  if (barEl) barEl.style.width = `${overallPct}%`;

  // التوجيه الذكي للمتبقي في الأفق النشط حالياً
  const horizonScores = [h1_score, h2_score, h3_score, h4_score, h5_score];
  const curScore = horizonScores[activeHorizonIndex];
  const hints = [
    `الأفق 01 (${h1_score}%): ${h1_words < 50 ? 'اكتب 50 كلمة في المشكلة' : (state.h1.adoptedIndex === null ? 'حدد المسار المعتمد' : 'استكمل تفكيك التحديات')}`,
    `الأفق 02 (${h2_score}%): استكمل توثيق القرارات وتوزيع الأدوار في التجارب المسجلة`,
    `الأفق 03 (${h3_score}%): ${!state.h3.robotImg ? 'ارفع صورة النموذج النهائي' : (state.h3.pins.length === 0 ? 'أسقط دبابيس المكونات على الصورة' : 'أكمل مسوغات قطع BOM')}`,
    `الأفق 04 (${h4_score}%): ${!state.h4.flowImg ? 'ارفع المخطط الانسيابي' : (!has(state.h4.algoCode) ? 'اكتب شفرة الخوارزمية في الطرفية' : 'وثق دراسة التحقق البشري من الذكاء الاصطناعي')}`,
    `الأفق 05 (${h5_score}%): دوّن أسماء أعضاء الفريق ورسالة الأثر المستدام لكل عضو`
  ];

  const hintEl = document.getElementById('radarMissingHint');
  if (hintEl) {
    hintEl.innerText = curScore >= 95 ? `✓ هذا الأفق مكتمل ومستوفٍ بنسبة ${curScore}%` : hints[activeHorizonIndex];
  }
}

function updateBadgeSafe(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

function updateDockCheckSafe(id, isOk) {
  const el = document.getElementById(id);
  if (el) el.style.display = isOk ? 'inline-block' : 'none';
}

// ============================================================
// 10. الحفظ التلقائي والاسترجاع السحابي/المحلي (Persistence Engine)
// ============================================================

function persistState() {
  const h1Stat = document.getElementById('h1_statement');
  const h1Axis = document.getElementById('h1_pillar_axis');
  const h1Reas = document.getElementById('h1_pillar_reason');
  if (h1Stat) state.h1.statement = h1Stat.value;
  if (h1Axis) state.h1.pillarAxis = h1Axis.value;
  if (h1Reas) state.h1.pillarReason = h1Reas.value;

  const h4Name = document.getElementById('h4_algo_name');
  const h4Prob = document.getElementById('h4_algo_problem');
  const h4Code = document.getElementById('h4_algo_code');
  const h4Logi = document.getElementById('h4_algo_logic');
  if (h4Name) state.h4.algoName = h4Name.value;
  if (h4Prob) state.h4.algoProblem = h4Prob.value;
  if (h4Code) state.h4.algoCode = h4Code.value;
  if (h4Logi) state.h4.algoLogic = h4Logi.value;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('تجاوزت البيانات الحجم التخزيني المقترح.');
  }

  triggerProgressAudit();
}

function restoreMasterState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      state = { ...state, ...parsed };
      
      // ضمان سلامة بنية المحطات الأربع دائماً
      if (!state.h3.evolution || !Array.isArray(state.h3.evolution) || state.h3.evolution.length < 4) {
        state.h3.evolution = [
          { img: "", note: "" }, { img: "", note: "" }, { img: "", note: "" }, { img: "", note: "" }
        ];
      }
    } catch (e) {}
  }

  // 1. استرجاع الأفق 01
  const h1Nar = document.getElementById('h1_narration');
  const h1Stat = document.getElementById('h1_statement');
  const h1Axis = document.getElementById('h1_pillar_axis');
  const h1Reas = document.getElementById('h1_pillar_reason');
  if (h1Nar) h1Nar.value = state.h1.narration || '';
  if (h1Stat) h1Stat.value = state.h1.statement || '';
  if (h1Axis) h1Axis.value = state.h1.pillarAxis || '';
  if (h1Reas) h1Reas.value = state.h1.pillarReason || '';

  if (state.h1.image) {
    const img = document.getElementById('h1_img_prev');
    const prompt = document.getElementById('h1_img_prompt');
    const del = document.getElementById('h1_img_del');
    if (img) { img.src = state.h1.image; img.style.display = 'block'; }
    if (prompt) prompt.style.display = 'none';
    if (del) del.style.display = 'block';
  }
  evaluateOriginWords();
  renderChallenges();
  renderStrategies();

  // 2. استرجاع الأفق 02
  renderTrials();

  // 3. استرجاع الأفق 03
  renderCatalog();
  if (state.h3.robotImg && typeof displayRobotImg === 'function') {
    displayRobotImg(state.h3.robotImg);
  }
  renderEvolution();

  // 4. استرجاع الأفق 04
  const h4Name = document.getElementById('h4_algo_name');
  const h4Prob = document.getElementById('h4_algo_problem');
  const h4Code = document.getElementById('h4_algo_code');
  const h4Logi = document.getElementById('h4_algo_logic');
  if (h4Name) h4Name.value = state.h4.algoName || '';
  if (h4Prob) h4Prob.value = state.h4.algoProblem || '';
  if (h4Code) h4Code.value = state.h4.algoCode || '';
  if (h4Logi) h4Logi.value = state.h4.algoLogic || '';

  if (state.h4.flowImg) {
    const img = document.getElementById('h4_flow_prev');
    const prompt = document.getElementById('h4_flow_prompt');
    const del = document.getElementById('h4_flow_del');
    if (img) { img.src = state.h4.flowImg; img.style.display = 'block'; }
    if (prompt) prompt.style.display = 'none';
    if (del) del.style.display = 'block';
  }
  renderFab();
  renderAiStudies();

  // 5. استرجاع الأفق 05
  const teamSizeEl = document.getElementById('h5_team_size');
  if (teamSizeEl) teamSizeEl.value = state.h5.teamSize || '3';
  renderIdentity();

  // تدقيق الإنجاز العام
  triggerProgressAudit();
}

// ============================================================
// 11. التهيئة الشاملة عند اكتمال تحميل الصفحة
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
  restoreMasterState();
  if (typeof initTooltips === 'function') initTooltips();
  runInsightEngine();
  switchHorizon(0);
});
