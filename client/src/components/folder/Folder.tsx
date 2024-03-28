import { useCallback } from "react";
import styles from "./folder.module.scss";

type FolderProps = {
  onClick: (folderId: string) => void;
  folderId: string;
  folderName: string;
  isActive: boolean;
};

const Folder = ({ onClick, folderId, folderName, isActive }: FolderProps) => {
  const handleClick = useCallback(() => {
    if (isActive) return;

    onClick(folderId);
  }, []);

  return (
    <div
      onClick={handleClick}
      className={
        isActive
          ? styles["folder-container--active"]
          : styles["folder-container"]
      }>
      <p className={styles["folder-container__text"]}>{folderName ?? ""}</p>
    </div>
  );
};

export default Folder;
