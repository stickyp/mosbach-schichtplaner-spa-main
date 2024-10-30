// JavaScript für das Löschen einer Abwesenheit

document.addEventListener('DOMContentLoaded', function () {
const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole"); // Admin oder User

    if (role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(element => {
            element.style.display = 'none';
        });
    }

    const deleteAbsenceForm = document.getElementById('deleteAbsenceForm');

    deleteAbsenceForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Verhindert das Standard-Submit-Verhalten

        // Eingaben abrufen
        const absenceId = document.getElementById('absenceId').value;

        // Validierung
        if (!absenceId) {
            alert('Bitte geben Sie eine Abwesenheits-ID ein.');
            return;
        }

        if (!confirm('Möchten Sie diese Abwesenheit wirklich löschen?')) {
            return;
        }

        // Abwesenheit löschen
        try {
            const response = await fetch(`https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/absences/${absenceId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Fehler beim Löschen der Abwesenheit.');
            }

            alert('Abwesenheit erfolgreich gelöscht.');
            window.location.href = 'absenceDashboard.html'; // Weiterleitung zur Abwesenheitsübersicht
        } catch (error) {
            console.error('Fehler:', error);
            alert('Fehler beim Löschen der Abwesenheit. Bitte versuchen Sie es später erneut.');
        }
    });
});
