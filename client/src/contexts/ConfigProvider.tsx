import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import { axiosClient } from "../utils/apiClient";
import { AuthContext } from "./AuthProvider";

type ItemConfig<T> = {
  [key: string]: T;
};

type ConfigContextData<TUserConfig, TGlobalConfig> = {
  userConfig: ItemConfig<TUserConfig>;
  globalConfig: ItemConfig<TGlobalConfig>;
};

const ConfigProvider = () => {
  return <></>;
};

export default ConfigProvider;
