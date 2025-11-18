document.addEventListener("DOMContentLoaded", () => {
    // 🔹 User kiolvasása sessionStorage-ből
    let raw = sessionStorage.getItem("user") || sessionStorage.getItem("felhasznalo");
  
    // Ha nincs bejelentkezve → login.html (kivéve ha pont azon az oldalon vagyunk)
    if (!raw) {
      const page = location.pathname.split("/").pop();
      if (page !== "login.html") {
        window.location.href = "login.html";
      }
      return;
    }
  
    let user;
    try {
      user = JSON.parse(raw);
    } catch (e) {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("felhasznalo");
      window.location.href = "login.html";
      return;
    }
  
    // 🔹 Jogosultság ID és név kinyerése (többféle kulcsnév miatt)
    let roleId = null;
    let roleName = null;
  
    if (user.jog_id != null) {
      roleId = parseInt(user.jog_id, 10);
    } else if (user.JogosultsagID != null) {
      roleId = parseInt(user.JogosultsagID, 10);
    } else if (user["Jogosultság ID"] != null) {
      roleId = parseInt(user["Jogosultság ID"], 10);
    }
  
    if (user.jog_nev) {
      roleName = user.jog_nev;
    } else if (user.Jogosultság) {
      roleName = user.Jogosultság;
    }
  
    // 🔹 Kijelentkezés gomb
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("felhasznalo");
        window.location.href = "login.html";
      });
    }
  
    // 👉 Itt állítjuk be, melyik ID milyen szerep
    // (Ezt írtad korábban a selectben: 1=Fogyasztó, 2=Raktáros, 3=User, 4=Admin)
    const ROLE_FOGYASZTO = 1;
    const ROLE_RAKTAROS  = 2;
    const ROLE_USER      = 3;
    const ROLE_ADMIN     = 4;
  
    // Nem-dolgozói szerepek: Fogyasztó + User
    const NON_WORKER_ROLES = [ROLE_FOGYASZTO, ROLE_USER];
  
    // 🔹 Dolgozók menü elrejtése a nem-dolgozóknál
    const dolgozokDropdown = document.getElementById("dolgozokDropdown");
    if (dolgozokDropdown && NON_WORKER_ROLES.includes(roleId)) {
      dolgozokDropdown.style.display = "none";
    }
  
    // 🔹 Oldal neve (URL utolsó része)
    const page = location.pathname.split("/").pop();
  
    // 🔹 Dolgozói oldalak listája
    const workerPages = ["warehouse.html", "mechanic.html", "quote.html", "index.html"];
  
    // Ha a user NEM dolgozó (fogyasztó vagy sima user),
    // és dolgozói oldalra próbál menni → dobjuk vissza a főoldalra
    if (NON_WORKER_ROLES.includes(roleId) && workerPages.includes(page)) {
      window.location.href = "homepage.html";
      return;
    }
  
    // Ha akarod, finomhangolható:
    // pl. Raktáros ne lássa az Admin felületet:
    //
    // if (roleId === ROLE_RAKTAROS && page === "index.html") {
    //   window.location.href = "homepage.html";
    //   return;
    // }
  });
  