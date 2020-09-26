'use strict';

const Metadata = require('../../util/meta');
/**
 * The `@authenticated` decorator adds authentication middleware before an endpoint
 * within a `Routes` or `Resource` class, requiring that a user have valid credentials
 * before they can access the decorated endpoint(s).
 *
 * Assumes that you've `require`'d an `AuthenticationProvider`, and that you
 * have set up an `@authconfig` `Module`.
 *
 * If an object is passed as an argument to the decorator, it is used for configuration purposes,
 * and supports the following keys:
 * - `boolean config.redirect` true iff should automatically redirect to `app.get('login route')`
 *   if user is not signed in.
 * - `boolean config.register` register user automatically if they are not registered.
 *             (rather than failing and throwing an `$err.Authentication`).
 *
 * See [`authconfig`](#authconfig) and
 * [`AuthenticationProvider`](#authenticationprovider) for more information.
 *
 * @param {Class|Method|object} args - A configuration object (returning a decorator), or the Method
 *                                         or Class to directly apply this decorator to.
 *
 * @example
 * // Note: decorator works the same way on Routes or Resource classes
 *
 * const Routes = require('ravel').Routes;
 * const mapping = Routes.mapping;
 * const authenticated = Routes.authenticated;
 * // &#64;Routes('/')
 * class MyRoutes {
 *   // &#64;authenticated({redirect: true}) // works at the method-level, with or without arguments
 *   // &#64;mapping(Routes.GET, 'app')
 *   async handler (ctx) {
 *     // will redirect to this.$params.get('login route') if not signed in
 *   }
 * }
 * @example
 * // Note: decorator works the same way on Routes or Resource classes
 *
 * const Resource = require('ravel').Resource;
 * const authenticated = Resource.authenticated;
 *
 * // &#64;authenticated // works at the class-level as well (with or without arguments)
 * // &#64;Resource('/')
 * class MyResource {
 *   async handler (ctx) {
 *     // will respond with a 401 if not signed in
 *   }
 * }
 */


function authenticated(...args) {
  if (args.length === 3 && typeof args[0].constructor === 'function') {
    Metadata.putMethodMeta(args[0], args[1], '@authenticated', 'config', Object.create(null));
  } else if (args.length === 1 && typeof args[0] === 'function') {
    // handle @authenticated at the class-level without arguments
    Metadata.putClassMeta(args[0].prototype, '@authenticated', 'config', Object.create(null));
  } else {
    const config = args[0] ? args[0] : Object.create(null);
    return function (target, key) {
      if (key === undefined) {
        Metadata.putClassMeta(target.prototype, '@authenticated', 'config', config);
      } else {
        Metadata.putMethodMeta(target, key, '@authenticated', 'config', config);
      }
    };
  }
}
/*!
 * Export the `@authenticated` decorator
 */


module.exports = authenticated;