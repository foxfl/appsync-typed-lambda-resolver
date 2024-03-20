This is a example repository build with SST to showcases the type generation and usage of the resolver function to make the AppSync Lambda resolver type safe.

The project uses pnpm as package manager. To install all packages run `pnpm i` in the root of the project. 

### Deployment

First you need to deploy the app. You can just run `pnpm start` which invokes the script that executes the following commands:

- `sst dev --region=us-east-1` -> deploy the example application to the `us-east-1` region in live dev mode
- `graphql-codegen --watch` -> which automatically updates the generated typescript types if you change your schema

Once the app is deployed, you can login to the AWS Console and navigate to the [newly created Table](https://us-east-1.console.aws.amazon.com/dynamodbv2/home?region=us-east-1#item-explorer?operation=QUERY&table=dev-appsync-typed-lambda-resolver-Database). Insert a new user as following:

```json
{
  "id": "123113",
  "email": "tester@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": 1710963119953,
  "updatedAt": 1710963119953
}
```

Now, head over to the [AppSync Console](https://us-east-1.console.aws.amazon.com/appsync/home?region=us-east-1#/apis). Select your API and navigate to queries on the left sidebar.
Enter the following query in the GQL Playground and execute:

```gql
query User {
  user(id: "123113") {
    firstName
    id
    lastName
  }
}
```

You should see the following result:

```json
{
  "data": {
    "user": {
      "firstName": "John",
      "id": "123113",
      "lastName": "Doe"
    }
  }
}
```

An that's it. You can now add new types to your GQL Schema, and everything gets auto generated 🙌
