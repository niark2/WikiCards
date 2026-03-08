export type RedeemReward = {
    type: 'coins' | 'card';
    value: number | string; // amount of coins or Wikipedia article title/URL
    successMessage?: string; // custom message shown on success
};

export const REDEEM_CODES: Record<string, RedeemReward> = {
    "supermotherlode777": {
        type: 'coins',
        value: 1000,
        successMessage: "SUCCESS! +1000 WikiCoins added to your balance."
    },
    "rickman": {
        type: 'card',
        value: "https://en.wikipedia.org/wiki/Never_Gonna_Give_You_Up",
        successMessage: "You've been Rickrolled! Here's your legendary card."
    }
};
