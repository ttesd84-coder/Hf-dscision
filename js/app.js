/* ==========================================================
   THPT Investment Pro
   Sprint 1 · Day 2 · Mission 5
   Bottom Navigation
========================================================== */

const bottomNav = document.getElementById("bottom-nav");

const screens = [
    {
        id: "home",
        icon: "⌂",
        label: "홈"
    },
    {
        id: "portfolio",
        icon: "▣",
        label: "자산"
    },
    {
        id: "report",
        icon: "☷",
        label: "리포트"
    },
    {
        id: "score",
        icon: "◉",
        label: "점수"
    },
    {
        id: "chat",
        icon: "●",
        label: "THPT"
    }
];


/* ==========================================================
   Navigation HTML
========================================================== */

bottomNav.innerHTML = screens
    .map((screen, index) => {
        return `
            <button
                type="button"
                class="nav-button ${index === 0 ? "active" : ""}"
                data-target="${screen.id}"
                aria-label="${screen.label}"
            >
                <span class="nav-icon">
                    ${screen.icon}
                </span>

                <span class="nav-label">
                    ${screen.label}
                </span>
            </button>
        `;
    })
    .join("");


/* ==========================================================
   Temporary Screen Contents
========================================================== */

const temporaryScreens = {
    portfolio: {
        title: "자산",
        description: "보유 종목과 추천 종목 화면을 준비하고 있습니다."
    },

    report: {
        title: "Daily Report",
        description: "오늘의 투자 정보를 한 줄씩 요약해서 보여줄 예정입니다."
    },

    score: {
        title: "Market Score",
        description: "시장점수와 점수 산정 근거를 보여줄 예정입니다."
    },

    chat: {
        title: "THPT 상담",
        description: "THPT 투자 비서와 대화하는 화면을 준비하고 있습니다."
    }
};


Object.entries(temporaryScreens).forEach(([screenId, information]) => {
    const section = document.getElementById(screenId);

    if (!section || section.innerHTML.trim() !== "") {
        return;
    }

    section.innerHTML = `
        <div class="card">
            <p class="subtitle">
                THPT Investment Pro
            </p>

            <h2>
                ${information.title}
            </h2>

            <p class="subtitle">
                ${information.description}
            </p>
        </div>
    `;
});


/* ==========================================================
   Screen Switching
========================================================== */

function showScreen(targetId) {
    screens.forEach((screen) => {
        const section = document.getElementById(screen.id);
        const button = bottomNav.querySelector(
            `[data-target="${screen.id}"]`
        );

        const isActive = screen.id === targetId;

        if (section) {
            section.style.display = isActive
                ? screen.id === "home"
                    ? "flex"
                    : "block"
                : "none";
        }

        if (button) {
            button.classList.toggle("active", isActive);

            button.style.color = isActive
                ? "var(--purple)"
                : "var(--gray)";

            button.style.background = isActive
                ? "var(--purple-soft)"
                : "transparent";
        }
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ==========================================================
   Navigation Events
========================================================== */

bottomNav.addEventListener("click", (event) => {
    const selectedButton = event.target.closest(".nav-button");

    if (!selectedButton) {
        return;
    }

    const targetId = selectedButton.dataset.target;

    showScreen(targetId);
});


/* ==========================================================
   Initial Screen
========================================================== */

showScreen("home");