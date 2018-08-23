var express = require('express');
var router = express.Router();

    const notes = require('../controllers/note.controller.js');

    //create a new note
    router.post('/', notes.create);

    router.get('/', notes.findAll);

    router.get('/', notes.findOne);

module.exports = router;
