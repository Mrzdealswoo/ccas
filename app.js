// CCAS Campus - Modern Web Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // --- State ---
  let currentCategory = 'all';
  let currentFaculty = 'all';
  let searchQuery = '';
  let activePathwayIndex = 0;
  let activeCampusId = 'colombo';

  // --- DOM Elements ---
  const programsGrid = document.getElementById('programs-grid');
  const programCountEl = document.getElementById('program-count');
  const categoryTabs = document.querySelectorAll('.category-tab');
  const facultyFilter = document.getElementById('faculty-filter');
  const searchInput = document.getElementById('course-search');
  const modalOverlay = document.getElementById('course-modal');
  const modalBody = document.getElementById('course-modal-body');
  const closeModalBtn = document.getElementById('close-modal-btn');

  // Application Modal Elements
  const applyModal = document.getElementById('apply-modal');
  const closeApplyModalBtn = document.getElementById('close-apply-modal');
  const applyForm = document.getElementById('apply-form');
  const programSelect = document.getElementById('apply-program-select');

  // Calculator Elements
  const calcLevelSelect = document.getElementById('calc-level');
  const calcScholarship = document.getElementById('calc-scholarship');
  const calcTenure = document.getElementById('calc-tenure');
  const calcTotalFee = document.getElementById('calc-total-fee');
  const calcMonthly = document.getElementById('calc-monthly');
  const calcSavings = document.getElementById('calc-savings');

  // Campus Tab Buttons
  const campusTabs = document.querySelectorAll('.campus-tab-btn');
  const campusDisplay = document.getElementById('campus-content-display');

  // Pathway Container
  const pathwayTabsContainer = document.getElementById('pathway-tabs');
  const pathwayDetailsContainer = document.getElementById('pathway-details');

  // Mobile Menu Elements
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  // --- 1. Populate Program Select in Application Modal ---
  if (programSelect && typeof CCAS_PROGRAMS !== 'undefined') {
    programSelect.innerHTML = '<option value="">-- Choose Desired Program --</option>' +
      CCAS_PROGRAMS.map(p => `<option value="${p.title}">${p.title} (${p.level})</option>`).join('');
  }

  // --- 2. Render Programs Function ---
  function renderPrograms() {
    if (!programsGrid || typeof CCAS_PROGRAMS === 'undefined') return;

    const filtered = CCAS_PROGRAMS.filter(prog => {
      const matchesCategory = currentCategory === 'all' || prog.category === currentCategory;
      const matchesFaculty = currentFaculty === 'all' || prog.faculty === currentFaculty;
      const matchesSearch = searchQuery === '' || 
        prog.title.toLowerCase().includes(searchQuery) ||
        prog.facultyName.toLowerCase().includes(searchQuery) ||
        prog.overview.toLowerCase().includes(searchQuery) ||
        prog.careerOutcomes.some(c => c.toLowerCase().includes(searchQuery));
      return matchesCategory && matchesFaculty && matchesSearch;
    });

    if (programCountEl) {
      programCountEl.textContent = `${filtered.length} Programs Found`;
    }

    if (filtered.length === 0) {
      programsGrid.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-2xl font-bold">🔍</div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">No Matching Programs Found</h3>
          <p class="text-slate-500 max-w-md mx-auto mb-6">We couldn't find any courses matching your specific search criteria. Try selecting another faculty or clearing the search bar.</p>
          <button id="reset-filters-btn" class="px-6 py-2.5 bg-[#07162c] text-white rounded-xl font-semibold hover:bg-[#122a4e] transition-colors">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'all';
          currentFaculty = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          if (facultyFilter) facultyFilter.value = 'all';
          categoryTabs.forEach(t => t.classList.remove('active', 'bg-[#07162c]', 'text-white'));
          categoryTabs[0].classList.add('active', 'bg-[#07162c]', 'text-white');
          renderPrograms();
        });
      }
      return;
    }

    programsGrid.innerHTML = filtered.map(prog => {
      const categoryColor = prog.category === 'degree' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                            prog.category === 'hnd' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                            prog.category === 'diploma' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                            'bg-purple-100 text-purple-900 border-purple-300';
      
      return `
        <div class="course-card bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group">
          <div>
            <!-- Card Image -->
            <div class="relative h-48 w-full overflow-hidden bg-slate-100">
              <img src="${prog.image}" alt="${prog.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              
              <!-- Badges -->
              <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span class="text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColor}">
                  ${prog.level}
                </span>
                ${prog.badge ? `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-bold shadow-sm">★ ${prog.badge}</span>` : ''}
              </div>

              <div class="absolute bottom-3 left-3 right-3 text-white">
                <span class="text-xs uppercase tracking-wider text-amber-300 font-semibold">${prog.facultyName}</span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6">
              <h3 class="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-[#07162c] transition-colors">${prog.title}</h3>
              <p class="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">${prog.overview}</p>

              <!-- Meta specs -->
              <div class="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-1.5 text-slate-500">
                    <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Duration:
                  </span>
                  <span class="font-semibold text-slate-800">${prog.duration}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-1.5 text-slate-500">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                    Delivery Mode:
                  </span>
                  <span class="font-semibold text-slate-800">${prog.mode}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-1.5 text-slate-500">
                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                    Affiliation:
                  </span>
                  <span class="font-semibold text-slate-800 truncate max-w-[170px]" title="${prog.awardingBody}">${prog.awardingBody}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer Actions -->
          <div class="p-6 pt-0 border-t border-slate-100 flex items-center gap-3">
            <button onclick="openCourseModal('${prog.id}')" class="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-[#07162c] hover:text-white text-slate-800 text-xs font-bold rounded-xl transition-all duration-200 text-center flex items-center justify-center gap-1.5">
              <span>View Curriculum</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
            <button onclick="quickApply('${prog.title}')" class="py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center">
              Apply
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- 3. Category Filter Tabs Event ---
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => {
        t.classList.remove('active', 'bg-[#07162c]', 'text-white', 'shadow-md');
        t.classList.add('bg-slate-100', 'text-slate-700');
      });
      tab.classList.add('active', 'bg-[#07162c]', 'text-white', 'shadow-md');
      tab.classList.remove('bg-slate-100', 'text-slate-700');
      currentCategory = tab.dataset.category;
      renderPrograms();
    });
  });

  // --- 4. Faculty Dropdown Filter ---
  if (facultyFilter) {
    facultyFilter.addEventListener('change', (e) => {
      currentFaculty = e.target.value;
      renderPrograms();
    });
  }

  // --- 5. Course Search Input ---
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderPrograms();
    });
  }

  // --- 6. Open Course Detail Modal ---
  window.openCourseModal = function(id) {
    if (!modalOverlay || !modalBody || typeof CCAS_PROGRAMS === 'undefined') return;
    const prog = CCAS_PROGRAMS.find(p => p.id === id);
    if (!prog) return;

    modalBody.innerHTML = `
      <div class="relative">
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-[#07162c] to-[#0e2547] p-5 sm:p-8 text-white rounded-t-2xl sm:rounded-t-3xl">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
              ${prog.level}
            </span>
            <span class="text-xs font-medium text-slate-300 truncate">
              ${prog.facultyName}
            </span>
          </div>
          <h2 class="text-xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">${prog.title}</h2>
          <p class="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">${prog.overview}</p>
        </div>

        <div class="p-5 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <!-- Quick Specs Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200">
            <div>
              <div class="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Duration</div>
              <div class="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">${prog.duration}</div>
            </div>
            <div>
              <div class="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Study Mode</div>
              <div class="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">${prog.mode}</div>
            </div>
            <div>
              <div class="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Upcoming Intakes</div>
              <div class="text-xs sm:text-sm font-bold text-amber-700 mt-0.5">${prog.intakes}</div>
            </div>
            <div>
              <div class="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Awarding Body</div>
              <div class="text-xs sm:text-sm font-bold text-blue-900 mt-0.5 truncate">${prog.awardingBody}</div>
            </div>
          </div>

          <!-- Modules List -->
          <div>
            <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span class="w-6 h-6 rounded-md bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">📚</span>
              Core Modules & Curriculum Structure
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
              ${prog.modules.map((m, i) => `
                <div class="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800">
                  <span class="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0 text-[11px]">${i + 1}</span>
                  <span class="font-medium">${m}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Entry Requirements & Outcomes -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div class="bg-blue-50/50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-blue-100">
              <h4 class="text-xs sm:text-sm font-bold text-blue-950 mb-1.5 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Entry Criteria
              </h4>
              <p class="text-xs text-slate-700 leading-relaxed">${prog.eligibility}</p>
            </div>

            <div class="bg-emerald-50/50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-emerald-100">
              <h4 class="text-xs sm:text-sm font-bold text-emerald-950 mb-1.5 flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                Career & Industry Outcomes
              </h4>
              <div class="flex flex-wrap gap-1.5">
                ${prog.careerOutcomes.map(c => `
                  <span class="text-[11px] sm:text-xs font-semibold px-2.5 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-lg">${c}</span>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Financial Snapshot & Action -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900 text-white">
            <div class="text-center sm:text-left">
              <div class="text-[11px] text-slate-400">Estimated Total Investment</div>
              <div class="text-lg sm:text-xl font-extrabold text-amber-400">${prog.tuitionEstimate} <span class="text-xs font-normal text-slate-400 block sm:inline">(Or from ${prog.monthlyInstallment})</span></div>
            </div>
            <div class="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <button onclick="downloadSyllabus('${prog.title}')" class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-semibold text-white transition-colors">
                Download Brochure
              </button>
              <button onclick="quickApply('${prog.title}')" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md">
                Apply for Next Intake
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    modalOverlay.classList.remove('hidden');
    modalOverlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  // Close modal function
  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add('hidden');
    modalOverlay.classList.remove('flex');
    document.body.style.overflow = '';
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // --- 7. Quick Apply Helper ---
  window.quickApply = function(programTitle) {
    closeModal();
    if (applyModal) {
      applyModal.classList.remove('hidden');
      applyModal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      if (programSelect) {
        programSelect.value = programTitle;
      }
    }
  };

  if (closeApplyModalBtn && applyModal) {
    closeApplyModalBtn.addEventListener('click', () => {
      applyModal.classList.add('hidden');
      applyModal.classList.remove('flex');
      document.body.style.overflow = '';
    });
    applyModal.addEventListener('click', (e) => {
      if (e.target === applyModal) {
        applyModal.classList.add('hidden');
        applyModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  }

  // --- 8. Application Form Submission via WhatsApp / Email ---
  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('applicant-name').value;
      const phone = document.getElementById('applicant-phone').value;
      const email = document.getElementById('applicant-email').value;
      const prog = programSelect.value;
      const campus = document.getElementById('applicant-campus').value;
      const notes = document.getElementById('applicant-notes').value || 'None';

      const whatsappMessage = encodeURIComponent(
        `*CCAS Campus - New Online Application*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Mobile:* ${phone}\n` +
        `✉️ *Email:* ${email}\n` +
        `🎓 *Selected Course:* ${prog}\n` +
        `🏛️ *Preferred Campus:* ${campus}\n` +
        `📝 *Background/Notes:* ${notes}\n\n` +
        `_Sent via CCAS Campus Official Portal_`
      );

      // Show instant toast notification
      showToast(`Thank you, ${name}! Your application has been logged.`);

      // Prompt WhatsApp admission officer direct connect
      setTimeout(() => {
        const goWhatsApp = confirm(`Would you like to connect directly with the CCAS Admissions Officer on WhatsApp to finalize your document submission?`);
        if (goWhatsApp) {
          window.open(`https://wa.me/94767483338?text=${whatsappMessage}`, '_blank');
        }
      }, 600);

      applyForm.reset();
      applyModal.classList.add('hidden');
      applyModal.classList.remove('flex');
      document.body.style.overflow = '';
    });
  }

  // --- 9. Interactive Fee Calculator ---
  function calculateTuition() {
    if (!calcLevelSelect || !calcTotalFee || !calcMonthly) return;

    let baseFee = 850000;
    const level = calcLevelSelect.value;

    if (level === 'degree') baseFee = 850000;
    else if (level === 'hnd') baseFee = 450000;
    else if (level === 'diploma') baseFee = 160000;
    else if (level === 'vocational') baseFee = 115000;

    const scholarshipRate = parseFloat(calcScholarship.value) || 0;
    const tenureMonths = parseInt(calcTenure.value) || 12;

    const discountAmount = baseFee * scholarshipRate;
    const finalFee = baseFee - discountAmount;
    const monthlyInstallment = Math.round(finalFee / tenureMonths);

    calcTotalFee.textContent = `LKR ${finalFee.toLocaleString()}`;
    calcMonthly.textContent = `LKR ${monthlyInstallment.toLocaleString()} / month`;
    if (calcSavings) {
      calcSavings.textContent = discountAmount > 0 
        ? `You save LKR ${discountAmount.toLocaleString()} with early scholarship!`
        : `Flexible 0% interest monthly installment plan`;
    }
  }

  if (calcLevelSelect) calcLevelSelect.addEventListener('change', calculateTuition);
  if (calcScholarship) calcScholarship.addEventListener('change', calculateTuition);
  if (calcTenure) calcTenure.addEventListener('change', calculateTuition);
  calculateTuition();

  // --- 10. Global Pathways Tabs ---
  function renderPathways() {
    if (!pathwayTabsContainer || !pathwayDetailsContainer || typeof CCAS_PATHWAYS === 'undefined') return;

    pathwayTabsContainer.innerHTML = CCAS_PATHWAYS.map((p, idx) => `
      <button class="pathway-btn px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${idx === activePathwayIndex ? 'bg-[#07162c] text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}" data-index="${idx}">
        <span class="text-base">${p.flag}</span>
        <span>${p.country}</span>
      </button>
    `).join('');

    const selected = CCAS_PATHWAYS[activePathwayIndex];
    pathwayDetailsContainer.innerHTML = `
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">${selected.flag}</span>
          <div>
            <h4 class="text-xl font-bold text-slate-900">${selected.country} Progression Pathway</h4>
            <span class="text-xs text-amber-700 font-semibold">Ofqual Level 4 & 5 UK Credit Transfer</span>
          </div>
        </div>
        <p class="text-slate-600 text-sm leading-relaxed mb-6">${selected.description}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div>
            <h5 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Partner Universities & Hubs</h5>
            <div class="space-y-2">
              ${selected.partners.map(u => `
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span class="text-blue-600">🏛️</span>
                  <span>${u}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div>
            <h5 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Pathway Advantages</h5>
            <div class="space-y-2">
              ${selected.benefits.map(b => `
                <div class="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span>${b}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll('.pathway-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activePathwayIndex = parseInt(btn.dataset.index);
        renderPathways();
      });
    });
  }
  renderPathways();

  // --- 11. Campuses Switcher ---
  function renderCampus() {
    if (!campusDisplay || typeof CCAS_CAMPUSES === 'undefined') return;
    const campus = CCAS_CAMPUSES.find(c => c.id === activeCampusId) || CCAS_CAMPUSES[0];

    campusTabs.forEach(btn => {
      if (btn.dataset.campus === activeCampusId) {
        btn.classList.add('bg-[#07162c]', 'text-white', 'shadow-md');
        btn.classList.remove('bg-white', 'text-slate-700');
      } else {
        btn.classList.remove('bg-[#07162c]', 'text-white', 'shadow-md');
        btn.classList.add('bg-white', 'text-slate-700');
      }
    });

    campusDisplay.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-slate-200 shadow-sm">
        <div>
          <div class="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-3">
            ${campus.city}
          </div>
          <h3 class="text-xl sm:text-3xl font-extrabold text-slate-900 mb-3 sm:mb-4">${campus.name}</h3>
          
          <div class="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-600 mb-6">
            <div class="flex items-start gap-2.5 sm:gap-3">
              <span class="text-blue-600 font-bold shrink-0 mt-0.5">📍</span>
              <span><strong>Address:</strong> ${campus.address}</span>
            </div>
            <div class="flex items-center gap-2.5 sm:gap-3">
              <span class="text-emerald-600 font-bold shrink-0">📞</span>
              <span><strong>Direct Hotlines:</strong> <a href="tel:${campus.phone.split('/')[0].trim()}" class="text-blue-700 hover:underline font-semibold">${campus.phone}</a></span>
            </div>
            <div class="flex items-center gap-2.5 sm:gap-3">
              <span class="text-amber-600 font-bold shrink-0">✉️</span>
              <span><strong>Email:</strong> <a href="mailto:${campus.email}" class="text-blue-700 hover:underline font-semibold">${campus.email}</a></span>
            </div>
            <div class="flex items-center gap-2.5 sm:gap-3">
              <span class="text-purple-600 font-bold shrink-0">⏰</span>
              <span><strong>Campus Hours:</strong> ${campus.hours}</span>
            </div>
          </div>

          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Campus Facilities & Infrastructure</h4>
          <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
            ${campus.features.map(f => `
              <span class="text-[11px] sm:text-xs font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-100 text-slate-800 rounded-lg sm:rounded-xl border border-slate-200">
                ✓ ${f}
              </span>
            `).join('')}
          </div>

          <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <a href="https://maps.google.com/?q=${encodeURIComponent(campus.address)}" target="_blank" class="w-full sm:w-auto px-5 py-3 bg-[#07162c] text-white rounded-xl text-xs font-bold hover:bg-[#122a4e] transition-colors flex items-center justify-center gap-2">
              <span>Open in Google Maps</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
            <button onclick="quickApply('Campus Visit Inquiry - ${campus.name}')" class="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-colors text-center">
              Schedule Campus Tour
            </button>
          </div>
        </div>

        <div class="rounded-2xl overflow-hidden h-[240px] sm:h-[340px] w-full border border-slate-200 shadow-inner bg-slate-100">
          <iframe src="${campus.mapEmbed}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
      </div>
    `;
  }

  campusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activeCampusId = tab.dataset.campus;
      renderCampus();
    });
  });
  renderCampus();

  // --- 12. Mobile Menu Toggle ---
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Close on navigation link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // --- 13. Toast Notification Helper ---
  window.showToast = function(msg) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#07162c] text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-amber-400/40 text-sm font-semibold flex items-center gap-3 transition-all duration-300 pointer-events-none opacity-0 translate-y-4';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>🎓</span><span>${msg}</span>`;
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4');
    }, 4000);
  };

  // --- 14. Download Syllabus Simulation ---
  window.downloadSyllabus = function(programTitle) {
    showToast(`Downloading official curriculum for: ${programTitle}`);
    setTimeout(() => {
      alert(`The official curriculum prospectus for "${programTitle}" has been prepared. Our admissions office will also email you the full module specification and scholarship guidelines.`);
    }, 800);
  };

  // Initial render of programs
  renderPrograms();
});
