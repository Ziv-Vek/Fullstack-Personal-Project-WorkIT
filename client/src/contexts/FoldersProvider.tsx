import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { axiosClient } from "../utils/apiClient";
import { AuthContext } from "./AuthProvider";
import { FieldType } from "../components/tasksPanel/TasksPanel";
import { ChildFolder } from "./WorkspaceProvider";
import { TaskType } from "../components/tasksPanel/TasksPanel";

/* type TaskType = {
  [positionWithinParent: number]: TaskDataType;
};
 */
/* type TaskDataType = {
  taskId: string;
  creationDate: Date;
  //headFieldNode:
  //[taskFieldId: string]: TaskFieldType;
}; */

export type TaskFieldType = {
  type: string | Date | number | object;
  name: string;
  //next
};

export type ChildFolderData = {
  folderId: string;
  name: string;
};

export type FolderData = {
  _id: string;
  name: string;
  description: string;
  //icon: string;
  childrenFolders: ChildFolder;
  parentFolder: string;
  tasks: TaskType[];
  fields: FieldType[];
  workspace: string;
  creationDate: Date;
};

type FolderContextType = {
  state: FolderData[];
  dispatch: (folders: FolderData[]) => void;
  createFolder: (folderData: FolderData) => void;
  changeFolderName: (folder: FolderData) => void;
  changeFolderPos: (folder: FolderData) => void;
};

export const FolderContext = createContext<FolderContextType>({
  state: [],
  dispatch: () => {},
  createFolder: () => {},
  changeFolderName: () => {},
  changeFolderPos: () => {},
});

const FoldersProvider = ({ children }) => {
  const { state: authState } = useContext(AuthContext);
  const [folders, setFolders] = useState<FolderData[]>([]);

  /** Get all folders in the workspace */
  /* const getFolders = useCallback(() => {
    axiosClient.
  })
 */
  // get all folders on init
  /* useEffect(() => {
    getFolders();
  }, []); */

  /** Create a new folder */
  const createFolder = () => {
    console.log("create folder called in FoldersProvider");

    // do something
  };

  /** Change folder's name */
  const changeFolderName = () => {
    console.log("change folder name called in FoldersProvider");

    // do something
  };

  /** Change the folder's position in the workspace */
  const changeFolderPos = () => {
    console.log("change folder position called in FoldersProvider");

    // do something
  };

  return <></>;
};

export default FoldersProvider;
