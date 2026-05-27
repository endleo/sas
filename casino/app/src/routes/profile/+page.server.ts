import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import type { PageServerLoad } from "./$types";
import { auth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { wallet } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/");
  }

  const walletData = await db
    .select()
    .from(wallet)
    .where(eq(wallet.userId, event.locals.user.id));
  return { user: event.locals.user, balance: walletData[0].money };
};

export const actions: Actions = {
  signOut: async (event) => {
    await auth.api.signOut({
      headers: event.request.headers,
    });
    return redirect(302, "/");
  }
};
