const express = require("express");
const router = express.Router();
const ModuleController = require("../Controllers/ModuleController");

// Fetch Module data
router.get("/fetch-data/:id", ModuleController.fetchData);

//Fetch Modules Code
router.get("/fetch-all-codes/", ModuleController.fetchAllCodes);

//Create Module
router.post("/create", ModuleController.createModule);

//Update Module
router.put("/update/:id", ModuleController.updateModule);

module.exports = router;