document.getElementById("createUserForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("userRole"); // Admin oder User

        if (role !== 'admin') {
            document.querySelectorAll('.admin-only').forEach(element => {
                element.style.display = 'none';
            });
        }

    // Formulardaten erfassen
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const color = document.getElementById("color").value;

    // JSON-Objekt für die Anfrage erstellen
    const requestData = {
        "name": name,
        "password": password
    };

    // JWT-Token aus localStorage holen
    const token = localStorage.getItem("authToken");

    // Fetch-API-Request
    fetch("https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "User created successfully") {
            console.log("Benutzer erfolgreich erstellt:", data);
            alert(`Benutzer ${name} wurde erfolgreich erstellt. Benutzer-ID: ${data.userId}`);
        } else {
            console.error("Fehler beim Erstellen des Benutzers:", data);
            alert("Benutzer konnte nicht erstellt werden. Bitte überprüfe die Eingabedaten.");
        }
    })
    .catch(error => {
        console.error("Fehler bei der Benutzererstellung:", error);
        alert("Es gab ein Problem bei der Benutzererstellung. Bitte versuche es erneut.");
    });
});


localStorage.setItem("userColor", color);
