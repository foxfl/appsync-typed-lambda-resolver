import { mergeResolvers } from "@graphql-tools/merge";
import middy from "@middy/core";

import { AppSyncResolverEvent, Context } from "aws-lambda";
import { userResolvers } from "./resolvers/users";
import { ResolverFn, Resolvers } from "./types/resolvers-types";
import { logger } from "./utils/logger";

export { Context }; // This can be enhanced by wrapping the type

const resolvers = mergeResolvers([userResolvers]);

export const handler = async (
  event: AppSyncResolverEvent<unknown, unknown>,
  context: Context
) => {
  const { fieldName, parentTypeName } = event.info;

  logger.debug("Received event", { event });

  try {
    const typeHandler = resolvers[parentTypeName as keyof Resolvers];

    if (fieldName in typeHandler) {
      // we do not know of which type the field here, as the type is dynamic based on the requested query/mutation
      const resolver: ResolverFn<unknown, unknown, Context, unknown> =
        typeHandler[fieldName as keyof typeof typeHandler];
      if (resolver) {
        return await resolver(event, context);
      }
    }
    throw new Error(`Resolver not found for ${fieldName}, ${parentTypeName}`);
  } catch (e) {
    const error = e as Error;
    logger.error("Error happened", { error });
    throw error;
  }
};

export const main = middy(handler);
