'use strict';

var Promise = require('bluebird');
var expect = require('chai').expect;
var Episode = require('../models/episode');
var TvShow = require('../models/tvshow');
var db = require('../models/database');

/**
 *
 * Start here!
 *
 * These tests describe the model that you'll be writing in models/article.js
 *
 */

describe('The `Episode` model', function () {

  /**
   * First we clear the database and recreate the tables before beginning a run
   */
  before(function () {
    return db.sync({force: true});
  });

  /**
   * Next, we create an (un-saved!) article instance before every spec
   */
  var shortText = 'This is a short synopsis.';

  var episode;
  beforeEach(function(){
    episode = Episode.build({
      title: 'Episode 1: Desperados learn Sequelize',
      synopsis: shortText
    });
  });

  /**
   * Also, we empty the tables after each spec
   */
  afterEach(function () {
    return Promise.all([
      Episode.truncate({ cascade: true }),
      TvShow.truncate({ cascade: true })
    ]);
  });

  describe('attributes definition', function(){
    it('includes `title` and `synopsis` fields', function () {

      return episode.save()
      .then(function (result) {
        expect(result.title).to.equal('Episode 1: Desperados learn Sequelize');
        expect(result.synopsis).to.equal(shortText);
      })


    });

    it('requires `title`', function () {

      episode.title = null;

      return episode.validate()
      .then(function(result) {
        expect(result).to.be.an.instanceOf(Error);
      })
      .catch(function(err) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.contain('title cannot be null');
      });
    });

    it('can handle long `synopsis`', function() {

      var longSynopsis = 'This is a sample synopsis. Generally, this is where I would summarize what happens in the episode without giving away too many spoilers. This paragraph is potentially very long, and by very long I mean over 255 characters. I hope that this gets correctly saved in my database. This is 300 characters.';

      return Episode.create({
        title: 'Episode 2: A lot happens',
        synopsis: longSynopsis
      })
      .then(function(result) {
        expect(result).to.be.an('object');
        expect(result.title).to.equal('Episode 2: A lot happens');
        expect(result.synopsis).to.equal(longSynopsis);
      });

    });

  });

  describe('options definition', function(){

    describe('`number` virtual field', function(){
      it('evaluates to the episode number, derived from the title', function () {

        // episode.title = 'Episode 113: blah blha blah'
        expect(episode.number).to.equal('Episode 1');

        episode.title = 'Episode 3: Something exciting!';
        expect(episode.number).to.equal('Episode 3');
      });
    });

    describe('`truncateSynopsis` instance method', function(){
      it('truncates the `synopsis`', function () {

        expect(episode.synopsis).to.equal(shortText);

        episode.truncateSynopsis(10);
        expect(episode.synopsis).to.equal('This is a ');

      });


    });

    describe('`findBySeason` class method', function(){
      beforeEach(function(){
        var otherEpisodes = [2, 3, 4].map(function (num) {
          return Episode.create({
            title: 'Episode ' + num,
            synopsis: 'etc.',
            season: num
          });
        });
        var episodes = otherEpisodes.concat(episode.save());
        return Promise.all(episodes);
      });

      it('finds one specific article by its `title`', function () {

        return Episode.findBySeason(2)
        .then(function (foundEpisodes) {
          expect(foundEpisodes).to.be.an.instanceOf(Array);
          expect(foundEpisodes[0].season).to.equal(2);
        });
      });
    });
  });
});
