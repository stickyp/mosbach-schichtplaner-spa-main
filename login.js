document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();


    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://SchichtplanerBackend-delightful-hartebeest-ka.apps.01.cf.eu01.stackit.cloud/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("authToken", data.token); // Speichere das Token im localStorage

            let userRole = data.user.role;

            // Fester Admin Benutzer
            if (name === "TestAdmin" && password === "TestAdmin") {
                userRole = "admin";
            }

            localStorage.setItem("userRole", userRole); // Speichere die Benutzerrolle im localStorage

            window.location.href = "homepage.html"; // Nach erfolgreichem Login zum Kalender weiterleiten
        } else {
            document.getElementById("loginError").style.display = "block";
        }
    } catch (error) {
        console.error("Fehler beim Login:", error);
        document.getElementById("loginError").style.display = "block";
    }
});
