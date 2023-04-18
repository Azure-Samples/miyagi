import { IAskInput } from './ask';

export interface IAskResult {
    value: string;
    state: IAskInput[];
}
