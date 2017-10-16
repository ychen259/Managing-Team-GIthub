'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Duc = mongoose.model('Duc'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  duc;

/**
 * Duc routes tests
 */
describe('Duc CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Duc
    user.save(function () {
      duc = {
        name: 'Duc name'
      };

      done();
    });
  });

  it('should be able to save a Duc if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Duc
        agent.post('/api/ducs')
          .send(duc)
          .expect(200)
          .end(function (ducSaveErr, ducSaveRes) {
            // Handle Duc save error
            if (ducSaveErr) {
              return done(ducSaveErr);
            }

            // Get a list of Ducs
            agent.get('/api/ducs')
              .end(function (ducsGetErr, ducsGetRes) {
                // Handle Ducs save error
                if (ducsGetErr) {
                  return done(ducsGetErr);
                }

                // Get Ducs list
                var ducs = ducsGetRes.body;

                // Set assertions
                (ducs[0].user._id).should.equal(userId);
                (ducs[0].name).should.match('Duc name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Duc if not logged in', function (done) {
    agent.post('/api/ducs')
      .send(duc)
      .expect(403)
      .end(function (ducSaveErr, ducSaveRes) {
        // Call the assertion callback
        done(ducSaveErr);
      });
  });

  it('should not be able to save an Duc if no name is provided', function (done) {
    // Invalidate name field
    duc.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Duc
        agent.post('/api/ducs')
          .send(duc)
          .expect(400)
          .end(function (ducSaveErr, ducSaveRes) {
            // Set message assertion
            (ducSaveRes.body.message).should.match('Please fill Duc name');

            // Handle Duc save error
            done(ducSaveErr);
          });
      });
  });

  it('should be able to update an Duc if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Duc
        agent.post('/api/ducs')
          .send(duc)
          .expect(200)
          .end(function (ducSaveErr, ducSaveRes) {
            // Handle Duc save error
            if (ducSaveErr) {
              return done(ducSaveErr);
            }

            // Update Duc name
            duc.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Duc
            agent.put('/api/ducs/' + ducSaveRes.body._id)
              .send(duc)
              .expect(200)
              .end(function (ducUpdateErr, ducUpdateRes) {
                // Handle Duc update error
                if (ducUpdateErr) {
                  return done(ducUpdateErr);
                }

                // Set assertions
                (ducUpdateRes.body._id).should.equal(ducSaveRes.body._id);
                (ducUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Ducs if not signed in', function (done) {
    // Create new Duc model instance
    var ducObj = new Duc(duc);

    // Save the duc
    ducObj.save(function () {
      // Request Ducs
      request(app).get('/api/ducs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Duc if not signed in', function (done) {
    // Create new Duc model instance
    var ducObj = new Duc(duc);

    // Save the Duc
    ducObj.save(function () {
      request(app).get('/api/ducs/' + ducObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', duc.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Duc with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ducs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Duc is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Duc which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Duc
    request(app).get('/api/ducs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Duc with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Duc if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Duc
        agent.post('/api/ducs')
          .send(duc)
          .expect(200)
          .end(function (ducSaveErr, ducSaveRes) {
            // Handle Duc save error
            if (ducSaveErr) {
              return done(ducSaveErr);
            }

            // Delete an existing Duc
            agent.delete('/api/ducs/' + ducSaveRes.body._id)
              .send(duc)
              .expect(200)
              .end(function (ducDeleteErr, ducDeleteRes) {
                // Handle duc error error
                if (ducDeleteErr) {
                  return done(ducDeleteErr);
                }

                // Set assertions
                (ducDeleteRes.body._id).should.equal(ducSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Duc if not signed in', function (done) {
    // Set Duc user
    duc.user = user;

    // Create new Duc model instance
    var ducObj = new Duc(duc);

    // Save the Duc
    ducObj.save(function () {
      // Try deleting Duc
      request(app).delete('/api/ducs/' + ducObj._id)
        .expect(403)
        .end(function (ducDeleteErr, ducDeleteRes) {
          // Set message assertion
          (ducDeleteRes.body.message).should.match('User is not authorized');

          // Handle Duc error error
          done(ducDeleteErr);
        });

    });
  });

  it('should be able to get a single Duc that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Duc
          agent.post('/api/ducs')
            .send(duc)
            .expect(200)
            .end(function (ducSaveErr, ducSaveRes) {
              // Handle Duc save error
              if (ducSaveErr) {
                return done(ducSaveErr);
              }

              // Set assertions on new Duc
              (ducSaveRes.body.name).should.equal(duc.name);
              should.exist(ducSaveRes.body.user);
              should.equal(ducSaveRes.body.user._id, orphanId);

              // force the Duc to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Duc
                    agent.get('/api/ducs/' + ducSaveRes.body._id)
                      .expect(200)
                      .end(function (ducInfoErr, ducInfoRes) {
                        // Handle Duc error
                        if (ducInfoErr) {
                          return done(ducInfoErr);
                        }

                        // Set assertions
                        (ducInfoRes.body._id).should.equal(ducSaveRes.body._id);
                        (ducInfoRes.body.name).should.equal(duc.name);
                        should.equal(ducInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Duc.remove().exec(done);
    });
  });
});
