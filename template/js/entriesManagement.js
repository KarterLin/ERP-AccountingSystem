document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#dateRange", {
    mode: "range",
    dateFormat: "Y-m-d",
    locale: "zh"
  });
});

document.getElementById('clearBtn').addEventListener('click', function () {
    // 清空 input 欄位
    document.getElementById('dateRange').value = '';
    document.getElementById('summonsId').value = '';
    document.getElementById('summary').value = '';

    // 重設 select 下拉選單
    document.getElementById('suject').selectedIndex = 0;
});
