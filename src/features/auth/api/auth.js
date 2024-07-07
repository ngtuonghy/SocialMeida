import env from "~/config/env";

const serverUrl = env.serverPort;

export function getGoogleOAuthURL() {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
  const option = {
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  // console.log(option);
  const qs = new URLSearchParams(option);
  return `${rootUrl}?${qs.toString()}`;
}

// import config from "config"
export function getGithubOAuthURL() {
  const rootUrl = `https://github.com/login/oauth/authorize`;
  const option = {
    redirect_uri: process.env.GITHUB_OAUTH_REDIRECT_URL,
    client_id: process.env.GITHUB_CLIENT_ID,
    scope: "user:email",
  };
  const qs = new URLSearchParams(option);
  // console.log(qs.toString());
  return `${rootUrl}?${qs.toString()}`;
}

export const checkuser = async (username) => {
  try {
    const res = await fetch(`${serverUrl}api/v1/auth/${username}`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    return res;
  } catch {
    throw new Error("Failed to checkuser");
  }
};
export const login = async (data) => {
  try {
    const res = await fetch(`${serverUrl}api/v1/auth/login`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
    return res;
  } catch {
    throw new Error("Failed to get login");
  }
};

export const register = async (data) => {
  try {
    const res = await fetch(`${serverUrl}api/v1/auth/register`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
    return res;
  } catch {
    throw new Error("Failed to get register");
  }
};
