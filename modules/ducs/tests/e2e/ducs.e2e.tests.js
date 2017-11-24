'use strict';

describe('Duc E2E Tests:', function () {
  var user1 = {
    email: 'myTest@meanjs.com',
    username: 'myTest',
    password: 'P@$$w0rd!!'
  };

  var signup = function(){
    browser.get('http://localhost:3001/authentication/signup');

    element(by.model('vm.credentials.email')).sendKeys(user1.email);
    // Enter Username
    element(by.model('vm.credentials.username')).sendKeys(user1.username);
    // Enter Invalid Password
    element(by.model('vm.credentials.password')).sendKeys(user1.password);
    // Click Submit button
    element(by.css('button[type=submit]')).click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/ducs/create');
  }

  var signout = function () {
    // Make sure user is signed out first
    browser.get('http://localhost:3001/authentication/signout');
    // Delete all cookies
    browser.driver.manage().deleteAllCookies();
  };

  describe('Duc create', function () {
    beforeAll(() => {
      signup();
    });

    afterAll(() => {
      signout();
    });

    it('Should report missing zipcode', function () {
      browser.get('http://localhost:3001/ducs/create');

      //element(by.model('zipcode')).sendKeys('94523');
      element(by.model('num')).sendKeys(5);
      element(by.model('time')).sendKeys(2);
      element(by.model('notes')).sendKeys('some notes');

      // Click continue button
      element(by.buttonText("Continue")).click();

      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Zipcode is required.');
    });

    it('Should report invalide zipcode', function () {
      browser.get('http://localhost:3001/ducs/create');

      element(by.model('zipcode')).sendKeys('12a');
      element(by.model('num')).sendKeys(5);
      element(by.model('time')).sendKeys(2);
      element(by.model('notes')).sendKeys('some notes');

      // Click continue button
      element(by.buttonText("Continue")).click();

      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Please provide valid zipcode');
    });

    it('Should report missing number of Cans', function () {
      browser.get('http://localhost:3001/ducs/create');

      element(by.model('zipcode')).sendKeys('94523');
      //element(by.model('num')).sendKeys(5);
      element(by.model('time')).sendKeys(2);
      element(by.model('notes')).sendKeys('some notes');

      // Click continue button
      element(by.buttonText("Continue")).click();

      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Number of Catch Cans is required');
    });

    it('Should report not positive input for number of cans', function () {
      browser.get('http://localhost:3001/ducs/create');

      element(by.model('zipcode')).sendKeys('94523');
      element(by.model('num')).sendKeys(0);
      element(by.model('time')).sendKeys(2);
      element(by.model('notes')).sendKeys('some notes');

      // Click continue button
      element(by.buttonText("Continue")).click();

      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Please provide a number which is greater than zero');
    });

    it('Should report missing Times', function () {
      browser.get('http://localhost:3001/ducs/create');

      element(by.model('zipcode')).sendKeys('94523');
      element(by.model('num')).sendKeys(5);
      //element(by.model('time')).sendKeys(2);
      element(by.model('notes')).sendKeys('some notes');

      // Click continue button
      element(by.buttonText("Continue")).click();

      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Running Time is required.');
    });

    it('Should report missing Times', function () {
      browser.get('http://localhost:3001/ducs/create');

      element(by.model('zipcode')).sendKeys('94523');
      element(by.model('num')).sendKeys(5);
      element(by.model('time')).sendKeys(0);
      element(by.model('notes')).sendKeys('some notes');

      // Click continue button
      element(by.buttonText("Continue")).click();

      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Please provide a number which is greater than zero');
    });

    it('Should be able to missing notes', function () {
      browser.get('http://localhost:3001/ducs/create');

      element(by.model('zipcode')).sendKeys('94523');
      element(by.model('num')).sendKeys(5);
      element(by.model('time')).sendKeys(2);
      //element(by.model('notes')).sendKeys('some notes');

      // Click continue button
      element(by.buttonText("Continue")).click();
      expect(element.all(by.css('.error-text')).length).toBe(undefined);
    });

    it('Should be able to Go to next with all valid input', function () {
      browser.get('http://localhost:3001/ducs/create');

      element(by.model('zipcode')).sendKeys('94523');
      element(by.model('num')).sendKeys(5);
      element(by.model('time')).sendKeys(2);
      element(by.model('notes')).sendKeys('some notes');

      // Click continue button
      element(by.buttonText("Continue")).click();

      expect(element.all(by.css('.error-text')).length).toBe(undefined);
    });

    it('Should get result if depth input all value', function () {
      browser.get('http://localhost:3001/ducs/create');

      element(by.model('zipcode')).sendKeys('94523');
      element(by.model('num')).sendKeys(5);
      element(by.model('time')).sendKeys(2);
      element(by.model('notes')).sendKeys('some notes');

      // Click continue button
      element(by.buttonText("Continue")).click();

      element(by.id('0')).sendKeys(1);
      element(by.id('1')).sendKeys(5);
      element(by.id('2')).sendKeys(4);
      element(by.id('3')).sendKeys(3);
      element(by.id('4')).sendKeys(2);

      element(by.buttonText("Calculation")).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/ducs/result');
    });

  });
});
