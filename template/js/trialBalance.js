
document.addEventListener("DOMContentLoaded", () => {
  initTableToggle();
});

function initTableToggle() {
  document.querySelectorAll('tr.main-row').forEach(mainRow => {
    const groupClass = Array.from(mainRow.classList).find(c => c.startsWith('group'));
    if (!groupClass) return;

    const hasSubRows = document.querySelector(`tr.sub-row.${groupClass}`);
    if (!hasSubRows) return;

    const td = mainRow.querySelector('td');
    if (!td) return;

    // 插入箭頭（如果尚未插入）
    if (!td.querySelector('.arrow')) {
      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      td.prepend(arrow);
    }

    // 加入點擊事件（避免重複綁定）
    if (!mainRow._clickBound) {
      mainRow._clickBound = true;
      mainRow.addEventListener('click', () => {
        mainRow.classList.toggle('expanded');
        document.querySelectorAll(`tr.sub-row.${groupClass}`).forEach(sub => {
          sub.classList.toggle('show');
        });
      });
    }
  });
}


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

  document.querySelectorAll('tr.main-row').forEach(mainRow => {
    const groupClass = Array.from(mainRow.classList).find(c => c.startsWith('group'));
    if (groupClass && document.querySelector(`tr.sub-row.${groupClass}`)) {
      const td = mainRow.querySelector('td');
      if (!td) return;

      // 避免重複插入箭頭
      if (!td.querySelector('.arrow')) {
        const arrow = document.createElement('span');
        arrow.className = 'arrow';
        td.prepend(arrow);
      }

      // 避免重複綁定事件
      if (!mainRow._clickBound) {
        mainRow._clickBound = true;
        mainRow.addEventListener('click', () => {
          mainRow.classList.toggle('expanded');
          document.querySelectorAll(`tr.sub-row.${groupClass}`).forEach(sub => {
            sub.classList.toggle('show');
          });
        });
      }
    }
  });
};

flatpickr("#dateRange", {
    locale: "zh", // 中文
    dateFormat: "Y-m-d", // 日期格式：年-月-日
    allowInput: true
  });