import { useContext, useCallback, useEffect, useMemo, useState } from "react";
import { WorkspaceContext } from "../../contexts/WorkspaceProvider";
import Folder from "../folder/Folder";
import classes from "./folderList.module.scss";

export type FolderListData = {
  folderId: string;
  name: string;
  positionWithinParent: number;
  _id: string;
};

export type FoldersListProps = {
  //folders: { [position: string]: FolderListData }[];
  folders: FolderListData[];
  onFolderSelection: (folderId: string) => void;
};

const FoldersList = ({ folders, onFolderSelection }: FoldersListProps) => {
  const { state: workspaceState } = useContext(WorkspaceContext);
  const [activeFolderId, setActiveFolderId] = useState("");

  const folderClickedHandler = (folderId: string) => {
    setActiveFolderId(folderId);
    onFolderSelection(folderId);
  };

  const createHtml = useCallback(() => {
    if (Array.isArray(folders) && folders.length > 0) {
      return folders.map((folder) => {
        return (
          <Folder
            onClick={folderClickedHandler}
            folderId={folder["folderId"]}
            folderName={folder["name"]}
            key={folder["folderId"]}
            isActive={activeFolderId == folder["folderId"] ? true : false}
          />
        );
      });
    }

    return "";
  }, [folders, activeFolderId]);

  const foldersHtml = useMemo(() => createHtml(), [folders, activeFolderId]);

  /* console.log(
    "active folder on list: " +
      folders.find((folder) => folder.folderId == activeFolderId)?.name
  ); */

  useEffect(() => {
    createHtml();
  }, [folders, activeFolderId, createHtml]);

  return <div className={classes.list}>{foldersHtml}</div>;
};

export default FoldersList;
