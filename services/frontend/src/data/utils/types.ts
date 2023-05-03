
// personalization service types
export interface MiyagiContext {
    userId: string;
    age?: number;
    riskLevel?: string;
    annualHouseholdIncome?: number;
    favoriteSubReddit?: string;
    favoriteAdvisor?: string;
    portfolio?: Portfolio[];
    stocks?: Stock[];
}

export interface Portfolio {
    name?: string;
    allocation?: number;
}

export interface Stock {
    symbol?: string;
    allocation?: number;
}

export interface AssetRecommendation {
    name: string;
    gptRecommendation: string;
}

export interface PortfolioRecommendations {
    portfolio: AssetRecommendation[];
}

export interface PersonalizeRequestData {
    input?: string;
    userId: string;
    firstName: string;
    lastName: string;
    age: number;
    riskLevel: string;
    annualHouseholdIncome: number;
    favoriteSubReddit: string;
    portfolio: string[];
}


export interface PersonalizeResponse {
    assets: {
        portfolio: AssetRecommendation[];
    };
    investments: {
        portfolio: InvestmentRecommendation[];
    };
}

export interface AssetRecommendation {
    name: string;
    gptRecommendation: string;
}

export interface InvestmentRecommendation {
    symbol: string;
    gptRecommendation: string;
}


// Semantic Kernel types
export interface IAsk {
    value: string;
    skills?: string[];
    inputs?: IAskInput[];
}

export interface IAskInput {
    key: string;
    value: string;
}

export interface IAskResult {
    value: string;
    state: IAskInput[];
}
