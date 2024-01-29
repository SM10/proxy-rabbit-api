# Proxy Rabbit

## Overview

Two repos are required for this project:
https://github.com/SM10/proxy-rabbit
https://github.com/SM10/proxy-rabbit-api

Proxy Rabbit is a social media website aimed at connecting people around the world. It aims to provide a platform where people can freely ask and offer their local specialties and region-exclusive products to each other.

### Problem

Did you know that Coffee Crisp is only available in Canada? Despite being an amazing commercial success and a widely popular, it isn't sold overseas or even in America.

There are tons of products like these. Region-exclusive specialties that are unknown to the world. Proxy Rabbit provides a platform for people to learn about and buy these products from and for each other.

### User Profile

Proxy Rabbit is planned to be aimed at young adults, and while a mobile version will be available, it will focus primarily on a tablet and desktop experience.

### Features

Proxy Rabbit will provide 2 ways to search for a proxy, or another user from that region who will help purchase and mail a desired product. The first is by country, and the second will be by popular products.

Once the user has found a proxy, they can send them a message through Proxy Rabbit's built-in messenging system.

## Implementation

### Tech Stack

Front End:
React
SASS

Back End:
Node.js
Express
MySQL
Knex
Nodemon
Socket.IO
Passport.js

### APIs

No external APIs will be used for this app.

### Sitemap

The following pages will be necessary:

"Find a proxy by country"
"Find a proxy by product"
"Mailbox"

The home page will be "Find a proxy by country". This will be a single page application. There is a navigation bar that allows the user to switch between any of the 3 pages on demand.

### Mockups

Find a proxy by country:
![Find a proxy by country image](./src/assets/images/proxy-rabbit-home-page.jpg)

Find a proxy by product:
![Find a proxy by product image](./src/assets/images/proxy-rabbit-by-product.jpg)

Login page:
![Login image](./src/assets/images/proxy-rabbit-login.jpg)

Mailbox page:
![Mailbox](./src/assets/images/proxy-rabbit-mailbox.jpg)

### Data

The following tables will be implemented

Country table with the following columns:
id
name

Products table:
id
name
image_url
country_id (foreign key mapped to country table)

User table:
id
email
first_name
last_name
password
country_id (foreign key mapped to country table)

Message Master table. This table will manage all the tables related to messages:
room_id (primary key)
user_one (foreign key mapped to user table)
user_two (foreign key mapped to user table)

Message Table Sample. A new table will be generated each time a user messages someone they have not messaged before.
id
room_id (foreign key mapped to message master table's primary key)
from (foreign key mapped to user.id on user table)
to (foreign key mapped to user.id on user table)
message
timestamp

Sessions. A sessions table as required by connect-session-knex dependency

### Endpoints

This app is meant to be used in tandem with the following project:

https://github.com/SM10/proxy-rabbit-api

Api endpoints and their description:

POST http://localhost:8080/api/login/

Requires the following body:

{
    email: email,
    password: password
}

returns the following if email and password are correct:

{
    email: email,
    first_name: first_name,
    last_name: last_name,
    country: country_name,
    user_id: user_id
}

POST htpp://localhost:8080/api/logout

Logs the user out. No body required.

POST http://localhost:8080/api/register

Verifies that the current email doesn't exist and creates a new one if it doesn't. Returns a 409 error code upon failure. Requires the following body. Returns a 201 response code only.

{
    email: email
    password: password
    first_name: first_name
    last_name: last_name
    country_id: country_id
}

GET http://localhost:8080/api/countries

Returns a list of countries and their ids.

[{
    id: country_id,
    name: country_name
}]

GET http://localhost:8080/api/countries/:countryId/products

Returns a list of all products with a country id that matches the country id.

{
    id: product_id,
    name: name,
    country: country_id,
    country_name: country_name
}

GET http://localhost:8080/api/products

Returns a list of all products and their ids.

{
    id: product_id,
    name: name,
    country: country_id,
    country_name: country_name
}

GET http://localhost:8080/api/products/search/:search

Returns a list of all products that start with the search parameter.

{
    id: product_id,
    name: name,
    country: country_id,
    country_name: country_name
}

GET http://localhost:8080/api/products/popular

Returns a list of the 9 items with the most views.

{
    id: product_id,
    name: name,
    country: country_id,
    country_name: country_name
}

GET http://localhost:8080/api/products/discover

Returns a list of 9 random items

{
    id: product_id,
    name: name,
    country: country_id,
    country_name: country_name
}

GET http://localhost:8080/api/message

Returns a list of all conversations that the user is a part of:

[{
    room_id: room id,
    recipient_id: recipient's id,
    recipient_first_name: recipient's first name,
    recipient_last_name: recipient's last name
}]

GET http://localhost:8080/api/message/:roomId

Returns all messages between the user and recipient, sorted by timestamp from earliest to latest:

[{
    room_id: room_id,
    from_id: sender's id,
    from_first_name: sender's_first_name
    from_last_name: sender's last name
    to_id: recipient's id,
    to_first_name: recipient's first name
    to_last_name: recipient's last name
    message: contents of the message
    timestamp: timestamp of the message
}]

POST http://localhost:8080/api/message

Sends a user's message to the server to be sent to the recipient. The body of the data sent to the server will be expecting the following format. If room_id is null, a room will be found and/or created:

{
    room_id: room id,
    recipient_id: recipient's user id,
    message: user's message for the recipient
}

The following will be returned upon a successful post:

{
    room_id: room_id,
    from_id: sender's id,
    from_first_name: sender's_first_name
    from_last_name: sender's last name
    to_id: recipient's id,
    to_first_name: recipient's first name
    to_last_name: recipient's last name
    message: contents of the message
    timestamp: timestamp of the message
}

### Auth

Authentication and authorization will be implemented through Passport.js's, authentication methods. The minimum necessary will be an Email and Password. If there is time, authentication through Google Account, Facebook Account and/or Apple Account will be implemented.

## Roadmap

Scope your project as a sprint. Break down the tasks that will need to be completed and map out timeframes for implementation. Think about what you can reasonably complete before the due date. The more detail you provide, the easier it will be to build.

January 19 - 22: Complete development and testing api requests.
January 22 - 25: Complete development of components and styling of front end.
January 26 - 30: Implementation of real-time messaging through Server.IO
January 31 - Feb 3: Implementation of Nice-to-haves

## Nice-to-haves

Your project will be marked based on what you committed to in the above document. Under nice-to-haves, you can list any additional features you may complete if you have extra time, or after finishing.

1. A rating system where users can rate each other as proxies.
2. Form for user to submit new region-exclusive products.
3. Expected price of products.
