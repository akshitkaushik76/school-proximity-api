const express = require('express');
const router = express.Router();
const controller = require('../controller/SchoolController');
router.post('/addSchool',controller.addSchools);
router.get('/listSchool',controller.listSchools);
module.exports = router;