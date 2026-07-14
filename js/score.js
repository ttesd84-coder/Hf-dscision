
/* =========================================================
   THPT Investment Pro
   Score Engine v1.0
========================================================= */


/* =========================================================
   1. 공통 함수
========================================================= */

function formatScorePercent(value) {
    const sign = value > 0 ? "+" : "";

    return `${sign}${value.toFixed(2)}%`;
}

function getMarketConclusion(totalScore) {
    if (totalScore >= 80) {
        return {
            status: "매우 긍정",
            action: "적극적 분할매수 가능",
            opinion:
                "시장 흐름이 강합니다. 다만 한 번에 매수하기보다 계획된 비중으로 나누어 접근하세요."
        };
    }

    if (totalScore >= 70) {
        return {
            status: "긍정",
            action: "선별적 분할매수",
            opinion:
                "시장 분위기가 우호적입니다. 점수가 높은 종목만 선별해 분할매수를 검토하세요."
        };
    }

    if (totalScore >= 60) {
        return {
            status: "중립",
            action: "관망 중심",
            opinion:
                "시장은 방향성을 확인하는 구간입니다. 기존 종목 관리와 현금 유지가 중요합니다."
        };
    }

    if (totalScore >= 50) {
        return {
            status: "주의",
            action: "현금 유지",
            opinion:
                "시장이 완전히 회복되지 않았습니다. 신규매수보다 현금 비중 유지가 우선입니다."
        };
    }

    return {
        status: "위험",
        action: "신규매수 자제",
        opinion:
            "시장 위험도가 높습니다. 손실 확대를 막기 위해 신규매수는 자제하고 방어적으로 대응하세요."
    };
}


/* =========================================================
   2. 점수 화면 대표 영역 표시
========================================================= */

function renderScoreHero(marketResult) {
    const scoreElement =
        document.querySelector(
            ".score-circle-inner strong"
        );

    const statusElement =
        document.querySelector(
            ".score-circle-inner em"
        );

    const heroTitleElement =
        document.querySelector(
            ".score-summary h2"
        );

    const heroDescriptionElement =
        document.querySelector(
            ".score-summary p"
        );

    const todayScoreElement =
        document.querySelector(
            ".score-change div:last-child strong"
        );

    const conclusion =
        getMarketConclusion(
            marketResult.totalScore
        );

    if (scoreElement) {
        scoreElement.textContent =
            marketResult.totalScore;
    }

    if (statusElement) {
        statusElement.textContent =
            conclusion.status;
    }

    if (heroTitleElement) {
        heroTitleElement.textContent =
            conclusion.action;
    }

    if (heroDescriptionElement) {
        heroDescriptionElement.textContent =
            conclusion.opinion;
    }

    if (todayScoreElement) {
        todayScoreElement.textContent =
            `${marketResult.totalScore}점`;
    }

    const scoreCircle =
        document.querySelector(
            ".score-circle"
        );

    if (scoreCircle) {
        const degree =
            marketResult.totalScore * 3.6;

        scoreCircle.style.background =
            `conic-gradient(
                var(--green) 0deg ${degree}deg,
                rgba(255,255,255,.18) ${degree}deg 360deg
            )`;
    }
}


/* =========================================================
   3. 항목별 점수 카드 표시
========================================================= */

function renderFactorCards(marketResult) {
    const factorCards =
        document.querySelectorAll(
            ".score-card"
        );

    const usCard = factorCards[1];
    const trendCard = factorCards[2];
    const kospiCard = factorCards[3];
    const newsCard = factorCards[4];

    renderSingleFactor({
        card: usCard,
        score:
            marketResult.factors.usMarket.score,
        maximum:
            marketResult.factors.usMarket.maximum
    });

    renderSingleFactor({
        card: trendCard,
        score:
            marketResult.factors.trend.score,
        maximum:
            marketResult.factors.trend.maximum
    });

    renderSingleFactor({
        card: kospiCard,
        score:
            marketResult.factors.kospi.score,
        maximum:
            marketResult.factors.kospi.maximum
    });

    renderSingleFactor({
        card: newsCard,
        score:
            marketResult.factors.news.score,
        maximum:
            marketResult.factors.news.maximum
    });
}

