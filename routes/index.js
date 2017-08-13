const express = require('express');
const router = express.Router();

const Episode = require('../models/episode');

/**
 *
 *___ _____ _   ___ _____   _  _ ___ ___ ___
 / __|_   _/_\ | _ \_   _| | || | __| _ \ __|
 \__ \ | |/ _ \|   / | |   | __ | _||   / _|
 |___/ |_/_/ \_\_|_\ |_|   |_||_|___|_|_\___|
 *
 *
 */

router.get('/episodes', function (req, res, next) {
  Episode.findAll()
  .then(function(arrayOfAllEpisodes) {  
    res.send(arrayOfAllEpisodes);
  });
});

router.get('/episodes/:id', function (req, res, next) {
  Episode.findById(req.params.id)
  .then(function(foundEpisode) {
    if (!foundEpisode) {
      res.sendStatus(404);
    } else {
      res.json(foundEpisode);
    }
  });
});

router.post('/episodes', function(req, res, next) {
  // req.body = { title: ..., synopsis: ... }
  Episode.create(req.body)
  .then(function(createdEpisode) {
    const customResponse = {
      message: 'Created successfully',
      episode: createdEpisode
    };
    res.status(200).send(customResponse)
  });
});

module.exports = router;
