/**
 * write a middleware function that will access the cookies on
 * an incoming request, parse them into an object, and assign
 * this object to a cookies property on the request.
 */
const parseCookies = (req, res, next) => {
  const { cookie } = req.headers;

  // create cookies property if undefined
  if (!req.cookies) {
    req.cookies = {};
  }

  if (cookie) {
    const collection = cookie.split('; ');
    collection.forEach((str) => {
      const [ key, value ] = str.split('=');
      req.cookies[key] = value;
    });
  }

  next();
};

module.exports = parseCookies;