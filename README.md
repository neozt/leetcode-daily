# LeetCode Daily

Dynamically redirect users directly to LeetCode's Problem of the Day. Backend ExpressJS server deployed to AWS Lambda
using Serverless Framework.

Access the website here:

- https://leetcode-daily.neozt.dev/
- https://leetcode-daily.neozt.dev/about

## 🛠️ Stack

- ExpressJS
- Serverless Framework
- AWS Lambda
- DynamoDB

## 🚀 Getting Started

1. Run `serverless dev` to deploy to `dev` stage and proxy all Lambda calls to local machine.
2. Run `serverless remove` to remove once you are done to clean up resources.

## 💻 Deployment

- The site is deployed to AWS Lambda using Serverless Framework.
- CI/CD is configured using Github Actions to automatically deploy changes to AWS once the changes are merged into
  `master` branch.

## Stages

1. `prod` - Production deployment
2. `dev` - Default stage, for testing

## Acknowledgements

Code for calling LeetCode's GrapQL API taken
from [alfa-leetcode-api project](https://github.com/alfaarghya/alfa-leetcode-api).
