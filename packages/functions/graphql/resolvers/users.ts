import { logger } from "graphql/utils/logger";
import { getMyUser } from "../services/user";
import { Resolvers } from "../types/resolvers-types";

export const userResolvers: Resolvers = {
  Query: {
    user: async ({ arguments: { id } }) => {
      logger.info("Fetching user", { id });

      const user = await getMyUser({ userId: id });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    },
  },
};
