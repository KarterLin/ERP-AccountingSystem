// js/sidebar.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("sidebar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("sidebar-container").innerHTML = html;
      // 插入sidebar後再判斷active

      if (window.onSidebarLoaded) window.onSidebarLoaded();

      const hamburger = document.querySelector('.hamburger');
      if (hamburger) {
        hamburger.addEventListener('click', toggleSidebar);
      }

      const currentPath = location.pathname.split("/").pop();
      const sidebarLinks = document.querySelectorAll(".sidebar a");

      sidebarLinks.forEach(link => {
        const href = link.getAttribute("href");

        if (href === currentPath) {
          // 精準頁面
          link.classList.add("active");
        } else {
          // 子頁面設定
          const group = link.dataset.group;
          if (group && currentPath.startsWith(group)) {
            link.classList.add("active");
          }
        }
      });
    })
    .catch(error => {
      console.error("發生錯誤：", error);
    });



  
})

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const pageWrapper = document.querySelector('.page-wrapper');
  const hamburger = document.querySelector('.hamburger');

  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    pageWrapper.classList.remove('shift');
    setTimeout(() => hamburger.classList.remove('hidden'), 300);
  } else {
    sidebar.classList.add('open');
    pageWrapper.classList.add('shift');
    hamburger.classList.add('hidden');
  }
}

// 把點擊監聽整合成一個，並避免重複
document.addEventListener('click', function (event) {
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

  if (!sidebar) {
    console.warn('找不到 .sidebar 元素');
  }
  if (!pageWrapper) {
    console.warn('找不到 .page-wrapper 元素');
  }
  if (!hamburger) {
    console.warn('找不到 .hamburger 元素');
  }

  if (!sidebar || !pageWrapper || !hamburger) {
    // 缺任何一個就先不要繼續執行
    return;
  }

  if (window.innerWidth > 768) {
    sidebar.classList.add('open');
    pageWrapper.classList.remove('shift');
    hamburger.classList.add('hidden');
    pageWrapper.style.marginLeft = '';
  } else {
    sidebar.classList.remove('open');
    pageWrapper.classList.remove('shift');
    hamburger.classList.remove('hidden');
  }
}

// 初始化
window.onSidebarLoaded = () => {
  handleResize();
  window.addEventListener('resize', handleResize);
};
