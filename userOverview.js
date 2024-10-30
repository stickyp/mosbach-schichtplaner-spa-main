// JavaScript für das Laden der Benutzerinformationen und Einfügen in die Tabelle

document.addEventListener('DOMContentLoaded', async function() {
const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole"); // Admin oder User

    if (role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(element => {
            element.style.display = 'none';
        });
    }

    try {
        // Abrufen des Authentifizierungstokens aus dem localStorage
        // const token = localStorage.getItem("authToken");
        // if (!token) {
        //     // Wenn kein Token vorhanden ist, zur Login-Seite umleiten
        //     window.location.href = "login.html";
        //     return;
        // }

        // Abrufen der Benutzerinformationen vom Backend
        const response = await fetch("https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/users", {
            method: "GET",
            headers: {
                // "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Fehler beim Abrufen der Benutzerinformationen.");
        }

        const users = await response.json();
        const userTableBody = document.getElementById("userTableBody");

        // Einfügen der Benutzerinformationen in die Tabelle
        users.forEach(user => {
            const row = document.createElement("tr");

            // Benutzer-ID
            const idCell = document.createElement("td");
            idCell.textContent = user.id;
            row.appendChild(idCell);

            // Benutzername
            const nameCell = document.createElement("td");
            nameCell.textContent = user.name;
            row.appendChild(nameCell);

            // Farbe des Benutzers
            const colorCell = document.createElement("td");
            colorCell.textContent = user.color || "Nicht festgelegt";
            colorCell.style.backgroundColor = user.color || "#ffffff";
            row.appendChild(colorCell);

            userTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Fehler beim Laden der Benutzerübersicht:", error);
        alert("Fehler beim Laden der Benutzerübersicht. Bitte versuchen Sie es später erneut.");
    }
});
