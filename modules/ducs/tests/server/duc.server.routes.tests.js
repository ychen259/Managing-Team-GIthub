'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  //Duc = mongoose.model('Duc'),
  Measurements = require("../../server/models/measurements.server.model.js"),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  measurements,
  can_depth_array;

/**
 * Duc routes tests
 */
describe('Duc CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    done();
  });

  it('should be able to save a Duc if logged in as user', function (done) {
        // Save a user to the test db and create new Duc
    user.save(function () {
      can_depth_array = [1, 2, 3, 4, 5];
      measurements = {
        "can_depths": can_depth_array,
        "zipcode": 94523,
        "time": 2,
        "notes": 'some notes'
      };
    });

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
        agent.post('/api/measurements')
          .send(measurements)
          .expect(200)
          .end(function (err, res) {

            should.not.exist(err);
            should.exist(res.body._id);

            res.body.user._id.should.equal(userId);

            for(var i = 0; i < can_depth_array.length; i++){
                res.body.can_depths[i].should.equal(can_depth_array[i]);
            }

            res.body.results.uniformity_distribution.should.equal(0.33);
            res.body.results.irrigation_rate.should.equal(1.5);
            res.body.zipcode.should.equal(94523);
            res.body.time.should.equal(2);
            res.body.notes.should.equal('some notes');
            res.body.county.should.equal('Contra Costa County');
            done();
          });
      });
  });

  it('should be able to save a Duc if logged in as admin', function (done) {
    user.roles = ['admin'];

    user.save(function () {
      can_depth_array = [1, 2, 3, 4, 5];
      measurements = {
        "can_depths": can_depth_array,
        "zipcode": 94523,
        "time": 2,
        "notes": 'some notes'
      };
    });

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
        agent.post('/api/measurements')
          .send(measurements)
          .expect(200)
          .end(function (err, res) {

            should.not.exist(err);
            should.exist(res.body._id);

            res.body.user._id.should.equal(userId);

            for(var i = 0; i < can_depth_array.length; i++){
                res.body.can_depths[i].should.equal(can_depth_array[i]);
            }

            res.body.results.uniformity_distribution.should.equal(0.33);
            res.body.results.irrigation_rate.should.equal(1.5);
            res.body.zipcode.should.equal(94523);
            res.body.time.should.equal(2);
            res.body.notes.should.equal('some notes');
            res.body.county.should.equal('Contra Costa County');
            done();
          });
      });
  });

  it('should show error to save a Duc if not logged in', function (done) {
    user.save(function () {
      can_depth_array = [1, 2, 3, 4, 5];
      measurements = {
        "can_depths": can_depth_array,
        "zipcode": 94523,
        "time": 2,
        "notes": 'some notes'
      };
    });

    // Save a new Duc
    agent.post('/api/measurements')
      .send(measurements)
      .expect(403)
      .end(function (err, res) {
          done(err);
      });

  });


  it('should be able to get list of measurements if logged in as admin', function (done) {
    user.roles = ['admin'];

    user.save(function (){});

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
        agent.get('/api/measurements')
          .expect(200)
          .end(function (err, res) {

            should.not.exist(err);
            should.exist(res);

            done();
          });
      });
  });


  it('should show an error to get list of measurements if logged in as user', function (done) {

    user.save(function (){});

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Save a new Duc
        agent.get('/api/measurements')
          .expect(403)
          .end(function (err, res) {
            done(err);
          });
      });
  });

  it('should show an error to get list of measurements if not logged in', function (done) {
    // Save a new Duc
    agent.get('/api/measurements')
      .expect(403)
      .end(function (err, res) {
          done(err);
      });
    
  });

  it('should be able to export data to Excel if logged in as admin', function (done) {
    user.roles = ['admin'];

    user.save(function (){
      can_depth_array = [1, 2, 3, 4, 5];
      measurements = {
        "can_depths": can_depth_array,
        "zipcode": 94523,
        "time": 2,
        "notes": 'some notes'
      };
    });

    
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
        agent.get('/api/measurements/export')
          .expect(200)
          .end(function (err, res) {

            should.not.exist(err);
            should.exist(res);

            done();
          });
      });
  });

  it('should show an error to export data to Excel if logged in as user', function (done) {

    user.save(function (){});

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Save a new Duc
        agent.get('/api/measurements/export')
          .expect(403)
          .end(function (err, res) {
            done(err);
          });
      });
  });

  it('should show an error to export data to Excel if not logged in', function (done) {
    // Save a new Duc
    agent.get('/api/measurements/export')
      .expect(403)
      .end(function (err, res) {
          done(err);
      });
    
  });

  it('should be able to get number of County if logged in as admin', function (done) {
    user.roles = ['admin'];

    user.save(function (){});

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
        agent.get('/api/measurements/count')
          .expect(200)
          .end(function (err, res) {

            should.not.exist(err);
            should.exist(res);

            done();
          });
      });
  });

  it('should show an error to get number of County if logged in as user', function (done) {

    user.save(function (){});

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Save a new Duc
        agent.get('/api/measurements/count')
          .expect(403)
          .end(function (err, res) {
            done(err);
          });
      });
  });

  it('should show an error to get number of County if not logged in', function (done) {
    // Save a new Duc
    agent.get('/api/measurements/count')
      .expect(403)
      .end(function (err, res) {
          done(err);
      });
    
  });

  it('should be able to get a single measurement if logged in as admin', function (done) {
    user.roles = ['admin'];

    //save user to database
    user.save(function (){
      can_depth_array = [1, 2, 3, 4, 5];
      measurements = new Measurements({
        "user": user,
        "can_depths": can_depth_array,
        "results": {uniformity_distribution: 0.33, irrigation_rate: 1.5},
        "zipcode": 94523,
        "time": 2,
        "notes": 'some notes',
        "county": 'Contra Costa County'
      });

      //save measurement to database
      measurements.save(function(){});
    });

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var measurementID = measurements.id;

        // Save a new Duc
        agent.get('/api/measurements/' + measurementID)
          .expect(200)
          .end(function (err, res) {

            should.not.exist(err);
            should.exist(res.body._id);

            for(var i = 0; i < can_depth_array.length; i++){
                res.body.can_depths[i].should.equal(can_depth_array[i]);
            }

            res.body.results.uniformity_distribution.should.equal(0.33);
            res.body.results.irrigation_rate.should.equal(1.5);
            res.body.zipcode.should.equal(94523);
            res.body.time.should.equal(2);
            res.body.notes.should.equal('some notes');
            res.body.county.should.equal('Contra Costa County');
            done();
          });
      });
  });

  it('should be able to get a single measurement if logged in as user', function (done) {

    //save user to database
    user.save(function (){
      can_depth_array = [1, 2, 3, 4, 5];
      measurements = new Measurements({
        "user": user,
        "can_depths": can_depth_array,
        "results": {uniformity_distribution: 0.33, irrigation_rate: 1.5},
        "zipcode": 94523,
        "time": 2,
        "notes": 'some notes',
        "county": 'Contra Costa County'
      });

      //save measurement to database
      measurements.save(function(){});
    });

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var measurementID = measurements.id;

        // Save a new Duc
        agent.get('/api/measurements/' + measurementID)
          .expect(200)
          .end(function (err, res) {
            should.not.exist(err);
            should.exist(res.body._id);

            for(var i = 0; i < can_depth_array.length; i++){
                res.body.can_depths[i].should.equal(can_depth_array[i]);
            }

            res.body.results.uniformity_distribution.should.equal(0.33);
            res.body.results.irrigation_rate.should.equal(1.5);
            res.body.zipcode.should.equal(94523);
            res.body.time.should.equal(2);
            res.body.notes.should.equal('some notes');
            res.body.county.should.equal('Contra Costa County');

            done();
          });
      });
  });

  it('should show error to get a single measurement if not logged', function (done) {

      can_depth_array = [1, 2, 3, 4, 5];
      measurements = new Measurements({
        "user": user,
        "can_depths": can_depth_array,
        "results": {uniformity_distribution: 0.33, irrigation_rate: 1.5},
        "zipcode": 94523,
        "time": 2,
        "notes": 'some notes',
        "county": 'Contra Costa County'
      });

      //save measurement to database
      measurements.save(function(){});

      // Get the userId
      var measurementID = measurements.id;

      // Save a new Duc
      agent.get('/api/measurements/' + measurementID)
        .expect(403)
        .end(function (err, res) {

          done(err);
      });
  });

  it('should be able to delete a measurement if logged in as admin', function (done) {
    user.roles = ['admin'];

    //save user to database
    user.save(function (){
      can_depth_array = [1, 2, 3, 4, 5];
      measurements = new Measurements({
        "user": user,
        "can_depths": can_depth_array,
        "results": {uniformity_distribution: 0.33, irrigation_rate: 1.5},
        "zipcode": 94523,
        "time": 2,
        "notes": 'some notes',
        "county": 'Contra Costa County'
      });

      //save measurement to database
      measurements.save(function(){});
    });

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var measurementID = measurements.id;

        // Save a new Duc
        agent.delete('/api/measurements/' + measurementID)
          .expect(200)
          .end(function (err, res) {
            should.not.exist(err);
            done();
          });
      });
  });

  it('should show an error to delete a measurement if logged in as user', function (done) {

    //save user to database
    user.save(function (){
      can_depth_array = [1, 2, 3, 4, 5];
      measurements = new Measurements({
        "user": user,
        "can_depths": can_depth_array,
        "results": {uniformity_distribution: 0.33, irrigation_rate: 1.5},
        "zipcode": 94523,
        "time": 2,
        "notes": 'some notes',
        "county": 'Contra Costa County'
      });

      //save measurement to database
      measurements.save(function(){});
    });

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var measurementID = measurements.id;

        // Save a new Duc
        agent.delete('/api/measurements/' + measurementID)
          .expect(403)
          .end(function (err, res) {
            done(err);
          });
      });
  });

  it('should show error to get a single measurement if not logged', function (done) {

      can_depth_array = [1, 2, 3, 4, 5];
      measurements = new Measurements({
        "user": user,
        "can_depths": can_depth_array,
        "results": {uniformity_distribution: 0.33, irrigation_rate: 1.5},
        "zipcode": 94523,
        "time": 2,
        "notes": 'some notes',
        "county": 'Contra Costa County'
      });

      //save measurement to database
      measurements.save(function(){});

      // Get the userId
      var measurementID = measurements.id;

      // Save a new Duc
      agent.delete('/api/measurements/' + measurementID)
        .expect(403)
        .end(function (err, res) {

          done(err);
      });
  });

  it('should be able to exmail result if logged in as admin', function (done) {
    user.roles = ['admin'];

    //save user to database
    user.save(function (){
      can_depth_array = [1, 2, 3, 4, 5];
      measurements = new Measurements({
        "user": user,
        "can_depths": can_depth_array,
        "results": {uniformity_distribution: 0.33, irrigation_rate: 1.5},
        "zipcode": 94523,
        "time": 2,
        "notes": 'some notes',
        "county": 'Contra Costa County'
      });

      //save measurement to database
      measurements.save(function(){});
    });

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var measurementID = measurements.id;

        var data = {
          condition : 'Good',
          metric : true
        }
        // Save a new Duc
        agent.post('/api/email-result/' + measurementID)
          .send(data)
          .expect(400)
          .end(function (err, res) {
            res.body.message.should.be.equal('Failure sending email_context');
            done();
          });
      });
  });

  it('should be able to exmail result if logged in as user', function (done) {

    //save user to database
    user.save(function (){
      can_depth_array = [1, 2, 3, 4, 5];
      measurements = new Measurements({
        "user": user,
        "can_depths": can_depth_array,
        "results": {uniformity_distribution: 0.33, irrigation_rate: 1.5},
        "zipcode": 94523,
        "time": 2,
        "notes": 'some notes',
        "county": 'Contra Costa County'
      });

      //save measurement to database
      measurements.save(function(){});
    });

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var measurementID = measurements.id;

        var data = {
          condition : 'Good',
          metric : true
        }
        // Save a new Duc
        agent.post('/api/email-result/' + measurementID)
          .send(data)
          .expect(400)
          .end(function (err, res) {
            res.body.message.should.be.equal('Failure sending email_context');
            done();
          });
      });
  });

  it('should be able to exmail result if not logged in', function (done) {

      can_depth_array = [1, 2, 3, 4, 5];
      measurements = new Measurements({
        "user": user,
        "can_depths": can_depth_array,
        "results": {uniformity_distribution: 0.33, irrigation_rate: 1.5},
        "zipcode": 94523,
        "time": 2,
        "notes": 'some notes',
        "county": 'Contra Costa County'
      });

      //save measurement to database
      measurements.save(function(){});

   

      // Get the userId
      var measurementID = measurements.id;

      var data = {
        condition : 'Good',
        metric : true
      }
      // Save a new Duc
      agent.post('/api/email-result/' + measurementID)
        .send(data)
        .expect(403)
        .end(function (err, res) {
          done(err);
        });
  });


  afterEach(function (done) {
    User.remove().exec(function () {
      Measurements.remove().exec(done);
    });
  });
});
