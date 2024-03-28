import styles from "./foldersPanel.module.scss";
import { AuthContext, getUserDataFromToken } from "../../contexts/AuthProvider";
import { FormEvent, useContext } from "react";
import SingleFieldForm from "../singleFieldForm/SingleFieldForm";
import { axiosClient } from "../../utils/apiClient";
import { WorkspaceContext } from "../../contexts/WorkspaceProvider";
import FoldersList from "../foldersList/FoldersList";

type FoldersPanelProps = {
  onFolderSelection: (folderId: string) => void;
};

const FoldersPanel = ({ onFolderSelection }: FoldersPanelProps) => {
  const { state: authState, dispatch: dispatchAuth } = useContext(AuthContext);
  const { state: workspaceState, getActiveWorkspace } =
    useContext(WorkspaceContext);

  const addFolder = async (name: string) => {
    console.log("called addFolder with: " + name);

    console.log(workspaceState.workspaceId);

    try {
      await axiosClient.post("/api/folder/add-root-folder", {
        name,
        workspaceId: workspaceState.workspaceId,
      });
      getActiveWorkspace();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles["panel-container"]}>
      <SingleFieldForm
        placeHolderText={"Enter Folder name"}
        toolTipText="Add a Folder"
        onSubmitHandler={addFolder}
      />
      <FoldersList
        folders={workspaceState.rootFolders as []}
        onFolderSelection={onFolderSelection}
      />
    </div>
  );
};

export default FoldersPanel;
