document.addEventListener("DOMContentLoaded", function () {
  const headers = document.querySelectorAll(".accordion-header");
  let accounts = [];
  let currentDeleteId = null;

  // 折疊效果
  headers.forEach(header => {
    header.addEventListener("click", function () {
      const item = this.parentElement;
      item.classList.toggle("active");
    });
  });

  // Modal 元素
  const addModal = document.getElementById('addSubjectModal');
  const deleteModal = document.getElementById('deleteConfirmModal');
  const addBtn = document.getElementById('addSubjectBtn');
  const addCloseBtn = addModal.querySelector('.close');
  const cancelAddBtn = document.getElementById('cancelSubjectBtn');
  const saveBtn = document.getElementById('saveSubjectBtn');
  
  const deleteCloseBtn = deleteModal.querySelector('.close');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  // 新增科目 Modal 事件
  addBtn.addEventListener('click', function (e) {
    e.preventDefault();
    addModal.style.display = 'block';
  });

  addCloseBtn.addEventListener('click', function () {
    clearForm();
    addModal.style.display = 'none';
  });

  cancelAddBtn.addEventListener('click', function () {
    clearForm();
    addModal.style.display = 'none';
  });

  // 刪除確認 Modal 事件
  deleteCloseBtn.addEventListener('click', function () {
    deleteModal.style.display = 'none';
  });

  cancelDeleteBtn.addEventListener('click', function () {
    deleteModal.style.display = 'none';
  });

  // 點擊外部關閉 Modal
  window.addEventListener('click', function (e) {
    if (e.target === addModal) {
      clearForm();
      addModal.style.display = 'none';
    }
    if (e.target === deleteModal) {
      deleteModal.style.display = 'none';
    }
  });

  // 儲存科目
  saveBtn.addEventListener('click', function() {
    const code = document.getElementById('subjectCode').value.trim();
    const name = document.getElementById('subjectName').value.trim();
    const type = document.getElementById('subjectType').value;
    const parentId = document.getElementById('parentId').value.trim();

    if (!code || !name || !type) {
      alert('請填寫所有必填欄位');
      return;
    }

    // 將成本類型轉換為expense，因為後端只有這5種類型
    const backendType = type === 'cost' ? 'expense' : type;

    const newAccount = {
      code: code,
      name: name,
      type: backendType,
      parentId: parentId === '' ? null : parseInt(parentId),
      isActive: true
    };

    saveAccount(newAccount);
  });

  // 確認刪除
  confirmDeleteBtn.addEventListener('click', function() {
    if (currentDeleteId) {
      deleteAccount(currentDeleteId);
    }
  });

  // API 調用函數
  async function loadAccounts() {
    try {
      const response = await fetch('http://localhost:8080/api/accounts');
      const data = await response.json();
      accounts = data;
      displayAccounts(accounts);
    } catch (error) {
      console.error('載入科目失敗:', error);
      alert('載入科目失敗，請檢查網路連線');
    }
  }

  async function saveAccount(account) {
    try {
      const response = await fetch('http://localhost:8080/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(account)
      });

      if (response.ok) {
        alert('科目新增成功');
        clearForm();
        addModal.style.display = 'none';
        loadAccounts(); // 重新載入科目列表
      } else {
        const errorText = await response.text();
        alert('新增失敗: ' + errorText);
      }
    } catch (error) {
      console.error('新增科目失敗:', error);
      alert('新增科目失敗，請檢查網路連線');
    }
  }

  async function deleteAccount(id) {
    try {
      const response = await fetch(`http://localhost:8080/api/accounts/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('科目刪除成功');
        deleteModal.style.display = 'none';
        currentDeleteId = null;
        loadAccounts(); // 重新載入科目列表
      } else {
        const errorText = await response.text();
        alert('刪除失敗: ' + errorText);
      }
    } catch (error) {
      console.error('刪除科目失敗:', error);
      alert('刪除科目失敗，請檢查網路連線');
    }
  }

  // 顯示科目
  function displayAccounts(accounts) {
    const assetList = document.getElementById('asset-list');
    const liabilityList = document.getElementById('liability-list');
    const equityList = document.getElementById('equity-list');
    const revenueList = document.getElementById('revenue-list');
    const costList = document.getElementById('cost-list');
    const expenseList = document.getElementById('expense-list');

    // 清空列表
    assetList.innerHTML = '';
    liabilityList.innerHTML = '';
    equityList.innerHTML = '';
    revenueList.innerHTML = '';
    costList.innerHTML = '';
    expenseList.innerHTML = '';

    accounts.forEach(account => {
      const li = createAccountListItem(account);
      
      // 根據科目代碼和類型進行分類
      if (account.type === 'asset') {
        assetList.appendChild(li);
      } else if (account.type === 'liability') {
        liabilityList.appendChild(li);
      } else if (account.type === 'equity') {
        equityList.appendChild(li);
      } else if (account.type === 'revenue') {
        revenueList.appendChild(li);
      } else if (account.type === 'expense') {
        // 根據科目代碼區分成本和費用
        if (isCostAccount(account.code)) {
          costList.appendChild(li);
        } else {
          expenseList.appendChild(li);
        }
      }
    });
  }

  // 判斷是否為成本科目（科目代碼以5開頭）
  function isCostAccount(code) {
    return code && code.startsWith('5');
  }

  function createAccountListItem(account) {
    const li = document.createElement('li');
    li.className = 'account-item';
    
    // 顯示類型時，區分成本和費用
    let displayType = getTypeDisplay(account.type);
    if (account.type === 'expense' && isCostAccount(account.code)) {
      displayType = '成本';
    }
    
    li.innerHTML = `
      <span class="account-info">
        <span class="account-code">${account.code}</span>
        <span class="account-name">${account.name}</span>
        <span class="account-type">[${displayType}]</span>
        <span class="parent-info">父科目ID: ${account.parentId || '無'}</span>
        ${account.parentName ? `<span class="parent-name">(${account.parentName})</span>` : ''}
      </span>
      <button class="delete-btn" onclick="showDeleteConfirm(${account.id}, '${account.name.replace(/'/g, "\\'")}')">刪除</button>
    `;
    return li;
  }

  function getTypeDisplay(type) {
    const typeMap = {
      'asset': '資產',
      'liability': '負債',
      'equity': '權益',
      'revenue': '收入',
      'expense': '費用'
    };
    return typeMap[type] || type;
  }

  // 全域函數供 HTML 調用
  window.showDeleteConfirm = function(id, name) {
    currentDeleteId = id;
    document.getElementById('deleteSubjectName').textContent = name;
    deleteModal.style.display = 'block';
  };

  // 清空表單
  function clearForm() {
    document.getElementById('subjectCode').value = '';
    document.getElementById('subjectName').value = '';
    document.getElementById('subjectType').value = '';
    document.getElementById('parentId').value = '';
  }

  // 初始載入
  loadAccounts();
});