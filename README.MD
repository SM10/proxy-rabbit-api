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
Socket.IO
Axios
js-cookie

Back End:
Node.js
Express
Express Session
MySQL
Knex
Nodemon
Socket.IO
JSON Web Token
Google Apis (OAuth 2.0)
Crypto
Dotenv

### APIs

This is the back end for the Proxy Rabbit project. The front end can be found here: https://github.com/SM10/proxy-rabbit

### Data

The following tables will be implemented

Country table with the following columns:

| Column  | Description |
| ------------- | ------------- |
| id  | Identifier code for the country.  |
| name  | Country name  |

Products table:
id
name
image_url
country_id (foreign key mapped to country table)

| Column  | Description |
| ------------- | ------------- |
| id  | Identifier code for the product  |
| name  | name of the product |
| image_url  | url to the picture |
| country_id  | references 'id' column from 'country' table |
| views  | tracks how many times each product has been clicked on |

User table:
id
email
first_name
last_name
password
country_id (foreign key mapped to country table)

| Column  | Description |
| ------------- | ------------- |
| id  | Identifier code for the user  |
| email  | User's email, which also serves as their username  |
| first_name  | user's first name |
| last_name  | user's last name |
| hashed_password  | hashed password that has been encrypted using the salt below as a SHA256 code |
| salt  | 16 random bytes associated with the user |
| country_id  | references the country table's id. |

Message Master table. This table will manage all the tables related to messages:
room_id (primary key)
user_one (foreign key mapped to user table)
user_two (foreign key mapped to user table)

| Column  | Description |
| ------------- | ------------- |
| room_id  | Rooms to put users in when they send each other messages. Primary Key  |
| user_one  | First user's id. Foreign key that references 'user' table  |
| user_two  | Second user's id. Foreign key that references 'user' table  |

