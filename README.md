# Dibs server

Server API for Dibs client.  

* Create - Add properties and reservations
* Read - Get a list of all properties and reservations 
* Update - Update the property and reservation info
* Delete - Delete properties and reservations

## Built With

### Back End
* Node.js
* Express
* Mongo
* Mongoose
* JWT Authentication
* bcryptjs
* Passport
* Mocha
* Chai

### DevOps
* Heroku
* TravisCI
* mLab

## Using the API

### Authentication / Login
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/auth/login

* Bearer Authentication with JSON Web Token
* Must supply valid Username and Password in request header
* If authentication succeeds, a valid 7d expiry JWT will be provided in response body

### Register New User
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/users 

* Must supply First name, Last name, Username and Password in request body
* If successful, a valid 7d expiry JWT will be provided in response body

### Get All Properties
##### GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/properties/{USER-GOES-HERE}

* This endpoint retrieves all properties from user database
* Must supply valid JWT via Bearer Authentication
* If authentication succeeds, all User properties will be returned

### Get All Reservations
##### GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/reservations/{USER-GOES-HERE}

* This endpoint retrieves all reservations from user database
* Must supply valid JWT via Bearer Authentication
* If authentication succeeds, all User reservations will be returned

### Add Property
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/api/properties

* This endpoint adds a single property to user database
* Supply property object in request body
* Must supply valid JWT via Bearer Authentication

### Add Reservation
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/api/reservations

* This endpoint adds a single reservation to user database
* Supply reservation object in request body
* Must supply valid JWT via Bearer Authentication

### Update Property
##### PUT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/api/properties/{BOX-ID-GOES-HERE}

* This endpoint updates a single property in user database
* Supply property ID as route parameter
* Supply property object in request body
* Must supply valid JWT via Bearer Authentication

### Update Reservation
##### PUT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/api/reservations/{BOX-ID-GOES-HERE}

* This endpoint updates a single reservation in user database
* Supply reservation ID as route parameter
* Supply reservation object in request body
* Must supply valid JWT via Bearer Authentication

### Delete Property
##### DELETE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/api/properties/{BOX-ID-GOES-HERE}

* This endpoint deletes a single property from user database
* Supply property ID as route parameter
* Must supply valid JWT via Bearer Authentication

### Delete Reservation
##### DELETE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/api/reservations/{BOX-ID-GOES-HERE}

* This endpoint deletes a single reservation from user database
* Supply reservation ID as route parameter
* Must supply valid JWT via Bearer Authentication
