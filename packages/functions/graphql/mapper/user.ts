import { DatabaseUserEntry } from "types/User";
import { User } from "graphql/types/resolvers-types";

export const mapToUser: (data: DatabaseUserEntry) => Partial<User> = (data) => {
  return {
    __typename: "User",
    firstName: data.firstName,
    email: data.email,
    id: data.id,
    lastName: data.lastName,
  };
};
