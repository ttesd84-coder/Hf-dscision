/* =========================================================
   THPT Investment Pro
   Report Engine v1.0
========================================================= */


/* =========================================================
   1. 공통 함수
========================================================= */

function formatReportWon(amount) {
    return `${Math.round(amount).toLocaleString("ko-KR")}원`;
}

function formatReportManWon(amount) {
    return `${Math.round(amount / 10000).toLocaleString("ko-KR")}만 원`;
}


/* =========================================================
   2. 포트폴리오 요약 계산
========================================================= */

function calculateReportPortfolio(data) {
    const cash = Number(data.assets?.cash) || 0;

    const holdings =
        Array.isArray(data.holdings)
            ? data.holdings
            : [];

    const investedAsset = holdings.reduce(
        (total, holding) => {
            const quantity =
                Number(holding.quantity) || 0;

            const currentPrice =
                Number(holding.currentPrice) || 0;

            return total + quantity * currentPrice;
        },
        0
    );

    const totalAsset =
        investedAsset + cash;

    const cashRatio =
        totalAsset > 0
            ? (cash / totalAsset) * 100
            : 0;

    return {
        cash,
        investedAsset,
        totalAsset,
        cashRatio
    };
}


/* =========================================================
   3. 시장점수에 따른 리포트 문구
========================================================= */

function getReportMarketMessage(score) {
    if (score >= 80) {
        return {
            title:
                "시장 흐름이 강하지만 계획대로 나누어 접근하세요.",
            summary:
                `${score}점 · 적극적 분할매수 가능`,
            action:
                "점수가 높은 종목 중심으로 분할매수",
            opinion:
                "시장 환경은 긍정적입니다. 다만 한 번에 비중을 확대하기보다 목표와 현금 비중을 지키며 나누어 접근하는 편이 적합합니다."
        };
    }

    if (score >= 70) {
        return {
            title:
                "좋은 종목을 선별해 천천히 모으는 날입니다.",
            summary:
                `${score}점 · 선별적 분할매수`,
            action:
                "종목점수 70점 이상만 검토",
            opinion:
                "시장 분위기는 우호적이지만 모든 종목이 좋은 것은 아닙니다. 수급과 가격 조건이 확인된 종목만 선별하세요."
        };
    }

    if (score >= 60) {
        return {
            title:
                "방향성을 확인하며 기존 종목을 관리하세요.",
            summary:
                `${score}점 · 관망 중심`,
            action:
                "신규매수보다 보유종목 점검",
            opinion:
                "시장은 중립 구간입니다. 공격적으로 비중을 늘리기보다 기존 포트폴리오와 현금 비중을 유지하는 편이 적합합니다."
        };
    }

    if (score >= 50) {
        return {
            title:
                "오늘은 수익보다 현금을 지키는 날입니다.",
            summary:
                `${score}점 · 현금 유지`,
            action:
                "신규매수 대기",
            opinion:
                "시장이 완전히 회복되지 않았습니다. 오늘은 종목을 늘리기보다 기존 종목의 수급과 현금 비중을 유지하는 편이 목표 달성에 더 적합합니다."
        };
    }

    return {
        title:
            "오늘은 쉬는 것도 투자입니다.",
        summary:
            `${score}점 · 신규매수 자제`,
        action:
            "현금 확보와 위험 관리",
        opinion:
            "시장 위험도가 높습니다. 수익 기회를 찾기보다 손실 확대를 막고 현금을 보존하는 것이 우선입니다."
    };
}


/* =========================================================
   4. 상단 대표 리포트 표시
========================================================= */

function renderReportHero(
    marketResult,
    goalResult
) {
    const message =
        getReportMarketMessage(
            marketResult.totalScore
        );

    const heroTitle =
        document.querySelector(
            ".report-hero h2"
        );

    const heroDescription =
        document.querySelector(
            ".report-hero > div:first-child > p"
        );

    const heroScore =
        document.querySelector(
            ".report-score strong"
        );

    const heroStatus =
        document.querySelector(
            ".report-score em"
        );

    if (heroTitle) {
        heroTitle.innerHTML =
            message.title.replace(
                "날입니다.",
                "<br>날입니다."
            );
    }

    if (heroDescription) {
        heroDescription.textContent =
            `시장점수 ${marketResult.totalScore}점 · ${goalResult.strategyType} 전략 유지`;
    }

    if (heroScore) {
        heroScore.textContent =
            marketResult.totalScore;
    }

    if (heroStatus) {
        heroStatus.textContent =
            marketResult.marketStatus;
    }
}


/* =========================================================
   5. 핵심 요약 표시
========================================================= */

function renderQuickSummary(
    marketResult,
    portfolioResult,
    goalResult,
    data
) {
    const summaryItems =
        document.querySelectorAll(
            ".summary-list li"
        );

    const firstHolding =
        data.holdings?.[0];

    const values = [
        marketResult
            ? `${marketResult.totalScore}점 · ${marketResult.marketAction}`
            : "시장 데이터 없음",

        firstHolding
            ? `${firstHolding.name} · ${firstHolding.status}`
            : "보유종목 없음",

        data.holdings?.find(
            (holding) =>
                holding.name.includes("S&P")
        )?.status ?? "ETF 정보 없음",

        `${formatReportManWon(
            portfolioResult.cash
        )} · ${portfolioResult.cashRatio.toFixed(1)}%`
    ];

    summaryItems.forEach(
        (item, index) => {
            const valueElement =
                item.querySelector("strong");

            if (valueElement && values[index]) {
                valueElement.textContent =
                    values[index];
            }
        }
    );

    const progressText =
        document.querySelector(
            ".progress-text"
        );

    if (progressText) {
        progressText.textContent =
            `전략 ${goalResult.strategyType}`;
    }
}


