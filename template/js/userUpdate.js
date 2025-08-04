const uAccountEl = document.getElementById("uAccount");
const uNameEl = document.getElementById("uName");
const uEmailEl = document.getElementById("uEmail");
const jobTitleEl = document.getElementById("jobTitle");

const initialFormData ={};

// 欄位與驗證規則定義
const fieldMap = [
    { el: uAccountEl, name: "帳號", required: true },
    { el: uNameEl, name: "姓名", required: true },
    { el: uEmailEl, name: "Email", required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, formatMsg: "信箱格式錯誤" },
    { el: jobTitleEl, name: "職稱", required: true }
];
// 儲存初始表單值
fieldMap.forEach(({ el }) => {
    initialFormData[el.id] = el.value;
});
// 清除錯誤格式
function clearErrType() {
    fieldMap.forEach(({ el }) => {
        el.classList.remove("error");
        el.style.border = "";
    });
}
// form格式驗證
document.getElementById("userUpdate").addEventListener("submit", function (e) {
    // 擋submit
    e.preventDefault();
    // clearErrType();

    // 檢查必填 & 格式
    for (let { el, name, pattern, formatMsg, required } of fieldMap) {
        const value = el.value.trim();

        if (required && !value) {
            showError(el, name + "不得為空");
            return;
        }
        if (value && pattern && !pattern.test(value)) {
            showError(el, formatMsg || name + "格式錯誤");
            return;
        }
    }
    // console.log("表單驗證通過，可以送出");
})

// 取消編輯
function cancelEdit() {
    const selects = document.querySelectorAll("select");

    clearErrType();

    fieldMap.forEach(({ el }) => {
        el.value = initialFormData[el.id] || "";
    });

    selects.forEach(el => {
        el.selectedIndex = 0;   // 回到預設選項
    });

    location.href = "setting_userManage.html";
}

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