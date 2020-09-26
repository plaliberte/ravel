describe('util/rest', () => {
  let app, store;

  beforeEach(async () => {
    const Ravel = require('../../lib/ravel');
    app = new Ravel();
    app.set('keygrip keys', ['abc']);
    app.set('log level', app.$log.NONE);
    await app.init();
    store = new (require('../../lib/util/redis_session_store'))(app);
  });

  describe('RedisSessionStore', () => {
    describe('#connected()', () => {
      it('should return the connection status of the internal.$kvstore', async () => {
        expect(store.connected).toBe(app.$kvstore.connected);
      });
    });

    describe('#get()', () => {
      it('should return a Promise which resolves with a JSON object representing the user\'s session', async () => {
        const session = { username: 'smcintyre' };
        app.$kvstore.hset('koa:sess:1234', { session: JSON.stringify(session) });
        await expect(store.get('koa:sess:1234')).resolves.toEqual(session);
      });

      it('should return a Promise which resolves with null if the specified session id does not exist', async () => {
        await expect(store.get('koa:sess:1234')).resolves.toEqual(null);
      });

      it('should return a Promise which rejects if redis calls back with an error', async () => {
        const session = { username: 'smcintyre' };
        const getError = new Error('getError');
        app.$kvstore.hmget = jest.fn(function (id, keys, cb) { cb(getError); });
        app.$kvstore.set('koa:sess:1234', JSON.stringify(session));
        await expect(store.get('koa:sess:1234')).rejects.toThrow(getError);
      });
    });

    describe('#set()', () => {
      it('should return a Promise which resolves after storing the user\'s session', async () => {
        const session = { username: 'smcintyre' };
        await expect(store.set('koa:sess:1234', session)).resolves;
        await expect(store.get('koa:sess:1234')).resolves.toEqual(session);
      });

      it('should return a Promise which resolves after storing the user\'s session with a ttl', async () => {
        const session = { username: 'smcintyre' };
        // expire from redis-mock sets a timeout, which stops test from exiting cleanly. Just stub it with nothing.
        app.$kvstore.expire = jest.fn(function (key, ttl, cb) { });
        await expect(store.set('koa:sess:1234', session, 1000 * 1000)).resolves;
        await expect(store.get('koa:sess:1234')).resolves.toEqual(session);
        expect(app.$kvstore.expire).toHaveBeenCalledWith('koa:sess:1234', 1000, expect.any(Function));
      });

      it('should return a Promise which rejects if redis calls back with an error', async () => {
        const session = { username: 'smcintyre' };
        const setError = new Error();
        app.$kvstore.hmset = jest.fn(function (key, value, cb) { cb(setError); });
        await expect(store.set('koa:sess:1234', session)).rejects.toThrow(setError);
      });

      it('should return a Promise which rejects if redis calls back with an error (ttl version)', async () => {
        const session = { username: 'smcintyre' };
        const setexError = new Error();
        app.$kvstore.expire = jest.fn(function (key, ttl, cb) { cb(setexError); });
        await expect(store.set('koa:sess:1234', session, 1000 * 1000)).rejects.toThrow(setexError);
      });

      it('should only update the expire on unchanged session', async () => {
        const session = { username: 'smcintyre' };
        await expect(store.set('koa:sess:1234', session)).resolves;

        app.$kvstore.expire = jest.fn(function (key, ttl, cb) { });

        const secondSession = { username: 'plaliberte' };
        await expect(store.set('koa:sess:1234', secondSession, 1000 * 1000, { changed: false })).resolves;
        await expect(store.get('koa:sess:1234')).resolves.toEqual(session);
        expect(app.$kvstore.expire).toHaveBeenCalledWith('koa:sess:1234', 1000, expect.any(Function));
      });

      it('should not create a blank sessions when flagged as unchaged', async () => {
        const session = { username: 'smcintyre' };
        await expect(store.get('koa:sess:1234')).resolves.toBe(null);
        await expect(store.set('koa:sess:1234', session, 1000 * 1000, { changed: false })).resolves;
        await expect(store.get('koa:sess:1234')).resolves.toBe(null);
      });

      it('should setup rolling keys when flagged rolling', async () => {
        const session = { username: 'plaliberte' };
        app.$kvstore.expire = jest.fn(function (key, ttl, cb) { });

        await expect(store.set('koa:sess:1234', session, 1000 * 1000, { changed: true, rolling: true })).resolves;
        expect(app.$kvstore.expire).toHaveBeenCalledWith('koa:sess:1234', 1000, expect.any(Function));
        await expect(store.get('koa:sess:1234')).resolves.toEqual(session);
        expect(app.$kvstore.expire.mock.calls.length).toBe(2);
      });

      it('should not setup rolling keys when not flagged as rolling', async () => {
        const session = { username: 'plaliberte' };
        app.$kvstore.expire = jest.fn(function (key, ttl, cb) { });

        await expect(store.set('koa:sess:1234', session, 1000 * 1000, { changed: true, rolling: false })).resolves;
        expect(app.$kvstore.expire).toHaveBeenCalledWith('koa:sess:1234', 1000, expect.any(Function));
        await expect(store.get('koa:sess:1234')).resolves.toEqual(session);
        expect(app.$kvstore.expire.mock.calls.length).toBe(1);
      });
    });

    describe('#destroy()', () => {
      it('should remove a session from redis', async () => {
        const session = { username: 'smcintyre' };
        await expect(store.set('koa:sess:1234', session)).resolves;
        await expect(store.get('koa:sess:1234')).resolves.toEqual(session);
        await expect(store.destroy('koa:sess:1234')).resolves;
        await expect(store.get('koa:sess:1234')).resolves.toBe(null);
      });

      it('should return a Promise which rejects if redis calls back with an error (ttl version)', async () => {
        const delError = new Error();
        app.$kvstore.del = jest.fn(function (key, cb) { cb(delError); });
        await expect(store.destroy('koa:sess:1234')).rejects.toThrow(delError);
      });
    });

    describe('#quit()', () => {
      it('should do nothing', () => {
        store.quit();
      });
    });

    describe('#end()', () => {
      it('should do nothing', () => {
        store.end();
      });
    });
  });
});
