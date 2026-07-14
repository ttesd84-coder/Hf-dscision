/* =========================================================
   THPT Investment Pro
   Core Engine v0.1
========================================================= */

window.THPT_ENGINE = {

    goal: {},

    asset: {},

    portfolio: {},

    market: {},

    recommendation: {},

    dashboard: {}

};


/* =========================================================
   Goal Engine
========================================================= */

function runGoalEngine() {

    const goal =
        window.THPT_DATA.goal;

    const progress =
        (
            goal.currentAsset /
            goal.goalAmount
        ) * 100;

    const remainAmount =
        goal.goalAmount -
        goal.currentAsset;

    const monthlyNeed =
        remainAmount /
        goal.monthsRemaining;

    window.THPT_ENGINE.goal = {

        progress,

        remainAmount,

        monthlyNeed

    };

}


/* =========================================================
   Asset Engine
========================================================= */

function runAssetEngine() {

    const cash =
        Number(window.THPT_DATA.assets.cash) || 0;

    const investedAsset =
        window.THPT_DATA.holdings.reduce(
            (total, holding) => {

                const quantity =
                    Number(holding.quantity) || 0;

                const currentPrice =
                    Number(holding.currentPrice) || 0;

                return (
                    total +
                    quantity * currentPrice
                );

            },
            0
        );

    const totalAsset =
        cash + investedAsset;

    const cashRatio =
        totalAsset > 0
            ? (cash / totalAsset) * 100
            : 0;

    /* 데이터도 함께 갱신 */

    window.THPT_DATA.assets.investedAsset =
        investedAsset;

    window.THPT_DATA.assets.totalAsset =
        totalAsset;

    window.THPT_ENGINE.asset = {

        cash,

        investedAsset,

        totalAsset,

        cashRatio

    };

}


/* =========================================================
   Portfolio Engine
========================================================= */

function runPortfolioEngine() {

    const holdings =
        window.THPT_DATA.holdings;

    const totalQuantity =
        holdings.reduce(
            (sum, holding) =>
                sum + (Number(holding.quantity) || 0),
            0
        );

    const scoredHoldings =
        holdings.filter(
            holding => holding.score !== null
        );

    const averageScore =
        scoredHoldings.length > 0
            ? scoredHoldings.reduce(
                  (sum, holding) =>
                      sum + holding.score,
                  0
              ) / scoredHoldings.length
            : 0;

    const holdingsWithProfit =
    holdings.map(holding => {

        const quantity =
            Number(holding.quantity) || 0;

        const averagePrice =
            Number(holding.averagePrice) || 0;

        const currentPrice =
            Number(holding.currentPrice) || 0;

        const profit =
            (currentPrice - averagePrice) * quantity;

        const profitRate =
            averagePrice > 0
                ? ((currentPrice - averagePrice) / averagePrice) * 100
                : 0;

        const evaluationAmount =
            currentPrice * quantity;

        return {

            ...holding,

            evaluationAmount,

            profit,

            profitRate

        };

    });

const profitableHoldings =
    holdingsWithProfit.filter(
        holding =>
            Number.isFinite(holding.profit)
    );

const bestHolding =
    profitableHoldings.length > 0
        ? profitableHoldings.reduce(
              (best, holding) =>
                  holding.profit > best.profit
                      ? holding
                      : best
          )
        : null;

const worstHolding =
    profitableHoldings.length > 0
        ? profitableHoldings.reduce(
              (worst, holding) =>
                  holding.profit < worst.profit
                      ? holding
                      : worst
          )
        : null;

const totalProfit =
    profitableHoldings.reduce(
        (sum, holding) =>
            sum + holding.profit,
        0
    );

const totalPurchaseAmount =
    profitableHoldings.reduce(
        (sum, holding) =>
            sum +
            holding.averagePrice *
            holding.quantity,
        0
    );

const totalProfitRate =
    totalPurchaseAmount > 0
        ? (
            totalProfit /
            totalPurchaseAmount
        ) * 100
        : 0;

window.THPT_ENGINE.portfolio = {
    holdings: holdingsWithProfit,

    count: holdings.length,

    totalQuantity,

    averageScore:
        Math.round(averageScore),

    totalProfit,

    totalProfitRate,

    bestHolding,

    worstHolding
};

}


/* =========================================================
   Market Engine
========================================================= */

function runMarketEngine() {

    const market =
        window.THPT_DATA.market;

    const score =

        market.usMarketScore +

        market.trendScore +

        market.kospiScore +

        market.newsScore;

    window.THPT_ENGINE.market = {

        score

    };

}


/* =========================================================
   Recommendation Engine
========================================================= */

function runRecommendationEngine() {

    const score =
        window.THPT_ENGINE.market.score;

    let action = "";

    if (score >= 80) {

        action = "적극매수";

    }

    else if (score >= 60) {

        action = "분할매수";

    }

    else if (score >= 40) {

        action = "관망";

    }

    else {

        action = "현금확보";

    }

    window.THPT_ENGINE.recommendation = {

        action

    };

}


/* =========================================================
   Dashboard Engine
========================================================= */

function runDashboardEngine() {

    window.THPT_ENGINE.dashboard = {

        updatedAt:
            new Date()

    };

}


/* =========================================================
   Core Engine
========================================================= */

function runCoreEngine() {

    runGoalEngine();

    runAssetEngine();

    runPortfolioEngine();

    runMarketEngine();

    runRecommendationEngine();

    runDashboardEngine();

    console.log(

        "THPT Core Engine 완료",

        window.THPT_ENGINE

    );

}

window.runCoreEngine =
    runCoreEngine;