import globalConfig from "../../../globalConfig.json";

// extract token from getServerSideProps context
export const extractToken = (ctx) => {
  const cookies = ctx.req.cookies;
  const token = cookies[globalConfig.SESSION_NAME];

  return token;
};
