'use strict';

const EventEmitter = require('events').EventEmitter;

const sRavelInstance = Symbol('ravelInstance');
const SESSION_KEY = 'session';
const TTL_KEY = 'rolling_ttl';
/**
 * Shorthand for adapting callbacks to `Promise`s.
 *
 * @param {Function} resolve - A resolve function.
 * @param {Function} reject - A reject function.
 * @private
 */

function finishBasicPromise(resolve, reject) {
  return (err, res) => {
    if (err) {
      return reject(err);
    } else {
      return resolve(res);
    }
  };
}
/**
 * Replacement for koa-redis.
 *
 * @private
 */


class RedisSessionStore extends EventEmitter {
  constructor(ravelInstance) {
    super();
    this[sRavelInstance] = ravelInstance;
    this[sRavelInstance].$kvstore.on('connect', this.emit.bind(this, 'connect'));

    if (this[sRavelInstance].$kvstore.connected) {
      this.emit('connect');
    }

    this[sRavelInstance].$kvstore.on('error', this.emit.bind(this, 'error'));
    this[sRavelInstance].$kvstore.on('end', this.emit.bind(this, 'end'));
    this[sRavelInstance].$kvstore.on('end', this.emit.bind(this, 'disconnect')); // For backwards compatibility

    this[sRavelInstance].$kvstore.on('connect', this.emit.bind(this, 'connect'));
    this[sRavelInstance].$kvstore.on('reconnecting', this.emit.bind(this, 'reconnecting'));
    this[sRavelInstance].$kvstore.on('ready', this.emit.bind(this, 'ready'));
    this[sRavelInstance].$kvstore.on('warning', this.emit.bind(this, 'warning'));
  }

  get connected() {
    return this[sRavelInstance].$kvstore.connected;
  }

  get(sid) {
    console.log('GET session');
    return new Promise((resolve, reject) => {
      this[sRavelInstance].$kvstore.hmget(sid, [SESSION_KEY, TTL_KEY], (err, res) => {
        let sess = null;
        let ttl = null;

        if (res !== null && res !== undefined) {
          sess = res[0];
          ttl = res[1];
        }

        if (ttl !== null && ttl !== undefined) {
          // Bump the ttl
          console.log('BUMP EXPIRY', ttl);
          this[sRavelInstance].$kvstore.expire(sid, ttl, finishBasicPromise(resolve, reject));
        }

        if (err) {
          return reject(err);
        } else if (sess !== null && sess !== undefined) {
          return resolve(JSON.parse(sess));
        } else {
          return resolve(null);
        }
      });
    });
  }

  set(sid, sess, ttl, opts = {
    changed: true
  }) {
    console.log('SET', opts, ttl);
    return new Promise((resolve, reject) => {
      if (typeof ttl === 'number') {
        ttl = Math.ceil(ttl / 1000);
      }

      if (opts.changed) {
        const jsess = JSON.stringify(sess);
        const hashObject = {
          session: jsess
        };

        if (ttl !== undefined) {
          if (opts.rolling) {
            hashObject[TTL_KEY] = ttl;
            console.log('BUMP ON SET', ttl);
          }

          this[sRavelInstance].$kvstore.hmset(sid, hashObject, finishBasicPromise(resolve, reject));
          this[sRavelInstance].$kvstore.expire(sid, ttl, finishBasicPromise(resolve, reject));
        } else {
          this[sRavelInstance].$kvstore.hmset(sid, hashObject, finishBasicPromise(resolve, reject));
        }
      } else if (ttl !== undefined) {
        this[sRavelInstance].$kvstore.expire(sid, ttl, finishBasicPromise(resolve, reject));
      } else {
        // Nothing to be done
        resolve();
      }
    });
  }

  destroy(sid) {
    console.log('DESTROY SESSION');
    return new Promise((resolve, reject) => {
      this[sRavelInstance].$kvstore.del(sid, finishBasicPromise(resolve, reject));
    });
  }

  quit() {// Do nothing. We'll let ravel manage its own redis connection - we're just borrowing it.
  }

  end() {
    this.quit();
  }

}

module.exports = RedisSessionStore;