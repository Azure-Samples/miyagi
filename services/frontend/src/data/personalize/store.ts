import { atom } from 'jotai';
import {TopInvestmentsData} from "@/data/static/top-investments-data";
import {advisors} from "@/data/static/personalize";

export const fetchedDataAtom = atom(TopInvestmentsData);

export const selectedAdvisorAtom = atom(advisors[0]);