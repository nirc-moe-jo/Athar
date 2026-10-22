/* =========================================================================
   أَثَـر • ATHAR ENGINE: MASTER ORCHESTRATOR & APPLICATION BRAIN (V2 MASTER)
   البطولة الوطنية للابتكار والروبوت — وزارة التربية والتعليم وتنمية الموارد البشرية
   ========================================================================= */

let activeHorizonIndex = 0;
window.currentInsightIndex = 0;

// =========================================================================
// 1. محرك التنقل المشهدي المركّز (Horizon Studio Viewport Switching)
// =========================================================================

function switchHorizon(index) {
  activeHorizonIndex = index;

  // إظهار الأفق المختار وإخفاء باقي الآفاق لضمان التركيز الذهني الكامل
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

  // تدقيق الإنجاز وتحديث المؤشرات
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
    row.style.cssText = "background:#fff; border:1px solid var(--border-whisper); border-radius:var(--radius-sm); padding:12px; display:flex; flex-direction:column; gap:8px;";
    row.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-whisper); padding-bottom:6px;">
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
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px;">
        <div class="field-group">
          <label class="field-label">توصيف العائق الفني بدقة:</label>
          <input type="text" placeholder="مثال: فقدان الاتصال اللحظي في الأماكن المغلقة..." value="${esc(ch.challenge)}" oninput="state.h1.challenges[${idx}].challenge=this.value; persistState();">
        </div>
        <div class="field-group">
          <label class="field-label">السبب الجذري للعائق:</label>
          <input type="text" placeholder="تفسير العوامل الفيزيائية أو البرمجية المسببة..." value="${esc(ch.analysis)}" oninput="state.h1.challenges[${idx}].analysis=this.value; persistState();">
        </div>
        <div class="field-group">
          <label class="field-label">المعالجة الهندسية المقترحة:</label>
          <input type="text" placeholder="كيف ستتعامل المنظومة مع هذا التحدي؟" value="${esc(ch.solution)}" oninput="state.h1.challenges[${idx}].solution=this.value; persistState();">
        </div>
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
      <div class="field-group">
        <label class="field-label">مسمى المسار الاستراتيجي البديل:</label>
        <input type="text" placeholder="مثال: بناء هيكل ثلاثي المحاور بمحركات سيرفو متزامنة..." value="${esc(st.title)}" oninput="state.h1.strategies[${sIdx}].title=this.value; updateAdoptedView(); persistState();" style="font-weight:600;">
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px;">
        <div class="field-group">
          <label class="field-label" style="color:var(--emerald-serene);">نقاط القوة والمكاسب:</label>
          ${st.pros.map((p, pIdx) => `<input type="text" style="margin-top:3px;" placeholder="مكسب تشغيلي..." value="${esc(p)}" oninput="state.h1.strategies[${sIdx}].pros[${pIdx}]=this.value; persistState();">`).join('')}
        </div>
        <div class="field-group">
          <label class="field-label" style="color:var(--red-alert);">نقاط الضعف والمحددات:</label>
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
// 4. الأفق 02: مسار التجريب والتعلّم المستمر
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
    
    const summaryWords = (t.summary || '').trim().split(/\s+/).filter(Boolean).length;

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

      <div class="field-group">
        <label class="field-label">عنوان التجربة والمكون قيد الاختبار:</label>
        <input type="text" placeholder="مثال: اختبار استجابة الحساس الليزري في الظلام الدامس..." value="${esc(t.title)}" oninput="state.h2.trials[${idx}].title=this.value; persistState();" style="font-weight:600;">
      </div>

      <div class="field-group">
        <label class="field-label">هدف المحاولة وتوزيع أدوار الفريق في الاختبار:</label>
        <textarea rows="2" placeholder="تحديد الغرض العلمي وتوزيع مهام الملاحظة والقياس بين الأعضاء..." oninput="state.h2.trials[${idx}].goal=this.value; persistState();">${esc(t.goal)}</textarea>
      </div>

      <!-- شبكة صورة النتيجة والخلاصة الاستنتاجية -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px;">
        <div class="field-group">
          <label class="field-label">صورة نتيجة الاختبار (رسم بياني/قراءة فنية):</label>
          <div class="media-shelf" onclick="document.getElementById('tr_res_file_${idx}').click()" style="min-height:100px;">
            <input type="file" id="tr_res_file_${idx}" accept="image/png, image/jpeg, image/webp" style="display:none;" onchange="handleSubImgUpload('h2', 'trials', ${idx}, 'resImg', this)">
            ${t.resImg ? `<img src="${t.resImg}" style="display:block;">` : `
              <div class="upload-placeholder-content">
                <span class="upload-main-text">رفع صورة نتيجة الاختبار</span>
                <span class="upload-sub-text">PNG, JPEG, WebP</span>
              </div>
            `}
          </div>
        </div>

        <div class="field-group">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <label class="field-label">الخلاصة الاستنتاجية للمحاولة:</label>
            <span class="word-meter ${summaryWords <= 25 ? 'in-range' : 'out-range'}">${summaryWords}/25 كلمة</span>
          </div>
          <textarea rows="3" placeholder="أهم استنتاج جوهري خرج به الفريق..." oninput="state.h2.trials[${idx}].summary=this.value; persistState();">${esc(t.summary)}</textarea>
        </div>
      </div>
      
      <!-- مصفوفة التحليل الثنائي -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">
        <div style="background:var(--emerald-bg); border:1px solid rgba(15,118,110,0.2); border-radius:var(--radius-sm); padding:10px; display:flex; flex-direction:column; gap:6px;">
          <span style="font-size:11px; font-weight:700; color:var(--emerald-serene);">ما الذي نجح؟</span>
          <div class="field-group">
            <label class="field-label">الجزء أو السلوك الناجح:</label>
            <input type="text" placeholder="السلوك الذي أدى وظيفته بدقة..." value="${esc(t.passT)}" oninput="state.h2.trials[${idx}].passT=this.value; persistState();">
          </div>
          <div class="field-group">
            <label class="field-label">قرار الفريق للبناء عليه:</label>
            <textarea rows="2" placeholder="قرار الاستثمار والبناء على هذا النجاح..." oninput="state.h2.trials[${idx}].passD=this.value; persistState();">${esc(t.passD)}</textarea>
          </div>
        </div>

        <div style="background:var(--red-bg); border:1px solid rgba(185,28,28,0.2); border-radius:var(--radius-sm); padding:10px; display:flex; flex-direction:column; gap:6px;">
          <span style="font-size:11px; font-weight:700; color:var(--red-alert);">ما الذي لم ينجح؟</span>
          <div class="field-group">
            <label class="field-label">موضع العائق وأسبابه الجذرية:</label>
            <input type="text" placeholder="موضع الخلل وسببه المباشر..." value="${esc(t.failT)}" oninput="state.h2.trials[${idx}].failT=this.value; persistState();">
          </div>
          <div class="field-group">
            <label class="field-label">قرار الفريق لمعالجته:</label>
            <textarea rows="2" placeholder="قرار الفريق الإجرائي لتجاوز هذا الخلل..." oninput="state.h2.trials[${idx}].failD=this.value; persistState();">${esc(t.failD)}</textarea>
          </div>
        </div>
      </div>

      <!-- صور العمل الميداني أثناء إجراء التجربة -->
      <div class="field-group">
        <label class="field-label">توثيق الفريق أثناء إجراء التجربة (صورتان):</label>
        <div class="dual-media-grid">
          <div class="media-shelf" onclick="document.getElementById('tr_act1_file_${idx}').click()" style="min-height:90px;">
            <input type="file" id="tr_act1_file_${idx}" accept="image/png, image/jpeg, image/webp" style="display:none;" onchange="handleSubImgUpload('h2', 'trials', ${idx}, 'act1Img', this)">
            ${t.act1Img ? `<img src="${t.act1Img}" style="display:block;">` : `
              <div class="upload-placeholder-content">
                <span class="upload-main-text">صورة أثناء العمل 01</span>
                <span class="upload-sub-text">PNG, JPEG, WebP</span>
              </div>
            `}
          </div>

          <div class="media-shelf" onclick="document.getElementById('tr_act2_file_${idx}').click()" style="min-height:90px;">
            <input type="file" id="tr_act2_file_${idx}" accept="image/png, image/jpeg, image/webp" style="display:none;" onchange="handleSubImgUpload('h2', 'trials', ${idx}, 'act2Img', this)">
            ${t.act2Img ? `<img src="${t.act2Img}" style="display:block;">` : `
              <div class="upload-placeholder-content">
                <span class="upload-main-text">صورة أثناء العمل 02</span>
                <span class="upload-sub-text">PNG, JPEG, WebP</span>
              </div>
            `}
          </div>
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" style="font-weight:700; color:var(--ink-deep);">القرار للمحاولة القادمة:</label>
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
// 5. الأفق 03: جدول المكونات (BOM) ومراحل التطور الزمني
// ============================================================

