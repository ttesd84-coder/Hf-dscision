/* =========================================================
   THPT Investment Pro
   Rule Engine v0.1
========================================================= */


/* =========================================================
   1. 공통 유틸리티
========================================================= */

function formatWon(amount) {
    return `${Math.round(amount).toLocaleString("ko-KR")}원`;
}

function formatManWon(amount) {
    return `${Math.round(amount / 10000).toLocaleString("ko-KR")}만 원`;
}

function clamp(value, minimum, maximum) {
    return Math.min(
        Math.max(value, minimum),
        maximum
    );
}


/* =========================================================
   2. 목표 기반 전략 계산
========================================================= */

function calculateGoalStrategy({
    currentAsset,
    goalAmount,
    monthsRemaining
}) {
    if (
        !Number.isFinite(currentAsset) ||
        !Number.isFinite(goalAmount) ||
        !Number.isFinite(monthsRemaining)
    ) {
        throw new Error(
            "목표 전략 입력값은 모두 숫자여야 합니다."
        );
    }

    if (
        currentAsset < 0 ||
        goalAmount <= 0 ||
        monthsRemaining <= 0
    ) {
        throw new Error(
            "목표 전략 입력값을 다시 확인하세요."
        );
    }

    const remainingAmount = Math.max(
        goalAmount - currentAsset,
        0
    );

    const monthlyRequiredProfit =
        remainingAmount / monthsRemaining;

    const monthlyRequiredRate =
        currentAsset > 0
            ? (
                monthlyRequiredProfit /
                currentAsset
            ) * 100
            : 0;

    const progressPercent = clamp(
        (
            currentAsset /
            goalAmount
        ) * 100,
        0,
        100
    );

    const isLongTerm =
        monthsRemaining >= 12;

    const isLowMonthlyNeed =
        monthlyRequiredProfit <= 300000;

    let strategyType;
    let minimumStockScore;
    let recommendedCashRatio;
    let description;

    if (
        isLongTerm &&
        isLowMonthlyNeed
    ) {
        strategyType = "안정형";
        minimumStockScore = 80;
        recommendedCashRatio = 30;

        description =
            "목표 기간이 길고 월 필요 증가액이 낮아 우량주와 ETF 중심 전략이 적합합니다.";
    } else if (
        isLongTerm &&
        !isLowMonthlyNeed
    ) {
        strategyType = "적극형";
        minimumStockScore = 70;
        recommendedCashRatio = 35;

        description =
            "목표 기간은 길지만 월 필요 증가액이 높아 성장성과 모멘텀을 함께 고려합니다.";
    } else if (
        !isLongTerm &&
        isLowMonthlyNeed
    ) {
        strategyType = "도전형";
        minimumStockScore = 60;
        recommendedCashRatio = 40;

        description =
            "남은 기간이 짧아 최근 차트와 수급을 적극적으로 반영합니다.";
    } else {
        strategyType = "위험형";
        minimumStockScore = 50;
        recommendedCashRatio = 50;

        description =
            "목표 기간이 짧고 월 필요 증가액이 높아 달성 난도가 매우 높습니다.";
    }

    let difficulty;

    if (monthlyRequiredRate <= 1) {
        difficulty = "낮음";
    } else if (monthlyRequiredRate <= 3) {
        difficulty = "보통";
    } else if (monthlyRequiredRate <= 7) {
        difficulty = "높음";
    } else {
        difficulty = "매우 높음";
    }

    return {
        currentAsset,
        goalAmount,
        monthsRemaining,
        remainingAmount,
        monthlyRequiredProfit,
        monthlyRequiredRate,
        progressPercent,
        strategyType,
        minimumStockScore,
        recommendedCashRatio,
        difficulty,
        description
    };
}


/* =========================================================
   3. 시장점수 계산
========================================================= */

