// subsidiaryLedger.js (修正版本)

// 全域變數
let currentLedgerData = [];
let currentDateRange = null;
let allAccounts = [];

// 初始化
document.addEventListener("DOMContentLoaded", function () {
  // 初始化日期選擇器
  initDatePicker();
  
  // 載入科目選項
  loadAccountOptions();
  
  // 綁定按鈕事件
  bindButtonEvents();
  
  // 初始載入資料
  loadInitialData();
});

// 初始化日期選擇器
function initDatePicker() {
  flatpickr("#dateRange", {
    mode: "range",
    dateFormat: "Y-m-d",
    locale: "zh",
    allowInput: true,
    onChange: function(selectedDates, dateStr) {
      if (selectedDates.length === 2) {
        currentDateRange = {
          startDate: formatDate(selectedDates[0]),
          endDate: formatDate(selectedDates[1])
        };
        console.log("選擇日期區間:", currentDateRange);
      }
    }
  });
}

// 格式化日期
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 載入科目選項
async function loadAccountOptions() {
  try {
    const response = await fetch('http://localhost:8080/api/accounts');
    if (!response.ok) throw new Error('載入科目失敗');
    
    allAccounts = await response.json();
    console.log('載入的科目資料:', allAccounts); // 除錯用
    populateAccountSelects();
  } catch (error) {
    console.error('載入科目錯誤:', error);
    alert('載入科目資料失敗：' + error.message);
  }
}

// 填充科目下拉選單 (修正版本)
function populateAccountSelects() {
  const startSelect = document.getElementById('accountstart');
  const endSelect = document.getElementById('accountend');
  
  // 修改標籤為單一科目選擇
  startSelect.innerHTML = '<option value="">-請選擇科目-</option>';
  endSelect.style.display = 'none'; // 隱藏終止科目選擇
  document.querySelector('span').style.display = 'none'; // 隱藏波浪號
  
  // 檢查資料是否存在且有效
  if (!allAccounts || !Array.isArray(allAccounts)) {
    console.error('科目資料格式錯誤:', allAccounts);
    return;
  }
  
  // 按科目代碼排序 (修正欄位名稱)
  const sortedAccounts = allAccounts.sort((a, b) => {
    const codeA = a.code || '';
    const codeB = b.code || '';
    return codeA.localeCompare(codeB);
  });
  
  // 加入科目選項 (修正欄位名稱)
  sortedAccounts.forEach(account => {
    if (account.code && account.name) {
      const optionText = `${account.code} - ${account.name}`;
      const startOption = new Option(optionText, account.code);
      startSelect.appendChild(startOption);
    }
  });
}

// 綁定按鈕事件
function bindButtonEvents() {
  // 查詢按鈕
  const queryBtn = document.querySelector('.btn3');
  if (queryBtn) {
    queryBtn.addEventListener('click', performSearch);
  }
  
  // 清空按鈕
  const clearBtn = document.querySelector('.btn2');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearSearchConditions);
  }
  
  // 匯出按鈕
  const exportBtn = document.querySelector('.btn1');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportToExcel);
  }
}

// 執行搜尋 (配合現有API)
async function performSearch() {
  // 準備搜尋條件
  const searchRequest = {
    startDate: currentDateRange?.startDate || null,
    endDate: currentDateRange?.endDate || null,
    voucherNumber: null,
    description: null,
    account: document.getElementById('accountstart').value || null
  };
  
  console.log('搜尋條件:', searchRequest);
  
  try {
    const response = await fetch('http://localhost:8080/api/vouchers/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchRequest)
    });
    
    if (!response.ok) throw new Error('搜尋失敗');
    
    const data = await response.json();
    currentLedgerData = data;
    renderLedgerTable(data);
    
  } catch (error) {
    console.error('搜尋錯誤:', error);
    alert('搜尋失敗：' + error.message);
  }
}

// 清空搜尋條件
function clearSearchConditions() {
  // 清空日期選擇器
  const dateInput = document.getElementById('dateRange');
  if (dateInput._flatpickr) {
    dateInput._flatpickr.clear();
  }
  currentDateRange = null;
  
  // 重設科目選擇
  document.getElementById('accountstart').selectedIndex = 0;
  
  // 清空表格
  clearTable();
}

