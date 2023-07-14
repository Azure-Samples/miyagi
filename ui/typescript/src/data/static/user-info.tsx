export const UserInfo = {
    "input": "How to allocate portfolio?",
    "userId": "5966",
    "userName": "govind-k.copilot-chat",
    "chatId": process.env.NEXT_PUBLIC_CHAT_ID,
    "firstName": "Govind",
    "lastName": "Kamtamneni",
    "age": 50,
    "riskLevel": "aggressive",
    "annualHouseholdIncome": 80000,
    "favoriteBook": "intelligent-investor",
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
    favoriteBook: string;
    favoriteAdvisor: string;
}
