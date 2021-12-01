const express = require("express");
const controller = require("../controllers/connectionController.js");
const {isLoggedIn, isHost} = require("../middlewares/auth");
const {validateId} = require("../middlewares/validator");

const router = express.Router();

//GET /connections; send all connections to the user
router.get("/", controller.index);

//GET /connections/new; send HTML form for creating a new connection.
router.get("/new", isLoggedIn, controller.new);

//POST /connections; create a new connection
router.post("/", isLoggedIn, controller.create);

//GET /connections/:id; send details of connection identified by id
router.get("/:id", validateId, controller.show);

//GET /connections/:id/edit; send HTML form for editing an existing connection
router.get("/:id/edit", validateId, isLoggedIn, isHost, controller.edit);

//PUT /connections/:id; Update the connection identified by id
router.put("/:id", validateId, isLoggedIn, isHost, controller.update);

//DELETE /stories/:id; delete the connection identified by id
router.delete("/:id", validateId, isLoggedIn, isHost, controller.delete);

module.exports = router;