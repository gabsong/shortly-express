/**
 * write a middleware function that will access the cookies on
 * an incoming request, parse them into an object, and assign
 * this object to a cookies property on the request.
 */
const parseCookies = (req, res, next) => {
  const rawCookies = req.get('Cookie') || '';

  parsedCookies = rawCookies.split('; ').reduce((cookies, rawCookie) => {
    if (rawCookie.length) {
      const [ key, token ] = rawCookie.split('=');
      cookies[key] = token;
    }
    return cookies;
  }, {});

  req.cookies = parsedCookies;

  next();
};

module.exports = parseCookies;