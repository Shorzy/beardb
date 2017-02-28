import { expect } from 'chai';
import sinon from 'sinon';

import { createStore } from '../src/store';

describe('the store', () => {
  let store;
  let insertSpy;

  before(() => {
    insertSpy = sinon.spy();
    const db = {
      insert: insertSpy
    };
    store = createStore(db);
  });

  it('should save the bear', () => {
    const document = { name: 'Bamse' };
    store.saveTeamConfig(document);
    expect(insertSpy.firstCall.args[0].name).to.equal(document.name);
  });
});
