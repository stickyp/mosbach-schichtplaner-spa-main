document.getElementById("updateEventForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Formulardaten erfassen
    const eventId = document.getElementById("eventId").value;
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

    // Fetch-API-Request
    fetch(`https://deine-api-url.com/events/${eventId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Event updated successfully") {
            console.log("Event erfolgreich aktualisiert:", data);
            alert(`Event "${title}" wurde erfolgreich aktualisiert.`);
        } else {
            console.error("Fehler beim Aktualisieren des Events:", data);
            alert("Event konnte nicht aktualisiert werden. Bitte überprüfe die Eingabedaten.");
        }
    })
    .catch(error => {
        console.error("Fehler bei der Eventaktualisierung:", error);
        alert("Es gab ein Problem bei der Eventaktualisierung. Bitte versuche es erneut.");
    });
});
