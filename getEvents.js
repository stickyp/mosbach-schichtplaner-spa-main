function fetchEvents() {
    const eventsContainer = document.getElementById("eventsContainer");
    const userId = document.getElementById("userId").value;

    // JWT-Token aus localStorage holen
    const token = localStorage.getItem("authToken");

    // Basis-URL für den Endpunkt
    let url = "https://deine-api-url.com/events";

    // Überprüfen, ob eine Benutzer-ID angegeben ist
    if (userId) {
        url += `?userId=${userId}`;
    }

    // Container leeren und Ladehinweis anzeigen
    eventsContainer.innerHTML = "<p>Lade Events...</p>";

    // Fetch-API-Request
    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data) && data.length > 0) {
            eventsContainer.innerHTML = ""; // Container leeren

            data.forEach(event => {
                const eventElement = document.createElement("div");
                eventElement.classList.add("event");

                eventElement.innerHTML = `
                    <h3>${event.title}</h3>
                    <p><strong>Start:</strong> ${new Date(event.startDateTime).toLocaleString()}</p>
                    <p><strong>Ende:</strong> ${new Date(event.endDateTime).toLocaleString()}</p>
                    <p><strong>Ort:</strong> ${event.location.address || event.location}</p>
                    <p><strong>Beschreibung:</strong> ${event.description}</p>
                    <p><strong>Zugewiesener Benutzer:</strong> ${event.assignedUser?.name || "N/A"}</p>
                `;

                eventsContainer.appendChild(eventElement);
            });
        } else {
            eventsContainer.innerHTML = "<p>Keine Events gefunden.</p>";
        }
    })
    .catch(error => {
        console.error("Fehler beim Abrufen der Events:", error);
        eventsContainer.innerHTML = "<p>Fehler beim Laden der Events. Bitte versuche es erneut.</p>";
    });
}

// Automatisches Laden aller Events beim Start
document.addEventListener("DOMContentLoaded", fetchEvents);
