
/* =========================================================
   THPT Investment Pro
   Chat Engine v1.0
========================================================= */


/* =========================================================
   1. 공통 함수
========================================================= */

function formatChatWon(amount) {
    return `${Math.round(amount).toLocaleString("ko-KR")}원`;
}

function formatChatManWon(amount) {
    return `${Math.round(amount / 10000).toLocaleString("ko-KR")}만 원`;
}


/* =========================================================
   2. 포트폴리오 요약 계산
========================================================= */

function calculateChatPortfolio(data) {
    const cash =
        Number(data.assets?.cash) || 0;

    const holdings =
        Array.isArray(data.holdings)
            ? data.holdings
            : [];

    const investedAsset =
        holdings.reduce(
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
   3. 시장점수 기반 기본 의견
========================================================= */

function getChatMarketOpinion(score) {
    if (score >= 80) {
        return {
            status: "매우 긍정",
            action: "적극적 분할매수 가능",
            text:
                "시장 흐름이 강합니다. 다만 계획된 비중 안에서 나누어 접근하세요."
        };
    }

    if (score >= 70) {
        return {
            status: "긍정",
            action: "선별적 분할매수",
            text:
                "시장 환경은 우호적입니다. 점수가 높은 종목만 선별하세요."
        };
    }

    if (score >= 60) {
        return {
            status: "중립",
            action: "관망 중심",
            text:
                "시장 방향성이 아직 명확하지 않습니다. 기존 종목 관리가 우선입니다."
        };
    }

    if (score >= 50) {
        return {
            status: "주의",
            action: "현금 유지",
            text:
                "시장이 완전히 회복되지 않았습니다. 신규매수보다 현금 유지가 우선입니다."
        };
    }

    return {
        status: "위험",
        action: "신규매수 자제",
        text:
            "시장 위험도가 높습니다. 수익보다 손실 방어와 현금 보존이 중요합니다."
    };
}


/* =========================================================
   4. 상단 인사 영역 표시
========================================================= */

function renderChatHero(
    data,
    marketResult
) {
    const heroTitle =
        document.querySelector(
            ".assistant-hero h2"
        );

    const heroText =
        document.querySelector(
            ".assistant-hero p"
        );

    const userName =
        data.user?.name ?? "사용자";

    if (heroTitle) {
        heroTitle.textContent =
            `안녕하세요, ${userName}님.`;
    }

    if (heroText) {
        heroText.innerHTML =
            `오늘 시장점수는 ${marketResult.totalScore}점입니다.<br>무엇을 함께 판단해볼까요?`;
    }
}


/* =========================================================
   5. 첫 번째 AI 답변 표시
========================================================= */

function renderStockAnswer(
    data,
    marketResult,
    goalResult
) {
    const firstHolding =
        data.holdings?.[0];

    if (!firstHolding) {
        return;
    }

    const answerTitle =
        document.querySelector(
            ".assistant-message .answer-head strong"
        );

    const scoreValues =
        document.querySelectorAll(
            ".assistant-message .score-grid strong"
        );

    const reasonItems =
        document.querySelectorAll(
            ".assistant-message .answer-box ul li"
        );

    const conclusion =
        document.querySelector(
            ".assistant-message .conclusion p"
        );

    if (answerTitle) {
        answerTitle.textContent =
            firstHolding.status;
    }

    const values = [
        marketResult.totalScore,
        firstHolding.score ?? "-",
        goalResult.strategyType
    ];

    scoreValues.forEach(
        (element, index) => {
            if (values[index] !== undefined) {
                element.textContent =
                    values[index];
            }
        }
    );

    const reasons = [
        `${firstHolding.name}의 현재 의견은 ${firstHolding.status}입니다.`,
        `현재 시장점수는 ${marketResult.totalScore}점입니다.`,
        `목표 기준 전략은 ${goalResult.strategyType}입니다.`
    ];

    reasonItems.forEach(
        (item, index) => {
            if (!reasons[index]) {
                return;
            }

            const badge =
                item.querySelector("b");

            item.innerHTML = "";

            if (badge) {
                item.appendChild(badge);
            }

            item.append(
                document.createTextNode(
                    ` ${reasons[index]}`
                )
            );
        }
    );

    if (conclusion) {
        conclusion.textContent =
            `${firstHolding.name}은 현재 ${firstHolding.status} 의견입니다. 시장점수 ${marketResult.totalScore}점과 ${goalResult.strategyType} 전략을 함께 고려해 최종 판단하세요.`;
    }
}


/* =========================================================
   6. 목표 분석 답변 표시
========================================================= */

function renderGoalAnswer(goalResult) {
    const goalTitle =
        document.querySelectorAll(
            ".answer-head strong"
        )[1];

    const goalValues =
        document.querySelectorAll(
            ".goal-grid strong"
        );

    const goalOpinion =
        document.querySelector(
            ".opinion"
        );

    if (goalTitle) {
        goalTitle.textContent =
            `현재 달성률 ${goalResult.progressPercent.toFixed(1)}%`;
    }

    const values = [
        formatChatManWon(
            goalResult.goalAmount
        ),

        formatChatManWon(
            goalResult.currentAsset
        ),

        `${goalResult.monthsRemaining}개월`,

        formatChatManWon(
            goalResult.monthlyRequiredProfit
        )
    ];

    goalValues.forEach(
        (element, index) => {
            if (values[index]) {
                element.textContent =
                    values[index];
            }
        }
    );

    if (goalOpinion) {
        goalOpinion.textContent =
            `현재 전략은 ${goalResult.strategyType}이며, 권장 현금 비중은 ${goalResult.recommendedCashRatio}%입니다. 목표 달성 난도는 ${goalResult.difficulty}입니다.`;
    }
}


/* =========================================================
   7. 투자 정보 영역 표시
========================================================= */

function renderChatContext(
    goalResult,
    marketResult,
    portfolioResult
) {
    const contextValues =
        document.querySelectorAll(
            ".context-grid strong"
        );

    const values = [
        goalResult.strategyType,

        `${portfolioResult.cashRatio.toFixed(1)}%`,

        `${marketResult.totalScore}점`,

        formatChatManWon(
            goalResult.monthlyRequiredProfit
        )
    ];

    contextValues.forEach(
        (element, index) => {
            if (values[index]) {
                element.textContent =
                    values[index];
            }
        }
    );
}


/* =========================================================
   8. 빠른 질문 버튼 기능
========================================================= */

function setupQuickQuestions() {
    const quickButtons =
        document.querySelectorAll(
            ".quick-grid button"
        );

    const chatInput =
        document.querySelector(
            ".chat-input input"
        );

    quickButtons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                if (!chatInput) {
                    return;
                }

                chatInput.value =
                    button.textContent
                        .replace(
                            /[📈💼🎯⭐📰]/g,
                            ""
                        )
                        .trim();

                chatInput.focus();
            }
        );
    });
}


