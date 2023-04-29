
// personalization service types
export interface PersonalizeRequestData {
    input: string;
    userId: string;
    firstName: string;
    lastName: string;
    age: number;
    riskLevel: string;
    favoriteSubReddit: string;
    portfolio: string[];
}


export interface PersonalizeResponse {
    recommendation: string;
    prompt: string;
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
