(function () {
  'use strict';

  const CATEGORIES = {
    expense: [
      { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#f59e0b' },
      { id: 'travel', name: 'Travel & Transport', icon: '🚗', color: '#3b82f6' },
      { id: 'bills', name: 'Bills & Utilities', icon: '💡', color: '#ef4444' },
      { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899' },
      { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
      { id: 'health', name: 'Health & Medical', icon: '💊', color: '#10b981' },
      { id: 'education', name: 'Education', icon: '📚', color: '#06b6d4' },
      { id: 'other_expense', name: 'Other Expense', icon: '📦', color: '#64748b' }
    ],
    income: [
      { id: 'salary', name: 'Salary', icon: '💼', color: '#10b981' },
      { id: 'freelance', name: 'Freelance & Contract', icon: '💻', color: '#6366f1' },
      { id: 'investment', name: 'Investments & Dividends', icon: '📈', color: '#0ea5e9' },
      { id: 'business', name: 'Business Income', icon: '🏢', color: '#f59e0b' },
      { id: 'gift', name: 'Gifts & Allowance', icon: '🎁', color: '#ec4899' },
      { id: 'other_income', name: 'Other Income', icon: '💰', color: '#14b8a6' }
    ]
  };

  const CATEGORY_MAP = {};
  [...CATEGORIES.expense, ...CATEGORIES.income].forEach(cat => {
    CATEGORY_MAP[cat.id] = cat;
  });

  const DEFAULT_SAMPLE_TRANSACTIONS = [
    {
      id: 'tx_demo_1',
      type: 'income',
      title: 'Monthly Salary (Tech Corp)',
      amount: 4200.00,
      category: 'salary',
      date: getRelativeDate(1),
      note: 'Direct Deposit'
    },
    {
      id: 'tx_demo_2',
      type: 'expense',
      title: 'Apartment Rent & Building Maint',
      amount: 1250.00,
      category: 'bills',
      date: getRelativeDate(2),
      note: 'Bank Transfer'
    },
    {
      id: 'tx_demo_3',
      type: 'expense',
      title: 'Supermarket Groceries',
      amount: 142.80,
      category: 'food',
      date: getRelativeDate(3),
      note: 'Credit Card'
    },
    {
      id: 'tx_demo_4',
      type: 'income',
      title: 'Website Redesign Project',
      amount: 850.00,
      category: 'freelance',
      date: getRelativeDate(5),
      note: 'Client Invoice #104'
    },
    {
      id: 'tx_demo_5',
      type: 'expense',
      title: 'Metro Pass & Uber rides',
      amount: 68.50,
      category: 'travel',
      date: getRelativeDate(6),
      note: 'Transit Card'
    },
    {
      id: 'tx_demo_6',
      type: 'expense',
      title: 'Dinner & Sushi with Friends',
      amount: 58.20,
      category: 'food',
      date: getRelativeDate(8),
      note: 'Split bill'
    },
    {
      id: 'tx_demo_7',
      type: 'expense',
      title: 'Electricity & High-speed Fiber',
      amount: 94.00,
      category: 'bills',
      date: getRelativeDate(10),
      note: 'Auto-debit'
    },
    {
      id: 'tx_demo_8',
      type: 'expense',
      title: 'Streaming & Movie Tickets',
      amount: 32.50,
      category: 'entertainment',
      date: getRelativeDate(12),
      note: 'Online'
    }
  ];

  function getRelativeDate(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  }

  const STORAGE_KEY = 'finflow_transactions_v1';
  const CURRENCY_KEY = 'finflow_currency_v1';
  const THEME_KEY = 'finflow_theme_v1';

  let transactions = [];
  let currentCurrency = '$';
  let lastDeletedTx = null;
  let undoTimeout = null;

  const filters = {
    search: '',
    type: 'all', 
    category: 'all',
    sort: 'date-desc' 
  };

  const elements = {

    currencySelect: document.getElementById('currencySelect'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    resetDemoBtn: document.getElementById('resetDemoBtn'),
    amountCurrencyPrefix: document.getElementById('amountCurrencyPrefix'),

  
    totalBalance: document.getElementById('totalBalance'),
    totalIncome: document.getElementById('totalIncome'),
    totalExpense: document.getElementById('totalExpense'),
    incomeCount: document.getElementById('incomeCount'),
    expenseCount: document.getElementById('expenseCount'),
    balanceStatusBadge: document.getElementById('balanceStatusBadge'),
    savingsRateText: document.getElementById('savingsRateText'),
    burnRate: document.getElementById('burnRate'),
    ratioProgressBar: document.getElementById('ratioProgressBar'),
    ratioStatusText: document.getElementById('ratioStatusText'),

    
    transactionForm: document.getElementById('transactionForm'),
    typeExpense: document.getElementById('typeExpense'),
    typeIncome: document.getElementById('typeIncome'),
    txTitle: document.getElementById('txTitle'),
    txAmount: document.getElementById('txAmount'),
    txDate: document.getElementById('txDate'),
    txCategory: document.getElementById('txCategory'),
    txNote: document.getElementById('txNote'),
    submitTxBtn: document.getElementById('submitTxBtn'),
    titleError: document.getElementById('titleError'),
    amountError: document.getElementById('amountError'),
    dateError: document.getElementById('dateError'),
    categoryError: document.getElementById('categoryError'),

    
    donutSvg: document.getElementById('donutSvg'),
    donutTopCategory: document.getElementById('donutTopCategory'),
    categoryBarsList: document.getElementById('categoryBarsList'),

    
    transactionsList: document.getElementById('transactionsList'),
    txCountBadge: document.getElementById('txCountBadge'),
    txSearchInput: document.getElementById('txSearchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    filterCategorySelect: document.getElementById('filterCategorySelect'),
    sortTransactionsSelect: document.getElementById('sortTransactionsSelect'),
    pillButtons: document.querySelectorAll('.pill-btn'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    emptyState: document.getElementById('emptyState'),
    emptyStateTitle: document.getElementById('emptyStateTitle'),
    emptyStateDesc: document.getElementById('emptyStateDesc'),
    emptyStateActionBtn: document.getElementById('emptyStateActionBtn'),

    
    toastContainer: document.getElementById('toastContainer'),
    modalBackdrop: document.getElementById('confirmModalBackdrop'),
    modalConfirmBtn: document.getElementById('modalConfirmBtn'),
    modalCancelBtn: document.getElementById('modalCancelBtn')
  };

  
  function init() {
    initTheme();
    initCurrency();
    loadTransactions();
    populateFormCategories('expense');
    populateFilterCategories();
    setDefaultDate();
    attachEventListeners();
    renderAll();
  }

  function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    elements.txDate.value = today;
  }

 
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  }

  function initCurrency() {
    const savedCurrency = localStorage.getItem(CURRENCY_KEY);
    if (savedCurrency) {
      currentCurrency = savedCurrency;
      elements.currencySelect.value = savedCurrency;
    } else {
      currentCurrency = '$';
      elements.currencySelect.value = '$';
    }
    elements.amountCurrencyPrefix.textContent = currentCurrency;
  }

  function handleCurrencyChange(e) {
    currentCurrency = e.target.value;
    localStorage.setItem(CURRENCY_KEY, currentCurrency);
    elements.amountCurrencyPrefix.textContent = currentCurrency;
    renderAll();
  }

  
  function loadTransactions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        transactions = JSON.parse(raw);
      } else {
        
        transactions = [...DEFAULT_SAMPLE_TRANSACTIONS];
        saveTransactions();
      }
    } catch (err) {
      console.error('Error reading localStorage, reverting to sample data:', err);
      transactions = [...DEFAULT_SAMPLE_TRANSACTIONS];
    }
  }

  function saveTransactions() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
      showToast('Error saving data to local storage', 'error');
    }
  }

  function resetDemoData() {
    transactions = JSON.parse(JSON.stringify(DEFAULT_SAMPLE_TRANSACTIONS));
    
    transactions.forEach((tx, idx) => {
      tx.date = getRelativeDate(idx + 1);
    });
    saveTransactions();
    renderAll();
    showToast('Demo data restored successfully!', 'success');
  }

  function clearAllData() {
    transactions = [];
    saveTransactions();
    renderAll();
    closeConfirmModal();
    showToast('All transactions cleared.', 'info');
  }

 
  function getCurrentFormType() {
    return elements.typeIncome.checked ? 'income' : 'expense';
  }

  function populateFormCategories(type) {
    const catList = CATEGORIES[type] || [];
    elements.txCategory.innerHTML = '';
    catList.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = `${cat.icon} ${cat.name}`;
      elements.txCategory.appendChild(option);
    });
  }

  function populateFilterCategories() {
    const currentVal = elements.filterCategorySelect.value || 'all';
    elements.filterCategorySelect.innerHTML = '<option value="all">All Categories</option>';

    const expGroup = document.createElement('optgroup');
    expGroup.label = 'Expense Categories';
    CATEGORIES.expense.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.icon} ${c.name}`;
      expGroup.appendChild(opt);
    });

    const incGroup = document.createElement('optgroup');
    incGroup.label = 'Income Categories';
    CATEGORIES.income.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.icon} ${c.name}`;
      incGroup.appendChild(opt);
    });

    elements.filterCategorySelect.appendChild(expGroup);
    elements.filterCategorySelect.appendChild(incGroup);
    elements.filterCategorySelect.value = currentVal;
  }

  function clearErrors() {
    elements.titleError.textContent = '';
    elements.amountError.textContent = '';
    elements.dateError.textContent = '';
    elements.categoryError.textContent = '';
    elements.txTitle.classList.remove('is-invalid');
    elements.txAmount.classList.remove('is-invalid');
    elements.txDate.classList.remove('is-invalid');
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    clearErrors();

    const type = getCurrentFormType();
    const title = elements.txTitle.value.trim();
    const amountVal = parseFloat(elements.txAmount.value);
    const dateVal = elements.txDate.value;
    const category = elements.txCategory.value;
    const note = elements.txNote.value.trim();

    let hasError = false;

    if (!title) {
      elements.titleError.textContent = 'Please enter a description.';
      elements.txTitle.classList.add('is-invalid');
      hasError = true;
    }

    if (isNaN(amountVal) || amountVal <= 0) {
      elements.amountError.textContent = 'Please enter a positive amount (> 0).';
      elements.txAmount.classList.add('is-invalid');
      hasError = true;
    }

    if (!dateVal) {
      elements.dateError.textContent = 'Please choose a date.';
      elements.txDate.classList.add('is-invalid');
      hasError = true;
    }

    if (!category) {
      elements.categoryError.textContent = 'Please select a category.';
      hasError = true;
    }

    if (hasError) return;

   
    const newTx = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      type,
      title,
      amount: parseFloat(amountVal.toFixed(2)),
      category,
      date: dateVal,
      note: note || ''
    };

    transactions.unshift(newTx);
    saveTransactions();
    renderAll();

   
    elements.txTitle.value = '';
    elements.txAmount.value = '';
    elements.txNote.value = '';
    elements.txTitle.focus();

    showToast(`Added ${type === 'income' ? 'income' : 'expense'}: "${title}"`, 'success');
  }

  
  function calculateFinancials() {
    let incomeSum = 0;
    let expenseSum = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    transactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        incomeSum += amt;
        incomeCount++;
      } else {
        expenseSum += amt;
        expenseCount++;
      }
    });

    const netBalance = incomeSum - expenseSum;
    const savingsRate = incomeSum > 0 ? Math.max(0, ((netBalance / incomeSum) * 100)) : 0;
    const burnRatio = incomeSum > 0 ? (expenseSum / incomeSum) * 100 : (expenseSum > 0 ? 100 : 0);

    return {
      netBalance,
      incomeSum,
      expenseSum,
      incomeCount,
      expenseCount,
      savingsRate,
      burnRatio
    };
  }

  function formatMoney(amount, showSign = false) {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (showSign) {
      const sign = amount >= 0 ? '+' : '-';
      return `${sign}${currentCurrency}${formatted}`;
    }
    return `${currentCurrency}${formatted}`;
  }

  function renderSummary() {
    const stats = calculateFinancials();

    
    const signPrefix = stats.netBalance < 0 ? '-' : '';
    elements.totalBalance.textContent = `${signPrefix}${formatMoney(Math.abs(stats.netBalance))}`;
    
    if (stats.netBalance < 0) {
      elements.balanceStatusBadge.textContent = 'In Deficit';
      elements.balanceStatusBadge.className = 'badge badge-negative';
    } else if (stats.netBalance > 0) {
      elements.balanceStatusBadge.textContent = 'Positive Net';
      elements.balanceStatusBadge.className = 'badge badge-positive';
    } else {
      elements.balanceStatusBadge.textContent = 'Zero Balance';
      elements.balanceStatusBadge.className = 'badge';
    }

    elements.savingsRateText.textContent = `${stats.savingsRate.toFixed(1)}% saved`;

   
    elements.totalIncome.textContent = `+${formatMoney(stats.incomeSum)}`;
    elements.incomeCount.textContent = `${stats.incomeCount} deposit${stats.incomeCount === 1 ? '' : 's'}`;

   
    elements.totalExpense.textContent = `-${formatMoney(stats.expenseSum)}`;
    elements.expenseCount.textContent = `${stats.expenseCount} payment${stats.expenseCount === 1 ? '' : 's'}`;

    
    elements.burnRate.textContent = `${Math.min(999, Math.round(stats.burnRatio))}%`;
    const progressWidth = Math.min(100, Math.max(0, stats.burnRatio));
    elements.ratioProgressBar.style.width = `${progressWidth}%`;

    if (stats.burnRatio <= 50) {
      elements.ratioStatusText.textContent = 'Excellent savings margin';
      elements.ratioProgressBar.style.background = 'var(--success)';
    } else if (stats.burnRatio <= 85) {
      elements.ratioStatusText.textContent = 'Balanced budget range';
      elements.ratioProgressBar.style.background = 'var(--warning)';
    } else {
      elements.ratioStatusText.textContent = 'High spending rate';
      elements.ratioProgressBar.style.background = 'var(--danger)';
    }
  }

  
  function renderExpenseBreakdown() {
   
    const categoryTotals = {};
    let totalExpenseAmount = 0;

    transactions.forEach(tx => {
      if (tx.type === 'expense') {
        const amt = Number(tx.amount) || 0;
        totalExpenseAmount += amt;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amt;
      }
    });

    const entries = Object.entries(categoryTotals).map(([catId, amount]) => {
      const catInfo = CATEGORY_MAP[catId] || { id: catId, name: catId, icon: '🏷️', color: '#64748b' };
      const percent = totalExpenseAmount > 0 ? (amount / totalExpenseAmount) * 100 : 0;
      return {
        ...catInfo,
        amount,
        percent
      };
    }).sort((a, b) => b.amount - a.amount);

    
    if (entries.length > 0) {
      elements.donutTopCategory.textContent = entries[0].name.split(' ')[0];
      elements.donutTopCategory.title = `${entries[0].name} (${formatMoney(entries[0].amount)})`;
    } else {
      elements.donutTopCategory.textContent = 'None';
    }

   
    renderSvgDonut(entries, totalExpenseAmount);

    
    elements.categoryBarsList.innerHTML = '';
    if (entries.length === 0) {
      elements.categoryBarsList.innerHTML = `
        <div style="text-align: center; padding: 1rem 0; color: var(--text-muted); font-size: 0.8rem;">
          No expense records to analyze yet.
        </div>
      `;
      return;
    }

    entries.slice(0, 5).forEach(item => {
      const barItem = document.createElement('div');
      barItem.className = 'category-bar-item';
      barItem.innerHTML = `
        <div class="category-bar-header">
          <div class="category-bar-name">
            <span class="category-dot" style="background-color: ${item.color}"></span>
            <span>${item.icon} ${item.name}</span>
          </div>
          <div>
            <span class="category-bar-amount">${formatMoney(item.amount)}</span>
            <span class="category-bar-percent">(${item.percent.toFixed(0)}%)</span>
          </div>
        </div>
        <div class="category-meter">
          <div class="category-meter-fill" style="width: ${item.percent.toFixed(1)}%; background-color: ${item.color}"></div>
        </div>
      `;
      elements.categoryBarsList.appendChild(barItem);
    });
  }

  function renderSvgDonut(entries, totalAmount) {
    const svg = elements.donutSvg;
    svg.innerHTML = '';

    const radius = 60;
    const center = 80;
    const circumference = 2 * Math.PI * radius;

    
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', center);
    bgCircle.setAttribute('cy', center);
    bgCircle.setAttribute('r', radius);
    bgCircle.setAttribute('stroke', 'var(--bg-secondary)');
    svg.appendChild(bgCircle);

    if (totalAmount <= 0 || entries.length === 0) {
      return;
    }

    let accumulatedPercent = 0;

    entries.forEach(item => {
      if (item.percent <= 0) return;

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', center);
      circle.setAttribute('cy', center);
      circle.setAttribute('r', radius);
      circle.setAttribute('stroke', item.color);

     
      const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((accumulatedPercent / 100) * circumference);

      circle.setAttribute('stroke-dasharray', strokeDasharray);
      circle.setAttribute('stroke-dashoffset', strokeDashoffset);

      const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      titleEl.textContent = `${item.name}: ${formatMoney(item.amount)} (${item.percent.toFixed(1)}%)`;
      circle.appendChild(titleEl);

      svg.appendChild(circle);
      accumulatedPercent += item.percent;
    });
  }

  
  function getFilteredTransactions() {
    let result = [...transactions];

   
    if (filters.type !== 'all') {
      result = result.filter(tx => tx.type === filters.type);
    }

    
    if (filters.category !== 'all') {
      result = result.filter(tx => tx.category === filters.category);
    }

 
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(tx => {
        const catName = (CATEGORY_MAP[tx.category]?.name || '').toLowerCase();
        const titleMatch = (tx.title || '').toLowerCase().includes(q);
        const noteMatch = (tx.note || '').toLowerCase().includes(q);
        return titleMatch || noteMatch || catName.includes(q);
      });
    }


    result.sort((a, b) => {
      switch (filters.sort) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return Number(b.amount) - Number(a.amount);
        case 'amount-asc':
          return Number(a.amount) - Number(b.amount);
        case 'date-desc':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return result;
  }

  function renderTransactionsList() {
    const filteredList = getFilteredTransactions();
    const count = filteredList.length;
    const totalCount = transactions.length;

    elements.txCountBadge.textContent = 
      count === totalCount 
        ? `Showing all ${count} transaction${count === 1 ? '' : 's'}`
        : `Showing ${count} of ${totalCount} transactions`;

    elements.transactionsList.innerHTML = '';

    if (count === 0) {
      elements.transactionsList.style.display = 'none';
      elements.emptyState.style.display = 'flex';

      if (totalCount === 0) {
        elements.emptyStateTitle.textContent = 'No transactions yet';
        elements.emptyStateDesc.textContent = 'Record an income or expense using the form to start tracking your finances.';
        elements.emptyStateActionBtn.style.display = 'inline-flex';
        elements.emptyStateActionBtn.textContent = 'Load Sample Data';
      } else {
        elements.emptyStateTitle.textContent = 'No matching transactions';
        elements.emptyStateDesc.textContent = 'Try adjusting your search terms or clearing active filters.';
        elements.emptyStateActionBtn.style.display = 'inline-flex';
        elements.emptyStateActionBtn.textContent = 'Reset Filters';
      }
      return;
    }

    elements.transactionsList.style.display = 'block';
    elements.emptyState.style.display = 'none';

    filteredList.forEach(tx => {
      const cat = CATEGORY_MAP[tx.category] || {
        name: tx.category,
        icon: tx.type === 'income' ? '💰' : '📦',
        color: tx.type === 'income' ? 'var(--success)' : 'var(--text-secondary)'
      };

      const isIncome = tx.type === 'income';
      const formattedDate = formatDateDisplay(tx.date);

      const li = document.createElement('li');
      li.className = 'transaction-item';
      li.setAttribute('data-id', tx.id);

      li.innerHTML = `
        <div class="tx-left">
          <div class="tx-icon-bubble" style="background-color: ${cat.color}1a; color: ${cat.color}">
            <span>${cat.icon}</span>
          </div>
          <div class="tx-details">
            <div class="tx-title" title="${escapeHtml(tx.title)}">${escapeHtml(tx.title)}</div>
            <div class="tx-meta">
              <span class="tx-cat-badge" style="background-color: ${cat.color}18; color: ${cat.color}">
                ${escapeHtml(cat.name)}
              </span>
              <span class="tx-dot-separator">•</span>
              <span class="tx-date">${formattedDate}</span>
              ${tx.note ? `<span class="tx-dot-separator">•</span><span class="tx-note" title="${escapeHtml(tx.note)}">${escapeHtml(tx.note)}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="tx-right">
          <span class="tx-amount ${isIncome ? 'is-income' : 'is-expense'}">
            ${isIncome ? '+' : '-'}${formatMoney(tx.amount)}
          </span>
          <button class="tx-delete-btn" title="Delete transaction" aria-label="Delete ${escapeHtml(tx.title)}" data-delete-id="${tx.id}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      `;

      elements.transactionsList.appendChild(li);
    });
  }

  function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

 
  function deleteTransaction(id) {
    const idx = transactions.findIndex(t => t.id === id);
    if (idx === -1) return;

    const [deleted] = transactions.splice(idx, 1);
    lastDeletedTx = { item: deleted, originalIndex: idx };
    saveTransactions();
    renderAll();

    showToast(`Deleted "${deleted.title}"`, 'warning', true);
  }

  function undoLastDelete() {
    if (!lastDeletedTx) return;

    const { item, originalIndex } = lastDeletedTx;
    transactions.splice(Math.min(originalIndex, transactions.length), 0, item);
    lastDeletedTx = null;
    saveTransactions();
    renderAll();
    showToast(`Restored "${item.title}"`, 'success');
  }

  
  function exportToCsv() {
    if (transactions.length === 0) {
      showToast('No transactions to export.', 'info');
      return;
    }

    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Currency', 'Note'];
    const rows = transactions.map(tx => {
      const catName = CATEGORY_MAP[tx.category]?.name || tx.category;
      return [
        `"${tx.date}"`,
        `"${tx.type.toUpperCase()}"`,
        `"${catName.replace(/"/g, '""')}"`,
        `"${(tx.title || '').replace(/"/g, '""')}"`,
        tx.amount.toFixed(2),
        `"${currentCurrency}"`,
        `"${(tx.note || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `FinFlow_Transactions_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Transactions exported to CSV!', 'success');
  }

 
  function showToast(message, type = 'info', hasUndo = false) {
    const toast = document.createElement('div');
    toast.className = 'toast';

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--warning)" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    } else {
      iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary)" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-msg">${escapeHtml(message)}</div>
      ${hasUndo ? '<button class="toast-undo" id="toastUndoBtn">Undo</button>' : ''}
    `;

    elements.toastContainer.appendChild(toast);

    if (hasUndo) {
      const undoBtn = toast.querySelector('#toastUndoBtn');
      undoBtn.addEventListener('click', () => {
        undoLastDelete();
        toast.remove();
      });
    }

    setTimeout(() => {
      toast.style.transition = 'opacity 200ms ease, transform 200ms ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 200);
    }, 4000);
  }

  function openConfirmModal() {
    elements.modalBackdrop.style.display = 'flex';
  }

  function closeConfirmModal() {
    elements.modalBackdrop.style.display = 'none';
  }

  
  function attachEventListeners() {
    
    elements.themeToggleBtn.addEventListener('click', toggleTheme);
    elements.currencySelect.addEventListener('change', handleCurrencyChange);
    elements.resetDemoBtn.addEventListener('click', resetDemoData);

   
    elements.typeExpense.addEventListener('change', () => {
      populateFormCategories('expense');
    });

    elements.typeIncome.addEventListener('change', () => {
      populateFormCategories('income');
    });

   
    elements.transactionForm.addEventListener('submit', handleFormSubmit);

    
    elements.txSearchInput.addEventListener('input', (e) => {
      filters.search = e.target.value.trim();
      elements.clearSearchBtn.style.display = filters.search ? 'block' : 'none';
      renderTransactionsList();
    });

    elements.clearSearchBtn.addEventListener('click', () => {
      elements.txSearchInput.value = '';
      filters.search = '';
      elements.clearSearchBtn.style.display = 'none';
      renderTransactionsList();
    });


    elements.pillButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.pillButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        filters.type = btn.getAttribute('data-filter');
        renderTransactionsList();
      });
    });

    
    elements.filterCategorySelect.addEventListener('change', (e) => {
      filters.category = e.target.value;
      renderTransactionsList();
    });

    
    elements.sortTransactionsSelect.addEventListener('change', (e) => {
      filters.sort = e.target.value;
      renderTransactionsList();
    });

    
    elements.transactionsList.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.tx-delete-btn');
      if (deleteBtn) {
        const txId = deleteBtn.getAttribute('data-delete-id');
        if (txId) {
          deleteTransaction(txId);
        }
      }
    });

    
    elements.exportCsvBtn.addEventListener('click', exportToCsv);

  
    elements.clearAllBtn.addEventListener('click', () => {
      if (transactions.length === 0) {
        showToast('No transactions to clear.', 'info');
        return;
      }
      openConfirmModal();
    });

    elements.modalCancelBtn.addEventListener('click', closeConfirmModal);
    elements.modalConfirmBtn.addEventListener('click', clearAllData);

    elements.modalBackdrop.addEventListener('click', (e) => {
      if (e.target === elements.modalBackdrop) {
        closeConfirmModal();
      }
    });

   
    elements.emptyStateActionBtn.addEventListener('click', () => {
      if (transactions.length === 0) {
        resetDemoData();
      } else {
        
        filters.search = '';
        filters.type = 'all';
        filters.category = 'all';
        elements.txSearchInput.value = '';
        elements.clearSearchBtn.style.display = 'none';
        elements.filterCategorySelect.value = 'all';
        elements.pillButtons.forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
        });
        renderTransactionsList();
      }
    });
  }

  
  function renderAll() {
    renderSummary();
    renderExpenseBreakdown();
    renderTransactionsList();
  }
  document.addEventListener('DOMContentLoaded', init);

})();
