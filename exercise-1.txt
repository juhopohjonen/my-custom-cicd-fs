My hypothetical application is a TypeScript microservice REST API built with Express framework: a store item management system which keeps track of products in a warehouse. I would also develop a simple front end for sale statistics with Angular.

For this application, I would choose Eslint for linting, Jest for testing. I would also configure an end-to-end testing framework to make sure the whole application is working well.

I would build the application with the TypeScript transpiler and deploy it to Google Cloud Platforms in a Docker container. This should also be included into the CI/CD pipeline.

Alternative to Jenkins could be Bamboo CI and alternative to GitHub Actions could be Jetbrain's TeamCity. GitLab also seems to have a CI/CD platform. Google Cloud offers a Cloud Build serverless CI/CD platform as a service, too. Using Google's CI/CD might be a good choice if I would deploy the application to Google Cloud Run.

It could be financially better option to use a CI/CD as a cloud platform. Buying new hardware for CI/CD process can be very expensive but sometimes mandatory. This kind of application doesn't probably use much hardware resources so GitHub actions can be a suitable choice. Sometimes using a local CI/CD setup can also be more safe because you don't have to share the secrets with any cloud platform. If the application would use a lot of hardware capacity, it could be more conventional to use a local CI/CD setup.