function calculateMarketScore({
    usMarketScore,
    trendScore,
    kospiScore,
    newsScore
}) {
    const scores = {
        usMarketScore,
        trendScore,
        kospiScore,
        newsScore
    };

    for (
        const [key, value]
        of Object.entries(scores)
    ) {
        if (!Number.isFinite(value)) {
            throw new Error(
                `${key} 값은 숫자여야 합니다.`
            );
        }
    }

    const safeUsScore = clamp(
        usMarketScore,
        0,
        40
    );

    const safeTrendScore = clamp(
        trendScore,
        0,
        30
    );

    const safeKospiScore = clamp(
        kospiScore,
        0,
        20
    );

    const safeNewsScore = clamp(
        newsScore,
        0,
        10
    );

    const totalScore = Math.round(
        safeUsScore +
        safeTrendScore +
        safeKospiScore +
        safeNewsScore
    );

    let marketStatus;
    let marketAction;
    let statusColor;

    if (totalScore >= 80) {
        marketStatus = "매우 긍정";
        marketAction = "적극적 분할매수 가능";
        statusColor = "green";
    } else if (totalScore >= 70) {
        marketStatus = "긍정";
        marketAction = "선별적 분할매수";
        statusColor = "green";
    } else if (totalScore >= 60) {
        marketStatus = "중립";
        marketAction = "관망 중심";
        statusColor = "yellow";
    } else if (totalScore >= 50) {
        marketStatus = "주의";
        marketAction = "현금 유지";
        statusColor = "orange";
    } else {
        marketStatus = "위험";
        marketAction = "신규매수 자제";
        statusColor = "red";
    }

    return {
        totalScore,
        marketStatus,
        marketAction,
        statusColor,

        factors: {
            usMarket: {
                score: safeUsScore,
                maximum: 40
            },

            trend: {
                score: safeTrendScore,
                maximum: 30
            },

            kospi: {
                score: safeKospiScore,
                maximum: 20
            },

            news: {
                score: safeNewsScore,
                maximum: 10
            }
        }
    };
}


/* =========================================================
   4. 홈 화면 목표 정보 반영
========================================================= */

function renderGoalStrategy(result) {
    const goalProgressElement =
        document.getElementById(
            "goal-progress"
        );

    const goalProgressBarElement =
        document.getElementById(
            "goal-progress-bar"
        );

    const monthlyRequiredElement =
        document.getElementById(
            "monthly-required"
        );

    const strategyTypeElement =
        document.getElementById(
            "strategy-type"
        );

    const currentAssetElement =
        document.getElementById(
            "current-asset-text"
        );

    const remainingAmountElement =
        document.getElementById(
            "remaining-amount-text"
        );

    if (goalProgressElement) {
        goalProgressElement.textContent =
            `${result.progressPercent.toFixed(1)}%`;
    }

    if (goalProgressBarElement) {
        goalProgressBarElement.style.width =
            `${result.progressPercent}%`;
    }

    if (monthlyRequiredElement) {
        monthlyRequiredElement.textContent =
            formatManWon(
                result.monthlyRequiredProfit
            );
    }

    if (strategyTypeElement) {
        strategyTypeElement.textContent =
            result.strategyType;
    }

    if (currentAssetElement) {
        currentAssetElement.textContent =
            `현재 ${formatManWon(
                result.currentAsset
            )}`;
    }

    if (remainingAmountElement) {
        remainingAmountElement.textContent =
            `남은 금액 ${formatManWon(
                result.remainingAmount
            )}`;
    }
}


/* =========================================================
   5. 홈 화면 시장점수 반영
========================================================= */

function renderMarketScore(result) {
    const marketScoreElement =
        document.querySelector(
            ".market strong"
        );

    const marketActionElement =
        document.querySelector(
            ".market em"
        );

    const strategyTitleElement =
        document.querySelector(
            ".card .head h3"
        );

    const strategyPillElement =
        document.querySelector(
            ".pill"
        );

    const reportMarketElement =
        document.querySelector(
            ".report li:first-child b"
        );

    if (marketScoreElement) {
        marketScoreElement.textContent =
            result.totalScore;
    }

    if (marketActionElement) {
        marketActionElement.textContent =
            result.marketAction;
    }

    if (strategyTitleElement) {
        strategyTitleElement.textContent =
            result.marketAction;
    }

    if (strategyPillElement) {
        strategyPillElement.textContent =
            result.marketStatus;
    }

    if (reportMarketElement) {
        reportMarketElement.textContent =
            `${result.totalScore}점 · ${result.marketAction}`;
    }
}


/* =========================================================
   6. 현재 테스트 데이터
   추후 사용자 입력과 API 데이터로 교체
========================================================= */

const thptInputData = window.THPT_DATA;


/* =========================================================
   7. THPT 엔진 실행
========================================================= */

function runThptEngine() {
    try {
       const goalResult =
    calculateGoalStrategy(
        thptInputData.goal
    );

const marketResult =
    calculateMarketScore(
        thptInputData.market
    );

        renderGoalStrategy(goalResult);
        renderMarketScore(marketResult);

        console.log(
            "THPT 목표 전략 결과:",
            goalResult
        );

        console.log(
            "THPT 시장점수 결과:",
            marketResult
        );

        return {
            goal: goalResult,
            market: marketResult
        };
    } catch (error) {
        console.error(
            "THPT 엔진 실행 오류:",
            error
        );

        return null;
    }
}


/* =========================================================
   8. HTML 로딩 완료 후 실행
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        window.thptResult =
            runThptEngine();
    }
);