# nodejs-template
A node.js template app

## setting environment
After clone this project you should install the npm packages.

    npm install -g bower
    npm install
    bower install

To run the app you should use this command.

    npm start

# Architecture

## framework
Presents common functions independent of the business.

## model
Defines the entities of the application, these are objects not defined by its attributes, but rather by a thread of continuity and its identity.
The business logic should be placed in this module.

## services
When an operation does not conceptually belong to any object. Following the natural contours of the problem, you can implement these operations in services.

## routes
Handles the HTTP requests. The business logic should not be placed here.
The public-api folder is public and does not need a user's session.
The api folder is a private API and need a valid user's session to use.

## public
This is all the client side content, the user can access this content freely.

# Updating front-end packages.

    bower update <package>

# Changing connection string to database.
You should looking for the connectionString field in the /config.json file. An example of a connection string is: mongodb://<user>:<password>@<server>:<port>/<database>?safe=true