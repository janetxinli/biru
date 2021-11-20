export const getCookieHeader = (token) => {
  return {
    headers: {
      Cookie: `biruCookie=${token}; HttpOnly;`,
    },
  };
};
