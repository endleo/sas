import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import type { PageServerLoad } from "./$types";
import { auth } from "$lib/server/auth";
import { APIError } from "better-auth/api";
import { db } from "$lib/server/db";
import { lcg, wallet } from "$lib/server/db/schema";
import { LCG_CONFIG } from "$lib/server/static/lcg-config";

export const load: PageServerLoad = (event) => {
  if (event.locals.user) {
    return redirect(302, "/profile");
  }
  return {};
};

export const actions: Actions = {
  signUpEmail: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const name = formData.get("name")?.toString() ?? "";

    try {
      const signupResponse = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
      });
      await db.insert(lcg).values({
        lastResult: Math.floor(Math.random() * (LCG_CONFIG.modulus - 2)),
        multiplier: LCG_CONFIG.multiplier,
        increment: LCG_CONFIG.increment,
        modulus: LCG_CONFIG.modulus,
        userId: signupResponse.user.id,
      });
      await db.insert(wallet).values({
        money: 1000,
        userId: signupResponse.user.id,
      });
    } catch (error) {
      if (error instanceof APIError) {
        return fail(400, { message: error.message || "Registration failed" });
      }
      return fail(500, { message: "Unexpected error" });
    }

    return redirect(302, "/");
  },
};
