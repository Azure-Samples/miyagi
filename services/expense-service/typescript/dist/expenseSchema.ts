// The following is a schema definition for determining the categories of given expenses.

export type ExpenseCategory = 'Grocery' | 'Electronics' | 'Furniture' | 'Clothing' | 'Travel';

export interface ExpenseResponse {
    description: string;
    vendor: string;
    price: string;
    name: string;
    category: ExpenseCategory;
    justification: string;
}
