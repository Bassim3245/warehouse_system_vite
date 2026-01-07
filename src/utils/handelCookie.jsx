import Cookies from "js-cookie";
/**
 * Sets the access token and refresh token in cookies with configurable expiration.
 * @param {string} accessToken - The access token.
 * @param {string} refreshToken - The refresh token.
 */
export const setToken = (accessToken, refreshToken) => {
  const cookieOptions = {
    expires: 1,
    path: "/",
    sameSite: "Strict",
    secure: window.location.protocol === "https:",
    domain: window.location.hostname,
  };
  Cookies.set("authToken", accessToken, cookieOptions);
  Cookies.set("refreshToken", refreshToken, cookieOptions);
};
/**
 * Retrieves the access token from cookies.
 * @returns {string | undefined} - The access token, or undefined if not set.
 */
export const getToken = () => {
  return Cookies.get("authToken");
};
/**
 * Retrieves the refresh token from cookies.
 * @returns {string | undefined} - The refresh token, or undefined if not set.
 */
export const getRefreshToken = () => {
  return Cookies.get("refreshToken");
};
/**
 * Removes the access token and refresh token from cookies.
 */
export const removeToken = () => {
  Cookies.remove("authToken", { path: "/", domain: window.location.hostname });
  Cookies.remove("refreshToken", {
    path: "/",
    domain: window.location.hostname,
  });
  Cookies.remove("accessToken", {
    path: "/",
    domain: window.location.hostname,
  });
  Cookies.remove("applicationPermissions", {
    path: "/",
    domain: window.location.hostname,
  });
  Cookies.remove("user", { path: "/", domain: window.location.hostname });
};
/**
 * Sets the application permissions in cookies.
 * @param {object} permissions - The application permissions.
 */
export const setPermissions = (permissions) => {
  if (permissions) {
    const cookieOptions = {
      expires: 1,
      path: "/",
      sameSite: "Strict",
      secure: window.location.protocol === "https:",
      domain: window.location.hostname,
    };
    Cookies.set(
      "applicationPermissions",
      JSON.stringify(permissions),
      cookieOptions
    );
  }
};

export const setUserInformation = (userIfo) => {
  if (userIfo) {
    const cookieOptions = {
      expires: 1,
      path: "/",
      sameSite: "Strict",
      secure: window.location.protocol === "https:",
      domain: window.location.hostname,
    };
    Cookies.set("user", JSON.stringify(userIfo), cookieOptions);
  }
};

export const setCompanyStructure = (companyPermission) => {
  if (companyPermission) {
    const cookieOptions = {
      expires: 1,
      path: "/",
      sameSite: "Strict",
      secure: window.location.protocol === "https:",
      domain: window.location.hostname,
    };
    Cookies.set("companyPermission", JSON.stringify(companyPermission), cookieOptions);
  }
};
/**
 * Retrieves the application permissions from cookies.
 * @returns {object|null} - The application permissions, or null if not set.
 */
export const getPermissions = () => {
  const permissions = Cookies.get("applicationPermissions");
  return permissions ? JSON.parse(permissions) : null;
};

export const getUserInformation = () => {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
};
export const getCompanyStructure = () => {
  const companyPermission = Cookies.get("companyPermission");
  return companyPermission ? JSON.parse(companyPermission) : null;
};
