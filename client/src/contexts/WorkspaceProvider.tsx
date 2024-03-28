import {
  createContext,
  useContext,
  useLayoutEffect,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import { axiosClient } from "../utils/apiClient";
import { AuthContext } from "./AuthProvider";
import { UserType } from "../common/userType";

type WorkspaceMemberData = {
  userId: string;
  userType: UserType;
};

type WorkspaceMembers = {
  [userId: string]: WorkspaceMemberData;
};

export type WorkspaceData = {
  workspaceId: string;
  name: string;
  members: WorkspaceMembers;
  owner: string;
  rootFolders: ChildFolder[];
  creationTime: Date;
};

type WorkspaceContextType = {
  state: WorkspaceData;
  dispatch: (workspace: WorkspaceData) => void;
  getWorkspaceById: (workspaceId: string) => void;
  getActiveWorkspace: () => void;
  getWorkspacesList: () => void;
};

export const defaultWorkspaceData: WorkspaceData = {
  workspaceId: "",
  name: "",
  members: {},
  owner: "",
  rootFolders: [],
  creationTime: new Date(),
};

export type ChildFolder = {
  positionWithinParent: number;
  folderId: string;
  name: string;
};

export const WorkspaceContext = createContext<WorkspaceContextType>({
  state: defaultWorkspaceData,
  dispatch: () => {},
  getWorkspaceById: () => {},
  getActiveWorkspace: () => {},
  getWorkspacesList: () => {},
});

const WorkspaceProvider = ({ children }) => {
  const { state: authState } = useContext(AuthContext);
  const [workspace, setWorkspace] =
    useState<WorkspaceData>(defaultWorkspaceData);

  const getWorkspaceById = async (targetWorkspaceId: string) => {
    try {
      const space = await axiosClient.post("/api/user/get-workspace-by-id", {
        workspaceId: targetWorkspaceId,
        userId: authState.userId,
      });

      if (space?.data) {
        console.log("new workspace received: ", space.data);

        setWorkspace(space.data["space"]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getActiveWorkspace = useCallback(async () => {
    console.log("getting active workspace");

    axiosClient
      .get("/api/workspace/get-active-workspace")
      .then((res) => {
        //console.log(res.data);

        setWorkspace({
          workspaceId: res.data._id,
          name: res.data.name,
          members: res.data.members,
          owner: res.data.owner,
          rootFolders: res.data.rootFolders,
          creationTime: res.data.creationTime,
        } as WorkspaceData);
      })
      .catch((err) => console.error(err));
  }, []);

  const getWorkspacesList = async () => {};

  /** Get all folders in the workspace */
  /* const getFolders = useCallback(() => {
    axiosClient.
  })
 */
  // get all folders on init
  /* useEffect(() => {
    getFolders();
  }, []); */

  useEffect(() => {
    if (authState.isLoggedIn) {
      getActiveWorkspace();
    }
  }, [authState.isLoggedIn]);

  const providerValue = useMemo(
    () => ({
      state: workspace,
      dispatch: setWorkspace,
      getWorkspaceById,
      getActiveWorkspace,
      getWorkspacesList,
    }),
    [
      workspace,
      setWorkspace,
      getWorkspaceById,
      getActiveWorkspace,
      getWorkspacesList,
    ]
  );

  return (
    <WorkspaceContext.Provider value={providerValue as WorkspaceContextType}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceProvider;
