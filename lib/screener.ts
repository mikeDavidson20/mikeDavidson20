type Signal = "Buy" | "Sell";

type PriceEstimates = {
  daily: number;
  weekly: number;
  monthly: number;
};

type BaseInstrument = {
  symbol: string;
  name: string;
  kind: "Stock" | "Option";
  price: number;
  momentum: number;
  volatility: number;
  synopsis: string;
  latestNews: string[];
  optionsIdeas: {
    contract: string;
    signal: Signal;
    rationale: string;
  }[];
};

const instruments: BaseInstrument[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    kind: "Stock",
    price: 193.42,
    momentum: 0.71,
    volatility: 0.24,
    synopsis:
      "Apple designs consumer devices and software platforms and is expanding services revenue while investing in on-device AI features.",
    latestNews: [
      "Apple supplier checks signal steady premium iPhone demand.",
      "Services segment keeps producing high-margin recurring revenue.",
      "Investors watch AI feature rollout cycle for upgrade momentum."
    ],
    optionsIdeas: [
      {
        contract: "AAPL 200C (45 DTE)",
        signal: "Buy",
        rationale: "Positive trend and moderate volatility support upside calls."
      }
    ]
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    kind: "Stock",
    price: 171.18,
    momentum: 0.33,
    volatility: 0.59,
    synopsis:
      "Tesla manufactures EVs, battery systems, and autonomy software, with margins sensitive to pricing and production efficiency.",
    latestNews: [
      "Analysts debate margin impact of recent EV price strategy.",
      "Energy storage deployments remain a key growth driver.",
      "Autonomy software milestones continue to influence sentiment."
    ],
    optionsIdeas: [
      {
        contract: "TSLA 165P (30 DTE)",
        signal: "Buy",
        rationale: "High volatility and weaker momentum favor protective puts."
      }
    ]
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    kind: "Stock",
    price: 921.34,
    momentum: 0.84,
    volatility: 0.42,
    synopsis:
      "NVIDIA builds GPUs and accelerated compute systems powering AI training and inference across cloud and enterprise workloads.",
    latestNews: [
      "Data center demand outlook stays strong for AI infrastructure.",
      "New enterprise partnerships expand software ecosystem stickiness.",
      "Supply chain checks show improving lead-time balance."
    ],
    optionsIdeas: [
      {
        contract: "NVDA 980C (60 DTE)",
        signal: "Buy",
        rationale: "Strong momentum with manageable volatility supports bullish calls."
      }
    ]
  },
  {
    symbol: "SPY 520C",
    name: "SPDR S&P 500 ETF Call",
    kind: "Option",
    price: 8.2,
    momentum: 0.58,
    volatility: 0.37,
    synopsis:
      "SPY call options provide leveraged exposure to broad U.S. large-cap performance and risk appetite shifts.",
    latestNews: [
      "Index breadth has improved across cyclical sectors.",
      "Rate expectations continue to drive intraday ETF option flow.",
      "Macro data surprise indexes remain mixed week-to-week."
    ],
    optionsIdeas: []
  }
];

export const marketNews = [
  {
    title: "Treasury yields stabilize as inflation data cools modestly",
    source: "Market Desk",
    date: "April 25, 2026",
    summary:
      "Bond markets are pricing a slower pace of policy tightening, supporting growth stocks while keeping defensives in rotation."
  },
  {
    title: "Mega-cap earnings set tone for risk sentiment next week",
    source: "Street View",
    date: "April 25, 2026",
    summary:
      "Options markets imply elevated post-earnings movement for technology names and broader index ETFs."
  },
  {
    title: "Energy and industrials lead recent sector momentum",
    source: "Daily Tape",
    date: "April 24, 2026",
    summary:
      "Cyclical sectors are outperforming as commodity trends and capital spending expectations firm up."
  }
];

const buildSignal = (momentum: number, volatility: number): Signal =>
  momentum - volatility * 0.4 > 0.45 ? "Buy" : "Sell";

const buildConfidence = (momentum: number, volatility: number): number =>
  Math.min(95, Math.max(52, Math.round((momentum * 70 + (1 - volatility) * 30) * 100) / 100));

const estimatePrice = (price: number, momentum: number, volatility: number): PriceEstimates => ({
  daily: price * (1 + (momentum - volatility * 0.2) * 0.008),
  weekly: price * (1 + (momentum - volatility * 0.2) * 0.025),
  monthly: price * (1 + (momentum - volatility * 0.2) * 0.08)
});

export function getScreenerRows() {
  return instruments.map((instrument) => {
    const signal = buildSignal(instrument.momentum, instrument.volatility);

    return {
      symbol: instrument.symbol,
      kind: instrument.kind,
      signal,
      confidence: buildConfidence(instrument.momentum, instrument.volatility),
      estimates: estimatePrice(instrument.price, instrument.momentum, instrument.volatility)
    };
  });
}

export function getStockDetails(symbol: string) {
  const found = instruments.find((instrument) => instrument.symbol.toLowerCase() === symbol.toLowerCase());

  if (!found) {
    return null;
  }

  const signal = buildSignal(found.momentum, found.volatility);
  return {
    ...found,
    signal,
    confidence: buildConfidence(found.momentum, found.volatility),
    estimates: estimatePrice(found.price, found.momentum, found.volatility)
  };
}

export function getMarketHeadlineSummary() {
  const buySignals = getScreenerRows().filter((row) => row.signal === "Buy").length;
  return `Mike's Screener currently flags ${buySignals} buy setups, with higher conviction in names showing steady momentum and contained volatility.`;
}
