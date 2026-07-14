/* =========================================================
   THPT Investment Pro
   Holdings Manager v1.0
========================================================= */

const holdingsElements = {
    editingIndex:
        document.getElementById(
            "editing-index"
        ),

    formTitle:
        document.getElementById(
            "form-title"
        ),

    name:
        document.getElementById(
            "holding-name"
        ),

    quantity:
        document.getElementById(
            "holding-quantity"
        ),

    averagePrice:
        document.getElementById(
            "holding-average-price"
        ),

    currentPrice:
        document.getElementById(
            "holding-current-price"
        ),

    score:
        document.getElementById(
            "holding-score"
        ),

    status:
        document.getElementById(
            "holding-status"
        ),

    previewEvaluation:
        document.getElementById(
            "preview-evaluation"
        ),

    previewProfit:
        document.getElementById(
            "preview-profit"
        ),

    saveButton:
        document.getElementById(
            "save-holding"
        ),

    cancelButton:
        document.getElementById(
            "cancel-edit"
        ),

    message:
        document.getElementById(
            "holding-message"
        ),

    list:
        document.getElementById(
            "holdings-list"
        ),

    count:
    document.getElementById(
        "holding-count"
    ),

assetTotal:
    document.getElementById(
        "asset-total"
    ),

assetCash:
    document.getElementById(
        "asset-cash"
    ),

assetInvested:
    document.getElementById(
        "asset-invested"
    ),

assetCashRatio:
    document.getElementById(
        "asset-cash-ratio"
    ),

cashInput:
    document.getElementById(
        "asset-cash-input"
    ),

saveCashButton:
    document.getElementById(
        "save-cash"
    ),

cashMessage:
   
    document.getElementById(
        "cash-message"
    ),

portfolioTotalProfit:
    document.getElementById(
        "portfolio-total-profit"
    ),

portfolioTotalProfitRate:
    document.getElementById(
        "portfolio-total-profit-rate"
    ),

portfolioBestHolding:
    document.getElementById(
        "portfolio-best-holding"
    ),

portfolioWorstHolding:
    document.getElementById(
        "portfolio-worst-holding"
    ),

portfolioHoldingCount:
    document.getElementById(
        "portfolio-holding-count"
    ),

portfolioTotalQuantity:
    document.getElementById(
        "portfolio-total-quantity"
    ),

portfolioAverageScore:
    document.getElementById(
        "portfolio-average-score"
    )
};


function formatHoldingWon(amount) {
    return `${Math.round(amount).toLocaleString("ko-KR")}원`;
}


function formatHoldingPercent(value) {
    const sign =
        value > 0
            ? "+"
            : "";

    return `${sign}${value.toFixed(2)}%`;
}


function getHoldingFormData() {
    const scoreValue =
        holdingsElements.score.value.trim();

    return {
        name:
            holdingsElements.name.value.trim(),

        quantity:
            Number(
                holdingsElements.quantity.value
            ),

        averagePrice:
            Number(
                holdingsElements.averagePrice.value
            ),

        currentPrice:
            Number(
                holdingsElements.currentPrice.value
            ),

        score:
            scoreValue === ""
                ? null
                : Number(scoreValue),

        status:
            holdingsElements.status.value
    };
}


function validateHolding(data) {
    if (!data.name) {
        throw new Error(
            "종목명을 입력하세요."
        );
    }

    if (
        !Number.isFinite(data.quantity) ||
        data.quantity <= 0
    ) {
        throw new Error(
            "보유 수량을 확인하세요."
        );
    }

    if (
        !Number.isFinite(data.averagePrice) ||
        data.averagePrice < 0
    ) {
        throw new Error(
            "평균 매수가를 확인하세요."
        );
    }

    if (
        !Number.isFinite(data.currentPrice) ||
        data.currentPrice < 0
    ) {
        throw new Error(
            "현재가를 확인하세요."
        );
    }

    if (
        data.score !== null &&
        (
            !Number.isFinite(data.score) ||
            data.score < 0 ||
            data.score > 100
        )
    ) {
        throw new Error(
            "종목 점수는 0~100 사이입니다."
        );
    }
}


function calculateHoldingPreview(data) {
    const purchaseAmount =
        data.quantity *
        data.averagePrice;

    const evaluationAmount =
        data.quantity *
        data.currentPrice;

    const profitRate =
        purchaseAmount > 0
            ? (
                (
                    evaluationAmount -
                    purchaseAmount
                ) /
                purchaseAmount
            ) * 100
            : 0;

    return {
        purchaseAmount,
        evaluationAmount,
        profitRate
    };
}


function updateHoldingPreview() {
    const data =
        getHoldingFormData();

    const result =
        calculateHoldingPreview(data);

    holdingsElements
        .previewEvaluation
        .textContent =
            formatHoldingWon(
                result.evaluationAmount
            );

    holdingsElements
        .previewProfit
        .textContent =
            formatHoldingPercent(
                result.profitRate
            );

    holdingsElements
        .previewProfit
        .style.color =
            result.profitRate >= 0
                ? "var(--green-dark)"
                : "var(--red)";
}


