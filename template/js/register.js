// API endpoint
const API_URL = "http://localhost:8080/api/register";

// 啟用按鈕 
const submitBtn = document.getElementById("submitBtn");
submitBtn.disabled = false; // 先開啟測試用

// 註冊請求的 payload，對應後端的 RegistrationRequest
submitBtn.addEventListener("click", async () => {
const registrationData = {
  cName: document.getElementById("cname").value,
    taxId: document.getElementById("taxId").value,
    rName: document.getElementById("rname").value,
    rTel: document.getElementById("rtel").value,
    uAccount: document.getElementById("account").value,
    uEmail: document.getElementById("email").value,
    password: document.getElementById("password").value,
    role: "ADMIN" 
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(registrationData)
    });

    // 解析回應
    const result = await response.json();

    if (response.ok) {
      alert("註冊成功: " + result.message); // 註冊成功，請查收驗證信。
      console.log("✅ 註冊成功:", result);
    } else {
      alert("註冊失敗: " + result.message);
      console.error("❌ 註冊失敗:", result);
    }
  } catch (error) {
    console.error("🚨 呼叫 API 發生錯誤:", error);
  }
});


