// extract cookie from request header
const cookieExtractor = (req) => {
  if (req && req.cookies["biruCookie"]) {
    const token = req.cookies["biruCookie"];
    return token;
  }
};

module.exports = cookieExtractor;