// 渲染明細分類帳表格
function renderLedgerTable(data) {
  let tbody = document.querySelector(".data-table tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    document.querySelector(".data-table").appendChild(tbody);
  }
  
  tbody.innerHTML = "";
  
  if (!data || data.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="8" style="text-align: center; color: #666;">查無資料</td>';
    tbody.appendChild(tr);
    return;
  }
  
  data.forEach(item => {
    const tr = document.createElement("tr");
    
    // 計算借/貸方向
    const debitAmount = item.debitAmount || 0;
    const creditAmount = item.creditAmount || 0;
    const direction = debitAmount > 0 ? '借' : (creditAmount > 0 ? '貸' : '-');
    
    tr.innerHTML = `
      <td>${item.voucherDate || ''}</td>
      <td>${item.voucherNumber || ''}</td>
      <td>${item.remarks || ''}</td>
      <td>${item.description || item.summary || ''}</td>
      <td>${debitAmount > 0 ? formatAmount(debitAmount) : ''}</td>
      <td>${creditAmount > 0 ? formatAmount(creditAmount) : ''}</td>
      <td>${direction}</td>
      <td>${formatAmount(item.balance || 0)}</td>
    `;
    
    tbody.appendChild(tr);
  });
}

// 格式化金額
function formatAmount(amount) {
  if (amount === 0 || amount === null || amount === undefined) return '0.00';
  return parseFloat(amount).toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

// 清空表格
function clearTable() {
  const tbody = document.querySelector(".data-table tbody");
  if (tbody) {
    tbody.innerHTML = "";
  }
  currentLedgerData = [];
}

// 初始載入資料
function loadInitialData() {
  console.log('明細分類帳頁面已載入');
}

// 匯出Excel功能
function exportToExcel() {
  if (!currentLedgerData || currentLedgerData.length === 0) {
    alert('沒有資料可以匯出，請先查詢資料');
    return;
  }

  // 準備Excel資料
  const excelData = [];
  
  // 加入標題行
  excelData.push([
    '日期',
    '傳票編號',
    '備註',
    '摘要',
    '借方金額',
    '貸方金額',
    '借/貸',
    '餘額'
  ]);

  // 加入資料行
  currentLedgerData.forEach(item => {
    const debitAmount = item.debitAmount || 0;
    const creditAmount = item.creditAmount || 0;
    const direction = debitAmount > 0 ? '借' : (creditAmount > 0 ? '貸' : '-');
    
    excelData.push([
      item.voucherDate || '',
      item.voucherNumber || '',
      item.remarks || '',
      item.description || item.summary || '',
      debitAmount > 0 ? debitAmount : '',
      creditAmount > 0 ? creditAmount : '',
      direction,
      item.balance || 0
    ]);
  });

  // 建立工作簿
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // 設定欄位寬度
  const colWidths = [
    { wch: 12 }, // 日期
    { wch: 15 }, // 傳票編號
    { wch: 20 }, // 備註
    { wch: 25 }, // 摘要
    { wch: 15 }, // 借方金額
    { wch: 15 }, // 貸方金額
    { wch: 8 },  // 借/貸
    { wch: 15 }  // 餘額
  ];
  ws['!cols'] = colWidths;

  // 設定數字格式 (金額欄位)
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = 1; R <= range.e.r; ++R) {
    // 借方金額 (第5欄, index 4)
    const cellAddress4 = XLSX.utils.encode_cell({ r: R, c: 4 });
    if (ws[cellAddress4] && typeof ws[cellAddress4].v === 'number') {
      ws[cellAddress4].z = '#,##0.00';
    }
    
    // 貸方金額 (第6欄, index 5)
    const cellAddress5 = XLSX.utils.encode_cell({ r: R, c: 5 });
    if (ws[cellAddress5] && typeof ws[cellAddress5].v === 'number') {
      ws[cellAddress5].z = '#,##0.00';
    }
    
    // 餘額 (第8欄, index 7)
    const cellAddress7 = XLSX.utils.encode_cell({ r: R, c: 7 });
    if (ws[cellAddress7] && typeof ws[cellAddress7].v === 'number') {
      ws[cellAddress7].z = '#,##0.00';
    }
  }

  // 加入工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, "明細分類帳");

  // 產生檔案名稱
  let fileName = '明細分類帳';
  if (currentDateRange) {
    fileName += `_${currentDateRange.startDate}_${currentDateRange.endDate}`;
  }
  
  // 如果有選擇科目，加入科目資訊
  const selectedAccount = document.getElementById('accountstart').value;
  if (selectedAccount) {
    fileName += `_${selectedAccount}`;
  }
  
  fileName += '.xlsx';

  // 匯出檔案
  XLSX.writeFile(wb, fileName);
}