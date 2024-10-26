document.getElementById("updateUserForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Formulardaten erfassen
    const userId = document.getElementById("userId").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    // JSON-Objekt für die Anfrage erstellen
    const requestData = {
        "name": name,
        "password": password
    };

    // JWT-Token aus localStorage holen
    const token = localStorage.getItem("authToken");

    // Fetch-API-Request
    fetch(`https://deine-api-url.com/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "User updated successfully") {
            console.log("Benutzer erfolgreich aktualisiert:", data);
            alert(`Benutzer ${name} wurde erfolgreich aktualisiert.`);
        } else {
            console.error("Fehler bei der Aktualisierung des Benutzers:", data);
            alert("Benutzer konnte nicht aktualisiert werden. Bitte überprüfe die Eingabedaten.");
        }
    })
    .catch(error => {
        console.error("Fehler bei der Benutzeraktualisierung:", error);
        alert("Es gab ein Problem bei der Benutzeraktualisierung. Bitte versuche es erneut.");
    });
});
