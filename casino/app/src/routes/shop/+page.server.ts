import { redirect } from "@sveltejs/kit";
import { wallet } from "$lib/server/db/schema";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/");
  }

  // check if user has purchased flag
  const walletData = await db
    .select()
    .from(wallet)
    .where(eq(wallet.userId, event.locals.user.id));

  return {
    user: event.locals.user,
    flag: walletData[0].hasFlag ? "gamblingisgood" : "",
  };
};

export const actions = {
  buy: async (event) => {
    /* get user's balance */
    const walletData = await db
      .select()
      .from(wallet)
      .where(eq(wallet.userId, event.locals.user.id));

    /* make sure user has enough money */
    if (walletData[0].money < 500000000) {
      return fail(400, { error: "insufficient funds" });
    }

    let updatedBalance = walletData[0].money - 500000000;

    /* update lcg data for user */
    await db
      .update(wallet)
      .set({ hasFlag: 1 })
      .where(eq(wallet.userId, event.locals.user.id));

    return {
      success: true,
    };
  },
} satisfies Actions;
