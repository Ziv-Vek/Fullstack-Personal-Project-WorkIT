import { useCallback, useState, useRef, useEffect } from "react";

export default function useCommonCell(
  initialValue: string | number | Date,
  taskId: string,
  fieldId: string,
  onSubmit: (
    cellValue: string | number | Date,
    taskId: string,
    fieldId: string
  ) => void
) {
  const [isShowForm, setIsShowForm] = useState(false);
  const [value, setValue] = useState<string | number | Date>(initialValue);
  const inputRef = useRef<HTMLDivElement>(null);

  const onCellClickHandler = useCallback(() => {
    setIsShowForm((curr) => !curr);
  }, []);

  const onValueChange = useCallback(
    (newValue: string | number | Date) => {
      onSubmit(newValue, taskId, fieldId);
      setIsShowForm(false);
      setValue(newValue);
    },
    [value, onSubmit, isShowForm]
  );

  useEffect(() => {
    const handleClickOutside = (eve: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(eve.target as Node)) {
        console.log("ye");
      }
    };

    if (isShowForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShowForm]);

  return { isShowForm, onCellClickHandler, onValueChange, inputRef };
}
