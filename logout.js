// Logout-Funktion zum Entfernen des Authentifizierungstokens und Weiterleitung zur Login-Seite

document.getElementById("logoutButton").addEventListener("click", function(event) {
    event.preventDefault();
    
    // Entferne das Token aus dem localStorage
    localStorage.removeItem("authToken");
    
    // Weiterleitung zur Login-Seite
    window.location.href = "login.html";
});
