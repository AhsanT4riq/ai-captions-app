import { UserJSON } from '@clerk/backend';
import { v, Validator } from 'convex/values';

import { internalMutation, QueryCtx } from './_generated/server';

/**
 * Upserts a user in the database based on Clerk user data.
 * This internal mutation is triggered by Clerk webhooks when a user is created or updated.
 *
 * @param {Object} args - The arguments object
 * @param {UserJSON} args.data - The user data from Clerk
 * @returns {Promise<void>}
 */
export const upsertFromClerk = internalMutation({
  args: {
    data: v.any() as Validator<UserJSON>,
  },
  handler: async (ctx, { data }) => {
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses[0].email_address,
      externalId: data.id,
      imageUrl: data.image_url,
    };

    // Check if user already exists
    const user = await userByExternalId(ctx, userAttributes.externalId);

    if (user) {
      // Update existing user
      await ctx.db.patch(user._id, userAttributes);
    } else {
      // Create new user
      await ctx.db.insert('users', userAttributes);
    }
  },
});

/**
 * Deletes a user from the database when they are deleted in Clerk.
 * This internal mutation is triggered by Clerk webhooks when a user is deleted.
 *
 * @param {Object} args - The arguments object
 * @param {string} args.clerkUserId - The Clerk user ID to delete
 * @returns {Promise<void>}
 */
export const deleteFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await userByExternalId(ctx, clerkUserId);
    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

/**
 * Helper function to find a user by their external ID (Clerk user ID).
 *
 * @private
 * @param {QueryCtx} ctx - The query context
 * @param {string} externalId - The Clerk user ID to search for
 * @returns {Promise<Document | null>} The user document if found, null otherwise
 */
async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return ctx.db
    .query('users')
    .withIndex('byExternalId', (q) => q.eq('externalId', externalId))
    .unique();
}
