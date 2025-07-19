function toggle(id) {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('hidden');
        }


// 備註輸入框顯示切換
function toggleNoteInput(liElement, event) {
    // 防止點擊冒泡導致 toggle 發生
    if (event) event.stopPropagation();

    let existingInput = liElement.querySelector(".note-area");
    if (existingInput) {
        existingInput.remove(); // 如果已經有就移除
        return;
    }

    // 建立輸入區塊
    const container = document.createElement("div");
    container.className = "note-area";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "輸入備註...";
    input.className = "note-input";
    input.onclick = (e) => e.stopPropagation();

    const saveBtn = document.createElement("button");
    saveBtn.innerText = "儲存";
    saveBtn.onclick = function (e) {
        e.stopPropagation();
        alert("備註已儲存: " + input.value);
        container.remove();
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "取消";
    cancelBtn.onclick = function (e) {
        e.stopPropagation();
        container.remove();
    };

    container.appendChild(input);
    container.appendChild(saveBtn);
    container.appendChild(cancelBtn);

    liElement.appendChild(container);
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const pageWrapper = document.querySelector('.page-wrapper');
  const hamburger = document.querySelector('.hamburger');

  if(sidebar.classList.contains('open')){
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