document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Formulardaten erfassen
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    // JSON-Objekt für die Anfrage erstellen
    const requestData = {
        "name": name,
        "password": password
    };

    // Fetch-API-Request
    fetch("https://deine-api-url.com/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            console.log("Token erhalten:", data.token);
            console.log("Benutzerinformationen:", data.user);

            // Token speichern, z.B. in localStorage
            localStorage.setItem("authToken", data.token);
            alert(`Willkommen, ${data.user.name}! Du bist jetzt eingeloggt.`);
        } else {
            console.error("Login fehlgeschlagen:", data);
            alert("Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.");
        }
    })
    .catch(error => {
        console.error("Fehler beim Login:", error);
        alert("Es gab ein Problem beim Login. Bitte versuche es erneut.");
    });
});
