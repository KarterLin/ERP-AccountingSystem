// 測試用
const accountData = [
    { code: "1001", name: "現金", category: "資產" },
    { code: "1002", name: "銀行存款", category: "資產" },
    { code: "2001", name: "應付帳款", category: "負債" },
    { code: "5001", name: "文具費", category: "費用" },
    { code: "5002", name: "交通費", category: "費用" },
  ];

  function openModal() {
    document.getElementById("modalOverlay").style.display = "flex";
    renderAccountList();
  }

  function closeModal() {
    document.getElementById("modalOverlay").style.display = "none";
  }

  function selectAccount(code, name) {
    document.getElementById("accountCode").value = `${code} - ${name}`;
    closeModal();
  }

  function renderAccountList() {
    const listEl = document.getElementById("accountList");
    listEl.innerHTML = "";

    const filterText = document.getElementById("searchInput").value.toLowerCase();
    const filterCategory = document.getElementById("categoryFilter").value;

    accountData
      .filter(acc => {
        const matchText = acc.name.toLowerCase().includes(filterText) || acc.code.includes(filterText);
        const matchCat = !filterCategory || acc.category === filterCategory;
        return matchText && matchCat;
      })
      .forEach(acc => {
        const btn = document.createElement("button");
        btn.textContent = `${acc.code} - ${acc.name} [${acc.category}]`;
        btn.onclick = () => selectAccount(acc.code, acc.name);
        listEl.appendChild(btn);
      });
  }

  function filterAccounts() {
    renderAccountList();
  }

  function addEntries() {
    alert("新增分錄功能待補充");
  }