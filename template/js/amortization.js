// 需要get 
// 1.後端 科目編號 為 "accountCode" 
// 2.後端 科目名稱為 "accountName"
// post 出
// 1.入帳日期 在後端為 "entryDate"
// 2.科目編號 在後端為 "accountCode" 
// 3.科目名稱 在後端為 "accountName"
// 4.借方名稱 在後端為 "debit"
// 5.貸方名稱 在後端為 "credit"
// 6.摘要 在後端為 "description"

let accountsData = [];

// ========== 原有功能保持不變 ==========
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function setDefaultDates() {
    const dateInput = document.getElementById('entry-date');
    if (!dateInput.value) dateInput.value = getCurrentDate();
}

async function loadAccountsData() {
    try {
        const response = await fetch('http://localhost:8080/api/accounts');
        if (response.ok) {
            accountsData = await response.json(); // 直接用原始欄位 code, name
        } else {
            throw new Error();
        }
    } catch {
        accountsData = [
            { code: "1001000", name: '現金' },
            { code: "1002000", name: '銀行存款' },
            { code: "2001000", name: '應付帳款' },
            { code: "3001000", name: '資本' },
            { code: "4001000", name: '銷貨收入' },
            { code: "5001000", name: '銷貨成本' }
        ];
    }

    populateAllAccountSelects();
    // 為初始行設置事件監聽器
    document.querySelectorAll('.journal-row').forEach(setupRowEvents);
}

// 初始化所有下拉選單選項
function populateAllAccountSelects() {
    document.querySelectorAll('.account-code').forEach(select => {
        if (select.options.length <= 1) { // 只有當選單為空時才填充
            select.innerHTML = '<option value="">請選擇科目編號</option>';
            accountsData.forEach(account => {
                const option = document.createElement('option');
                option.value = account.code;
                option.textContent = account.code;
                select.appendChild(option);
            });
        }
    });

    document.querySelectorAll('.account-name').forEach(select => {
        if (select.options.length <= 1) { // 只有當選單為空時才填充
            select.innerHTML = '<option value="">請選擇科目名稱</option>';
            accountsData.forEach(account => {
                const option = document.createElement('option');
                option.value = account.name;
                option.textContent = account.name;
                select.appendChild(option);
            });
        }
    });
}

// 為單一行設置選項和事件監聽器
function setupRowEvents(row) {
    const codeSelect = row.querySelector('.account-code');
    const nameSelect = row.querySelector('.account-name');
    const debitInput = row.querySelector('.debit-amount');
    const creditInput = row.querySelector('.credit-amount');

    // 填充選項（只有當選單為空時）
    if (codeSelect && codeSelect.options.length <= 1) {
        codeSelect.innerHTML = '<option value="">請選擇科目編號</option>';
        accountsData.forEach(account => {
            const option = document.createElement('option');
            option.value = account.code;
            option.textContent = account.code;
            codeSelect.appendChild(option);
        });
    }

    if (nameSelect && nameSelect.options.length <= 1) {
        nameSelect.innerHTML = '<option value="">請選擇科目名稱</option>';
        accountsData.forEach(account => {
            const option = document.createElement('option');
            option.value = account.name;
            option.textContent = account.name;
            nameSelect.appendChild(option);
        });
    }

    // 設置連動事件（使用標記來避免重複綁定）
    if (codeSelect && !codeSelect.hasAttribute('data-events-bound')) {
        codeSelect.addEventListener('change', () => {
            const matched = accountsData.find(acc => acc.code === codeSelect.value);
            if (nameSelect) nameSelect.value = matched ? matched.name : '';
        });
        codeSelect.setAttribute('data-events-bound', 'true');
    }

    if (nameSelect && !nameSelect.hasAttribute('data-events-bound')) {
        nameSelect.addEventListener('change', () => {
            const matched = accountsData.find(acc => acc.name === nameSelect.value);
            if (codeSelect) codeSelect.value = matched ? matched.code : '';
        });
        nameSelect.setAttribute('data-events-bound', 'true');
    }

    // 借方金額輸入時的處理
    if (debitInput && !debitInput.hasAttribute('data-events-bound')) {
        debitInput.addEventListener('input', () => {
            if (debitInput.value && parseFloat(debitInput.value) > 0) {
                if (creditInput) {
                    creditInput.disabled = true;
                    creditInput.value = '0';
                    creditInput.style.backgroundColor = '#f5f5f5';
                }
            } else {
                if (creditInput) {
                    creditInput.disabled = false;
                    creditInput.style.backgroundColor = '';
                }
            }
            if (typeof updateBalanceSummary === 'function') {
                updateBalanceSummary();
            }
        });
        debitInput.setAttribute('data-events-bound', 'true');
    }

    // 貸方金額輸入時的處理
    if (creditInput && !creditInput.hasAttribute('data-events-bound')) {
        creditInput.addEventListener('input', () => {
            if (creditInput.value && parseFloat(creditInput.value) > 0) {
                if (debitInput) {
                    debitInput.disabled = true;
                    debitInput.value = '0';
                    debitInput.style.backgroundColor = '#f5f5f5';
                }
            } else {
                if (debitInput) {
                    debitInput.disabled = false;
                    debitInput.style.backgroundColor = '';
                }
            }
            if (typeof updateBalanceSummary === 'function') {
                updateBalanceSummary();
            }
        });
        creditInput.setAttribute('data-events-bound', 'true');
    }
}

