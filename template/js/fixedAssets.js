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
}

// ========== 新增的固定資產聯動功能 ==========
// 定義每個固定資產類型對應的折舊科目
const fixedAssetDepreciationOptions = {
    'land': {
        message: '土地無需折舊',
        disabled: true,
        autoSelect: null
    },
    'buildings': {
        text: '累積折舊-房屋及建物',
        value: 'ACCbuildings',
        disabled: true
    },
    'itEquipments': {
        text: '累積折舊-資訊設備',
        value: 'ACCitEquipments',
        disabled: true
    },
    'officeitEquipments': {
        text: '累積折舊-辦公設備',
        value: 'ACCofficeitEquipments',
        disabled: true
    },
    'transportationEquipments': {
        text: '累積折舊-運輸設備',
        value: 'ACCtransportationEquipments',
        disabled: true
    },
    'miscellaneousEquipments': {
        text: '累積折舊-什項設備',
        value: 'ACCmiscellaneousEquipments',
        disabled: true
    }
};

// 更新每期折舊科目選單的函數
function updateFixedAssetDepreciationSubject(selectedType) {
    // 直接使用 ID 選擇器
    const depreciationSubjectSelect = document.getElementById('depreciation-subject');
    if (!depreciationSubjectSelect) return;
    
    // 清空現有選項
    depreciationSubjectSelect.innerHTML = '';
    
    if (!selectedType || !fixedAssetDepreciationOptions[selectedType]) {
        // 如果沒有選擇或選擇了未定義的選項，恢復預設狀態
        depreciationSubjectSelect.innerHTML = '<option value="">請選擇</option>';
        depreciationSubjectSelect.disabled = false;
        depreciationSubjectSelect.style.backgroundColor = '';
        depreciationSubjectSelect.style.color = '';
        return;
    }

    const config = fixedAssetDepreciationOptions[selectedType];
    
    // 統一設置反灰樣式
    depreciationSubjectSelect.disabled = true;
    depreciationSubjectSelect.style.backgroundColor = '#f5f5f5';
    depreciationSubjectSelect.style.color = '#999';
    
    // 特別處理土地的情況
    if (selectedType === 'land') {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = config.message; // "土地無需折舊"
        depreciationSubjectSelect.appendChild(option);
        depreciationSubjectSelect.value = '';
        return;
    }
    
    // 處理其他固定資產類型：自動帶出對應的累計折舊科目並反灰
    const option = document.createElement('option');
    option.value = config.value;
    option.textContent = config.text;
    depreciationSubjectSelect.appendChild(option);
    depreciationSubjectSelect.value = config.value;
}

// ========== 事件監聽器設置 ==========
// 表單提交處理
const journalForm = document.getElementById('journal-entry-form');
if (journalForm) {
    journalForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        // 固定資產表單提交處理
        handleFixedAssetFormSubmission();
    });
}

// 固定資產表單提交處理
async function handleFixedAssetFormSubmission() {
    const entryDate = document.getElementById('entry-date').value;
    const fixedAssetType = document.getElementById('fixed-asset-type').value;
    const fixedAssetName = document.getElementById('fixed-asset-name').value;
    const creditAccount = document.getElementById('credit-account').value;
    const depreciationSubject = document.getElementById('depreciation-subject').value;
    
    // 注意：HTML 中金額和殘值的 ID 都是 startDate，需要修正
    const amountInputs = document.querySelectorAll('input[type="number"]');
    const amount = amountInputs[0] ? amountInputs[0].value : '';
    const residualValue = amountInputs[1] ? amountInputs[1].value : '';
    
    // 摘要欄位
    const descriptionInputs = document.querySelectorAll('input[type="text"]');
    const description = descriptionInputs[0] ? descriptionInputs[0].value : '';
    
    const usefulLifeYears = document.getElementById('useful-life-years').value;
    const usefulLifeMonths = document.getElementById('useful-life-months').value;

    // 基本驗證
    if (!entryDate) return alert('請選擇入帳日期');
    if (!fixedAssetType) return alert('請選擇固定資產類型');
    if (!fixedAssetName) return alert('請輸入固定資產名稱');
    if (!creditAccount) return alert('請選擇對應貸方科目');
    if (!amount || parseFloat(amount) <= 0) return alert('請輸入正確的金額');
    
    // 土地不需要折舊科目和使用年限
    if (fixedAssetType !== 'land') {
        if (!depreciationSubject) return alert('請選擇每期折舊科目');
        if (!usefulLifeYears && !usefulLifeMonths) return alert('請輸入使用年限');
    }

    const formData = {
        entryDate,
        fixedAssetType,
        fixedAssetName,
        creditAccount,
        depreciationSubject: fixedAssetType === 'land' ? null : depreciationSubject, // 土地設為 null
        amount: parseFloat(amount),
        residualValue: parseFloat(residualValue || '0'),
        usefulLifeYears: parseInt(usefulLifeYears || '0'),
        usefulLifeMonths: parseInt(usefulLifeMonths || '0'),
        description
    };

    console.log('固定資產數據:', formData);
    
    try {
        // 這裡可以添加API調用
        // const response = await fetch('http://localhost:8080/api/fixed-assets', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
        
        alert('固定資產分錄已提交！');
        document.getElementById('journal-entry-form').reset();
        setDefaultDates();
        updateFixedAssetDepreciationSubject('');
    } catch (error) {
        console.error('提交錯誤:', error);
        alert('提交失敗，請重試');
    }
}

// DOMContentLoaded 事件處理
document.addEventListener('DOMContentLoaded', function () {
    // 設置預設日期
    setDefaultDates();

    // 新增的固定資產聯動功能
    const fixedAssetTypeSelect = document.getElementById('fixed-asset-type');
    if (fixedAssetTypeSelect) {
        // 監聽固定資產類型選擇變化
        fixedAssetTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            updateFixedAssetDepreciationSubject(selectedType);
        });

        // 初始化折舊科目選單
        updateFixedAssetDepreciationSubject(fixedAssetTypeSelect.value);
    }

    // 如果存在賬戶相關功能，載入賬戶數據
    if (document.querySelector('.account-code') || document.querySelector('.account-name')) {
        loadAccountsData();
    }
});