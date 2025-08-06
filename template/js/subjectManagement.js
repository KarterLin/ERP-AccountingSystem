
document.addEventListener("DOMContentLoaded", function () {
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach(header => {
    header.addEventListener("click", function () {
      const item = this.parentElement;
      item.classList.toggle("active");
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('trialBalanceModal');
  const btn = document.getElementById('trialBalanceBtn');
  const closeBtn = document.querySelector('.modal .close');
  const cancelBtn = document.getElementById('cancelChildAccountBtn');


  btn.addEventListener('click', function (e) {
    e.preventDefault(); // 阻止超連結跳轉
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  cancelBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});