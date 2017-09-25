# Question Editor

## Goal

This is the admin part of the [question-queue](https://github.com/SheCanCodeHQ/question-queue) project.

It lets admins edit questions that will then be used by the question queue.

Future: Show reports on answers selected by users, export questions to different formats..

## Install

You'll need `npm` or `yarn`.

### Set up the Graphcool back-end

We are using a [graphcool](https://www.graph.cool) back-end for this project.

Install graphcool:
```
npm install -g graphcool
```
You'll have to create a graphcool account and authentify.
```
graphcool auth
```
Start a new graphcool project using the example schema:
```
graphcool init --schema schema.graphql
```
In the future, you can change your GraphQL schema by editing the generated configuration file `project.graphcool` and running `graphcool push`.

In order to use the app, you need to create an admin user. I do that by running a query in the graphcool playground.
Launch the playground:
```
graphcool playground
```

Run this query - don't forget to replace the informations:
```
mutation {
  createUser(
    name: "REPLACE_WITH_YOUR_NAME",
    role: "ADMIN",
    authProvider: {
      email: {
        email: "REPLACE_WITH_YOUR_EMAIL",
        password: "REPLACE_WITH_YOUR_PASSWORD"
      }
    }
  ) {
    id
  }
}
```
A new `ADMIN` user should have been created. Use these credentials to log into the app later.

Read Graphcool really cool documentation [here](https://www.graph.cool/docs/).

### Config

In the `src` folder, create a `config.js` file with this data: 
```
export const GRAPHCOOL_SERVER_URI = '__simple_api_endpoint__'
```
Now, get the endpoint url from graphcool by running:
```
graphcool endpoints
```
You want to copy the *Simple API* endpoint into you `config.js` file.

### Run in development mode

That's it, You should be able to run the app.
```
yarn start
```
This should open a browser with the app running on `localhost:3000`.
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) which bring plenty of cool development features.

### Build for prod

Build the app for prod using `yarn build`

## Misc

I have a pre-commit hook to copy my graphcool schema into the example if there are changes to it. If you want to contribute changes to the schema and would like the same functionality, here is what I did:

```
touch .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

In the pre-commit file, copy paste this:
```
#!/bin/sh

sed '1,10 s/\(^# \([a-z_]*\):\).*$/\1 example_\2_id/' project.graphcool > /tmp/project.graphcool.example

if ! cmp /tmp/project.graphcool.example project.graphcool.example >/dev/null 2>&1
then
  # copy modified file to example file
  echo 'regenerating project.graphcool.example'
  mv /tmp/project.graphcool.example project.graphcool.example
  git add project.graphcool.example
fi
```
