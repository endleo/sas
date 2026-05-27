import type { LayoutServerLoad } from './$types';
import { db } from "$lib/server/db";
import { wallet } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { BOT_TOKEN } from "$lib/server/static/bot-token";


export const load: LayoutServerLoad = async (event) => {
/*	if (!event.locals.user) {
		return redirect(302, '/login');
	}*/
	const balance = event.locals.user ? await db
		.select()
		.from(wallet)
		.where(eq(wallet.userId, event.locals.user.id)) : [{money: 0}];

	return { user: event.locals.user, balance: balance[0].money, admin: event.cookies.get("bot_token") == BOT_TOKEN ? true : false };
};