import {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { parseJwt } from "../utils/tokens";
import { axiosClient } from "../utils/apiClient";

export type UserWorkspaceData = {
  workspaceId: string;
  name: string;
  isActive: boolean;
};

type UserData = {
  isLoggedIn?: boolean;
  userId?: string;
  name?: string;
  email?: string;
  devices?: string[];
};

type AuthContextType = {
  state: UserData;
  dispatch: (newUser: UserData) => void;
  logout: () => void;
};

export const getUserDataFromToken = (accessToken?: string | null) => {
  if (!accessToken) {
    accessToken = window.localStorage.getItem("accessToken");
  }

  let userId = "none",
    name = "none",
    email = "none",
    devices = [];

  if (typeof accessToken == "string" && accessToken != "undefined") {
    const userDetails = parseJwt(accessToken);

    userId = userDetails.userId;
    name = userDetails.name;
    email = userDetails.email;
    devices = userDetails.devices;
  }

  return {
    isLoggedIn: accessToken ? true : false,
    userId,
    name,
    email,
    devices,
  };
};

const AuthHelper = ({ logout, children }: any) => {
  useLayoutEffect(() => {
    // using useLayoutEffect - that this useEffect will run before the useEffects of the children components
    axiosClient.interceptors.request.use(
      (req) => {
        const accessToken = window.localStorage.getItem("accessToken");
        if (accessToken) {
          if (!req.url?.includes("/token")) {
            req.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
        return req;
      },
      (err) => {
        console.error(err);
        return err;
      }
    );

    axiosClient.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err.response?.status == 401) {
          if (!err.config.__isRetryRequest) {
            const refreshToken = window.localStorage.getItem("refreshToken");
            if (refreshToken) {
              let accessTokenRes;
              try {
                accessTokenRes = await axiosClient.post(
                  "/token",
                  {
                    oldAccessToken: window.localStorage.getItem("accessToken"),
                  },
                  { headers: { Authorization: `Bearer ${refreshToken}` } }
                );
              } catch (err) {
                logout();
              }
              const accessToken = accessTokenRes?.data?.accessToken;
              if (accessToken) {
                window.localStorage.setItem("accessToken", accessToken);
                err.config.__isRetryRequest = true;
                const response = await axiosClient(err.config);
                return response;
              }
              return err;
            } else {
              logout();
            }
          } else {
            logout();
          }
        } else {
          console.error(err);
          alert(err);
          if (err.response?.status == 410) {
            logout();
          }
          return err;
        }
      }
    );
  }, []);

  return <>{children}</>;
};

export const AuthContext = createContext<AuthContextType>({
  state: {},
  dispatch: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: any) => {
  const [userData, setUserData] = useState(getUserDataFromToken());

  const logout = useCallback(async () => {
    try {
      await axiosClient.post("/logout", {
        refreshToken: window.localStorage.getItem("refreshToken"),
      });
    } catch (err) {
      // you can handle your error more accurate here
      // example - if 500/429 - do retry for /logout after 10s
    }
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    setUserData(getUserDataFromToken());
    window.location.pathname = "/";
  }, []);

  const providerUserValue = useMemo(
    () => ({ state: userData, dispatch: setUserData, logout }),
    [userData, setUserData, logout]
  );

  return (
    <AuthHelper logout={logout}>
      <AuthContext.Provider value={providerUserValue as AuthContextType}>
        {children}
      </AuthContext.Provider>
    </AuthHelper>
  );
};

export default AuthProvider;
