'use strict';

const httpCodes = require('../util/http_codes');

const symbols = require('./symbols');

const sRavelInstance = Symbol.for('_ravelInstance');
const sShouldRedirect = Symbol.for('_shouldRedirect');
const sAllowMobileRegistration = Symbol.for('_allowMobileRegistration');
const sTokenAuth = Symbol.for('_tokenAuth');
/**
 * Factory for Koa-style middleware which authenticates a request to a route, using
 * either a web-based user's session, or a mobile-based user's authentication token
 * (the latter being supplied via the x-auth-token header).
 *
 * Non-web clients must also identify their type using an x-auth-client header
 * such as:
 * - 'google-oauth2-ios' (for an iOS device)
 * - 'google-oauth2-web' (for a web browser)
 * See specific authentication provider for more details.
 *
 * @private
 */

class AuthenticationMiddleware {
  /**
   * @private
   * @param {object} ravelInstance - An instance of a Ravel app.
   * @param {boolean} redirect - True iff this middleware should redirect to the login page when a
   *                                   user is not authenticated.
   * @param {boolean} allowMobileRegistration - True iff this middleware should automatically register mobile clients
   *                                            the first time they are seen.
   */
  constructor(ravelInstance, redirect, allowMobileRegistration) {
    this[sRavelInstance] = ravelInstance;
    this[sShouldRedirect] = redirect;
    this[sAllowMobileRegistration] = allowMobileRegistration;
    this[sTokenAuth] = require('./authenticate_token')(ravelInstance);
  }
  /**
   * @returns {AsyncFunction} Koa-compatible middleware which validates a web session or mobile auth token,
   *                         potentially redirecting if the user is not authenticated, or registering an
   *                         unknown mobile client automatically.
   * @private
   */


  middleware() {
    const self = this;
    return async function (ctx, next) {
      let promise;

      if (ctx.headers['x-auth-token'] && ctx.headers['x-auth-client']) {
        promise = self[sTokenAuth].credentialToProfile(ctx.headers['x-auth-token'], ctx.headers['x-auth-client']).then(profile => {
          if (self[sAllowMobileRegistration]) {
            return self[sRavelInstance][symbols.authConfigModule].deserializeOrCreateUser(profile);
          } else {
            return self[sRavelInstance][symbols.authConfigModule].deserializeUser(profile.id);
          }
        }).then(user => {
          // set ctx.user for mobile users
          ctx.user = user;
        });
      } else if (!ctx.isAuthenticated || !ctx.isAuthenticated()) {
        // Web user isn't authenticated
        promise = Promise.reject(new self[sRavelInstance].$err.Authentication(`User with session id=${ctx.cookies.get('ravel.sid')} is not authenticated`));
      } else {
        // Web user is authenticated and ctx.user has been set by passport.
        promise = Promise.resolve();
      } // try out the promise, and then try to await next
      // catch all errors, regardless of client type, and behave appropriately


      let errorFromNext = false;

      try {
        await promise;
        errorFromNext = true;
        await next();
      } catch (err) {
        if (!errorFromNext && self[sShouldRedirect]) {
          self[sRavelInstance].$log.error(err);
          ctx.redirect(self[sRavelInstance].get('login route'));
        } else if (!errorFromNext) {
          // if the error didn't come from the next middleware, then
          // we should throw an auth error instead.
          self[sRavelInstance].$log.error(err);
          ctx.status = httpCodes.UNAUTHORIZED;
          throw new self[sRavelInstance].$err.Authentication(`User with session id=${ctx.cookies.get('ravel.sid')} is not authenticated`);
        } else {
          // throw errors which don't come from auth
          throw err;
        }
      }
    };
  }

}
/*!
 * Export AuthenticationMiddleware
 */


module.exports = AuthenticationMiddleware;