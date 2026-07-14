/* =========================================================
   THPT Investment Pro
   Portfolio Engine v1.0
========================================================= */


/* =========================================================
   1. 공통 함수
========================================================= */

function formatPortfolioWon(amount) {
    return `${Math.round(amount).toLocaleString("ko-KR")}원`;
}

function formatPortfolioPercent(value) {
    const sign = value > 0 ? "+" : "";

    return `${sign}${value.toFixed(2)}%`;
}

function getHoldingLogoClass(name) {
    if (name.includes("NAVER")) {
        return "naver";
    }

    if (name.includes("삼성")) {
        return "samsung";
    }

    return "etf";
}

function getHoldingLogoText(name) {
    if (name.includes("NAVER")) {
        return "N";
    }

    if (name.includes("삼성")) {
        return "S";
    }

    return "E";
}


/* =========================================================
   2. 포트폴리오 계산
========================================================= */

function calculatePortfolio(data) {
    const cash = Number(data.assets.cash) || 0;

    const holdings = data.holdings.map((holding) => {
        const quantity =
            Number(holding.quantity) || 0;

        const averagePrice =
            Number(holding.averagePrice) || 0;

        const currentPrice =
            Number(holding.currentPrice) || 0;

        const purchaseAmount =
            quantity * averagePrice;

        const evaluationAmount =
            quantity * currentPrice;

        const profitAmount =
            evaluationAmount - purchaseAmount;

        const profitRate =
            purchaseAmount > 0
                ? (
                    profitAmount /
                    purchaseAmount
                ) * 100
                : 0;

        return {
            ...holding,
            quantity,
            averagePrice,
            currentPrice,
            purchaseAmount,
            evaluationAmount,
            profitAmount,
            profitRate
        };
    });

    const investedAsset =
        holdings.reduce(
            (total, holding) =>
                total + holding.evaluationAmount,
            0
        );

    const totalAsset =
        investedAsset + cash;

    const cashRatio =
        totalAsset > 0
            ? (cash / totalAsset) * 100
            : 0;

    const holdingsWithRatio =
        holdings.map((holding) => ({
            ...holding,

            assetRatio:
                totalAsset > 0
                    ? (
                        holding.evaluationAmount /
                        totalAsset
                    ) * 100
                    : 0
        }));

    return {
        cash,
        investedAsset,
        totalAsset,
        cashRatio,
        holdings: holdingsWithRatio
    };
}


/* =========================================================
   3. 자산 요약 표시
========================================================= */

function renderPortfolioSummary(
    portfolioResult,
    goalResult
) {
    const totalAssetElement =
        document.querySelector(
            ".summary-top div strong"
        );

    const investedAssetElement =
        document.querySelector(
            ".asset-breakdown div:first-child strong"
        );

    const cashElement =
        document.querySelector(
            ".asset-breakdown div:last-child strong"
        );

    const strategyElement =
        document.querySelector(
            ".strategy-summary h2"
        );

    const cashRatioElement =
        document.querySelector(
            ".cash-ratio-card .portfolio-section-title h2"
        );

    const recommendedCashElement =
        document.querySelector(
            ".cash-ratio-card .portfolio-section-title > strong"
        );

    const cashProgressElement =
        document.querySelector(
            ".cash-progress span"
        );

    const cashCommentElement =
        document.querySelector(
            ".cash-ratio-card > p"
        );

    if (totalAssetElement) {
        totalAssetElement.textContent =
            formatPortfolioWon(
                portfolioResult.totalAsset
            );
    }

    if (investedAssetElement) {
        investedAssetElement.textContent =
            formatPortfolioWon(
                portfolioResult.investedAsset
            );
    }

    if (cashElement) {
        cashElement.textContent =
            formatPortfolioWon(
                portfolioResult.cash
            );
    }

    if (strategyElement && goalResult) {
        strategyElement.textContent =
            `${goalResult.strategyType} 투자`;
    }

    if (cashRatioElement) {
        cashRatioElement.textContent =
            `${portfolioResult.cashRatio.toFixed(1)}%`;
    }

    if (
        recommendedCashElement &&
        goalResult
    ) {
        recommendedCashElement.textContent =
            `권장 ${goalResult.recommendedCashRatio}%`;
    }

    if (cashProgressElement) {
        cashProgressElement.style.width =
            `${Math.min(
                portfolioResult.cashRatio,
                100
            )}%`;
    }

    if (
        cashCommentElement &&
        goalResult
    ) {
        const difference =
            portfolioResult.cashRatio -
            goalResult.recommendedCashRatio;

        if (Math.abs(difference) <= 5) {
            cashCommentElement.textContent =
                "현재 전략 기준으로 적절한 현금 비중입니다.";
        } else if (difference > 5) {
            cashCommentElement.textContent =
                "권장 비중보다 현금이 많습니다. 분할매수 기회를 검토할 수 있습니다.";
        } else {
            cashCommentElement.textContent =
                "권장 비중보다 현금이 적습니다. 신규매수는 신중하게 판단하세요.";
        }
    }
}


/* =========================================================
   4. 보유종목 카드 생성
========================================================= */

