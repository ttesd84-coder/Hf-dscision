/* =========================================================
   THPT Investment Pro
   Shared Data + Local Storage v1.0
========================================================= */

const THPT_STORAGE_KEY = "thpt-investment-pro-data";


/* =========================================================
   1. 기본 데이터
========================================================= */

const THPT_DEFAULT_DATA = {
    user: {
        name: "태화",
        strategyType: "적극형"
    },

    goal: {
        currentAsset: 4000000,
        goalAmount: 10000000,
        monthsRemaining: 12
    },

    assets: {
        totalAsset: 8334614,
        investedAsset: 5574614,
        cash: 2760000
    },

    market: {
        usMarketScore: 35,
        trendScore: 25,
        kospiScore: 15,
        newsScore: 8
    },

    holdings: [
        {
            name: "NAVER",
            quantity: 3,
            averagePrice: 181000,
            currentPrice: 184600,
            score: 84,
            status: "분할매수 대기"
        },

        {
            name: "삼성전자",
            quantity: 25,
            averagePrice: 170000,
            currentPrice: 260500,
            score: null,
            status: "락업 유지"
        },

        {
            name: "미국 S&P500(H)",
            quantity: 21,
            averagePrice: 15934,
            currentPrice: 15934,
            score: null,
            status: "적립 유지"
        }
    ],

    watchlist: [
        {
            name: "NAVER",
            score: 84,
            status: "분할매수"
        },

        {
            name: "두산에너빌리티",
            score: 77,
            status: "대기"
        },

        {
            name: "HD현대일렉트릭",
            score: 72,
            status: "관망"
        }
    ]
};


/* =========================================================
   2. 데이터 복사
========================================================= */

function cloneThptData(data) {
    return JSON.parse(
        JSON.stringify(data)
    );
}


/* =========================================================
   3. 저장된 데이터 불러오기
========================================================= */

function loadThptData() {
    try {
        const savedData =
            localStorage.getItem(
                THPT_STORAGE_KEY
            );

        if (!savedData) {
            return cloneThptData(
                THPT_DEFAULT_DATA
            );
        }

        return JSON.parse(savedData);

    } catch (error) {
        console.error(
            "THPT 데이터 불러오기 오류:",
            error
        );

        return cloneThptData(
            THPT_DEFAULT_DATA
        );
    }
}


/* =========================================================
   4. 데이터 저장
========================================================= */

function saveThptData() {
    try {
        localStorage.setItem(
            THPT_STORAGE_KEY,
            JSON.stringify(
                window.THPT_DATA
            )
        );

        console.log(
            "THPT 데이터 저장 완료:",
            window.THPT_DATA
        );

        return true;

    } catch (error) {
        console.error(
            "THPT 데이터 저장 오류:",
            error
        );

        return false;
    }
}


/* =========================================================
   5. 데이터 초기화
========================================================= */

function resetThptData() {
    localStorage.removeItem(
        THPT_STORAGE_KEY
    );

    window.THPT_DATA =
        cloneThptData(
            THPT_DEFAULT_DATA
        );

    saveThptData();

    console.log(
        "THPT 데이터 초기화 완료"
    );

    location.reload();
}


/* =========================================================
   6. 특정 항목 변경
========================================================= */

function updateThptData(
    category,
    key,
    value
) {
    if (
        !window.THPT_DATA[category]
    ) {
        throw new Error(
            `존재하지 않는 데이터 영역입니다: ${category}`
        );
    }

    window.THPT_DATA[category][key] =
        value;

    saveThptData();

    return window.THPT_DATA;
}


/* =========================================================
   7. 전역 데이터 및 함수 등록
========================================================= */

window.THPT_DATA =
    loadThptData();

window.saveThptData =
    saveThptData;

window.resetThptData =
    resetThptData;

window.updateThptData =
    updateThptData;


/* =========================================================
   8. 실행 확인
========================================================= */

console.log(
    "THPT 공통 데이터 연결 성공:",
    window.THPT_DATA
);