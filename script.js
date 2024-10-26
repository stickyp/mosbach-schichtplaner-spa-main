document.addEventListener('DOMContentLoaded', function() {
    // Initialisiere FullCalendar nur, wenn der Kalender existiert
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: fetchEvents
        });
        calendar.render();
    }
});

// Funktion zum Abrufen von Events, wiederverwendbar für verschiedene Seiten
function fetchEvents(fetchInfo, successCallback, failureCallback) {
    const token = localStorage.getItem("authToken");
    fetch("https://deine-api-url.com/events", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const events = data.map(event => ({
            id: event.id,
            title: event.title,
            start: event.startDateTime,
            end: event.endDateTime
        }));
        successCallback(events);
    })
    .catch(error => {
        console.error("Fehler beim Laden der Events:", error);
        failureCallback(error);
    });
}

let map;
let geocoder;

function initMap() {
    // Initialisiere die Karte mit einem Standardort
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 52.5200, lng: 13.4050 }, // Standard: Berlin
        zoom: 10,
    });

    geocoder = new google.maps.Geocoder();

    // Event Location abrufen und Karte aktualisieren
    const locationElement = document.getElementById("event-location");
    const locationAddress = locationElement.textContent || locationElement.innerText;
    
    if (locationAddress) {
        geocodeAddress(locationAddress);
    }
}

// Funktion zur Geokodierung (Adresse in Koordinaten umwandeln)
function geocodeAddress(address) {
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
            map.setCenter(results[0].geometry.location);
            new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
            });
        } else {
            console.error("Geokodierungsfehler: " + status);
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    let calendarEl = document.getElementById('calendar');
    
    // FullCalendar-Initialisierung
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: [
            // Beispiel-Events (mit Ort)
            { title: 'Team Meeting', start: '2024-10-15', location: '123 Main St' },
            { title: 'Project Kickoff', start: '2024-10-20', location: '456 Elm St' }
        ],
        eventClick: function(info) {
            // Eventdetails und Karten-Container anzeigen
            showEventDetails(info.event.extendedProps.location);
        }
    });

    calendar.render();
});

// Funktion zum Anzeigen der Eventdetails
function showEventDetails(location) {
    // Event-Details-Container sichtbar machen
    const eventDetails = document.getElementById('eventDetails');
    eventDetails.style.display = 'block';

    // Location-Text aktualisieren
    document.getElementById('event-location').textContent = location;

    // Karte aktualisieren
    geocodeAddress(location);
}