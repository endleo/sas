import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { lcg, wallet } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { calculatePayout } from "$lib/roulette";
import { LCG_CONFIG } from "$lib/server/static/lcg-config";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/");
  }

  /* load lcg parameters for user*/
  let lcgData = await db
    .select()
    .from(lcg)
    .where(eq(lcg.userId, event.locals.user.id));

  /* if no lcg parameters exist for user, create default parameters; should never happen */
  if (lcgData.length === 0) {
    await db.insert(lcg).values({
      lastResult: Math.floor(Math.random() * (LCG_CONFIG.modulus - 2)),
      multiplier: LCG_CONFIG.multiplier,
      increment: LCG_CONFIG.increment,
      modulus: LCG_CONFIG.modulus,
      userId: event.locals.user.id,
    });
  }

  return { user: event.locals.user };
};

export const actions = {
  spin: async (event) => {
    const formData = await event.request.formData();

    // Get the bets array from form data
    const betsJson = formData.get("bets");
    const betsArray: { [key: string]: number }[] = betsJson
      ? JSON.parse(betsJson as string)
      : [];

    const bets: { [key: string]: number } = {};
    betsArray.forEach((b) => {
      const [key, value] = Object.entries(b)[0];
      bets[key] = (bets[key] || 0) + value;
    });

    const totalBetAmount = Object.values(bets).reduce((acc, amt) => acc + amt, 0);

    /* get user's balance */
    const walletData = await db
      .select()
      .from(wallet)
      .where(eq(wallet.userId, event.locals.user.id));

    /* make sure user has enough money */
    if (walletData[0].money < totalBetAmount) {
      return { error: "insufficient funds" };
    }

    let updatedBalance = walletData[0].money - totalBetAmount;

    /* load lcg data for user */
    const lcgData = await db
      .select()
      .from(lcg)
      .where(eq(lcg.userId, event.locals.user.id));

    /* calculate next lcg result and corresponding roulette roll */
    const xn =
      (lcgData[0].lastResult * lcgData[0].multiplier + lcgData[0].increment) %
      lcgData[0].modulus;

    const result = xn % 37;

    /* update lcg data for user */
    await db
      .update(lcg)
      .set({ lastResult: xn })
      .where(eq(lcg.userId, event.locals.user.id));

    /* calculate winnings from bets */
    const winnings = calculatePayout(result, bets);

    /* update user's balance */
    updatedBalance += winnings;

    await db
      .update(wallet)
      .set({ money: updatedBalance })
      .where(eq(wallet.userId, event.locals.user.id));

    return {
      success: true,
      resultNumber: result,
      totalWinnings: winnings,
      newBalance: updatedBalance,
    };
  },
} satisfies Actions;