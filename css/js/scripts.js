document.addEventListener("DOMContentLoaded", () => {
    // === Язык ===
    const currentLanguage = localStorage.getItem("language") || "en";
    const changeLanguage = (lang) => {
        localStorage.setItem("language", lang);
        document.querySelectorAll("[data-en], [data-ru]").forEach((el) => {
            el.textContent = el.dataset[lang];
        });
    };
    changeLanguage(currentLanguage);

    document.querySelectorAll(".language-switch").forEach((btn) => {
        btn.addEventListener("click", () => {
            const lang = btn.getAttribute("data-lang");
            changeLanguage(lang);
        });
    });

    // === Тема ===
    const applyTheme = (theme) => {
        document.body.className = theme;
        localStorage.setItem("theme", theme);

        // Обновление текста кнопки темы
        const themeSwitcher = document.querySelector(".theme-switcher");
        if (themeSwitcher) {
            themeSwitcher.textContent =
                theme === "dark-theme"
                    ? "Switch to Light Theme"
                    : "Switch to Dark Theme";
        }
    };

    const savedTheme = localStorage.getItem("theme") || "light-theme";
    applyTheme(savedTheme);

    const themeSwitcher = document.querySelector(".theme-switcher");
    if (themeSwitcher) {
        themeSwitcher.addEventListener("click", () => {
            const newTheme = savedTheme === "dark-theme" ? "light-theme" : "dark-theme";
            applyTheme(newTheme);
        });
    }

    // === Имя пользователя ===
    const playerNameInput = document.getElementById("player-name");
    const saveNameButton = document.getElementById("save-name");
    const savedName = localStorage.getItem("playerName") || "User";

    if (playerNameInput) playerNameInput.value = savedName;

    if (saveNameButton) {
        saveNameButton.addEventListener("click", () => {
            const newName = playerNameInput.value.trim();
            if (newName) {
                localStorage.setItem("playerName", newName);
                alert("Name updated!");
                location.reload();
            }
        });
    }

    // === Меню с тремя точками ===
    const menuToggle = document.querySelector(".menu-toggle");
    const menuDropdown = document.querySelector(".menu-dropdown");

    if (menuToggle && menuDropdown) {
        menuToggle.addEventListener("click", () => {
            menuDropdown.classList.toggle("active");
        });
    }
});




