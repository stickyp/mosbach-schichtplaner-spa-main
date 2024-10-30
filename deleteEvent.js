document.getElementById("deleteEventForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("userRole"); // Admin oder User

        if (role !== 'admin') {
            document.querySelectorAll('.admin-only').forEach(element => {
                element.style.display = 'none';
            });
        }

    // Event-ID erfassen
    const eventId = document.getElementById("eventId").value;

    // JWT-Token aus localStorage holen
    const token = localStorage.getItem("authToken");

    // Sicherheitsabfrage
    if (confirm(`Bist du sicher, dass du das Event mit der ID ${eventId} löschen möchtest?`)) {
        // Fetch-API-Request
        fetch(`https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api//events/${eventId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Event deleted successfully") {
                console.log("Event erfolgreich gelöscht:", data);
                alert(`Event mit der ID ${eventId} wurde erfolgreich gelöscht.`);
            } else {
                console.error("Fehler beim Löschen des Events:", data);
                alert("Event konnte nicht gelöscht werden. Bitte überprüfe die Eingabedaten.");
            }
        })
        .catch(error => {
            console.error("Fehler beim Löschen des Events:", error);
            alert("Es gab ein Problem beim Löschen des Events. Bitte versuche es erneut.");
        });
    }
});
