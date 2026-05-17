import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { lcg, wallet } from "$lib/server/db/schema";
import { user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { calculatePayout, bets as possibleBets } from "$lib/roulette";

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
      lastResult: Math.floor(Math.random() * 2 ** 16 - 1),
      multiplier: 75,
      increment: 0,
      modulus: 2 ** 16 + 1,
      userId: event.locals.user.id,
    });
  }

  return { user: event.locals.user };
};

export const actions = {
  default: async (event) => {
    const formData = await event.request.formData();

    const bets: { [key: string]: number } = {};

    Object.keys(possibleBets).forEach((bet) => {
      bets[bet] = +(formData.get(bet) || 0);
    });

    const totalBetAmount = Object.values(bets).reduce(
      (acc, elem) => acc + elem,
    );

    /* get user's balance */
    const walletData = await db
      .select()
      .from(wallet)
      .where(eq(wallet.userId, event.locals.user.id));

    /* make sure user has enough money */
    if (walletData[0].money < totalBetAmount) {
      return { result: "insufficient funds" };
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

    return { result: "success", value: result, bets: bets, winnings: winnings };
  },
} satisfies Actions;