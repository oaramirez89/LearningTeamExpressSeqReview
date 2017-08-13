'use strict';

const db = require('./database');
const Sequelize = require('sequelize');
const TvShow = require('./tvshow');

// Make sure you have `postgres` running!


const Episode = db.define('episode', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  synopsis: {
    type: Sequelize.TEXT
  },
  season: {
    type: Sequelize.INTEGER
  }
}, {
  getterMethods: {
    number: function () {
      return this.title.slice(0, this.title.indexOf(':'));
    }
  }
});

// const episodeInstance = Episode.build({synopsis: 'a synopsis that is long'});
// episodeInstance.truncateSynopsis(10);
Episode.prototype.truncateSynopsis = function (length) {
  this.synopsis = this.synopsis.slice(0, length);
};

Episode.findBySeason = function (seasonNumber) {
  return Episode.findAll({
    where: {
      season: seasonNumber
    }
  })
};


module.exports = Episode;