function clearHoldingForm() {
    holdingsElements.editingIndex.value =
        "";

    holdingsElements.formTitle.textContent =
        "새 종목 추가";

    holdingsElements.name.value =
        "";

    holdingsElements.quantity.value =
        "";

    holdingsElements.averagePrice.value =
        "";

    holdingsElements.currentPrice.value =
        "";

    holdingsElements.score.value =
        "";

    holdingsElements.status.value =
        "보유 유지";

    holdingsElements.cancelButton.hidden =
        true;

    holdingsElements.saveButton.textContent =
        "종목 저장";

    holdingsElements.message.textContent =
        "";

    updateHoldingPreview();
}


function saveHolding() {
    try {
        const holding =
            getHoldingFormData();

        validateHolding(holding);

        const indexValue =
            holdingsElements
                .editingIndex
                .value;

        if (indexValue === "") {
            window.THPT_DATA
                .holdings
                .push(holding);

            holdingsElements.message.textContent =
                "종목이 추가되었습니다.";
        } else {
            const index =
                Number(indexValue);

            window.THPT_DATA
                .holdings[index] =
                    holding;

            holdingsElements.message.textContent =
                "종목 정보가 수정되었습니다.";
        }

        window.saveThptData();
        runCoreEngine();

renderHoldingsManager();
renderAssetSummary();
renderPortfolioPerformance();
renderPortfolioStats();

setTimeout(() => {
    clearHoldingForm();
}, 600);

    } catch (error) {
        holdingsElements.message.textContent =
            error.message;
    }
}