Message Table Sample. A new table will be generated each time a user messages someone they have not messaged before.
id
room_id (foreign key mapped to message master table's primary key)
from (foreign key mapped to user.id on user table)
to (foreign key mapped to user.id on user table)
message
timestamp

| Column  | Description |
| ------------- | ------------- |
| id  | The message's id. Primary key.  |
| room_id  | room associated with the message. References message master table |
| from | Sender's user id. Foreign key that references 'user; table |
| to | Recipient's user's id. Foreign key that references 'user' table |
| message | contents of the message |
| timestampt | timestamp that the message was received by the server |

### Endpoints

This app is meant to be used in tandem with the following project:

https://github.com/SM10/proxy-rabbit-api

Api endpoints and their description:

POST http://localhost:8080/api/login/

Requires the following body:

| Key | Value |
| ------------- | ------------- |
| email | Email of the user |
| password | User's password |

returns the following if email and password are correct:

| Key | Value |
| ------------- | ------------- |
| user_id | Return's user's id |
| email | User's email |
| first_name | User's first name |
| last_name | User's last name |
| country_id | Country id of the user's selected country |
| country_name | Country name of the user's selected country |

POST http://localhost:8080/api/login/google

Redirects the user to google's authentication page or directly logs them in.

POST htpp://localhost:8080/api/logout

Logs the user out. No body required.

POST http://localhost:8080/api/register

Verifies that the current email doesn't exist and creates a new one if it doesn't. Returns a 409 error code upon failure. Requires the following body. Returns a 201 response code only.

| Key | Value |
| ------------- | ------------- |
| email | User's email |
| first_name | User's first name |
| last_name | User's last name |
| country_id | Country id of the user's selected country |

GET http://localhost:8080/api/countries

Returns a list of countries and their ids.

| Key | Value |
| ------------- | ------------- |
| id | Country's identifier. Primary key |
| name | Country's name |

GET http://localhost:8080/api/countries/:countryId/products

Returns a list of all products with a country id that matches the country id.

| Key | Value |
| ------------- | ------------- |
| id | Product's id |
| name | Product's name |
| image_url | Product's picture |
| country_id | Country id of that the product is sold in |
| country_name | Name of country that the product is sold in |

GET http://localhost:8080/api/countries/:countryId/users

Returns a list of all users with a country id that matches the parameter country id.

| Key | Value |
| ------------- | ------------- |
| id | Return's user's id |
| first_name | User's first name |
| last_name | User's last name |
| country_id | Country id of the user's selected country |
| country_name | Country name of the user's selected country |

PATCH http://localhost:8080/api/countries/change-country

Changes the country of the current user. Accepts the following as body:

| Key | Value |
| ------------- | ------------- |
| user_id | The user whose country needs to be changed |
| country_id | The user's new country |

Returns the following:

| Key | Value |
| ------------- | ------------- |
| user_id | Return's user's id |
| email | User's email |
| first_name | User's first name |
| last_name | User's last name |
| country_id | Country id of the user's selected country |
| country_name | Country name of the user's selected country |

GET http://localhost:8080/api/products

Returns a list of all products and their ids.

| Key | Value |
| ------------- | ------------- |
| id | Product's ID |
| image_url | Url to product's picture |
| name | Product's name |
| country_id | Country id that the product is sold in |
| country_name | Country name that the product is sold in |

GET http://localhost:8080/api/products/:searchString

Returns a list of all products that begin with the searchString parameter.

| Key | Value |
| ------------- | ------------- |
| id | Product's ID |
| image_url | Url to product's picture |
| name | Product's name |
| country_id | Country id that the product is sold in |
| country_name | Country name that the product is sold in |

GET http://localhost:8080/api/products/discover

Returns a list of 9 random products.

| Key | Value |
| ------------- | ------------- |
| id | Product's ID |
| image_url | Url to product's picture |
| name | Product's name |
| country_id | Country id that the product is sold in |
| country_name | Country name that the product is sold in |

GET http://localhost:8080/api/products/popular

Returns a list of the 9 products with the most views.

| Key | Value |
| ------------- | ------------- |
| id | Product's ID |
| image_url | Url to product's picture |
| name | Product's name |
| country_id | Country id that the product is sold in |
| country_name | Country name that the product is sold in |

GET http://localhost:8080/api/message

Returns an array of all conversations that the user is a part of:

| Key | Value |
| ------------- | ------------- |
| room_id | ID of the conversation room the user is a part of |
| recipient_id | The id of the other conversation participant |
| recipient_first_name | The first name of the other conversation participant |
| recipient_last_name | The last of the other conversation participant |
| recipient_country_name | Country of the other conversation participant |

GET http://localhost:8080/api/message/:roomId

Returns all messages between the user and recipient, sorted by timestamp from earliest to latest:

| Key | Value |
| ------------- | ------------- |
| room_id | ID of the conversation room the user is a part of |
| from_id | Id of the sender |
| from_first_name | First name of the sender |
| from_last_name | Last name of the sender |
| to_id | Id of the recipient |
| to_first_name | First name of the recipient |
| to_last_name | Last name of the recipient |
| message | Contents of the message |
| timestamp | Timestamp of the message |

POST http://localhost:8080/api/message

Sends a user's message to the server to be sent to the recipient. The body of the data sent to the server will be expecting the following format. If room_id is null, a room will be found and/or created:

| Key | Value |
| ------------- | ------------- |
| room_id | ID of the conversation room the user is a part of |
| recipient_id | Recipient's user id |
| message | Contents of the message |

The following will be returned upon a successful post:

| Key | Value |
| ------------- | ------------- |
| room_id | ID of the conversation room the user is a part of |
| from_id | Id of the sender |
| from_first_name | First name of the sender |
| from_last_name | Last name of the sender |
| to_id | Id of the recipient |
| to_first_name | First name of the recipient |
| to_last_name | Last name of the recipient |
| message | Contents of the message |
| timestamp | Timestamp of the message |

### Auth

Current supported authentication method is through web token and Google OAuth.


## Roadmap

January 19 - 22: Complete development and testing api requests.
January 22 - 25: Complete development of components and styling of front end.
January 26 - 30: Implementation of real-time messaging through Server.IO
January 31 - Feb 3: Implementation of Nice-to-haves

## Nice-to-haves

Your project will be marked based on what you committed to in the above document. Under nice-to-haves, you can list any additional features you may complete if you have extra time, or after finishing.

1. A rating system where users can rate each other as proxies.
2. Form for user to submit new region-exclusive products.
3. Expected price of products.