function handleAccountCodeChange(select) {
    const row = select.closest('tr');
    if (!row) return;
    const nameSelect = row.querySelector('.account-name');
    const selected = accountsData.find(a => a.code == select.value);
    if (nameSelect) nameSelect.value = selected ? selected.name : '';
}

function handleAccountNameChange(select) {
    const row = select.closest('tr');
    if (!row) return;
    const codeSelect = row.querySelector('.account-code');
    const selected = accountsData.find(a => a.name === select.value);
    if (codeSelect) codeSelect.value = selected ? selected.code : '';
}

function updateBalanceSummary() {
    let totalDebit = 0;
    let totalCredit = 0;
    document.querySelectorAll('input[name="debit[]"]').forEach(input => {
        totalDebit += parseFloat(input.value || '0');
    });
    document.querySelectorAll('input[name="credit[]"]').forEach(input => {
        totalCredit += parseFloat(input.value || '0');
    });
    const diff = totalDebit - totalCredit;
    
    const totalDebitElement = document.getElementById('total-debit');
    const totalCreditElement = document.getElementById('total-credit');
    const diffSpan = document.getElementById('balance-diff');
    
    if (totalDebitElement) totalDebitElement.textContent = totalDebit.toFixed(2);
    if (totalCreditElement) totalCreditElement.textContent = totalCredit.toFixed(2);
    if (diffSpan) {
        diffSpan.textContent = diff.toFixed(2);
        diffSpan.style.color = diff === 0 ? 'green' : 'red';
    }
}

function addEntryRow() {
    const table = document.getElementById('entries-table');
    if (!table || table.rows.length < 2) return;
    
    const newRow = table.rows[1].cloneNode(true);

    // 清空新行的輸入值
    Array.from(newRow.querySelectorAll('input')).forEach(i => {
        i.value = '';
        i.disabled = false;
    });
    Array.from(newRow.querySelectorAll('select')).forEach(s => s.selectedIndex = 0);

    // 移除事件綁定標記，這樣新行可以重新綁定事件
    Array.from(newRow.querySelectorAll('select, input')).forEach(element => element.removeAttribute('data-events-bound'));

    const currentRowCount = table.rows.length - 1; // 不含表頭
    if (currentRowCount >= 2) {
        newRow.cells[newRow.cells.length - 1].innerHTML = '<button type="button" class="remove-row">-</button>';
    } else {
        newRow.cells[newRow.cells.length - 1].innerHTML = '';
    }

    table.appendChild(newRow);

    // 為新行設置選項和事件監聽器
    setupRowEvents(newRow);
}

