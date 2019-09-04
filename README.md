# Foodelicious

![https://foodelicious.herokuapp.com](https://www.antoineparat.com/img/foodelicious.png)

Hi ! I built this application using **MongoDB, Express.js, Vue.js and Node.js**. <br> 
The goal is simple : you can add, rate and review restaurants.

![MEVN stack](https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto/gigs/118913530/original/051672fddc3634fc420f2721ad510675d3a3c099/develop-a-mevn-stack-app.png)

# Features

Here are some of the main features covered by this app : 
 
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
	
-  REST API
	> RESTful API with **Node** and  **Express**.

-  MVC Pattern

- Sending emails
	 > Welcome emails, password reset flow and cancellation emails are sent with **SendGrid** 

-   Geocoding Addresses 
	 > Restaurants coordinates are getting from **Google Places API** and **Google Geocoding API**

-   Custom map and markers
	> All restaurants are set on a bounded and centered Google  [map](https://foodelicious.herokuapp.com/carte). When the user clicks the marker, a custom info window appears. 

-   Search bar
	> Search a store by name, location or tags. Results are sorted by relevance.

- Advanced DB Queries and Tags filtering
	> Sort and display restaurants by tags

-   Pagination
	 > 6 additional restaurants are loaded on scroll (infinite-content page)