function renderSingleFactor({
    card,
    score,
    maximum
}) {
    if (!card) {
        return;
    }

    const scoreTextElement =
        card.querySelector(
            ".factor-header h2"
        );

    const progressElement =
        card.querySelector(
            ".factor-progress span"
        );

    if (scoreTextElement) {
        scoreTextElement.textContent =
            `${score} / ${maximum}점`;
    }

    if (progressElement) {
        const width =
            maximum > 0
                ? (
                    score /
                    maximum
                ) * 100
                : 0;

        progressElement.style.width =
            `${width}%`;
    }
}


/* =========================================================
   4. 점수 산정 사유 표시
========================================================= */

function renderScoreReasons(marketResult) {
    const reasonItems =
        document.querySelectorAll(
            ".reason-list li"
        );

    const values = [
        {
            score:
                marketResult.factors.usMarket.score,
            text:
                "전일 미국장 흐름 반영"
        },
        {
            score:
                marketResult.factors.trend.score,
            text:
                "최근 2주~1개월 추세 반영"
        },
        {
            score:
                marketResult.factors.kospi.score,
            text:
                "코스피 장중 흐름 반영"
        },
        {
            score:
                marketResult.factors.news.score,
            text:
                "뉴스와 주요 일정 반영"
        }
    ];

    reasonItems.forEach(
        (item, index) => {
            const value = values[index];

            if (!value) {
                return;
            }

            const scoreElement =
                item.querySelector(
                    ".reason-plus"
                );

            const textElement =
                item.querySelector(
                    "p"
                );

            if (scoreElement) {
                scoreElement.textContent =
                    `+${value.score}`;
            }

            if (textElement) {
                textElement.textContent =
                    value.text;
            }
        }
    );
}


/* =========================================================
   5. 점수 화면 최종 결론 표시
========================================================= */

function renderScoreConclusion(marketResult) {
    const conclusion =
        getMarketConclusion(
            marketResult.totalScore
        );

    const conclusionTitleElement =
        document.querySelector(
            ".score-conclusion h2"
        );

    const conclusionTextElement =
        document.querySelector(
            ".score-conclusion p"
        );

    if (conclusionTitleElement) {
        conclusionTitleElement.innerHTML =
            `시장점수 ${marketResult.totalScore}점으로<br>${conclusion.action}이 적합합니다.`;
    }

    if (conclusionTextElement) {
        conclusionTextElement.textContent =
            conclusion.opinion;
    }
}


/* =========================================================
   6. 점수 추세 요약 표시
========================================================= */

function renderScoreHistory(marketResult) {
    const currentElement =
        document.querySelector(
            ".score-history div:last-child strong"
        );

    if (currentElement) {
        currentElement.textContent =
            `${marketResult.totalScore}점`;
    }
}


/* =========================================================
   7. Score Engine 실행
========================================================= */

function runScoreEngine() {
    try {
        if (!window.THPT_DATA) {
            throw new Error(
                "THPT_DATA가 연결되지 않았습니다."
            );
        }

        runCoreEngine();

        const factorResult =
            window.thptResult?.market ??
            calculateMarketScore(
                window.THPT_DATA.market
            );

        const marketResult = {
            ...factorResult,

            totalScore:
                window.THPT_ENGINE.market.score
        };

        renderScoreHero(
            marketResult
        );

        renderFactorCards(
            marketResult
        );

        renderScoreReasons(
            marketResult
        );

        renderScoreConclusion(
            marketResult
        );

        renderScoreHistory(
            marketResult
        );

        window.thptScoreResult =
            marketResult;

        console.log(
            "THPT 점수 화면 결과:",
            marketResult
        );

    } catch (error) {
        console.error(
            "THPT 점수 엔진 오류:",
            error
        );
    }
}


/* =========================================================
   8. HTML 로딩 완료 후 실행
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    runScoreEngine
);