import { relations } from 'drizzle-orm/relations';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';

export const lcg = sqliteTable('lcg', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	lastResult: integer('last_result').notNull(),
	multiplier: integer('multiplier').notNull(),
	increment: integer('increment').notNull(),
	modulus: integer('modulus').notNull(),
	userId: text('user_id').notNull(),
});

export const lcgRelations = relations(lcg, ({ one }) => ({
  user: one(user, {
    fields: [lcg.userId],
    references: [user.id]
  })
}));

export const wallet = sqliteTable('wallet', {
	id: text('id').primaryKey().$defaultFn(()=> crypto.randomUUID()),
	money: integer('money').notNull(),
	hasFlag: integer('has_flag').notNull(),
	userId: text('user_id').notNull(),
});

export const walletRelation = relations(wallet, ({one}) => ({
	user: one(user, {
		fields: [wallet.userId],
		references: [user.id]
	})
})

)

export *  from './auth.schema';
