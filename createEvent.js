document.getElementById("createEventForm").addEventListener("submit", function(event) {
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

    // Fetch-API-Request
    fetch("https://deine-api-url.com/events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Event created successfully") {
            console.log("Event erfolgreich erstellt:", data);
            alert(`Event "${title}" wurde erfolgreich erstellt. Event-ID: ${data.eventId}`);
        } else {
            console.error("Fehler beim Erstellen des Events:", data);
            alert("Event konnte nicht erstellt werden. Bitte überprüfe die Eingabedaten.");
        }
    })
    .catch(error => {
        console.error("Fehler bei der Eventerstellung:", error);
        alert("Es gab ein Problem bei der Eventerstellung. Bitte versuche es erneut.");
    });
});
