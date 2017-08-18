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
  synopsis: Sequelize.TEXT,
  season: Sequelize.INTEGER
},{
  /* options */
  getterMethods:{
    number(){
      let thisTitle = this.getDataValue('title');
      return thisTitle.slice(0, thisTitle.indexOf(':'));
    }
  }
})

Episode.prototype.truncateSynopsis = function(length){
 this.setDataValue('synopsis', this.getDataValue('synopsis').slice(0, length));
}

Episode.findBySeason = function(season){
  return Episode.findAll({
    where:{
      season: season
    }
  })
}

module.exports = Episode;
