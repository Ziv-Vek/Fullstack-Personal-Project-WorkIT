import { useCallback, useEffect } from "react";
import styles from "./folderHeader.module.scss";
import { axiosClient } from "../../utils/apiClient";

type FolderHeaderProps = {
  folderId?: string;
  folderName?: string;
  folderDescription?: string;
};

const FolderHeader = ({
  folderId,
  folderName,
  folderDescription,
}: FolderHeaderProps) => {
  return (
    <div className={styles["panel-container"]}>
      <h2>{folderName}</h2>
      <p>{folderDescription}</p>
    </div>
  );
};

export default FolderHeader;
