// extract token from getServerSideProps context
export const extractToken = (ctx) => {
  const cookies = ctx.req.cookies;
  const token = cookies["biruCookie"];

  return token;
};
