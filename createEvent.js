document.addEventListener('DOMContentLoaded', function () {

const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole"); // Admin oder User

    if (role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(element => {
            element.style.display = 'none';
        });
    }

    // Eventlistener für das Formular zur Eventerstellung
    const createEventForm = document.getElementById("createEventForm");
    const urlParams = new URLSearchParams(window.location.search);
    const start = urlParams.get('start');
    const end = urlParams.get('end');

    if (start) {
        let startDate = new Date(start);
        startDate.setHours(2, 0, 0); // Standardzeit setzen
        document.getElementById('startDateTime').value = startDate.toISOString().slice(0, 16);
    }

    if (end) {
        let endDate = new Date(end);
        endDate.setHours(2, 0, 0); // Standardzeit setzen
        document.getElementById('endDateTime').value = endDate.toISOString().slice(0, 16);
    }

    if (createEventForm) {
        createEventForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const title = document.getElementById("title")?.value.trim();
            const startDateTime = document.getElementById("startDateTime")?.value;
            const endDateTime = document.getElementById("endDateTime")?.value;
            const assignedUserId = document.getElementById("assignedUserId")?.value.trim();
            const location = document.getElementById("location")?.value.trim();
            const description = document.getElementById("description")?.value.trim();

            if (!title || !startDateTime || !endDateTime || !assignedUserId || !location || !description) {
                showModal('Bitte füllen Sie alle Felder aus.');
                return;
            }

            const requestData = {
                "title": title,
                "startDateTime": new Date(startDateTime).toISOString(),
                "endDateTime": new Date(endDateTime).toISOString(),
                "assignedUserId": parseInt(assignedUserId),
                "location": location,
                "description": description
            };

            const token = localStorage.getItem("authToken");

            try {
                const response = await fetch("https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/events", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(requestData)
                });

                const data = await response.json();
                if (response.ok) {
                    showModal(`Event "${title}" wurde erfolgreich erstellt.\nMöchten Sie ein weiteres Event erstellen?`, true, function () {
                        createEventForm.reset();
                    }, function () {
                        window.location.href = "../homepage.html";
                    });
                } else {
                    showModal("Event konnte nicht erstellt werden.\nBitte überprüfe die Eingabedaten.");
                }
            } catch (error) {
                showModal("Es gab ein Problem bei der Eventerstellung.\nBitte versuche es erneut.");
            }
        });
    }

    // Initialisiere Google Maps und Geocoder
    let map;
    let marker;
    let autocomplete;

    function initMap() {
        const mapElement = document.getElementById("map");
        if (mapElement) {
            map = new google.maps.Map(mapElement, {
                center: { lat: 49.3520, lng: 9.1465}, // Standard: Berlin
                zoom: 10,
            });
            marker = new google.maps.Marker({
                map: map,
                position: { lat: 49.3520, lng: 9.1465}, // Standardposition
            });

            // Autocomplete für das Location-Feld aktivieren
            const locationInput = document.getElementById("location");
            autocomplete = new google.maps.places.Autocomplete(locationInput);
            autocomplete.bindTo('bounds', map);

            // Event für Änderungen im Autocomplete-Input
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (!place.geometry || !place.geometry.location) {
                    showModal("Die eingegebene Adresse konnte nicht gefunden werden. Bitte überprüfen Sie die Adresse.");
                    return;
                }

                // Karte und Marker auf den neuen Standort setzen
                map.setCenter(place.geometry.location);
                map.setZoom(15);
                marker.setPosition(place.geometry.location);
            });
        }
    }

    // Modal zur Fehlermeldung
    function showModal(message, hasOptions = false, onConfirm = null, onCancel = null) {
        const notificationMessage = document.getElementById('notificationMessage');
        notificationMessage.innerHTML = message.replace(/\n/g, '<br>');

        const confirmButton = document.getElementById('confirmButton');
        const modalFooter = document.querySelector('.modal-footer');

        if (hasOptions) {
            confirmButton.textContent = 'Weitere Event erfassen';
            confirmButton.onclick = () => {
                if (onConfirm) onConfirm();
                $('#notificationModal').modal('hide');
            };

            if (!document.getElementById('cancelButton')) {
                const cancelButton = document.createElement('button');
                cancelButton.type = 'button';
                cancelButton.className = 'btn btn-secondary';
                cancelButton.id = 'cancelButton';
                cancelButton.textContent = 'Zur Startseite';
                cancelButton.onclick = () => {
                    if (onCancel) onCancel();
                    $('#notificationModal').modal('hide');
                };
                modalFooter.appendChild(cancelButton);
            }
        } else {
            confirmButton.textContent = 'OK';
            confirmButton.onclick = () => {
                $('#notificationModal').modal('hide');
            };
        }

        $('#notificationModal').modal('show');
    }

    // Rufe die initMap Funktion auf, um die Karte zu initialisieren
    initMap();
});