// تحديث المجموع الحسابي لحظياً دون مقاطعة التركيز (No Focus Loss)
function updateCatalogTotalCost() {
  let sum = 0;
  if (state.h3.catalog) {
    state.h3.catalog.forEach(item => {
      const cost = parseFloat(item.cost) || 0;
      const qty = parseInt(item.qty, 10) || 1;
      sum += cost * qty;
    });
  }
  const costEl = document.getElementById('h3_total_cost');
  if (costEl) costEl.innerText = `${sum.toFixed(2)} د.أ`;
  persistState();
}

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
    row.style.cssText = "background:#fff; border:1px solid var(--border-whisper); border-radius:var(--radius-sm); padding:12px; display:flex; flex-direction:column; gap:8px;";
    
    row.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-whisper); padding-bottom:6px;">
        <span style="font-family:var(--font-code); font-size:11px; font-weight:700;">المكون ${String(idx+1).padStart(2,'0')}</span>
        <div>
          <button type="button" class="btn-discrete-del" onclick="armDel('cat_del_${idx}', 'cat_conf_${idx}')" id="cat_del_${idx}">استبعاد</button>
          <div class="confirm-deck" id="cat_conf_${idx}">
            <button type="button" class="btn-affirm" onclick="removeCatalogItem(${idx})">تأكيد</button>
            <button type="button" class="btn-cancel" onclick="disarmDel('cat_del_${idx}', 'cat_conf_${idx}')">تراجع</button>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1.5fr 1.2fr 0.8fr 0.8fr; gap:8px;">
        <div class="field-group">
          <label class="field-label">اسم المكون:</label>
          <input type="text" placeholder="مثال: محرك سيرفو رقمي..." value="${esc(item.name)}" oninput="state.h3.catalog[${idx}].name=this.value; renderBomChips(); persistState();">
        </div>
        <div class="field-group">
          <label class="field-label">الطراز والإصدار:</label>
          <input type="text" placeholder="مثال: MG996R Metal Gear..." value="${esc(item.model)}" oninput="state.h3.catalog[${idx}].model=this.value; persistState();">
        </div>
        <div class="field-group">
          <label class="field-label">الكلفة (د.أ):</label>
          <input type="number" step="0.5" placeholder="0.00" value="${item.cost}" oninput="state.h3.catalog[${idx}].cost=this.value; updateCatalogTotalCost();">
        </div>
        <div class="field-group">
          <label class="field-label">الكمية:</label>
          <input type="number" min="1" placeholder="1" value="${item.qty}" oninput="state.h3.catalog[${idx}].qty=this.value; updateCatalogTotalCost();">
        </div>
      </div>

      <div class="field-group">
        <label class="field-label">مسوغات الاختيار الهندسية وعلاقتها بالتحديات:</label>
        <input type="text" placeholder="تفسير سبب اختيار هذه القطعة بالذات..." value="${esc(item.reason)}" oninput="state.h3.catalog[${idx}].reason=this.value; persistState();">
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <div class="field-group">
          <label class="field-label">أفق التطوير والترقية المستقبلي:</label>
          <input type="text" placeholder="خطة الترقية للمنظومة لاحقاً..." value="${esc(item.upgrade)}" oninput="state.h3.catalog[${idx}].upgrade=this.value; persistState();">
        </div>
        <div class="field-group">
          <label class="field-label">رابط الشراء أو المصدر الفني:</label>
          <input type="text" placeholder="https://..." value="${esc(item.link)}" oninput="state.h3.catalog[${idx}].link=this.value; persistState();" style="direction:ltr; text-align:left;">
        </div>
      </div>
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