/* =========================================================
   9. 간단한 메시지 전송 기능
========================================================= */

function setupChatForm(
    data,
    marketResult,
    goalResult,
    portfolioResult
) {
    const form =
        document.querySelector(
            ".chat-input"
        );

    const input =
        form?.querySelector("input");

    const conversation =
        document.querySelector(
            ".conversation"
        );

    if (
        !form ||
        !input ||
        !conversation
    ) {
        return;
    }

    form.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            const question =
                input.value.trim();

            if (!question) {
                return;
            }

            const userMessage =
                document.createElement("div");

            userMessage.className =
                "user-message";

            userMessage.innerHTML = `
                <p>${question}</p>
                <small>방금 전</small>
            `;

            conversation.appendChild(
                userMessage
            );

            const answer =
                createLocalChatAnswer(
                    question,
                    data,
                    marketResult,
                    goalResult,
                    portfolioResult
                );

            const assistantMessage =
                document.createElement("div");

            assistantMessage.className =
                "assistant-message";

            assistantMessage.innerHTML = `
                <div class="mini-avatar">
                    •ᴗ•
                </div>

                <div class="answer-box">
                    <div class="answer-head">
                        <span>THPT 답변</span>
                        <strong>${answer.title}</strong>
                    </div>

                    <p class="opinion">
                        ${answer.text}
                    </p>

                    <small class="notice">
                        AI는 정보를 판단합니다.
                        투자 버튼은 본인의 판단입니다.
                    </small>
                </div>
            `;

            conversation.appendChild(
                assistantMessage
            );

            input.value = "";

            assistantMessage.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        }
    );
}


