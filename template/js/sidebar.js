// js/sidebar.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("sidebar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("sidebar-container").innerHTML = html;  
	  })
	  .catch(error => {
	      console.error("發生錯誤：", error);
	    });
	
});