function createHoldingCard(holding) {
    const scoreText =
        holding.score !== null &&
        holding.score !== undefined
            ? holding.score
            : holding.name.includes("삼성")
                ? "LOCK"
                : "ETF";

    const scoreClass =
        holding.score
            ? "positive-score"
            : holding.name.includes("삼성")
                ? "neutral-score"
                : "etf-score";

    const profitClass =
        holding.profitRate >= 0
            ? "positive-text"
            : "negative-text";

    return `
        <article class="holding-card">

            <div class="holding-top">

                <div class="holding-identity">

                    <div class="
                        holding-logo
                        ${getHoldingLogoClass(
                            holding.name
                        )}
                    ">
                        ${getHoldingLogoText(
                            holding.name
                        )}
                    </div>

                    <div>
                        <h3>${holding.name}</h3>

                        <p>
                            ${holding.quantity}주 ·
                            평단 ${formatPortfolioWon(
                                holding.averagePrice
                            )}
                        </p>
                    </div>

                </div>

                <div class="
                    holding-score
                    ${scoreClass}
                ">
                    <strong>${scoreText}</strong>
                    <span>${holding.status}</span>
                </div>

            </div>


            <div class="holding-numbers">

                <div>
                    <span>평가금액</span>
                    <strong>
                        ${formatPortfolioWon(
                            holding.evaluationAmount
                        )}
                    </strong>
                </div>

                <div>
                    <span>수익률</span>
                    <strong class="${profitClass}">
                        ${formatPortfolioPercent(
                            holding.profitRate
                        )}
                    </strong>
                </div>

                <div>
                    <span>자산 비중</span>
                    <strong>
                        ${holding.assetRatio.toFixed(1)}%
                    </strong>
                </div>

            </div>


            <div class="holding-opinion">
                <span>THPT 의견</span>

                <p>
                    ${holding.status} 상태입니다.
                    시장점수와 수급을 함께 확인해
                    다음 행동을 판단합니다.
                </p>
            </div>


            <button
                class="detail-button"
                type="button"
            >
                상세 분석 보기
            </button>

        </article>
    `;
}


/* =========================================================
   5. 보유종목 목록 표시
========================================================= */

function renderHoldings(portfolioResult) {
    const portfolioCards =
        document.querySelectorAll(
            ".portfolio-card"
        );

    const holdingSection =
        portfolioCards[0];

    if (!holdingSection) {
        return;
    }

    const titleElement =
        holdingSection.querySelector(
            ".portfolio-section-title h2"
        );

    if (titleElement) {
        titleElement.textContent =
            `${portfolioResult.holdings.length}개 종목`;
    }

    holdingSection
        .querySelectorAll(".holding-card")
        .forEach((card) => {
            card.remove();
        });

    const holdingHtml =
        portfolioResult.holdings
            .map(createHoldingCard)
            .join("");

    holdingSection.insertAdjacentHTML(
        "beforeend",
        holdingHtml
    );
}


/* =========================================================
   6. 추천종목 목록 생성
========================================================= */

function createWatchlistCard(
    stock,
    index
) {
    const rankClass =
        index === 1
            ? "second"
            : index === 2
                ? "third"
                : "";

    const resultClass =
        stock.status === "대기"
            ? "wait"
            : stock.status === "관망"
                ? "observe"
                : "";

    return `
        <article class="candidate-card">

            <div class="
                candidate-rank
                ${rankClass}
            ">
                ${index + 1}
            </div>

            <div class="candidate-content">
                <h3>${stock.name}</h3>

                <p>
                    THPT 시장·종목 점수를 기준으로
                    ${stock.status} 의견을 제시합니다.
                </p>
            </div>

            <div class="
                candidate-result
                ${resultClass}
            ">
                <strong>${stock.score}</strong>
                <span>${stock.status}</span>
            </div>

        </article>
    `;
}


/* =========================================================
   7. 추천종목 목록 표시
========================================================= */

function renderWatchlist(data) {
    const portfolioCards =
        document.querySelectorAll(
            ".portfolio-card"
        );

    const watchlistSection =
        portfolioCards[1];

    if (!watchlistSection) {
        return;
    }

    watchlistSection
        .querySelectorAll(".candidate-card")
        .forEach((card) => {
            card.remove();
        });

    const watchlistHtml =
        data.watchlist
            .map(createWatchlistCard)
            .join("");

    watchlistSection.insertAdjacentHTML(
        "beforeend",
        watchlistHtml
    );
}


/* =========================================================
   8. Portfolio Engine 실행
========================================================= */

function runPortfolioEngine() {
    try {
        if (!window.THPT_DATA) {
            throw new Error(
                "THPT_DATA가 연결되지 않았습니다."
            );
        }

        const portfolioResult =
            calculatePortfolio(
                window.THPT_DATA
            );

        const goalResult =
            window.thptResult?.goal ??
            calculateGoalStrategy(
                window.THPT_DATA.goal
            );

        renderPortfolioSummary(
            portfolioResult,
            goalResult
        );

        renderHoldings(
            portfolioResult
        );

        renderWatchlist(
            window.THPT_DATA
        );

        window.thptPortfolioResult =
            portfolioResult;

        console.log(
            "THPT 포트폴리오 결과:",
            portfolioResult
        );

    } catch (error) {
        console.error(
            "THPT 포트폴리오 엔진 오류:",
            error
        );
    }
}


/* =========================================================
   9. HTML 로딩 완료 후 실행
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    runPortfolioEngine
);