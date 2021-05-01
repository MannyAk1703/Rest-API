# Rest-API

9th Project

This is restful api built with Express.js framework and the Sequelizejs ORM. This API will provide a way to administer a school database containing information about users and courses. Users can interact with the database to create new courses, retrieve information on existing courses, and update or delete existing courses. To make changes to the database, users will be required to log in so the API will also allow users to create a new account or retrieve information on an existing account. 

Install dependencies => npm install

Usage => npm start
Run npm run seed to seed the database with a few initial entries.

This app will run on => localhost:5000/

Routes available

GET /api/users - Retrieves the currently authenticated user.
POST /api/users - Allowes the user to create a login account.
GET /api/courses - Retrieves a list of courses from the database.
GET /api/courses/:id - Retrieves a specific course and its information.
POST /api/courses - Allows a user to create a course which only they will be able to update or delete.
PUT /api/courses/:id - Allows the user to update any course they created.
DELETE /api/courses/:id - User can delete any course they created.

use RESTAPI.postman_collection.json with Postman as test are already configured  
