'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  path = require('path'),
  fs = require('fs'),
  request = require('supertest'),
  config = require(path.resolve('./config/config')),
  logger = require(path.resolve('./config/lib/logger')),
  seed = require(path.resolve('./config/lib/mongo-seed')),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  user1,
  admin1,
  userFromSeedConfig,
  adminFromSeedConfig,
  originalLogConfig;

describe('Configuration Tests:', function () {

  describe('Testing Mongo Seed', function () {
    var _seedConfig = _.clone(config.seedDB, true);
    var userSeedConfig;
    var _admin;
    var _user;

    before(function (done) {
      _admin = {
        username: 'test-seed-admin',
        email: 'test-admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Test',
        roles: ['admin', 'user']
      };

      _user = {
        username: 'test-seed-user',
        email: 'test-user@localhost.com',
        firstName: 'User',
        lastName: 'Test',
        roles: ['user']
      };

      var userCollections = _.filter(_seedConfig.collections, function (collection) {
        return collection.model === 'User';
      });

      // userCollections.should.be.instanceof(Array).and.have.lengthOf(1);
      userSeedConfig = userCollections[0];

      return done();
    });

    it('should have default seed configuration set for users', function (done) {
      userSeedConfig.should.be.instanceof(Object);
      userSeedConfig.docs.should.be.instanceof(Array).and.have.lengthOf(2);

      should.exist(userSeedConfig.docs[0].data.username);
      should.exist(userSeedConfig.docs[0].data.email);
      should.exist(userSeedConfig.docs[0].data.firstName);
      should.exist(userSeedConfig.docs[0].data.lastName);
      should.exist(userSeedConfig.docs[0].data.roles);

      should.exist(userSeedConfig.docs[1].data.username);
      should.exist(userSeedConfig.docs[1].data.email);
      should.exist(userSeedConfig.docs[1].data.firstName);
      should.exist(userSeedConfig.docs[1].data.lastName);
      should.exist(userSeedConfig.docs[1].data.roles);

      return done();
    });

    it('should NOT seed user when missing username with custom options', function (done) {
      var invalid = _.clone(_user, true);
      invalid.username = undefined;

      seed
        .start({
          collections: [{
            model: 'User',
            docs: [{
              data: invalid
            }]
          }]
        })
        .then(function () {
          // We should not make it here so we
          // force an assert failure to prevent hangs.
          should.exist(undefined);
          return done();
        })
        .catch(function (err) {
          should.exist(err);
          err.message.should.equal('User validation failed: username: Please fill in a username');

          return done();
        });
    });
  });

  describe('Testing Session Secret Configuration', function () {
    it('should warn if using default session secret when running in production', function (done) {
      var conf = { sessionSecret: 'MEAN' };
      // set env to production for this test
      process.env.NODE_ENV = 'production';
      config.utils.validateSessionSecret(conf, true).should.equal(false);
      // set env back to test
      process.env.NODE_ENV = 'test';
      return done();
    });

    it('should accept non-default session secret when running in production', function () {
      var conf = { sessionSecret: 'super amazing secret' };
      // set env to production for this test
      process.env.NODE_ENV = 'production';
      config.utils.validateSessionSecret(conf, true).should.equal(true);
      // set env back to test
      process.env.NODE_ENV = 'test';
    });

    it('should accept default session secret when running in development', function () {
      var conf = { sessionSecret: 'MEAN' };
      // set env to development for this test
      process.env.NODE_ENV = 'development';
      config.utils.validateSessionSecret(conf, true).should.equal(true);
      // set env back to test
      process.env.NODE_ENV = 'test';
    });

    it('should accept default session secret when running in test', function () {
      var conf = { sessionSecret: 'MEAN' };
      config.utils.validateSessionSecret(conf, true).should.equal(true);
    });
  });

  describe('Testing Logger Configuration', function () {

    beforeEach(function () {
      originalLogConfig = _.clone(config.log, true);
    });

    afterEach(function () {
      config.log = originalLogConfig;
    });

    it('should retrieve the log format from the logger configuration', function () {

      config.log = {
        format: 'tiny'
      };

      var format = logger.getLogFormat();
      format.should.be.equal('tiny');
    });

    it('should retrieve the log options from the logger configuration for a valid stream object', function () {

      var options = logger.getMorganOptions();

      options.should.be.instanceof(Object);
      options.should.have.property('stream');

    });

    it('should verify that a file logger object was created using the logger configuration', function () {
      var _dir = process.cwd();
      var _filename = 'unit-test-access.log';

      config.log = {
        fileLogger: {
          directoryPath: _dir,
          fileName: _filename
        }
      };

      var fileTransport = logger.getLogOptions(config);
      fileTransport.should.be.instanceof(Object);
      fileTransport.filename.should.equal(_dir + '/' + _filename);
    });

    it('should use the default log format of "combined" when an invalid format was provided', function () {

      var _logger = require(path.resolve('./config/lib/logger'));

      // manually set the config log format to be invalid
      config.log = {
        format: '_some_invalid_format_'
      };

      var format = _logger.getLogFormat();
      format.should.be.equal('combined');
    });

    it('should not create a file transport object if critical options are missing: filename', function () {

      // manually set the config stream fileName option to an empty string
      config.log = {
        format: 'combined',
        options: {
          stream: {
            directoryPath: process.cwd(),
            fileName: ''
          }
        }
      };

      var fileTransport = logger.getLogOptions(config);
      fileTransport.should.be.false();
    });

    it('should not create a file transport object if critical options are missing: directory', function () {

      // manually set the config stream fileName option to an empty string
      config.log = {
        format: 'combined',
        options: {
          stream: {
            directoryPath: '',
            fileName: 'app.log'
          }
        }
      };

      var fileTransport = logger.getLogOptions(config);
      fileTransport.should.be.false();
    });
  });

  describe('Testing exposing environment as a variable to layout', function () {

    ['development', 'production', 'test'].forEach(function (env) {
      it('should expose environment set to ' + env, function (done) {
        // Set env to development for this test
        process.env.NODE_ENV = env;

        // Gget application
        app = express.init(mongoose.connection.db);
        agent = request.agent(app);

        // Get rendered layout
        agent.get('/')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(200)
          .end(function (err, res) {
            // Set env back to test
            process.env.NODE_ENV = 'test';
            // Handle errors
            if (err) {
              return done(err);
            }
            res.text.should.containEql('env = "' + env + '"');
            return done();
          });
      });
    });

  });

});