// ========== 新增的無形資產聯動功能 ==========
// 定義每個無形資產類型對應的攤提科目
const intangibleAmortizationOptions = {
    'patents': {
        options: [
            { value: 'AMTpatents', text: '累計攤銷-專利權' }
        ],
        disabled: true, // 專利權自動帶出並反灰
        autoSelect: 'AMTpatents'
    },
    'trademarks': {
        options: [
            { value: 'AMTtrademarks', text: '累計攤銷-商標權' }
        ],
        disabled: true, // 商標權自動帶出並反灰
        autoSelect: 'AMTtrademarks'
    },
    'computerSoftwareCost': {
        options: [
            { value: 'AMTcomputerSoftwareCost', text: '累計攤銷-電腦軟體' }
        ],
        disabled: true, // 電腦軟體自動帶出並反灰
        autoSelect: 'AMTcomputerSoftwareCost'
    }
};

// 更新每期攤提科目選單的函數
function updateIntangibleAmortizationSubject(selectedType) {
    const amortizationSubjectSelect = document.getElementById('amortization-subject');
    if (!amortizationSubjectSelect) return;
    
    // 清空現有選項
    amortizationSubjectSelect.innerHTML = '';
    
    if (!selectedType || !intangibleAmortizationOptions[selectedType]) {
        // 如果沒有選擇或選擇了未定義的選項，恢復預設選項
        amortizationSubjectSelect.innerHTML = `
            <option value="">請選擇</option>
            <option value="AMTpatents">累計攤銷-專利權</option>
            <option value="AMTtrademarks">累計攤銷-商標權</option>
            <option value="AMTcomputerSoftwareCost">累計攤銷-電腦軟體</option>
        `;
        amortizationSubjectSelect.disabled = false;
        amortizationSubjectSelect.style.backgroundColor = '';
        amortizationSubjectSelect.style.color = '';
        return;
    }

    const config = intangibleAmortizationOptions[selectedType];
    
    // 添加對應的選項
    config.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        amortizationSubjectSelect.appendChild(optionElement);
    });

    // 設置是否禁用選單
    if (config.disabled) {
        amortizationSubjectSelect.disabled = true;
        amortizationSubjectSelect.style.backgroundColor = '#f5f5f5'; // 反灰背景色
        amortizationSubjectSelect.style.color = '#999'; // 反灰文字色
        
        // 自動選擇對應的值
        if (config.autoSelect) {
            amortizationSubjectSelect.value = config.autoSelect;
        }
    } else {
        amortizationSubjectSelect.disabled = false;
        amortizationSubjectSelect.style.backgroundColor = '';
        amortizationSubjectSelect.style.color = '';
    }
}

// ========== 事件監聽器設置 ==========
// 原有的事件監聽器
const entriesTable = document.getElementById('entries-table');
if (entriesTable) {
    entriesTable.addEventListener('input', function (e) {
        if (e.target.name === 'debit[]' || e.target.name === 'credit[]') {
            updateBalanceSummary();
        }
    });

    entriesTable.addEventListener('change', function (e) {
        if (e.target.classList.contains('account-code')) handleAccountCodeChange(e.target);
        else if (e.target.classList.contains('account-name')) handleAccountNameChange(e.target);
    });

    entriesTable.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('remove-row')) {
            e.target.closest('tr').remove();
            updateBalanceSummary();
        }
    });
}

const addRowBtn = document.getElementById('add-row');
if (addRowBtn) {
    addRowBtn.onclick = addEntryRow;
}

// 表單提交處理
const journalForm = document.getElementById('journal-entry-form');
if (journalForm) {
    journalForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        // 檢查是否為無形資產表單（通過檢查特定元素存在與否）
        const intangibleTypeSelect = document.getElementById('intangible-type');
        const entriesTable = document.getElementById('entries-table');
        
        if (intangibleTypeSelect && !entriesTable) {
            // 這是無形資產表單
            handleIntangibleFormSubmission();
        } else if (entriesTable) {
            // 這是一般分錄表單
            handleJournalFormSubmission();
        }
    });
}

