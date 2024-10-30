// JavaScript für das Abrufen und Anzeigen von Abwesenheiten aus dem Backend

document.addEventListener('DOMContentLoaded', async function () {

    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole"); // Admin oder User

        if (role !== 'admin') {
            document.querySelectorAll('.admin-only').forEach(element => {
            element.style.display = 'none';
                });
    }

    const absencesTableBody = document.getElementById('absenceTableBody');

    try {
        const response = await fetch('https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/absences', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Abwesenheiten.');
        }

        const absences = await response.json();

        absences.forEach(absence => {
            const row = document.createElement('tr');

            // ID Spalte
            const idCell = document.createElement('td');
            idCell.textContent = absence.id;
            row.appendChild(idCell);

            // Startdatum Spalte
            const startDateCell = document.createElement('td');
            startDateCell.textContent = new Date(absence.startDateTime).toLocaleString();
            row.appendChild(startDateCell);

            // Enddatum Spalte
            const endDateCell = document.createElement('td');
            endDateCell.textContent = new Date(absence.endDateTime).toLocaleString();
            row.appendChild(endDateCell);

            // Grund Spalte
            const reasonCell = document.createElement('td');
            reasonCell.textContent = absence.reason;
            row.appendChild(reasonCell);

            absencesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Fehler beim Laden der Abwesenheitsübersicht:', error);
        alert('Fehler beim Laden der Abwesenheitsübersicht. Bitte versuchen Sie es später erneut.');
    }
});
