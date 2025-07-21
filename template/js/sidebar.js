// js/sidebar.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("sidebar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("sidebar-container").innerHTML = html;
      // 插入sidebar後再判斷active
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


  if (window.onSidebarLoaded) window.onSidebarLoaded();
})
