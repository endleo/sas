import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { BOT_TOKEN } from "$lib/server/static/bot-token";
import { LCG_CONFIG } from "$lib/server/static/lcg-config";

export const load: PageServerLoad = async (event) => {
  if (event.cookies.get("bot_token") !== BOT_TOKEN) {
    return redirect(302, "/");
  }

  return { 
    modulus: LCG_CONFIG.modulus 
  };
};