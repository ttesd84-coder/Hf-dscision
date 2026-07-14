/* =========================================================
   THPT Investment Pro
   Settings Engine v1.0
========================================================= */

function formatSettingsManWon(amount) {
    return `${Math.round(amount / 10000).toLocaleString("ko-KR")}만 원`;
}

const settingsElements = {
    userName:
        document.getElementById("user-name"),

    currentAsset:
        document.getElementById("current-asset"),

    goalAmount:
        document.getElementById("goal-amount"),

    monthsRemaining:
        document.getElementById("months-remaining"),

    cashAmount:
        document.getElementById("cash-amount"),

    previewStrategy:
        document.getElementById("preview-strategy"),

    previewMonthly:
        document.getElementById("preview-monthly"),

    previewCashRatio:
        document.getElementById("preview-cash-ratio"),

    saveButton:
        document.getElementById("save-settings"),

    resetButton:
        document.getElementById("reset-settings"),

    message:
        document.getElementById("settings-message")
};


function loadSettingsForm() {
    const data = window.THPT_DATA;

    settingsElements.userName.value =
        data.user.name;

    settingsElements.currentAsset.value =
        data.goal.currentAsset;

    settingsElements.goalAmount.value =
        data.goal.goalAmount;

    settingsElements.monthsRemaining.value =
        data.goal.monthsRemaining;

    settingsElements.cashAmount.value =
        data.assets.cash;

    updateSettingsPreview();
}


function getSettingsFormData() {
    return {
        userName:
            settingsElements.userName.value.trim(),

        currentAsset:
            Number(settingsElements.currentAsset.value),

        goalAmount:
            Number(settingsElements.goalAmount.value),

        monthsRemaining:
            Number(settingsElements.monthsRemaining.value),

        cash:
            Number(settingsElements.cashAmount.value)
    };
}


function updateSettingsPreview() {
    try {
        const formData =
            getSettingsFormData();

        const result =
            calculateGoalStrategy({
                currentAsset:
                    formData.currentAsset,

                goalAmount:
                    formData.goalAmount,

                monthsRemaining:
                    formData.monthsRemaining
            });

        settingsElements.previewStrategy.textContent =
            result.strategyType;

        settingsElements.previewMonthly.textContent =
            formatSettingsManWon(
                result.monthlyRequiredProfit
            );

        settingsElements.previewCashRatio.textContent =
            `${result.recommendedCashRatio}%`;

        settingsElements.message.textContent = "";

    } catch (error) {
        settingsElements.message.textContent =
            "입력값을 확인하세요.";
    }
}


function saveSettings() {
    try {
        const formData =
            getSettingsFormData();

        calculateGoalStrategy({
            currentAsset:
                formData.currentAsset,

            goalAmount:
                formData.goalAmount,

            monthsRemaining:
                formData.monthsRemaining
        });

        window.THPT_DATA.user.name =
            formData.userName || "사용자";

        window.THPT_DATA.goal.currentAsset =
            formData.currentAsset;

        window.THPT_DATA.goal.goalAmount =
            formData.goalAmount;

        window.THPT_DATA.goal.monthsRemaining =
            formData.monthsRemaining;

        window.THPT_DATA.assets.cash =
            formData.cash;

        const saved =
            window.saveThptData();

        if (!saved) {
            throw new Error(
                "저장에 실패했습니다."
            );
        }

        settingsElements.message.textContent =
            "저장되었습니다.";

        setTimeout(() => {
            location.href = "./index.html";
        }, 700);

    } catch (error) {
        settingsElements.message.textContent =
            error.message;
    }
}


[
    settingsElements.currentAsset,
    settingsElements.goalAmount,
    settingsElements.monthsRemaining,
    settingsElements.cashAmount
].forEach((element) => {
    element.addEventListener(
        "input",
        updateSettingsPreview
    );
});


settingsElements.saveButton.addEventListener(
    "click",
    saveSettings
);


settingsElements.resetButton.addEventListener(
    "click",
    () => {
        const confirmed =
            confirm(
                "모든 데이터를 기본값으로 초기화할까요?"
            );

        if (confirmed) {
            window.resetThptData();
        }
    }
);


document.addEventListener(
    "DOMContentLoaded",
    loadSettingsForm
);