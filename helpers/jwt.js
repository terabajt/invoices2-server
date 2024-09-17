import expressJwt from "express-jwt";

function authJwt() {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;

  return expressJwt({
    secret,
    algorithms: ["HS256"],
    // isRevoked: isRevoked,
  }).unless({
    path: [
      `${api}/users/login`,
      `${api}/users/register`,
      /\/activation\/*/,

      // { url: /(.*)/ },
    ],
  });
}

export default authJwt;
