# Foodelicious
Hi ! I built this application using **MongoDB, Express.js, Vue.js and Node.js**. <br> 
The goal is simple : you can add, rate and review restaurants.

# Features

Here are the main features covered by this app : 
 
- Full Stack application 
	> **Vue.js** on client side / **Node.js** on server side.

-  Server Deployment
	> Deployed on [Heroku](https://foodelicious.herokuapp.com/).

 - User account
	> User can create an account to add, rate and review restaurants. From his account he can view his reviews' history or edit them. Moreover he can update email and password, and upload profil picture.

-  Multiple files Uploading
 > Upload many restaurant photos or user's avatar picture.

- Image Resizing 
	 > User's avatar picture is resized and converted to png if needed.

- Slide
	> Each restaurant page has a slide to show photos.
	
- Authentification 
	> Sign up / Sign in / Sign out with **encrypted password** stored in database.
	
- Vuex Store
	>Is used to handle data. 

- Live update 
	>After being stored in the database, each new review, rating or restaurant added, are displayed on the fly without reloading the page.

-  Middleware 
	 >User's credentials are checked before protected routes.

- Cookies and JSON Web Tokens
	> Are used to manage **Authorization**
	
-   Database Schemas and Document Relationships
	> Three models are used and managed with **Mongoose** : User, Store and Reviews.
	
-  REST API endpoints
	> RESTful API with **Node** and  **Express**.

-  MVC Pattern

- Sending emails
	 > Welcome emails, password reset flow and cancellation emails are sent with **SendGrid** 

-   Geocoding Addresses 
	 > Restaurants coordinates are getting from **Google Places API** and **Google Geocoding API**

-   Custom map and cursor

-   Search bar

-   Pagination
