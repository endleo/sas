import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { BOT_TOKEN } from "$lib/server/static/bot-token";

export const load: PageServerLoad = async (event) => {
  if (event.cookies.get("bot_token") !== BOT_TOKEN) {
    return redirect(302, "/");
  }
};
