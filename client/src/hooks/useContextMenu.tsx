import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ContextMenu from "../components/contextMenu/ContextMenu";

export default function useContextMenu() {
  const callingItem = useRef(null);
  const [renderContextMenu, setRenderContextMenu] = useState(false);
  const [menuProps, setMenuProps] = useState({});

  function onOpenContext<E extends MouseEvent, T>(
    itemName: string,
    eve: E,
    onSelect?: (arg1?: T, arg2?: T, arg3?: T) => void,
    targetProps?: { [key: string]: T }
  ) {
    eve.preventDefault();

    const clientX = eve.clientX;
    const clientY = eve.clientY;

    setRenderContextMenu(true);
    setMenuProps({
      itemName,
      onSelect: onSelect,
      targetProps: targetProps,
      clientX: clientX,
      clientY: clientY,
    });
  }

  const ContextMenuInstance = useCallback(
    () => (
      <ContextMenu
        itemName={menuProps["itemName"]}
        onSelect={menuProps["onSelect"]}
        targetProps={menuProps["targetProps"]}
        clientX={menuProps["clientX"]}
        clientY={menuProps["clientY"]}
      />
    ),
    [menuProps]
  );

  const closeMenu = () => {
    setRenderContextMenu(false);
    setMenuProps({});
  };

  useEffect(() => {
    const handleClickOutside = (eve: MouseEvent) => {
      if (
        callingItem.current &&
        !callingItem.current.contains(eve.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callingItem]);

  return { callingItem, renderContextMenu, onOpenContext, ContextMenuInstance };
}
