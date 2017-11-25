'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  //Duc = mongoose.model('Duc'),
 // Measurements = require("../../server/models/measurements.server.model.js");
  Measurements = mongoose.model('Measurement');
/**
 * Globals
 */
var user,
  measurements,can_depth_array, id, user_id;

/**
 * Unit tests
 */
 
describe('Duc Model Unit Tests:', function() {

  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'testss',
      password: 'M3@n.jsI$Aw3$0m3',
      provider: 'local'
    });
   

    user.save(function() {
      user_id = user._id;

      can_depth_array = [1, 2, 3, 4, 5];

      measurements = new Measurements({
        user: user,
        can_depths: can_depth_array,
        results: {uniformity_distribution: 0.33, irrigation_rate:1.5},
        zipcode: 94523,
        time: 2,
        notes: 'some notes',
        county: 'Contra Costa County',
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);

       measurements.save(function(err) {
        should.not.exist(err);
        id = measurements._id;
        done();
      });
    });

    it('should be able to save without notes', function(done) {
      measurements.notes = '';

       measurements.save(function(err) {
        should.not.exist(err);
        id = measurements._id;
        done();
      });
    });

    it('should be able to show an error when without can_depths', function(done) {
      measurements.can_depths= [];

       measurements.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when without results', function(done) {
      measurements.results= '';

       measurements.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to save without zipcode', function(done) {
      measurements.zipcode= '';

       measurements.save(function(err) {
        should.not.exist(err);
        id = measurements._id;
        done();
      });
    });

    it('should be able to show an error when without county', function(done) {
      measurements.county= '';

       measurements.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when without time', function(done) {
      measurements.time= '';

       measurements.save(function(err) {
        should.exist(err);
        done();
      });
    });

    afterEach(function(done) {
      if(user_id){
        User.remove({_id: user_id}, function(err){
          user_id = null;
        });
      } 

      if(id) {
        Measurements.remove({_id: id}, function(err){
          id = null;
          done();
        });
      } else {
        done();
      }
    });

  });
});
