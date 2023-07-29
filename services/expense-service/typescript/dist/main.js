"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const typechat_1 = require("typechat");
// TODO: use local .env file.
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const model = (0, typechat_1.createLanguageModel)(process.env);
const schema = fs_1.default.readFileSync(path_1.default.join(__dirname, 'expenseSchema.ts'), 'utf8');
const translator = (0, typechat_1.createJsonTranslator)(model, schema, 'ExpenseResponse');
// Process requests interactively or from the input file specified on the command line
(0, typechat_1.processRequests)('💵> ', process.argv[2], async (request) => {
    const response = await translator.translate(request);
    if (!response.success) {
        console.log(response.message);
        return;
    }
    const expense = response.data;
    console.log(JSON.stringify(expense, undefined, 2));
    console.log('Success!');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUN4QixvREFBNEI7QUFDNUIsdUNBQXNGO0FBR3RGLDZCQUE2QjtBQUM3QixnQkFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFekQsTUFBTSxLQUFLLEdBQUcsSUFBQSw4QkFBbUIsRUFBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0MsTUFBTSxNQUFNLEdBQUcsWUFBRSxDQUFDLFlBQVksQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pGLE1BQU0sVUFBVSxHQUFHLElBQUEsK0JBQW9CLEVBQWtCLEtBQUssRUFBRSxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUUzRixzRkFBc0Y7QUFDdEYsSUFBQSwwQkFBZSxFQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFZLEVBQUUsRUFBRTtJQUM1RCxNQUFNLFFBQVEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsT0FBTztLQUNWO0lBQ0QsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztJQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRW5ELE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUIsQ0FBQyxDQUFDLENBQUMifQ==