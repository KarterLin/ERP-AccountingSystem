document.addEventListener("DOMContentLoaded", () => {
  fetch("./topnavbar.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("topbar-container").innerHTML = data;
    })
    .catch(error => console.error("Topbar 載入失敗:", error));
});