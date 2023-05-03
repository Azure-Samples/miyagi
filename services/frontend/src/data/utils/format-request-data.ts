import {AssetsData} from "@/data/static/assetsData";
import {TopInvestmentsData} from "@/data/static/top-investments-data";
import {RequestAsset, RequestStock} from "@/data/utils/types";

export const formatRequestData = (assets: typeof AssetsData, investments: typeof TopInvestmentsData) => {
    const formattedAssets: RequestAsset[] = assets.map(asset => ({
        name: asset.name,
        allocation: parseFloat(asset.volume), // Parse volume as a float value
    }));

    const formattedInvestments: RequestStock[] = investments.map(investment => ({
        symbol: investment.stock.symbol,
        allocation: parseFloat(investment.price), // Parse price as a float value
    }));

    return { portfolio: formattedAssets, stocks: formattedInvestments };
};

