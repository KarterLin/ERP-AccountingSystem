// 管理者權限才能執行?

const cNameEl = document.getElementById("cName");
const taxIDEl = document.getElementById("taxID");
const rNameEl = document.getElementById("rName");
const telEl = document.getElementById("rTel");
const emailEl = document.getElementById("cEmail");
const contactNameEl = document.getElementById("contactName");
const oAddrEl = document.getElementById("oAddr");
const contactTelEl = document.getElementById("contactTel");
const LOSNEl = document.getElementById("LOSN");

const initialFormData ={};

// 欄位與驗證規則定義
const fieldMap = [
    { el: cNameEl, name: "公司名稱", required: true },
    { el: taxIDEl, name: "公司統編", required: true, pattern: /^\d{8}$/, formatMsg: "公司統編格式錯誤" },  // 8碼數字
    { el: rNameEl, name: "負責人姓名", required: true },
    { el: telEl, name: "負責人電話", required: true, pattern: /^09\d{8}$/, formatMsg: "電話格式錯誤" },  // 台灣手機號碼格式
    { el: emailEl, name: "Email", required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, formatMsg: "信箱格式錯誤" },  // Email基本格式
    { el: contactNameEl, name: "營登地址",required: false },
    { el: oAddrEl, name: "申報人姓名",required: false },
    { el: contactTelEl, name: "申報人電話",required: false },
    { el: LOSNEl, name: "稅籍編號",required: false }
];
// 儲存初始表單值
fieldMap.forEach(({ el }) => {
    initialFormData[el.id] = el.value;
});
// 開啟編輯
function enableForm() {
    const inputs = document.querySelectorAll('#cForm input, #cForm select');
    inputs.forEach(el => el.disabled = false);

    // 顯示按鈕
    document.querySelector('.endEdit').style.display = 'block';
    // 隱藏編輯按鈕
    document.querySelector('.editBtn').style.display = "none";
}
// 清除錯誤格式
function clearErrType() {
    fieldMap.forEach(({ el }) => {
        el.classList.remove("error");
        el.style.border = "";
    });
}
// 取消編輯
function cancelEdit() {
    const selects = document.querySelectorAll("select");

    document.querySelector('.endEdit').style.display = 'none';
    document.querySelector('.editBtn').style.display = "block";
    clearErrType()

    fieldMap.forEach(({ el }) => {
        el.value = initialFormData[el.id] || "";
        el.disabled = true;
    });
    
    selects.forEach(el => {
    el.selectedIndex = 0;   // 回到預設選項
    el.disabled = true;
    });
}

// form格式驗證
document.getElementById("cForm").addEventListener("submit", function (e) {
    // 擋submit
    e.preventDefault();
    clearErrType()

    // 檢查必填 & 格式
    for (let { el, name, pattern, formatMsg, required } of fieldMap) {
        const value = el.value.trim();

        if (required && !value) {
            showError(el, name + "不得為空");
            return;
        }
        if (value && pattern && !pattern.test(value)){
            showError(el, formatMsg || name + "格式錯誤");
            return; 
        } 
    }
    // console.log("表單驗證通過，可以送出");
})

// 實時移除ERRTYPE
fieldMap.forEach(({ el, pattern }) => {
    el.addEventListener("input", () => {
        const value = el.value.trim();

        // 判斷是否需要格式驗證
        if (pattern) {
            if (pattern.test(value)) {
                el.classList.remove("error");
                el.style.border = "";
            }
        } else {
            if (value !== "") {
                el.classList.remove("error");
                el.style.border = "";
            }
        }
    });
});

// 錯誤提示
function showError(element, message) {
    element.classList.add("error");
    element.style.border = "2px solid red";
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    // element.focus();
    // alert(message);
}

