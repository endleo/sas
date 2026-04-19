import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}
	return { user: event.locals.user };
};
