export const UserInfo = {
    "input": "How to allocate portfolio?",
    "userId": "5966",
    "userName": "thegovind",
    "chatId": "52247c33-002b-4888-a560-de3f40cdd198",
    "firstName": "Govind",
    "lastName": "Kamtamneni",
    "age": 50,
    "riskLevel": "aggressive",
    "annualHouseholdIncome": 80000,
    "favoriteSubReddit": "wallstreetbets",
    "favoriteAdvisor": "Jim Cramer"
};

export interface UserInfoProps {
    input: string;
    userId: string;
    userName: string;
    chatId: string;
    firstName: string;
    lastName: string;
    age: number;
    riskLevel: string;
    annualHouseholdIncome: number;
    favoriteSubReddit: string;
    favoriteAdvisor: string;
}
