document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole"); // Admin oder User

    if (role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(element => {
            element.style.display = 'none';
        });
    }

    const absenceForm = document.getElementById('createAbsenceForm');

    absenceForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Verhindert das Standard-Submit-Verhalten

        // Eingaben abrufen
        const startDateTime = document.getElementById('absenceStart').value;
        const endDateTime = document.getElementById('absenceEnd').value;
        const reason = document.getElementById('reason').value;

        // Validierung
        if (!startDateTime || !endDateTime || !reason) {
            showModal('Bitte füllen Sie alle Felder aus.');
            return;
        }

        // Abwesenheit erstellen
        const absenceData = {
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            reason: reason,
        };

        try {
            // Sende die Abwesenheit an das Backend
            const response = await fetch('https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/absences', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(absenceData)
            });

            if (!response.ok) {
                throw new Error('Fehler beim Hinzufügen der Abwesenheit.');
            }

            // Erfolgreiche Abwesenheitserstellung
            showModal('Abwesenheit erfolgreich hinzugefügt. Möchten Sie eine weitere Abwesenheit erfassen?', true, function () {
                absenceForm.reset(); // Benutzer möchte eine weitere Abwesenheit erfassen - Formular zurücksetzen
            }, function () {
                window.location.href = '../homepage.html'; // Benutzer möchte zur Startseite gehen
            });

        } catch (error) {
            console.error('Fehler:', error);
            showModal('Fehler beim Hinzufügen der Abwesenheit. Bitte versuchen Sie es später erneut.');
        }
    });

    // Funktion zum Anzeigen des Modals
    function showModal(message, hasOptions = false, onConfirm = null, onCancel = null) {
        const notificationMessage = document.getElementById('notificationMessage');
        const confirmButton = document.getElementById('confirmButton');
        const modalFooter = document.querySelector('.modal-footer');

        notificationMessage.textContent = message;

        // Entferne ggf. vorhandene Cancel-Buttons, um Duplikate zu vermeiden
        const cancelButtons = modalFooter.querySelectorAll('.btn-secondary');
        cancelButtons.forEach(button => button.remove());

        if (hasOptions) {
            confirmButton.textContent = 'Weitere Abwesenheit erfassen';
            confirmButton.onclick = () => {
                if (onConfirm) onConfirm();
                $('#notificationModal').modal('hide');
            };

            const cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.className = 'btn btn-secondary';
            cancelButton.textContent = 'Zur Startseite';
            cancelButton.onclick = () => {
                if (onCancel) onCancel();
                $('#notificationModal').modal('hide');
            };
            modalFooter.appendChild(cancelButton);
        } else {
            confirmButton.textContent = 'OK';
            confirmButton.onclick = () => {
                $('#notificationModal').modal('hide');
            };
        }

        $('#notificationModal').modal('show');
    }
});
