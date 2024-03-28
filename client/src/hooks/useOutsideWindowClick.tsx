import { useEffect, useRef, useState } from "react";

export default function useOutsideWindowClick(
  initialOpenState: boolean,
  onOpen?: () => void,
  onClose?: () => void
) {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpenState);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (eve: MouseEvent) => {
    if (
      isOpen &&
      inputRef.current &&
      !inputRef.current.contains(eve.target as Node)
    ) {
      onClose?.();
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleBlur = () => {
      if (isOpen) {
        onClose?.();
        setIsOpen(false);
      }
    };

    window.addEventListener("blur", handleClickOutside);

    return () => window.removeEventListener("blur", handleClickOutside);
  }, [isOpen, onClose]);

  return { isOpen, inputRef };
}
