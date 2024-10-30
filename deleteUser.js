document.getElementById("deleteUserForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("userRole"); // Admin oder User

        if (role !== 'admin') {
            document.querySelectorAll('.admin-only').forEach(element => {
                element.style.display = 'none';
            });
        }

    //Benutzer-ID erfassen
    const userId = document.getElementById("userId").value;

    // JWT-Token aus localStorage holen
    const token = localStorage.getItem("authToken");

    // Sicherheitsabfrage
    if (confirm(`Bist du sicher, dass du den Benutzer mit der ID ${userId} löschen möchtest?`)) {
        // Fetch-API-Request
        fetch(`https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "User deleted successfully") {
                console.log("Benutzer erfolgreich gelöscht:", data);
                alert(`Benutzer mit der ID ${userId} wurde erfolgreich gelöscht.`);
            } else {
                console.error("Fehler beim Löschen des Benutzers:", data);
                alert("Benutzer konnte nicht gelöscht werden. Bitte überprüfe die Eingabedaten.");
            }
        })
        .catch(error => {
            console.error("Fehler beim Löschen des Benutzers:", error);
            alert("Es gab ein Problem beim Löschen des Benutzers. Bitte versuche es erneut.");
        });
    }
});
