/* ==========================================================
   THPT Investment Pro
   Home Screen
========================================================== */

const homeSection = document.getElementById("home");

homeSection.innerHTML = `
    <!-- 브랜드 영역 -->
    <div class="card">
        <p class="subtitle">Your AI Investment Partner</p>
        <h1 class="title">THPT Investment Pro</h1>

        <p class="subtitle">
            AI는 정보를 판단합니다.<br>
            투자 버튼은 본인의 판단입니다.
        </p>
    </div>


    <!-- 시장 점수 / 총 자산 -->
    <div class="row">

        <div class="card">
            <p class="subtitle">Market Score</p>
            <p class="score">54</p>
            <p>현금 유지</p>
        </div>

        <div class="card">
            <p class="subtitle">총 자산</p>
            <h2>8,334,614원</h2>
            <p class="subtitle">오늘 +0.00%</p>
        </div>

    </div>


    <!-- Daily Report -->
    <div class="card">
        <p class="subtitle">Daily Report</p>
        <h2>오늘은 신규 매수보다 현금 유지가 우선입니다.</h2>

        <button type="button">
            오늘 리포트 보기
        </button>
    </div>


    <!-- 투자 수익률 그래프 -->
    <div class="card">
        <p class="subtitle">투자 수익률</p>
        <h2>최근 자산 흐름</h2>

        <div>
            그래프 준비 중
        </div>
    </div>


    <!-- 목표 달성률 -->
    <div class="card">
        <p class="subtitle">목표 달성률</p>
        <h2>8.3%</h2>

        <p>
            목표금액 100,000,000원
        </p>

        <p class="subtitle">
            목표일까지 필요한 월 수익을 계산할 예정입니다.
        </p>
    </div>


    <!-- 주요 지수 / THPT 상담 -->
    <div class="row">

        <div class="card">
            <p class="subtitle">오늘 주요 지수</p>

            <p>S&P 500</p>
            <p>NASDAQ 100</p>
            <p>USD / KRW</p>
        </div>

        <div class="card">
            <p class="subtitle">THPT 상담</p>
            <h2>무엇이 궁금한가요?</h2>

            <button type="button">
                상담 시작
            </button>
        </div>

    </div>


    <!-- 현재 보유 종목 -->
    <div class="card">
        <p class="subtitle">현재 보유 종목</p>
        <h2>내 포트폴리오</h2>

        <div>
            <p>삼성전자 · 락업 유지</p>
            <p>미국 S&P500(H) · 적립 유지</p>
            <p>NAVER · 보유</p>
        </div>
    </div>


    <!-- 추천 종목 -->
    <div class="card">
        <p class="subtitle">추천 종목</p>
        <h2>오늘의 관심 대상</h2>

        <div>
            <p>NAVER · 분할매수 검토</p>
            <p>두산에너빌리티 · 대기</p>
            <p>HD현대일렉트릭 · 관망</p>
        </div>
    </div>


    <!-- THPT 한마디 -->
    <div class="card">
        <p class="subtitle">THPT 한마디</p>

        <h2>
            오늘은 기회를 억지로 만들기보다
            현금을 지키며 기다리는 날입니다.
        </h2>
    </div>
`;