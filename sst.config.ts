import { SSTConfig } from "sst";
import { API } from "./stacks/ApiStack";
import { Database } from "./stacks/DatabaseStack";

export default {
  config(_input) {
    return {
      name: "appsync-typed-lambda-resolver",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Database, {});

    app.stack(API, {});
  },
} satisfies SSTConfig;
