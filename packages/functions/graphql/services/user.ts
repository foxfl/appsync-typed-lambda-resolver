import { DatabaseUserEntry } from "types/User";
import { mapToUser } from "../mapper/user";

import { DynamoDB } from "aws-sdk";

const ddb = new DynamoDB.DocumentClient();

export const getUserBySub: (
  sub: string
) => Promise<DatabaseUserEntry | null> = async (sub) => {
  return await ddb
    .get({ TableName: process.env.TABLE_NAME!, Key: { id: sub } })
    .promise()
    .then(({ Item }) => (Item ? (Item as DatabaseUserEntry) : null));
};

export const getMyUser = async ({ userId }: { userId: string }) => {
  const user = await getUserBySub(userId);

  if (!user) {
    return null;
  }

  return mapToUser(user);
};
