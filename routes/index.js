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
    .then(function(foundEpisodes) {
      res.json(foundEpisodes);
    });
});

router.get('/episodes/:id', function (req, res, next) {
  const id = req.params.id;
  Episode.findById(id)
    .then(function (singleEpisode) {
      if (!singleEpisode) {
        res.sendStatus(404);
      } else {
        res.json(singleEpisode);
      }
    })
    .catch(next);
});

router.post('/episodes', function (req, res, next) {
  const newEpisode = req.body; // { title: ..., synopsis: ... }
  Episode.create(req.body)
    .then(function (createdEpisode) {
      const customResponse = {
        message: 'Created successfully',
        episode: createdEpisode
      };
      res.json(customResponse);
    });
});

router.put('/episodes/:id', function (req, res, next) {
  Episode.findById(req.params.id)
  .then(function(foundEpisode) {
    return foundEpisode.update(req.body);
  })
  .then(function (updatedEpisode) {
    customMessage = {
      message: 'Updated successfully',
      episode: updatedEpisode
    };
    res.json(customMessage);
  })
  .catch(function(error) {
    res.sendStatus(500)
  });
});
module.exports = router;
