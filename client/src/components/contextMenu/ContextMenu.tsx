import classes from "./contextMenu.module.scss";

type ContextMenuProps<T> = {
  itemName: string;
  onSelect?: (arg1?: T, arg2?: T, arg3?: T) => void;
  targetProps?: { [key: string]: T };
  clientX?: number;
  clientY?: number;
};

const ContextMenu = ({
  itemName,
  onSelect,
  targetProps,
  clientX,
  clientY,
}: ContextMenuProps) => {
  return (
    <div className={classes.window}>
      <button
        onClick={() => onSelect(targetProps["targetId"])}
        className={classes.item}>
        {itemName}
      </button>
    </div>
  );
};

export default ContextMenu;
