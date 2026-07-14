export default async function handler(req, res) {
  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "TWELVE_DATA_API_KEY 환경변수가 없습니다."
    });
  }

  const symbols = {
    SPY: "SPY",
    QQQ: "QQQ",
    USDKRW: "USD/KRW"
  };

  try {
    const entries = await Promise.all(
      Object.entries(symbols).map(async ([key, symbol]) => {
        const url = new URL("https://api.twelvedata.com/quote");
        url.searchParams.set("symbol", symbol);
        url.searchParams.set("apikey", apiKey);

        const response = await fetch(url.toString(), {
          headers: {
            Accept: "application/json"
          }
        });

        const data = await response.json();

        if (!response.ok || data.status === "error") {
          throw new Error(
            `${symbol}: ${data.message || "조회 실패"}`
          );
        }

        const price = Number(data.close ?? data.price);
        const changePercent = Number(data.percent_change);

        return [
          key,
          {
            symbol,
            price: Number.isFinite(price) ? price : null,
            changePercent: Number.isFinite(changePercent)
              ? changePercent
              : null,
            datetime: data.datetime ?? null
          }
        ];
      })
    );

    const assets = Object.fromEntries(entries);

    const spy = assets.SPY.changePercent ?? 0;
    const qqq = assets.QQQ.changePercent ?? 0;
    const usdkrw = assets.USDKRW.changePercent ?? 0;

    const rawScore =
      65 +
      spy * 4 +
      qqq * 5 -
      usdkrw * 2;

    const marketScore = Math.max(
      35,
      Math.min(90, Math.round(rawScore))
    );

    return res.status(200).json({
      marketScore,
      assets,
      updatedAt: new Date().toISOString(),
      methodology: "65 + SPY×4 + QQQ×5 - USDKRW×2"
    });
  } catch (error) {
    return res.status(502).json({
      error:
        error instanceof Error
          ? error.message
          : "시장 데이터 조회 실패"
    });
  }
}