/* =========================================================
   10. 로컬 임시 답변 생성
========================================================= */

function createLocalChatAnswer(
    question,
    data,
    marketResult,
    goalResult,
    portfolioResult
) {
    const normalizedQuestion =
        question.replace(/\s/g, "");

    const firstHolding =
        data.holdings?.[0];

    if (
        normalizedQuestion.includes("목표") ||
        normalizedQuestion.includes("달성")
    ) {
        return {
            title:
                `달성률 ${goalResult.progressPercent.toFixed(1)}%`,

            text:
                `현재 목표까지 ${formatChatManWon(goalResult.remainingAmount)}이 남았고 월 필요 증가액은 ${formatChatManWon(goalResult.monthlyRequiredProfit)}입니다. 현재 전략은 ${goalResult.strategyType}입니다.`
        };
    }

    if (
        normalizedQuestion.includes("시장") ||
        normalizedQuestion.includes("오늘")
    ) {
        const opinion =
            getChatMarketOpinion(
                marketResult.totalScore
            );

        return {
            title:
                `${marketResult.totalScore}점 · ${opinion.status}`,

            text:
                opinion.text
        };
    }

    if (
        normalizedQuestion.includes("현금")
    ) {
        return {
            title:
                `현금 비중 ${portfolioResult.cashRatio.toFixed(1)}%`,

            text:
                `현재 현금은 ${formatChatWon(portfolioResult.cash)}이며, ${goalResult.strategyType} 전략의 권장 현금 비중은 ${goalResult.recommendedCashRatio}%입니다.`
        };
    }

    if (
        firstHolding &&
        normalizedQuestion.includes(
            firstHolding.name.replace(
                /\s/g,
                ""
            )
        )
    ) {
        return {
            title:
                firstHolding.status,

            text:
                `${firstHolding.name}의 종목점수는 ${firstHolding.score ?? "미정"}점이며, 현재 의견은 ${firstHolding.status}입니다. 시장점수 ${marketResult.totalScore}점도 함께 고려하세요.`
        };
    }

    return {
        title:
            "판단 보조",

        text:
            `현재 시장점수는 ${marketResult.totalScore}점이고 전략은 ${goalResult.strategyType}입니다. 질문한 종목의 수급·차트·뉴스를 함께 확인한 뒤 최종 판단하세요.`
    };
}


/* =========================================================
   11. Chat Engine 실행
========================================================= */

function runChatEngine() {
    try {
        if (!window.THPT_DATA) {
            throw new Error(
                "THPT_DATA가 연결되지 않았습니다."
            );
        }

        const goalResult =
            window.thptResult?.goal ??
            calculateGoalStrategy(
                window.THPT_DATA.goal
            );

        const marketResult =
            window.thptResult?.market ??
            calculateMarketScore(
                window.THPT_DATA.market
            );

        const portfolioResult =
            calculateChatPortfolio(
                window.THPT_DATA
            );

        renderChatHero(
            window.THPT_DATA,
            marketResult
        );

        renderStockAnswer(
            window.THPT_DATA,
            marketResult,
            goalResult
        );

        renderGoalAnswer(
            goalResult
        );

        renderChatContext(
            goalResult,
            marketResult,
            portfolioResult
        );

        setupQuickQuestions();

        setupChatForm(
            window.THPT_DATA,
            marketResult,
            goalResult,
            portfolioResult
        );

        window.thptChatResult = {
            goal: goalResult,
            market: marketResult,
            portfolio: portfolioResult
        };

        console.log(
            "THPT 채팅 결과:",
            window.thptChatResult
        );

    } catch (error) {
        console.error(
            "THPT 채팅 엔진 오류:",
            error
        );
    }
}


/* =========================================================
   12. HTML 로딩 완료 후 실행
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    runChatEngine
);