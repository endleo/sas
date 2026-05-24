import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { BOT_TOKEN } from "$lib/server/static/bot-token";
import { db } from "$lib/server/db";
import { lcg } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
  // TODO: This requires user to send bot token and his own better auth session cookie. THis is theoretically 
  // fine but might seem a little unintuitive for some users? Since technically we just stole the bot token?
  if (event.cookies.get("bot_token") !== BOT_TOKEN || !event.locals.user) {
    return redirect(302, "/");
  }

  /* load lcg parameters for user*/
  let lcgData = await db
    .select()
    .from(lcg)
    .where(eq(lcg.userId, event.locals.user.id));

  return { user: event.locals.user, multiplier: lcgData[0].multiplier, increment: lcgData[0].increment, modulus: lcgData[0].modulus }
}