'use strict';


var expect = require('chai').expect;
var request = require('supertest-as-promised');

var app = require('../app');
var agent = request.agent(app);

var db = require('../models/database');
var Episode = require('../models/episode');
var TvShow = require('../models/tvshow');

/**
 *
 * Episode Route Tests
 *
 * Do these after you finish the Episode Model tests
 *
 */
describe('Episode Route:', function () {

  /**
   * First we clear the database before beginning each run
   */
  before(function () {
    return db.sync({force: true});
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

  describe('GET /episodes', function () {
    /**
     * Problem 1
     * We'll run a GET request to /episodes
     *
     * 1.  It should return JSON (i.e., use res.json)
     * 2.  Because there isn't anything in the DB, it should be an empty array
     */

    it('responds with an array via JSON', function () {

      return agent
      .get('/episodes')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function (res) {
        // res.body is the JSON return object
        expect(res.body).to.be.an.instanceOf(Array);
        expect(res.body).to.have.length(0);
      });

    });

    /**
     * Problem 2
     * Save an article in the database using our model and then retrieve it
     * using the GET /episodes route
     *
     */
    it('returns an episode if there is one in the DB', function () {

      var episode = Episode.build({
        title: 'Episode 1: Test Episode',
        synopsis: 'Test synopsis'
      });

      return episode.save().then(function () {

        return agent
        .get('/episodes')
        .expect(200)
        .expect(function (res) {
          expect(res.body).to.be.an.instanceOf(Array);
          expect(res.body[0].title).to.equal('Episode 1: Test Episode');
        });

      });

    });

    /**
     * Problem 3
     * Save a second article in the database using our model, then retrieve it
     * using the GET /episodes route
     *
     */
    it('returns another article if there is one in the DB', function () {

      var episode1 = Episode.build({
        title: 'Test episode',
        synopsis: 'Test synopsis'
      });

      var episode2 = Episode.build({
        title: 'Another Test episode',
        synopsis: 'Another test synopsis'
      });

      return episode1.save()
      .then(function () { return episode2.save() })
      .then(function () {

        return agent
        .get('/episodes')
        .expect(200)
        .expect(function (res) {
          expect(res.body).to.be.an.instanceOf(Array);
          expect(res.body[0].synopsis).to.equal('Test synopsis');
          expect(res.body[1].synopsis).to.equal('Another test synopsis');
        });

      });

    });

  });

  /**
   * Search for articles by ID
   */
  describe('GET /episodes/:id', function () {

    var coolEpisode;

    beforeEach(function () {

      var creatingEpisodes = [{
        title: 'Boring episode',
        synopsis: 'This episode is boring'
      }, {
        title: 'Cool episode',
        synopsis: 'This episode is cool'
      }, {
        title: 'Riveting episode',
        synopsis: 'This episode is riveting'
      }]
      .map(data => Episode.create(data));

      return Promise.all(creatingEpisodes)
      .then(createdEpisodes => {
        coolEpisode = createdEpisodes[1];
      });

    });

    /**
     * This is a proper GET /articles/ID request
     * where we search by the ID of the article created above
     */
    it('returns the JSON of the article based on the id', function () {

      return agent
      .get('/episodes/' + coolEpisode.id)
      .expect(200)
      .expect(function (res) {
        if (typeof res.body === 'string') {
          res.body = JSON.parse(res.body);
        }
        expect(res.body.title).to.equal('Cool episode');
      });

    });

    /**
     * Here we pass in a bad ID to the URL, we should get a 404 error
     */
    it('returns a 404 error if the ID is not correct', function () {

      return agent
      .get('/episodes/76142896')
      .expect(404);

    });

  });

  /**
   * Series of tests to test creation of new episodes using a POST
   * request to /episodes
   */
  describe('POST /episodes', function () {

    /**
     * Test the creation of an article
     * Here we don't get back just the article, we get back an object of this type, which you construct:
     *  {
     *    message: 'Created successfully',
     *    article: <the created article instance>
     *  }
     *
     */
    it('creates a new episode', function () {

      return agent
      .post('/episodes')
      .send({
        title: 'Awesome POST-Created Episode',
        synopsis: 'Can you believe I did this in a test?'
      })
      .expect(200)
      .expect(function (res) {
        expect(res.body.message).to.equal('Created successfully');
        expect(res.body.episode.id).to.not.be.an('undefined');
        expect(res.body.episode.title).to.equal('Awesome POST-Created Episode');
      });

    });


    // Check if the episodes were actually saved to the database
    it('saves the episode to the DB', function () {

      return agent
      .post('/episodes')
      .send({
        title: 'Awesome POST-Created Episode',
        synopsis: 'Can you believe I did this in a test?'
      })
      .expect(200)
      .then(function () {
        return Episode.findOne({
          where: { title: 'Awesome POST-Created Episode' }
        });
      })
      .then(function (foundEpisode) {
        expect(foundEpisode).to.exist; // eslint-disable-line no-unused-expressions
        expect(foundEpisode.synopsis).to.equal('Can you believe I did this in a test?');
      });

    });
  });

  /**
   * Series of specs to test updating of Articles using a PUT
   * request to /articles/:id
   */
  describe('PUT /episodes/:id', function () {

    var episode;

    beforeEach(function () {

      return Episode.create({
        title: 'Final Episode',
        synopsis: 'You can do it!'
      })
      .then(function (createdEpisode) {
        episode = createdEpisode;
      });

    });

    /**
     * Test the updating of an article
     * Here we don't get back just the article, we get back an object of this type, which you construct:
     *  {
     *    message: 'Updated successfully',
     *    article: <the updated article instance>
     *  }
     *
     **/
    it('updates an episode', function () {

      return agent
      .put('/episodes/' + episode.id)
      .send({
        title: 'Awesome PUT-Updated Episode'
      })
      .expect(200)
      .expect(function (res) {
        expect(res.body.message).to.equal('Updated successfully');
        expect(res.body.episode.id).to.not.be.an('undefined');
        expect(res.body.episode.title).to.equal('Awesome PUT-Updated Episode');
        expect(res.body.episode.synopsis).to.equal('You can do it!');
      });

    });

    xit('gets 500 for invalid update', function () {

      return agent
      .put('/episodes/' + episode.id)
      .send({ title: null })
      .expect(500);

    });

  });

});
