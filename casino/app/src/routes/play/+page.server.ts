import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { lcg } from "$lib/server/db/schema";
import { user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/");
  }

  // Initialize LCG parameters for the new user
  // Randomize this eventually
  /*
	await db.insert(lcg).values({
		lastResult: 1,
		multiplier: 75,
		increment: 0,
		modulus: (2 ** 16)+1,
		
	});*/

  let lcgData = await db
    .select()
    .from(lcg)
    .where(eq(lcg.userId, event.locals.user.id));

  if (lcgData.length === 0) {
    await db.insert(lcg).values({
      lastResult: 1,
      multiplier: 75,
      increment: 0,
      modulus: 2 ** 16 + 1,
      userId: event.locals.user.id,
    });
  }

  lcgData = await db
    .select()
    .from(lcg)
    .where(eq(lcg.userId, event.locals.user.id));

  return { user: event.locals.user, lcg: lcgData[0] };
};

export const actions = {
  default: async (event) => {
    const lcgData = await db
      .select()
      .from(lcg)
      .where(eq(lcg.userId, event.locals.user.id));

    const xn =
      (lcgData[0].lastResult * lcgData[0].multiplier + lcgData[0].increment) %
      lcgData[0].modulus;

    await db
      .update(lcg)
      .set({ lastResult: xn })
      .where(eq(lcg.userId, event.locals.user.id));

    return { result: "success", value: xn };
  },
} satisfies Actions;
