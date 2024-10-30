document.addEventListener('DOMContentLoaded', async function() {

const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole"); // Admin oder User

    if (role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(element => {
            element.style.display = 'none';
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    if (eventId) {
        try {
            // Eventdaten vom Backend abrufen
            const token = localStorage.getItem("authToken");
            const response = await fetch(`https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/events/${eventId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Fehler beim Laden des Events");
            }

            const eventData = await response.json();

            // Formularfelder mit Eventdaten füllen
            const startDateTime = new Date(eventData.startDateTime);
            const endDateTime = new Date(eventData.endDateTime);

            document.getElementById('title').value = eventData.title;
            document.getElementById('startDateTime').value = startDateTime.toISOString().slice(0, 16);
            document.getElementById('endDateTime').value = endDateTime.toISOString().slice(0, 16);
            document.getElementById('assignedUserId').value = eventData.assignedUserId;
            document.getElementById('location').value = eventData.location;
            document.getElementById('description').value = eventData.description;

        } catch (error) {
            console.error("Fehler beim Laden des Events:", error);
        }
    }

    document.getElementById("updateEventForm").addEventListener("submit", function(event) {
        event.preventDefault();

        // Formulardaten erfassen
        const title = document.getElementById("title").value;
        const startDateTime = document.getElementById("startDateTime").value;
        const endDateTime = document.getElementById("endDateTime").value;
        const assignedUserId = document.getElementById("assignedUserId").value;
        const location = document.getElementById("location").value;
        const description = document.getElementById("description").value;

        // JSON-Objekt für die Anfrage erstellen
        const requestData = {
            "title": title,
            "startDateTime": new Date(startDateTime).toISOString(),
            "endDateTime": new Date(endDateTime).toISOString(),
            "assignedUserId": parseInt(assignedUserId),
            "location": location,
            "description": description
        };

        // JWT-Token aus localStorage holen
        const token = localStorage.getItem("authToken");

        // Fetch-API-Request für das Event-Update
        fetch(`https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/events/${eventId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (response.ok) {
                return response.json().then(data => {
                    console.log("Event erfolgreich aktualisiert:", data);
                    alert(`Event "${title}" wurde erfolgreich aktualisiert.`);
                });
            } else {
                console.error("Fehler beim Aktualisieren des Events:", response);
                alert("Event konnte nicht aktualisiert werden. Bitte überprüfe die Eingabedaten.");
            }
        })
        .catch(error => {
            console.error("Fehler bei der Eventaktualisierung:", error);
            alert("Es gab ein Problem bei der Eventaktualisierung. Bitte versuche es erneut.");
        });
    });
});
