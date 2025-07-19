document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#dateRange", {
    mode: "range",
    dateFormat: "Y-m-d",
    locale: "zh"
  });
});

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const pageWrapper = document.querySelector('.page-wrapper');
  const hamburger = document.querySelector('.hamburger');

  const isOpen = sidebar.classList.contains('open');

  if (isOpen) {
    // 關閉 sidebar
    sidebar.classList.remove('open');
    pageWrapper.classList.remove('shift');

    // 延遲顯示 hamburger（等 sidebar 收合動畫完成）
    setTimeout(() => {
      hamburger.classList.remove('hidden');
    }, 300); // 與 CSS transition 一致
  } else {
    // 開啟 sidebar
    sidebar.classList.add('open');
    pageWrapper.classList.add('shift');
    hamburger.classList.add('hidden');
  }
}

// 把點擊監聽整合成一個，並避免重複
document.addEventListener('click', function(event) {
  const sidebar = document.querySelector('.sidebar');
  const hamburger = document.querySelector('.hamburger');
  const pageWrapper = document.querySelector('.page-wrapper');

  const clickedInsideSidebarOrHamburger = sidebar.contains(event.target) || hamburger.contains(event.target);

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
});

function handleResize() {
  const sidebar = document.querySelector('.sidebar');
  const pageWrapper = document.querySelector('.page-wrapper');
  const hamburger = document.querySelector('.hamburger');

  if (window.innerWidth > 768) {
    sidebar.classList.add('open');
    pageWrapper.classList.remove('shift'); // ← 可考慮依 sidebar 是否固定來決定是否 shift
    hamburger.classList.add('hidden'); // ← 桌機版不顯示 hamburger
    pageWrapper.style.marginLeft = ''; // 清除 inline
  } else {
    sidebar.classList.remove('open');
    pageWrapper.classList.remove('shift');
    hamburger.classList.remove('hidden');
  }
}

// 初始化
handleResize();
window.addEventListener('resize', handleResize);
