'use strict';

const db = require('./database');
const Sequelize = require('sequelize');

const TvShow = db.define('tvshow', {
  name: Sequelize.STRING
});

module.exports = TvShow;
