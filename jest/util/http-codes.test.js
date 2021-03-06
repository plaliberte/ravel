const Ravel = require('../../lib/ravel');

describe('Ravel', () => {
  describe('httpCodes', () => {
    it('should return the appropriate status code for a given name', () => {
      expect(Ravel.httpCodes.OK).toBe(200);
      expect(Ravel.httpCodes.CREATED).toBe(201);
      expect(Ravel.httpCodes.NO_CONTENT).toBe(204);
      expect(Ravel.httpCodes.PARTIAL_CONTENT).toBe(206);
      expect(Ravel.httpCodes.MULTIPLE_CHOICES).toBe(300);
      expect(Ravel.httpCodes.MOVED_PERMANENTLY).toBe(301);
      expect(Ravel.httpCodes.FOUND).toBe(302);
      expect(Ravel.httpCodes.SEE_OTHER).toBe(303);
      expect(Ravel.httpCodes.NOT_MODIFIED).toBe(304);
      expect(Ravel.httpCodes.USE_PROXY).toBe(305);
      expect(Ravel.httpCodes.SWITCH_PROXY).toBe(306);
      expect(Ravel.httpCodes.TEMPORARY_REDIRECT).toBe(307);
      expect(Ravel.httpCodes.PERMANENT_REDIRECT).toBe(308);
      expect(Ravel.httpCodes.BAD_REQUEST).toBe(400);
      expect(Ravel.httpCodes.UNAUTHORIZED).toBe(401);
      expect(Ravel.httpCodes.PAYMENT_REQUIRED).toBe(402);
      expect(Ravel.httpCodes.FORBIDDEN).toBe(403);
      expect(Ravel.httpCodes.NOT_FOUND).toBe(404);
      expect(Ravel.httpCodes.METHOD_NOT_ALLOWED).toBe(405);
      expect(Ravel.httpCodes.NOT_ACCEPTABLE).toBe(406);
      expect(Ravel.httpCodes.PROXY_AUTHENTICATION_REQUIRED).toBe(407);
      expect(Ravel.httpCodes.REQUEST_TIMEOUT).toBe(408);
      expect(Ravel.httpCodes.CONFLICT).toBe(409);
      expect(Ravel.httpCodes.GONE).toBe(410);
      expect(Ravel.httpCodes.LENGTH_REQUIRED).toBe(411);
      expect(Ravel.httpCodes.PRECONDITION_FAILED).toBe(412);
      expect(Ravel.httpCodes.REQUEST_ENTITY_TOO_LARGE).toBe(413);
      expect(Ravel.httpCodes.REQUEST_URI_TOO_LONG).toBe(414);
      expect(Ravel.httpCodes.UNSUPPORTED_MEDIA_TYPE).toBe(415);
      expect(Ravel.httpCodes.REQUESTED_RANGE_NOT_SATISFIABLE).toBe(416);
      expect(Ravel.httpCodes.EXPECTATION_FAILED).toBe(417);
      expect(Ravel.httpCodes.IM_A_TEAPOT).toBe(418);
      expect(Ravel.httpCodes.AUTHENTICATION_TIMEOUT).toBe(419);
      expect(Ravel.httpCodes.METHOD_FAILURE).toBe(420);
      expect(Ravel.httpCodes.UNPROCESSABLE_ENTITY).toBe(422);
      expect(Ravel.httpCodes.LOCKED).toBe(423);
      expect(Ravel.httpCodes.FAILED_DEPENDENCY).toBe(424);
      expect(Ravel.httpCodes.UPGRADE_REQUIRED).toBe(426);
      expect(Ravel.httpCodes.PRECONDITION_REQUIRED).toBe(428);
      expect(Ravel.httpCodes.TOO_MANY_REQUESTS).toBe(429);
      expect(Ravel.httpCodes.REQUEST_HEADER_FIELDS_TOO_LARGE).toBe(431);
      expect(Ravel.httpCodes.LOGIN_TIMEOUT).toBe(440);
      expect(Ravel.httpCodes.NO_RESPONSE).toBe(444);
      expect(Ravel.httpCodes.RETRY_WITH).toBe(449);
      expect(Ravel.httpCodes.BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS).toBe(450);
      expect(Ravel.httpCodes.UNAVAILABLE_FOR_LEGAL_REASONS).toBe(451);
      expect(Ravel.httpCodes.REQUEST_HEADER_TOO_LARGE).toBe(494);
      expect(Ravel.httpCodes.CERT_ERROR).toBe(495);
      expect(Ravel.httpCodes.NO_CERT).toBe(496);
      expect(Ravel.httpCodes.HTTP_TO_HTTPS).toBe(497);
      expect(Ravel.httpCodes.TOKEN_EXPIRED_INVALID).toBe(498);
      expect(Ravel.httpCodes.CLIENT_CLOSED_REQUEST).toBe(499);
      expect(Ravel.httpCodes.INTERNAL_SERVER_ERROR).toBe(500);
      expect(Ravel.httpCodes.NOT_IMPLEMENTED).toBe(501);
      expect(Ravel.httpCodes.BAD_GATEWAY).toBe(502);
      expect(Ravel.httpCodes.SERVICE_UNAVAILABLE).toBe(503);
      expect(Ravel.httpCodes.GATEWAY_TIMEOUT).toBe(504);
      expect(Ravel.httpCodes.HTTP_VERSION_NOT_SUPPORTED).toBe(505);
      expect(Ravel.httpCodes.VARIANT_ALSO_NEGOTIATES).toBe(506);
      expect(Ravel.httpCodes.INSUFFICIENT_STORAGE).toBe(507);
      expect(Ravel.httpCodes.LOOP_DETECTED).toBe(508);
      expect(Ravel.httpCodes.BANDWIDTH_LIMIT_EXCEEDED).toBe(509);
      expect(Ravel.httpCodes.NOT_EXTENDED).toBe(510);
      expect(Ravel.httpCodes.NETWORK_AUTHENTICATION_REQUIRED).toBe(511);
      expect(Ravel.httpCodes.ORIGIN_ERROR).toBe(520);
      expect(Ravel.httpCodes.WEB_SERVER_IS_DOWN).toBe(521);
      expect(Ravel.httpCodes.CONNECTION_TIMED_OUT).toBe(522);
      expect(Ravel.httpCodes.PROXY_DECLINED_REQUEST).toBe(523);
      expect(Ravel.httpCodes.A_TIMEOUT_OCCURRED).toBe(524);
      expect(Ravel.httpCodes.NETWORK_READ_TIMEOUT_ERROR).toBe(598);
      expect(Ravel.httpCodes.NETWORK_CONNECT_TIMEOUT_ERROR).toBe(599);
    });
  });
});
