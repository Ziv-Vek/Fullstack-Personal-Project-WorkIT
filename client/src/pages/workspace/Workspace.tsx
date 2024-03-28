import classes from "./workspace.module.scss";
import GlobalActionsBar from "../../components/globalActionsBar/GlobalActionsBar";
import FoldersPanel from "../../components/foldersPanel/FoldersPanel";
import TasksPanel from "../../components/tasksPanel/TasksPanel";
import { AuthContext, getUserDataFromToken } from "../../contexts/AuthProvider";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { WorkspaceContext } from "../../contexts/WorkspaceProvider";
import WorkspacePanel from "../../components/workspacePanel/WorkspacePanel";
import FolderHeader from "../../components/folderHeader/FolderHeader";
import { axiosClient } from "../../utils/apiClient";
import { FolderData } from "../../contexts/FoldersProvider";

const Workspace = () => {
  const { state: authState, dispatch: dispatchAuth } = useContext(AuthContext);
  const {
    state: workspaceState,
    dispatch: workspaceDispatch,
    getWorkspace,
  } = useContext(WorkspaceContext);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState<FolderData | null>(null);

  useEffect(() => {}, []);

  const getFolder = useCallback(async () => {
    const folder = await axiosClient.post("/api/folder/get-folder", {
      folderId,
    });

    setActiveFolder(folder.data ?? null);
  }, [folderId]);

  const onFolderSelectionHandler = useCallback((folderId: string) => {
    if (folderId != null) {
      setFolderId(folderId);
    }
  }, []);

  /* const activeFolder = useMemo( () => getFolder(), [getFolder]); */

  //const getTasks = useCallback(() => {});

  useEffect(() => {
    if (folderId != null) {
      getFolder();
    }
  }, [folderId]);

  return (
    <>
      <GlobalActionsBar />
      <div className={classes["panels-container"]}>
        <div className={classes["panels-container__left"]}>
          <WorkspacePanel />
          <hr />
          <FoldersPanel onFolderSelection={onFolderSelectionHandler} />
        </div>

        <div className={classes["panels-container__right"]}>
          <FolderHeader
            folderId={activeFolder?._id}
            folderName={activeFolder?.name}
            folderDescription={activeFolder?.description}
          />
          <TasksPanel currentFolder={activeFolder} />
        </div>
      </div>
    </>
  );
};

export default Workspace;
