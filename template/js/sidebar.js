// js/sidebar.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("sidebar.html")
    .then(res => res.text())
    .then(html => {
      // 把 sidebar HTML 插進容器
      document.getElementById("sidebar-container").innerHTML = html;

      // 插入後才綁定所有需要的事件
      bindSidebarEvents();

      // 設定 active：支援子頁面對應主選單
      highlightActiveLink();

      // 若外部有定義 onSidebarLoaded（例如做一些額外處理），就呼叫它
      if (window.onSidebarLoaded) window.onSidebarLoaded();
    })
    .catch(error => {
      console.error("載入 sidebar 發生錯誤：", error);
    });
});

function bindSidebarEvents() {
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleSidebar);
  }

  // 點擊頁面空白處自動關閉側欄（小螢幕）
  document.addEventListener('click', handleDocumentClick);
  
  // RWD 開關
  handleResize();
  window.addEventListener('resize', handleResize);
}

/* =========================
   1) 設定 active 的重點邏輯
   ========================= */
function highlightActiveLink() {
  const currentPath = location.pathname.split("/").pop() || "index.html";
  const sidebarLinks = document.querySelectorAll(".sidebar a");

  // 子頁 → 主選單對應（依專案情況擴充）
  const aliasMap = {
    // 收支帳簿模組
    "journalEntries.html": "accountbooks.html",

    "prepayment.html":"assets.html",
    "amortization.html":"assets.html",
    "fixedAssets.html":"assets.html",
    "property.html":"assets.html",

    "balanceSheet.html":"reports.html",
    "incomeStatement.html":"reports.html",
    "subsidiaryLedger.html":"reports.html",
    "trialBalance.html":"reports.html",

    "entriesManagement.html":"management.html",
    "subjectManagement.html":"management.html",


    // 你之後如果有其他子頁 → 主選單，就照這樣加：
    // "assetDetail.html": "assets.html",
    // "toDoAdmin.html": "toDoUser.html",
  };

  // 最終要點亮的目標 href
  const targetHref = aliasMap[currentPath] || currentPath;

  let matched = false;

  // 先嘗試精準 match href
  sidebarLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === targetHref) {
      link.classList.add("active");
      matched = true;
    }
  });

  // 若沒有 match，再用 data-group 輔助（例如 setting 一群頁面）
  if (!matched) {
    sidebarLinks.forEach(link => {
      const group = link.dataset.group;
      if (group && currentPath.includes(group)) {
        link.classList.add("active");
        matched = true;
      }
    });
  }
}

/* =====================
   2) Sidebar 開/收邏輯
   ===================== */
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const pageWrapper = document.querySelector('.page-wrapper');
  const hamburger = document.querySelector('.hamburger');

  if (!sidebar || !pageWrapper || !hamburger) return;

  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    pageWrapper.classList.remove('shift');
    // 等動畫結束再顯示漢堡
    setTimeout(() => hamburger.classList.remove('hidden'), 300);
  } else {
    sidebar.classList.add('open');
    pageWrapper.classList.add('shift');
    hamburger.classList.add('hidden');
  }
}

/* =======================
   3) 點擊空白處關閉側欄
   ======================= */
function handleDocumentClick(event) {
  const sidebar = document.querySelector('.sidebar');
  const hamburger = document.querySelector('.hamburger');
  const pageWrapper = document.querySelector('.page-wrapper');

  if (!sidebar || !hamburger || !pageWrapper) return;

  const clickedInsideSidebarOrHamburger =
    sidebar.contains(event.target) || hamburger.contains(event.target);

  if (!clickedInsideSidebarOrHamburger) {
    sidebar.classList.remove('open');
    pageWrapper.classList.remove('shift');

    // 取消先前的延遲，避免重複
    if (hamburger._showTimeout) {
      clearTimeout(hamburger._showTimeout);
    }

    // 延遲顯示漢堡按鈕，等待側邊欄動畫結束
    hamburger._showTimeout = setTimeout(() => {
      hamburger.classList.remove('hidden');
      hamburger._showTimeout = null;
    }, 300);
  }
}

/* ============================
   4) RWD：視窗變化時的處理
   ============================ */
function handleResize() {
  const sidebar = document.querySelector('.sidebar');
  const pageWrapper = document.querySelector('.page-wrapper');
  const hamburger = document.querySelector('.hamburger');

  if (!sidebar || !pageWrapper || !hamburger) return;

  if (window.innerWidth > 768) {
    // 大螢幕：側欄展開、漢堡隱藏、內容不偏移
    sidebar.classList.add('open');
    pageWrapper.classList.remove('shift');
    hamburger.classList.add('hidden');
    pageWrapper.style.marginLeft = ''; // 保持你的 CSS 控制
  } else {
    // 小螢幕：側欄收起、漢堡顯示
    sidebar.classList.remove('open');
    pageWrapper.classList.remove('shift');
    hamburger.classList.remove('hidden');
  }
}

/* 可選：給外部呼叫的 hook（若你有需要） */
window.onSidebarLoaded = window.onSidebarLoaded || null;