function renderEvolution() {
  const grid = document.getElementById('h3_evolution_grid');
  if (!grid) return;
  grid.innerHTML = '';

  // التحصين الذاتي لضمان ظهور المحطات الأربع دائماً
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

      <div class="field-group">
        <label class="field-label">أبرز التحسينات والدروس المكتسبة:</label>
        <input type="text" placeholder="بيان النقلة التطويرية في هذا النموذج..." value="${esc(evo.note)}" oninput="state.h3.evolution[${idx}].note=this.value; persistState();" style="font-size:11px; padding:6px 8px;">
      </div>
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
    card.style.cssText = "background:#fff; border:1px solid var(--border-whisper); border-radius:var(--radius-sm); padding:14px; display:flex; flex-direction:column; gap:10px;";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-whisper); padding-bottom:6px;">
        <span style="font-family:var(--font-code); font-size:11px; font-weight:700;">ابتكار التصنيع ${String(idx+1).padStart(2,'0')}</span>
        <button type="button" class="btn-discrete-del" onclick="removeFabItem(${idx})">استبعاد</button>
      </div>

      <div class="field-group">
        <label class="field-label">اسم القطعة المبتكرة المصنّعة:</label>
        <input type="text" placeholder="مثال: ذراع توجيه ثلاثي الأبعاد مع مفاصل ارتكاز..." value="${esc(fab.title)}" oninput="state.h4.fabItems[${idx}].title=this.value; persistState();" style="font-weight:600;">
      </div>

      <div class="field-group">
        <label class="field-label">المعضلة الميكانيكية التي حلها هذا التصميم المخصص:</label>
        <input type="text" placeholder="مثال: تفادي الاصطدام بالهيكل وتوزيع عزم الدوران بالتساوي..." value="${esc(fab.problem)}" oninput="state.h4.fabItems[${idx}].problem=this.value; persistState();">
      </div>
      
      <div class="dual-media-grid">
        <div class="field-group">
          <label class="field-label">المخطط الهندسي الرقمي (CAD):</label>
          <div class="media-shelf" onclick="document.getElementById('cad_f_${idx}').click()">
            <input type="file" id="cad_f_${idx}" accept="image/png, image/jpeg, image/webp" style="display:none;" onchange="handleSubImgUpload('h4', 'fabItems', ${idx}, 'cadImg', this)">
            ${fab.cadImg ? `<img src="${fab.cadImg}" style="display:block;">` : `
              <div class="upload-placeholder-content">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                <span class="upload-main-text">رفع مخطط CAD (2D / 3D)</span>
                <span class="upload-sub-text">PNG, JPEG, WebP</span>
              </div>
            `}
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">القطعة بعد التصنيع والتشغيل الفعلي:</label>
          <div class="media-shelf" onclick="document.getElementById('real_f_${idx}').click()">
            <input type="file" id="real_f_${idx}" accept="image/png, image/jpeg, image/webp" style="display:none;" onchange="handleSubImgUpload('h4', 'fabItems', ${idx}, 'realImg', this)">
            ${fab.realImg ? `<img src="${fab.realImg}" style="display:block;">` : `
              <div class="upload-placeholder-content">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span class="upload-main-text">رفع صورة القطعة المصنّعة</span>
                <span class="upload-sub-text">PNG, JPEG, WebP</span>
              </div>
            `}
          </div>
        </div>
      </div>

      <div class="field-group">
        <label class="field-label">مسوغات الشكل والأبعاد وتوزيع الكتل ومراكز الارتكاز:</label>
        <textarea rows="2" placeholder="تفسير الزوايا المختارة وتوزيع الثقل الهندسي..." oninput="state.h4.fabItems[${idx}].geoReason=this.value; persistState();">${esc(fab.geoReason)}</textarea>
      </div>

      <div class="field-group">
        <label class="field-label">مسوغات اختيار الخامة ومقاومة الإجهاد وظروف التشغيل:</label>
        <textarea rows="2" placeholder="تفسير اختيار PLA أو ألمنيوم أو أكريليك بحسب الحرارة والضغط..." oninput="state.h4.fabItems[${idx}].matReason=this.value; persistState();">${esc(fab.matReason)}</textarea>
      </div>
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
    card.style.cssText = "background:#fff; border:1px solid var(--border-whisper); border-radius:var(--radius-sm); padding:14px; display:flex; flex-direction:column; gap:10px;";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-whisper); padding-bottom:6px;">
        <span style="font-family:var(--font-code); font-size:11px; font-weight:700;">دراسة الحالة ${String(idx+1).padStart(2,'0')}</span>
        <button type="button" class="btn-discrete-del" onclick="removeAiItem(${idx})">استبعاد</button>
      </div>

      <div class="field-group">
        <label class="field-label">التحدي الفني المعالج محل الاستشارة:</label>
        <input type="text" placeholder="مثال: تصفية إشارة الحساس البرمجية ومنع التشويش اللحظي..." value="${esc(ai.challenge)}" oninput="state.h4.aiStudies[${idx}].challenge=this.value; persistState();">
      </div>

      <div class="field-group">
        <label class="field-label">اسم الأداة المستخدمة:</label>
        <input type="text" placeholder="مثال: ChatGPT (GPT-4o), Claude 3.5 Sonnet, GitHub Copilot..." value="${esc(ai.tool)}" oninput="state.h4.aiStudies[${idx}].tool=this.value; persistState();">
      </div>

      <div class="field-group">
        <label class="field-label" style="font-weight:700; color:var(--ink-deep);">التوجيه والأمر البرمجي الدقيق الموجه للأداة (Prompt):</label>
        <textarea rows="2" class="prompt-box" placeholder="الصيغة الحرفية الدقيقة للأمر والمسألة المطروحة على الأداة..." oninput="state.h4.aiStudies[${idx}].prompt=this.value; persistState();">${esc(ai.prompt)}</textarea>
      </div>

      <div class="field-group">
        <label class="field-label">المخرج أو الكود الأولي المقترح من الأداة:</label>
        <textarea rows="2" class="output-box" placeholder="الكود أو المقترح الأولي المستلم من الأداة قبل التعديل..." oninput="state.h4.aiStudies[${idx}].output=this.value; persistState();">${esc(ai.output)}</textarea>
      </div>

      <div style="background:var(--gold-soft); border:1px solid var(--gold-border); border-radius:var(--radius-sm); padding:10px; display:flex; flex-direction:column; gap:4px;">
        <label class="field-label" style="font-weight:700; color:var(--gold-deep);">التحقق والتقويم والتكييف البشري (أصالة العمل والملكية الفكرية):</label>
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
      
      <div class="field-group">
        <label class="field-label">الاسم الثلاثي الكامل:</label>
        <input type="text" placeholder="الاسم الكامل..." value="${esc(m.name)}" oninput="state.h5.members['${k}'].name=this.value; renderFpTabs(); persistState();" style="font-weight:600;">
      </div>

      <div class="field-group">
        <label class="field-label">الدور الميداني التخصصي:</label>
        <input type="text" placeholder="مثال: قائد الفريق، مبرمج المنظومة..." value="${esc(m.role)}" oninput="state.h5.members['${k}'].role=this.value; renderFpTabs(); persistState();">
      </div>

      ${k !== 'sup' ? `
        <div class="field-group">
          <label class="field-label">الصف الدراسي:</label>
          <select class="field-select" onchange="state.h5.members['${k}'].grade=this.value; persistState();">
            <option value="">تحديد الصف الدراسي...</option>
            ${['الصف السابع','الصف الثامن','الصف التاسع','الصف العاشر','الصف الحادي عشر','الصف الثاني عشر'].map(g=>`<option value="${g}" ${m.grade===g?'selected':''}>${g}</option>`).join('')}
          </select>
        </div>
      ` : `
        <div class="field-group">
          <label class="field-label">التخصص الأكاديمي للمشرف:</label>
          <input type="text" placeholder="مثال: هندسة ميكاترونكس، حاسوب..." value="${esc(m.major)}" oninput="state.h5.members['sup'].major=this.value; persistState();">
        </div>
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

  // إدراج نص quote المحفوظ بشكل منضبط داخل وسم textarea
  container.innerHTML = `
    <div class="stage-card" style="background:#fff; gap:10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-whisper); padding-bottom:6px;">
        <strong>${m.name || 'عضو الفريق'} • ${m.role}</strong>
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:10.5px; color:var(--ink-subtle);">تاريخ الانضمام:</span>
          <input type="date" value="${fp.date||''}" onchange="state.h5.footprints['${curKey}'].date=this.value; persistState();" style="width:auto; font-size:11px; padding:2px 6px;">
        </div>
      </div>

      <div class="field-group">
        <label class="field-label">مهمتي الرئيسية والمسؤولية المباشرة في المشروع:</label>
        <input type="text" placeholder="توصيف المهام التنفيذية المباشرة في المنظومة..." value="${esc(fp.role)}" oninput="state.h5.footprints['${curKey}'].role=this.value; persistState();">
      </div>

      <div class="field-group">
        <label class="field-label">أهم مساهمة وفارق نوعي أفتخر به في نجاح المنظومة:</label>
        <textarea rows="2" placeholder="المساهمة المحددة التي أحدثت فرقاً ملموساً في الأداء..." oninput="state.h5.footprints['${curKey}'].impact=this.value; persistState();">${esc(fp.impact)}</textarea>
      </div>

      <div class="field-group">
        <label class="field-label">الدرس والتحول المهاري والفكري المكتسب من التحديات:</label>
        <textarea rows="2" placeholder="المهارات التقنية والشخصية التي استقرت في نفسي بعد هذا العمل..." oninput="state.h5.footprints['${curKey}'].lesson=this.value; persistState();">${esc(fp.lesson)}</textarea>
      </div>

      <div class="field-group">
        <label class="field-label" style="font-weight:700; color:var(--gold-deep);">الرسالة والأثر المستدام المراد تركه:</label>
        <textarea rows="2" placeholder="الصياغة الشخصية للأثر والرسالة التي أطمح لغرسها في وطني..." oninput="state.h5.footprints['${curKey}'].quote=this.value; persistState();">${esc(fp.quote)}</textarea>
      </div>
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
      else if (subArray === 'trials') renderTrials();
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
// 9. محرك قياس التقدم والتدقيق الهندسي المحصّن والمعاير رياضياً
// ============================================================

function triggerProgressAudit() {
  const has = s => Boolean(String(s || '').trim());

  // 1. تدقيق أفق 01 (الأساس): اشتراط وقوع الكلمات بدقة بين 50 و 100 كلمة
  let h1_score = 0;
  const h1_words = (state.h1.narration || '').trim().split(/\s+/).filter(Boolean).length;
  
  if (h1_words >= 50 && h1_words <= 100) {
    h1_score += 25; // النطاق المثالي
  } else if (h1_words > 100) {
    h1_score += 15; // حسم جزئي لتجاوز الحد والإسهاب الإنشائي
  } else if (h1_words > 0) {
    h1_score += Math.round((h1_words / 50) * 15); // نسبة جزئية لمن لم يستوفِ الحد الأدنى
  }

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
      if (has(t.title)) s += 20;
      if (has(t.goal)) s += 20;
      if (has(t.summary)) s += 20;
      if (has(t.passT) || has(t.failT)) s += 20;
      if (has(t.nextV)) s += 20;
      return s;
    });
    h2_score = Math.round(t_scores.reduce((a, b) => a + b, 0) / state.h2.trials.length);
  }
  const h2_ok = h2_score >= 90;
  updateBadgeSafe('badge_h1', h2_ok ? 'مكتمل ومستوفٍ ✓' : `${h2_score}% منجز`);
  updateDockCheckSafe('dock_chk_1', h2_ok);

  // 3. تدقيق أفق 03 (التجسيد): احتساب نسبة الدبابيس مقارنة بعدد قطع BOM الفعلية
  let h3_score = 0;
  const totalCatalog = state.h3.catalog ? state.h3.catalog.length : 0;
  const totalPins = state.h3.pins ? state.h3.pins.length : 0;

  if (totalCatalog > 0 && state.h3.catalog.some(c => has(c.name) && has(c.reason))) h3_score += 35;
  if (Boolean(state.h3.robotImg)) h3_score += 35;

  if (totalCatalog > 0 && totalPins > 0) {
    const pinRatio = Math.min(1, totalPins / totalCatalog);
    h3_score += Math.round(pinRatio * 30);
  }

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
    if (has(m.name)) s += 30;
    if (has(m.role)) s += 20;
    if (has(fp.impact)) s += 25;
    if (has(fp.quote)) s += 25;
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

  // التوجيه الذكي المباشر بحسب الأفق النشط أمام الطالب
  const horizonScores = [h1_score, h2_score, h3_score, h4_score, h5_score];
  const curScore = horizonScores[activeHorizonIndex];
  const hints = [
    `الأفق 01 (${h1_score}%): ${h1_words < 50 ? 'اكتب 50 كلمة على الأقل' : (h1_words > 100 ? 'اختصر المشكلة لتكون تحت 100 كلمة' : (state.h1.adoptedIndex === null ? 'حدد المسار المعتمد' : 'استكمل تفكيك التحديات'))}`,
    `الأفق 02 (${h2_score}%): استكمل توثيق الخلاصة والقرارات والصور في التجارب المسجلة`,
    `الأفق 03 (${h3_score}%): ${!state.h3.robotImg ? 'ارفع صورة النموذج النهائي' : (totalPins < totalCatalog ? `أسقط دبابيس باقي المكونات (${totalPins} من ${totalCatalog} مسقطة)` : 'أكمل مسوغات قطع BOM')}`,
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
      
      // ضمان سلامة بنية المحطات الأربع دائماً حتى لو كانت الذاكرة قديمة
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

  // التدقيق النهائي الشامل
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