function editHolding(index) {
    const holding =
        window.THPT_DATA
            .holdings[index];

    if (!holding) {
        return;
    }

    holdingsElements.editingIndex.value =
        index;

    holdingsElements.formTitle.textContent =
        "보유 종목 수정";

    holdingsElements.name.value =
        holding.name;

    holdingsElements.quantity.value =
        holding.quantity;

    holdingsElements.averagePrice.value =
        holding.averagePrice;

    holdingsElements.currentPrice.value =
        holding.currentPrice;

    holdingsElements.score.value =
        holding.score ?? "";

    holdingsElements.status.value =
        holding.status;

    holdingsElements.cancelButton.hidden =
        false;

    holdingsElements.saveButton.textContent =
        "수정 내용 저장";

    holdingsElements.message.textContent =
        `${holding.name} 수정 중`;

    updateHoldingPreview();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function deleteHolding(index) {
    const holding =
        window.THPT_DATA
            .holdings[index];

    if (!holding) {
        return;
    }

    const confirmed =
        confirm(
            `${holding.name}을 보유 종목에서 삭제할까요?`
        );

    if (!confirmed) {
        return;
    }

    window.THPT_DATA
        .holdings
        .splice(index, 1);

    window.saveThptData();

    runCoreEngine();

renderHoldingsManager();
renderAssetSummary();
renderPortfolioStats();
renderPortfolioPerformance();

clearHoldingForm();
}


function createManagerItem(
    holding,
    index
) {
    const preview = holding;

    const scoreText =
        holding.score ?? "-";

    return `
        <article class="manager-item">

            <div class="manager-item-top">

                <div class="manager-logo">
                    ${holding.name
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div class="manager-info">

                    <strong>
                        ${holding.name}
                    </strong>

                    <span>
                        ${holding.quantity}주 ·
                        평단 ${formatHoldingWon(
                            holding.averagePrice
                        )}
                    </span>

                </div>

                <div class="manager-result">

                    <strong>
                        ${scoreText}점
                    </strong>

                    <span>
                        ${holding.status}
                    </span>

                </div>

            </div>


            <div class="manager-numbers">

                <div>
    <span>현재가</span>

    <strong>
        ${formatHoldingWon(
            holding.currentPrice
        )}
    </strong>
</div>

<div>
    <span>평가금액</span>

    <strong>
        ${formatHoldingWon(
            preview.evaluationAmount
        )}
    </strong>
</div>


<div>
    <span>평가손익</span>

    <strong class="${
        preview.profit >= 0
            ? "up"
            : "down"
    }">

        ${
            preview.profit >= 0
                ? "+"
                : ""
        }${formatHoldingWon(
            preview.profit
        )}

    </strong>
</div>

                <div>
                    <span>수익률</span>

                    <strong>
                        ${formatHoldingPercent(
                            preview.profitRate
                        )}
                    </strong>
                </div>

            </div>


            <div class="manager-actions">

                <button
                    class="edit-holding-button"
                    type="button"
                    data-edit-index="${index}"
                >
                    수정
                </button>

                <button
                    class="delete-holding-button"
                    type="button"
                    data-delete-index="${index}"
                >
                    삭제
                </button>

            </div>

        </article>
    `;
}


function renderHoldingsManager() {

    const holdings =
        window.THPT_ENGINE.portfolio.holdings;

    holdingsElements.count.textContent =
        `${holdings.length}개`;

    if (holdings.length === 0) {
        holdingsElements.list.innerHTML = `
            <div class="empty-holdings">
                등록된 보유 종목이 없습니다.
            </div>
        `;

        return;
    }

    holdingsElements.list.innerHTML =
        holdings
            .map(createManagerItem)
            .join("");
}


function setupManagerEvents() {
    [
        holdingsElements.quantity,
        holdingsElements.averagePrice,
        holdingsElements.currentPrice
    ].forEach((element) => {
        element.addEventListener(
            "input",
            updateHoldingPreview
        );
    });


    holdingsElements.saveButton.addEventListener(
        "click",
        saveHolding
    );


    holdingsElements.cancelButton.addEventListener(
        "click",
        clearHoldingForm
    );


    holdingsElements.list.addEventListener(
        "click",
        (event) => {
            const editButton =
                event.target.closest(
                    "[data-edit-index]"
                );

            const deleteButton =
                event.target.closest(
                    "[data-delete-index]"
                );

            if (editButton) {
                editHolding(
                    Number(
                        editButton.dataset
                            .editIndex
                    )
                );

                return;
            }

            if (deleteButton) {
                deleteHolding(
                    Number(
                        deleteButton.dataset
                            .deleteIndex
                    )
                );
            }
        }
    );
}




function renderPortfolioPerformance() {
    const portfolio =
        window.THPT_ENGINE.portfolio;

    const profitClass =
        portfolio.totalProfit >= 0
            ? "up"
            : "down";

    holdingsElements
        .portfolioTotalProfit
        .className =
            profitClass;

    holdingsElements
        .portfolioTotalProfit
        .textContent =
            `${
                portfolio.totalProfit > 0
                    ? "+"
                    : ""
            }${formatHoldingWon(
                portfolio.totalProfit
            )}`;

    holdingsElements
        .portfolioTotalProfitRate
        .className =
            profitClass;

    holdingsElements
        .portfolioTotalProfitRate
        .textContent =
            formatHoldingPercent(
                portfolio.totalProfitRate
            );

    holdingsElements
        .portfolioBestHolding
        .textContent =
            portfolio.bestHolding
                ? `${portfolio.bestHolding.name} · ${formatHoldingPercent(
                    portfolio.bestHolding.profitRate
                )}`
                : "-";

    holdingsElements
        .portfolioWorstHolding
        .textContent =
            portfolio.worstHolding
                ? `${portfolio.worstHolding.name} · ${formatHoldingPercent(
                    portfolio.worstHolding.profitRate
                )}`
                : "-";
}

function renderPortfolioStats() {
    const portfolio =
        window.THPT_ENGINE.portfolio;

    holdingsElements
        .portfolioHoldingCount
        .textContent =
            `${portfolio.count}개`;

    holdingsElements
        .portfolioTotalQuantity
        .textContent =
            `${portfolio.totalQuantity}주`;

    holdingsElements
        .portfolioAverageScore
        .textContent =
            `${portfolio.averageScore}점`;
}


function renderAssetSummary() {

    const result =
        window.THPT_ENGINE.asset;

    holdingsElements.assetTotal.textContent =
        formatHoldingWon(
            result.totalAsset
        );

    holdingsElements.assetCash.textContent =
        formatHoldingWon(
            result.cash
        );

    holdingsElements.assetInvested.textContent =
        formatHoldingWon(
            result.investedAsset
        );

    holdingsElements.assetCashRatio.textContent =
        `${result.cashRatio.toFixed(1)}%`;

    holdingsElements.cashInput.value =
        result.cash;

    window.THPT_DATA.assets.totalAsset =
        result.totalAsset;

    window.THPT_DATA.assets.investedAsset =
        result.investedAsset;
}



function saveCashAmount() {
    const cash =
        Number(holdingsElements.cashInput.value);

    if (!Number.isFinite(cash) || cash < 0) {
        holdingsElements.cashMessage.textContent =
            "현금 금액을 확인하세요.";

        return;
    }

    window.THPT_DATA.assets.cash =
    cash;


window.saveThptData();

runCoreEngine();

renderAssetSummary();
renderPortfolioPerformance();
renderPortfolioStats();
renderHoldingsManager();

    holdingsElements.cashMessage.textContent =
        "보유 현금이 저장되었습니다.";
}


document.addEventListener(
    "DOMContentLoaded",
    () => {
        runCoreEngine();

        renderAssetSummary();
        renderPortfolioPerformance();
        renderPortfolioStats();
        renderHoldingsManager();
        setupManagerEvents();
        updateHoldingPreview();

        holdingsElements.saveCashButton.addEventListener(
            "click",
            saveCashAmount
        );
    }
);

