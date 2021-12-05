import globalConfig from "../../../globalConfig.json";

export const getCookieHeader = (token) => {
  return {
    headers: {
      Cookie: `${globalConfig.SESSION_NAME}=${token}; HttpOnly;`,
    },
  };
};
