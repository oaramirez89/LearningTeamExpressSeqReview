'use strict';

const db = require('./database');
const Sequelize = require('sequelize');
const TvShow = require('./tvshow');

// Make sure you have `postgres` running!


const Episode = db.define('episode', {

});
module.exports = Episode;
