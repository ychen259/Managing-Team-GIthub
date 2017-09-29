'use strict';

describe('Ducs E2E Tests:', function () {
  describe('Test Ducs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ducs');
      expect(element.all(by.repeater('duc in ducs')).count()).toEqual(0);
    });
  });
});
