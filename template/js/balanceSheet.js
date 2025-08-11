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

// 點擊空白處收起 sidebar
document.addEventListener('click', function (event) {
  const sidebar = document.querySelector('.sidebar');
  const hamburger = document.querySelector('.hamburger');
  const pageWrapper = document.querySelector('.page-wrapper');

  const clickedInsideSidebarOrHamburger = sidebar.contains(event.target) || hamburger.contains(event.target);

  if (!clickedInsideSidebarOrHamburger) {
    sidebar.classList.remove('open');
    pageWrapper.classList.remove('shift');

    if (hamburger._showTimeout) {
      clearTimeout(hamburger._showTimeout);
    }

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

  if (!sidebar || !pageWrapper || !hamburger) return;

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
handleResize();
window.addEventListener('resize', handleResize);

function toggleItems() {
  const toggle = document.getElementById('toggleSwitch');
  const text = document.getElementById('switchText');

  toggle.classList.toggle('active');
  if (toggle.classList.contains('active')) {
    text.innerText = '隱藏部分項目';
    // 加入顯示全部行的程式碼
  } else {
    text.innerText = '顯示全部項目';
    // 加入隱藏部分行的程式碼
  }
}

function toggleSubRows(groupClass) {
  const rows = document.querySelectorAll('tr.sub-row.' + groupClass);
  rows.forEach(row => {
    row.classList.toggle('show');
  });
}

// Sidebar 載入完成後的初始化
window.onSidebarLoaded = () => {
  handleResize();
  window.addEventListener('resize', handleResize);

  // 針對兩個表格分別初始化
  const tables = document.querySelectorAll('.tableFixHead table');

  tables.forEach(table => {
    table.querySelectorAll('tr.main-row').forEach(mainRow => {
      const groupClass = Array.from(mainRow.classList).find(c => c.startsWith('group'));
      if (groupClass && table.querySelector(`tr.sub-row.${groupClass}`)) {
        const td = mainRow.querySelector('td');
        if (!td) return;

        if (!td.querySelector('.arrow')) {
          const arrow = document.createElement('span');
          arrow.className = 'arrow';
          td.prepend(arrow);
        }

        // 預設展開主列與該表格內對應的子列
        mainRow.classList.add('expanded');
        table.querySelectorAll(`tr.sub-row.${groupClass}`).forEach(sub => {
          sub.classList.add('show');
        });

        if (!mainRow._clickBound) {
          mainRow._clickBound = true;
          mainRow.addEventListener('click', () => {
            mainRow.classList.toggle('expanded');
            table.querySelectorAll(`tr.sub-row.${groupClass}`).forEach(sub => {
              sub.classList.toggle('show');
            });
          });
        }
      }
    });
  });
};

// 若 sidebar 載入完了，立即執行
if (typeof window.onSidebarLoaded === 'function') {
  window.onSidebarLoaded();
}

flatpickr("#dateRange", {
    locale: "zh", // 中文
    dateFormat: "Y-m-d", // 日期格式：年-月-日
    allowInput: true
  });
