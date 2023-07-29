import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createLanguageModel, createJsonTranslator, processRequests } from 'typechat';
import { ExpenseResponse } from './expenseSchema';

// TODO: use local .env file.
dotenv.config({ path: path.join(__dirname, '../.env') });

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(path.join(__dirname, 'expenseSchema.ts'), 'utf8');
const translator = createJsonTranslator<ExpenseResponse>(model, schema, 'ExpenseResponse');

// Process requests interactively or from the input file specified on the command line
processRequests('💵> ', process.argv[2], async (request: any) => {
    const response = await translator.translate(request);
    if (!response.success) {
        console.log(response.message);
        return;
    }
    const expense = response.data;
    console.log(JSON.stringify(expense, undefined, 2));

    console.log('Success!');
});
