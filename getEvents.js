document.addEventListener('DOMContentLoaded', async function() {
    try {
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("userRole"); // Admin oder User

        if (role !== 'admin') {
            document.querySelectorAll('.admin-only').forEach(element => {
                element.style.display = 'none';
            });
        }

        await fetchEvents();
        initMap(); // Initialisiere die Karte

        // Testfunktion aufrufen, um das Modal mit Dummy-Daten zu öffnen
        testOpenEventModal();
    } catch (error) {
        console.error("Fehler beim Laden der Seite:", error);
        alert("Ein Fehler ist aufgetreten.");
    }
});

// Funktion zum Abrufen und Anzeigen von Events in der Tabelle
async function fetchEvents() {
    const eventsTableBody = document.getElementById("eventsTableBody");

    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/events", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Fehler beim Abrufen der Events.");
        }

        const events = await response.json();
        eventsTableBody.innerHTML = ""; // Leere Tabelle

        events.forEach(event => {
            const row = document.createElement("tr");

            // Event-ID
            const idCell = document.createElement("td");
            idCell.textContent = event.id;
            row.appendChild(idCell);

            // Titel
            const titleCell = document.createElement("td");
            titleCell.textContent = event.title;
            row.appendChild(titleCell);

            // Startdatum
            const startCell = document.createElement("td");
            startCell.textContent = new Date(event.startDateTime).toLocaleString();
            row.appendChild(startCell);

            // Enddatum
            const endCell = document.createElement("td");
            endCell.textContent = new Date(event.endDateTime).toLocaleString();
            row.appendChild(endCell);

            // Verantwortlicher Nutzer
            const userCell = document.createElement("td");
            userCell.textContent = event.assignedUser?.name || "N/A";
            row.appendChild(userCell);

            // Ort
            const locationCell = document.createElement("td");
            locationCell.textContent = event.location?.address || event.location || "Nicht festgelegt";
            row.appendChild(locationCell);

            // Beschreibung
            const descriptionCell = document.createElement("td");
            descriptionCell.textContent = event.description || "Keine Beschreibung verfügbar";
            row.appendChild(descriptionCell);

            // Klick-Event hinzufügen, um das Modal anzuzeigen
            row.addEventListener("click", () => openEventModal(event));

            eventsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Fehler beim Laden der Events:", error);
        alert("Fehler beim Laden der Events. Bitte versuchen Sie es später erneut.");
    }
}

let map;
let marker;
let geocoder;

function initMap() {
    // Initialisiere Geocoder, um Adressen in Koordinaten umzuwandeln
    geocoder = new google.maps.Geocoder();
}

function openEventModal(event) {
    document.getElementById("modal-event-title").textContent = event.title;
    document.getElementById("modal-event-start").textContent = new Date(event.startDateTime).toLocaleString();
    document.getElementById("modal-event-end").textContent = new Date(event.endDateTime).toLocaleString();
    document.getElementById("modal-event-user").textContent = event.assignedUser?.name || "N/A";
    document.getElementById("modal-event-location").textContent = event.location || "Nicht festgelegt";
    document.getElementById("modal-event-description").textContent = event.description || "Keine Beschreibung verfügbar";

    // Zeige das Modal an, falls jQuery verfügbar ist
    if (window.jQuery) {
        $('#eventModal').modal('show');
    } else {
        console.warn("jQuery ist nicht geladen. Das Modal kann nicht angezeigt werden.");
    }

    // Initialisiere die Karte, wenn sie noch nicht erstellt wurde
    if (!map) {
        map = new google.maps.Map(document.getElementById("modal-map"), {
            zoom: 15,
            center: { lat: 49.3520, lng: 9.1465 } // Standard: Mosbach
        });
        marker = new google.maps.Marker({
            map: map
        });
    }

    // Adresse in Koordinaten umwandeln und auf der Karte anzeigen
    if (event.location && geocoder) {
        geocoder.geocode({ address: event.location }, function(results, status) {
            if (status === "OK") {
                map.setCenter(results[0].geometry.location);
                marker.setPosition(results[0].geometry.location);
            } else {
                console.error("Geocoding war nicht erfolgreich: " + status);
            }
        });
    }
}

/* Testfunktion zum Öffnen des Modals mit Dummy-Daten
function testOpenEventModal() {
    const dummyEvent = {
        id: 1,
        title: "Test Event",
        startDateTime: "2024-10-29T10:00:00",
        endDateTime: "2024-10-29T12:00:00",
        assignedUser: { name: "Max Mustermann" },
        location: "Neckarbischofsheim",
        description: "Dies ist eine Testbeschreibung für das Event."
    };
    openEventModal(dummyEvent); // Öffne das Modal mit den Dummy-Daten
    */
//}
