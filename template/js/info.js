// 管理者權限才能執行?
function enableForm() {
  const inputs = document.querySelectorAll('#cForm input, #cForm select');
  inputs.forEach(el => el.disabled = false);

  // 顯示 submit 按鈕
  document.querySelector('.submit').style.display = 'block';
}