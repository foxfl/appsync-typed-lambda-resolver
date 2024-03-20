import { AuthorizationType } from "aws-cdk-lib/aws-appsync";
import { AppSyncApi, StackContext, use } from "sst/constructs";
import { Database } from "./DatabaseStack";

export function API({ stack }: StackContext) {
  const { table } = use(Database);

  // Create the GraphQL API
  const api = new AppSyncApi(stack, "GraphqlApi", {
    schema: "graphql/schema.graphql",

    cdk: {
      graphqlApi: {
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: AuthorizationType.API_KEY,
          },
        },
      },
    },

    dataSources: {
      resolverFn: {
        function: {
          bind: [table],
          handler: "packages/functions/graphql/lambda.main",
          environment: {
            TABLE_NAME: table.tableName,
          },
        },
      },
    },
    resolvers: {
      "Query user": "resolverFn",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    ApiKey: api.cdk.graphqlApi.apiKey,
  });
}
