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

router.get('/episodes', function(req, res, next){
  Episode.findAll()
  .then(function(episodes){
    res.json(episodes);
  })
  .catch(next)
})

router.get('/episodes/:id', function(req, res, next){
  Episode.findById(req.params.id)
  .then(function(episode){
    if (episode === null){
      res.status(404).send();
    } else {
      res.json(episode);
    }
  })
  .catch(next)
})

router.post('/episodes', function(req, res, next){
  Episode.create(req.body)
  .then(function(episode){
    res.send({message: "Created successfully", episode: episode});
  })
  .catch(next)
})

router.put('/episodes/:id', function(req, res, next){
  Episode.findById(req.params.id)
  .then(function(episode){
    if (episode === null){
      res.status(404).send();
    } else {
      episode.title = req.body.title;
      res.json({message: 'Updated successfully' , episode: episode});
    }
  })
  .catch(error=> {
    res.status(500).send(error);
  })
})

module.exports = router;
