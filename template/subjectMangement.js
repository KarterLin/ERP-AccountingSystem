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