/* =========================================================
   6. 체크리스트 표시
========================================================= */

function renderChecklist(
    marketResult,
    data
) {
    const checkItems =
        document.querySelectorAll(
            ".check-item"
        );

    const firstHolding =
        data.holdings?.[0];

    const checklistData = [
        {
            title: "시장점수 확인",
            description:
                `${marketResult.totalScore}점으로 ${marketResult.marketAction} 구간입니다.`
        },
        {
            title:
                firstHolding
                    ? `${firstHolding.name} 흐름 확인`
                    : "보유종목 확인",
            description:
                firstHolding
                    ? `${firstHolding.status} 의견을 유지합니다.`
                    : "등록된 보유종목이 없습니다."
        },
        {
            title: "현금 비중 확인",
            description:
                "현재 전략의 권장 현금 비중과 비교합니다."
        },
        {
            title: "주요 일정 확인",
            description:
                "시장 변동성을 높일 발표 일정을 확인합니다."
        }
    ];

    checkItems.forEach(
        (item, index) => {
            const title =
                item.querySelector("strong");

            const description =
                item.querySelector("p");

            const content =
                checklistData[index];

            if (!content) {
                return;
            }

            if (title) {
                title.textContent =
                    content.title;
            }

            if (description) {
                description.textContent =
                    content.description;
            }
        }
    );
}


/* =========================================================
   7. 보유종목 브리핑 표시
========================================================= */

function renderHoldingBriefs(data) {
    const briefRows =
        document.querySelectorAll(
            ".brief-row"
        );

    briefRows.forEach(
        (row, index) => {
            const holding =
                data.holdings?.[index];

            if (!holding) {
                row.style.display = "none";
                return;
            }

            row.style.display = "flex";

            const name =
                row.querySelector(
                    ".brief-content strong"
                );

            const description =
                row.querySelector(
                    ".brief-content p"
                );

            const status =
                row.querySelector(
                    ".brief-status"
                );

            if (name) {
                name.textContent =
                    holding.name;
            }

            if (description) {
                description.textContent =
                    `${holding.quantity}주 보유 · 현재 의견은 ${holding.status}입니다.`;
            }

            if (status) {
                status.textContent =
                    holding.status;
            }
        }
    );
}


/* =========================================================
   8. 목표 현황 표시
========================================================= */

function renderReportGoal(goalResult) {
    const goalPercent =
        document.querySelector(
            ".goal-percent"
        );

    const goalBar =
        document.querySelector(
            ".goal-bar span"
        );

    const goalStats =
        document.querySelectorAll(
            ".goal-stat-grid div"
        );

    if (goalPercent) {
        goalPercent.textContent =
            `${goalResult.progressPercent.toFixed(1)}%`;
    }

    if (goalBar) {
        goalBar.style.width =
            `${goalResult.progressPercent}%`;
    }

    const values = [
        formatReportManWon(
            goalResult.monthlyRequiredProfit
        ),
        goalResult.strategyType,
        `${goalResult.monthsRemaining}개월`
    ];

    goalStats.forEach(
        (item, index) => {
            const value =
                item.querySelector("strong");

            if (value && values[index]) {
                value.textContent =
                    values[index];
            }
        }
    );
}


/* =========================================================
   9. THPT Opinion 표시
========================================================= */

function renderReportOpinion(
    marketResult,
    goalResult,
    portfolioResult
) {
    const message =
        getReportMarketMessage(
            marketResult.totalScore
        );

    const title =
        document.querySelector(
            ".thpt-opinion h2"
        );

    const description =
        document.querySelector(
            ".thpt-opinion p"
        );

    if (title) {
        title.textContent =
            message.title;
    }

    if (description) {
        description.textContent =
            `${message.opinion} 현재 현금 비중은 ${portfolioResult.cashRatio.toFixed(1)}%이며, ${goalResult.strategyType} 기준 권장 현금 비중은 ${goalResult.recommendedCashRatio}%입니다.`;
    }
}


/* =========================================================
   10. Report Engine 실행
========================================================= */

function runReportEngine() {
    try {
        if (!window.THPT_DATA) {
            throw new Error(
                "THPT_DATA가 연결되지 않았습니다."
            );
        }

        runCoreEngine();

        const goalResult =
    window.thptResult?.goal ??
    calculateGoalStrategy(
        window.THPT_DATA.goal
    );

        const marketResult = {
            ...(
                window.thptResult?.market ??
                calculateMarketScore(
                    window.THPT_DATA.market
                )
            ),

            totalScore:
                window.THPT_ENGINE.market.score
        };

        const portfolioResult =
            window.THPT_ENGINE.asset;

        renderReportHero(
            marketResult,
            goalResult
        );

        renderQuickSummary(
            marketResult,
            portfolioResult,
            goalResult,
            window.THPT_DATA
        );

        renderChecklist(
            marketResult,
            window.THPT_DATA
        );

        renderHoldingBriefs(
            window.THPT_DATA
        );

        renderReportGoal(
            goalResult
        );

        renderReportOpinion(
            marketResult,
            goalResult,
            portfolioResult
        );

        window.thptReportResult = {
            goal: goalResult,
            market: marketResult,
            portfolio: portfolioResult
        };

        console.log(
            "THPT 리포트 결과:",
            window.thptReportResult
        );

    } catch (error) {
        console.error(
            "THPT 리포트 엔진 오류:",
            error
        );
    }
}


/* =========================================================
   11. HTML 로딩 완료 후 실행
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    runReportEngine
);
