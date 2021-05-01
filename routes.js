"use strict";

const express = require("express");
const { asyncHandler } = require("./middleware/async-handler");
const { User } = require("./models");
const { authenticateUser } = require("./middleware/auth-user");
const { Course } = require("./models");

// Construct a router instance.
const router = express.Router();

// USERS ROUTES
// GET route for users
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  })
);

// POST route for users
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.location("/").status(201).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// COURSES ROUTES
// GET route that returns all courses including the Users that owns each course and a 200 HTTP status code
router.get("/courses", async (req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        as: "User",
        attributes: ["firstName", "lastName", "emailAddress"], //This will only return these attributes from the associated model
      },
    ],
    attributes: [
      "id",
      "title",
      "description",
      "estimatedTime",
      "materialsNeeded",
      "userId",
    ],
  });
  res.status(200).json(courses);
});

// GET route that returns corresponding course with a 200 HTTP status code
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    let course = await Course.findByPk(req.params.id);
    if (course) {
      course = await Course.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "User",
            attributes: ["firstName", "lastName", "emailAddress", "password"], //This will only return these attributes from the associated model
          },
        ],
        attributes: [
          "id",
          "title",
          "description",
          "estimatedTime",
          "materialsNeeded",
          "userId",
        ],
      });
      res.status(200).json(course);
    } else {
      res.sendStatus(400);
      throw (error = new Error("Query not found."));
    }
  })
);

// POST route that will create a new course
// Sets the location header to the URI for the newly created course, and return a 201 HTTP status code and no content
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      res.locals.course = await Course.create(req.body);
      const newCourse = res.locals.course;
      res.location(`/api/courses/${newCourse.id}`);
      res.status(201).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// PUT route that will update course + 204 HTTP status code
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const errors = [];

    if (!req.body.title) errors.push("Please provide a value for the title");

    if (!req.body.description)
      errors.push("Please provide a value for the description");

    if (errors.length > 0) res.status(400).json({ errors });

    const course = await Course.findByPk(req.params.id);
    try {
      await course.update(req.body);
      res.status(204).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// DELETE route that will delete course + 204 HTTP status code
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(404);
    }
  })
);

module.exports = router;
