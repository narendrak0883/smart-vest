export interface StartDate {
    day: number;
    month: string;
    year: number;
}

export interface Stock {
    id: string;
    name: string;
    amount: number;
    price: number;
    quantity: number;
}

export interface Portfolio {
    cash: number;
    stocks: Stock[];
}

export interface PortfolioEvent {
    type: string; // Changed `any` to `string` for better type safety
    stock: string;
    quantity: number;
    price: number;
    total: number;
    botComment?: string;
}

export interface DailyPortfolio {
    cash: number;
    totalValue: number;
    percentChange: number;
    niftyChange: number;
}

export interface JourneyDay {
    date: string;
    dayNum: number;
    events: PortfolioEvent[];
    portfolio: DailyPortfolio;
}

export interface InvestmentState {
    // Journey configuration
    startDate: StartDate;
    selectedProduct: string;
    initialInvestment: number;
    selectedDays: number;
    rollsRemaining: number;
    destinationDate: string;
    journeyStarted: boolean;

    // Portfolio data
    startPortfolio: Portfolio;
    finalPortfolio: Portfolio;

    // Daily journey data
    journeyDays: JourneyDay[];
    currentDayIndex: number;
}