// 無形資產表單提交處理
async function handleIntangibleFormSubmission() {
    const entryDate = document.getElementById('entry-date').value;
    const intangibleType = document.getElementById('intangible-type').value;
    const intangibleName = document.getElementById('intangible-name').value;
    const creditAccount = document.getElementById('credit-account').value;
    const amortizationSubject = document.getElementById('amortization-subject').value;
    const amount = document.getElementById('amount').value;
    const residualValue = document.getElementById('residual-value').value;
    const usefulLifeYears = document.getElementById('useful-life-years').value;
    const usefulLifeMonths = document.getElementById('useful-life-months').value;
    const description = document.getElementById('description').value;

    // 基本驗證
    if (!entryDate) return alert('請選擇入帳日期');
    if (!intangibleType) return alert('請選擇無形資產類型');
    if (!intangibleName) return alert('請輸入無形資產名稱');
    if (!creditAccount) return alert('請選擇對應貸方科目');
    if (!amortizationSubject) return alert('請選擇每期攤提科目');
    if (!amount || parseFloat(amount) <= 0) return alert('請輸入正確的金額');
    if (!usefulLifeYears && !usefulLifeMonths) return alert('請輸入使用年限');

    const formData = {
        entryDate,
        intangibleType,
        intangibleName,
        creditAccount,
        amortizationSubject,
        amount: parseFloat(amount),
        residualValue: parseFloat(residualValue || '0'),
        usefulLifeYears: parseInt(usefulLifeYears || '0'),
        usefulLifeMonths: parseInt(usefulLifeMonths || '0'),
        description
    };

    console.log('無形資產數據:', formData);
    
    try {
        // 這裡可以添加API調用
        // const response = await fetch('http://localhost:8080/api/intangible-assets', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
        
        alert('無形資產分錄已提交！');
        document.getElementById('journal-entry-form').reset();
        setDefaultDates();
        updateIntangibleAmortizationSubject('');
    } catch (error) {
        console.error('提交錯誤:', error);
        alert('提交失敗，請重試');
    }
}

// 一般分錄表單提交處理（原有功能）
async function handleJournalFormSubmission() {
    const entryDate = document.getElementById('entry-date').value;
    const details = [];
    const rows = document.querySelectorAll('#entries-table tr');

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const accountCode = row.querySelector('select[name="accountCode[]"]')?.value;
        const accountName = row.querySelector('select[name="accountName[]"]')?.value;
        const debit = row.querySelector('input[name="debit[]"]')?.value || '0';
        const credit = row.querySelector('input[name="credit[]"]')?.value || '0';
        const description = row.querySelector('input[name="description[]"]')?.value;

        if (accountCode && accountName) {
            details.push({
                accountCode: parseInt(accountCode), // 轉換為數字
                debit: parseFloat(debit),
                credit: parseFloat(credit),
                description
            });
        }
    }

    if (details.length === 0) return alert('請至少填寫一筆分錄');

    const totalDebit = details.reduce((sum, e) => sum + e.debit, 0);
    const totalCredit = details.reduce((sum, e) => sum + e.credit, 0);
    if (totalDebit !== totalCredit) return alert(`借貸不相符！\n借方總額：${totalDebit}，貸方總額：${totalCredit}`);

    // 構建新的JSON格式
    const journalEntry = {
        entryDate: entryDate,
        details: details
    };

    // 顯示將要發送的JSON格式供檢查
    console.log('將要發送的JSON格式:', JSON.stringify(journalEntry, null, 2));

    try {
        const res = await fetch('http://localhost:8080/api/journal-entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(journalEntry)
        });
        if (res.ok) {
            alert('分錄已成功提交！');
            document.getElementById('journal-entry-form').reset();
            setDefaultDates();
            updateBalanceSummary();
        } else {
            alert('提交失敗，請重試');
        }
    } catch (err) {
        console.error(err);
        alert('提交時發生錯誤，請重試');
    }
}

// DOMContentLoaded 事件處理
document.addEventListener('DOMContentLoaded', function () {
    // 設置預設日期
    setDefaultDates();

    // 新增的無形資產聯動功能
    const intangibleTypeSelect = document.getElementById('intangible-type');
    if (intangibleTypeSelect) {
        // 監聽無形資產類型選擇變化
        intangibleTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            updateIntangibleAmortizationSubject(selectedType);
        });

        // 初始化攤提科目選單
        updateIntangibleAmortizationSubject(intangibleTypeSelect.value);
    }

    // 如果存在賬戶相關功能，載入賬戶數據
    if (document.querySelector('.account-code') || document.querySelector('.account-name')) {
        loadAccountsData();
    }
    
    // 如果存在分錄表格，添加行並更新餘額
    if (document.getElementById('entries-table')) {
        addEntryRow(); // 新增第二筆
        updateBalanceSummary();
    }
});