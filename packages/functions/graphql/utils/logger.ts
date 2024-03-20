import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({ serviceName: "graphql-lambda-resolver" });

export { logger };
