
document.addEventListener("DOMContentLoaded", function () {
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach(header => {
    header.addEventListener("click", function () {
      const item = this.parentElement;
      item.classList.toggle("active");
    });
  });
});