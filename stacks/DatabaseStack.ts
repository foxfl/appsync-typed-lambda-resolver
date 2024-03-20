import { BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { StackContext, Table } from "sst/constructs";

export function Database({ stack }: StackContext) {
  const table = new Table(stack, "Database", {
    fields: {
      id: "string",

    },
    primaryIndex: { partitionKey: "id" },
    cdk: {
      table: {
        billingMode: BillingMode.PAY_PER_REQUEST,
      },
    },
  });

  return { table };
}
