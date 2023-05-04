import { atom } from 'jotai';
import {TopInvestmentsData} from "@/data/static/top-investments-data";
import {AdvisorsList, RiskLevelsList, SubredditsList} from "@/data/static/personalize";
import {UserInfo} from "@/data/static/user-info";
import {AssetsData} from "@/data/static/assetsData";
import {Chats} from "@/data/static/chats";

export const userInfoAtom = atom(UserInfo);

export const investmentsDataAtom = atom(TopInvestmentsData);

export const assetsDataAtom = atom(AssetsData);

const getRandomIndex = (arrayLength: number) => Math.floor(Math.random() * arrayLength);

export const selectedAdvisorAtom = atom(AdvisorsList[getRandomIndex(AdvisorsList.length)]);

export const selectedSubRedditAtom = atom(SubredditsList[getRandomIndex(SubredditsList.length)]);

export const selectedRiskLevelAtom = atom(RiskLevelsList[getRandomIndex(RiskLevelsList.length)]);

export const chatsAtom = atom(Chats);


