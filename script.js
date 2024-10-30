// Kombinierter DOMContentLoaded Event für Authentifizierung und Kalenderinitialisierung
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem("authToken");

     /*Wenn kein Token vorhanden ist, zur Login-Seite umleiten
    if (!token) {
        window.location.href = "subpages/login.html";
        return;
    } */

    const role = localStorage.getItem("userRole"); // Admin oder User

    if (role !== 'admin') {
        // Menüeinträge für Nicht-Admins ausblenden
        
        document.querySelectorAll('.admin-only').forEach(element => {
            element.style.display = 'none';
        });
    }
    async function fetchAbsences() {
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('userRole');
    
        let url = 'https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/absences';
    
        // Für normale Benutzer nur eigene Abwesenheiten laden
        if (role !== 'admin') {
            url += `?userId=${userId}`;
        }
    
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const data = await response.json();

            // Zeige die Abwesenheiten auf der Seite an...
        } catch (error) {
            console.error('Fehler beim Laden der Abwesenheiten:', error);
        }
    }
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            editable: true,
            selectable: true,
            events: fetchEvents,
            select: function(info) {
                // Weiterleitung zur Seite zur Eventerstellung mit den ausgewählten Daten als Parameter
                const start = encodeURIComponent(info.startStr);
                const end = encodeURIComponent(info.endStr);
                window.location.href = `subpages/createEventForm.html?start=${start}&end=${end}`;
            },
            eventClick: function(info) {
                // Event-Details im Modal anzeigen
                showModalEventDetails(info.event);
            }
        });
        calendar.render();
    }
    const userColor = localStorage.getItem("userColor");

const calendar = new FullCalendar.Calendar(calendarEl, {
    events: function(fetchInfo, successCallback, failureCallback) {
        // Lade die Events, z.B. vom Backend
        fetch('...').then(response => response.json()).then(data => {
            const events = data.map(event => ({
                id: event.id,
                title: event.title,
                start: event.startDateTime,
                end: event.endDateTime,
                backgroundColor: userColor, // Verwende die gespeicherte Farbe
                borderColor: userColor // Verwende die gespeicherte Farbe
            }));
            successCallback(events);
        }).catch(error => {
            console.error('Fehler beim Laden der Events:', error);
            failureCallback(error);
        });
    }
});

    // Google Maps initialisieren
    initMap();
    // Wetterdaten abrufen und anzeigen
    fetchWeatherData();
});
 // Funktion zum Abrufen von Wetterdaten vom Backend
 async function fetchWeatherData() {
    try {
        const response = await fetch("https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/weather?date=" + new Date().toISOString().split('T')[0]);
        if (!response.ok) {
            throw new Error("Fehler beim Abrufen der Wetterdaten");
        }
        const weatherData = await response.json();
        document.getElementById("weather-date").textContent = weatherData.date;
        document.getElementById("weather-temp-min").textContent = weatherData.temperatureMin;
        document.getElementById("weather-temp-max").textContent = weatherData.temperatureMax;
        document.getElementById("weather-precipitation").textContent = weatherData.precipitation;
        document.getElementById("weather-wind-speed").textContent = weatherData.windSpeed;
    } catch (error) {
        console.error("Fehler beim Abrufen der Wetterdaten:", error);
    }
}
// Funktion zum Abrufen von Events vom Backend
async function fetchEvents(fetchInfo, successCallback, failureCallback) {
    try {
        const events = [
            {
                id: '1',
                title: 'Beispiel-Event 1',
                start: '2024-10-29T10:00:00',
                end: '2024-10-29T12:00:00',
                location: 'Brandenburger Tor, Berlin'
            },
            {
                id: '2',
                title: 'Beispiel-Event 2',
                start: '2024-10-30T14:00:00',
                end: '2024-10-30T16:00:00',
                location: 'Alexanderplatz, Berlin'
            }
        ];
        successCallback(events);
    } catch (error) {
        console.error("Fehler beim Laden der Events:", error);
        failureCallback(error);
        alert("Fehler beim Laden der Events. Bitte versuchen Sie es später erneut.");
    }
}


// Funktion zum Hinzufügen eines neuen Events im Backend
async function addEvent(event) {
    const token = localStorage.getItem("authToken");
    try {
        const response = await fetch("https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/events", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        });
        if (!response.ok) {
            throw new Error("Fehler beim Hinzufügen des Events");
        }
        alert("Event erfolgreich hinzugefügt!");
    } catch (error) {
        console.error("Fehler:", error);
        alert("Fehler beim Hinzufügen des Events. Bitte versuchen Sie es später erneut.");
    }
}

// Initialisiere Google Maps und Geocoder
let map;
let modalMap;
let geocoder;

function initMap() {
    const mapElement = document.getElementById("map");
    if (mapElement) {
        map = new google.maps.Map(mapElement, {
            center: { lat: 52.5200, lng: 13.4050 }, // Standard: Berlin
            zoom: 10,
        });
        geocoder = new google.maps.Geocoder();
    }

    // Initialisierung der Karte für das Modal
    const modalMapElement = document.getElementById("modal-map");
    if (modalMapElement) {
        modalMap = new google.maps.Map(modalMapElement, {
            center: { lat: 52.5200, lng: 13.4050 }, // Standard: Berlin
            zoom: 10,
        });
    }
}

// Funktion zur Geokodierung (Adresse in Koordinaten umwandeln) für das Modal
function geocodeAddressForModal(address) {
    if (geocoder) {
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === "OK") {
                modalMap.setCenter(results[0].geometry.location);
                new google.maps.Marker({
                    map: modalMap,
                    position: results[0].geometry.location,
                });
                google.maps.event.trigger(modalMap, 'resize'); // Karte im Modal aktualisieren
            } else {
                console.error("Geokodierungsfehler: " + status);
            }
        });
    }
}

// Funktion zur Anzeige der Event-Details im Modal und Aktualisierung der Karte
function showModalEventDetails(event) {
    document.getElementById("modal-event-title").textContent = event.title;
    document.getElementById("modal-event-description").textContent = event.extendedProps.description || "Keine Beschreibung verfügbar";
    document.getElementById("modal-event-location").textContent = event.extendedProps.location;

    $('#eventModal').modal('show'); // Bootstrap's jQuery-Modal-Funktion

    // Update die Karte im Modal
    geocodeAddressForModal(event.extendedProps.location);
}
