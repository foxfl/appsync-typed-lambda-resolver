import { PostConfirmationTriggerEvent } from "aws-lambda";

import { Logger } from "@aws-lambda-powertools/logger";
import middy from "@middy/core";
import { DynamoDB } from "aws-sdk";
import { DatabaseUserEntry } from "types/User";

const ddb = new DynamoDB.DocumentClient();

const logger = new Logger({ serviceName: "post-confirmation-trigger" });

export const handler = async (event: PostConfirmationTriggerEvent) => {
  logger.info("Received event", { event });
  if (event.triggerSource !== "PostConfirmation_ConfirmSignUp") {
    logger.info("Not a sign up event. Skipping");
    return event;
  }

  try {
    await createUser(event);
  } catch (error) {
    logger.error("Error creating new user", { error });
  }

  return {
    ...event,
  };
};

const createUser = async (event: PostConfirmationTriggerEvent) => {
  const user = readUserFromEvent(event);

  const names = user.name.split(" ");
  const firstName = names[0];
  const lastName = names.slice(1, names.length).join(" ");

  const dbUser: Partial<DatabaseUserEntry> = {
    id: user.id,
    email: user.email,
    firstName,
    lastName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const params = {
    TableName: process.env.TABLE_NAME!,
    ReturnValues: "ALL_OLD",
    Item: {
      ...dbUser,
      __typename: "User",
    },
    ConditionExpression: "attribute_not_exists(id)",
  };
  return ddb.put(params).promise();
};

const readUserFromEvent = (event: PostConfirmationTriggerEvent) => {
  const {
    request: {
      userAttributes: { sub, name, email },
    },
  } = event || {};
  return {
    id: sub,
    email,
    name,
  };
};

export const main = middy(handler);
