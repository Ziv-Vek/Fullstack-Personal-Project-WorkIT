import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import classes from "./fieldCell.module.scss";
import SingleFieldForm from "../singleFieldForm/SingleFieldForm";
import { useContextMenu } from "../../hooks";

type FieldCellProps = {
  fieldName: string;
  fieldId: string;
  onNameUpdate: (name: string, fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
  onChangeFieldsOrder: (
    draggedFieldId: string,
    destinationFieldId: string
  ) => void;
};

const FieldCell = ({
  fieldName,
  fieldId,
  onNameUpdate,
  onDeleteField,
  onChangeFieldsOrder,
}: FieldCellProps) => {
  const [isShowForm, setIsShowForm] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragEnter, setIsDragEnter] = useState(false);
  //const [draggedItem, setDraggedItem] = useState(" ");
  let draggedItem = "";
  const inputRef = useRef<HTMLDivElement>(null);

  const { callingItem, ContextMenuInstance, onOpenContext, renderContextMenu } =
    useContextMenu();

  const onNameClickHandler = useCallback(() => {
    setIsShowForm((curr) => !curr);
  }, []);

  const onNameChange = useCallback(
    (newName: string) => {
      onNameUpdate(newName, fieldId);
      setIsShowForm(false);
    },
    [fieldId, onNameUpdate]
  );

  useEffect(() => {
    const handleClickOutside = (eve: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(eve.target as Node)) {
        setIsShowForm(false);
      }
    };

    if (isShowForm) document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShowForm]);

  const onDragStart = (eve: React.DragEvent) => {
    //console.log("drag started");
    //console.log(eve);
    //eve.preventDefault();
    console.log(`staring id: ` + fieldId);
    eve.dataTransfer.setData("draggedId", fieldId);

    /* 
    firingDragId = fieldId;*/
    setIsDragging(true);
    draggedItem = fieldId;
  };

  const onDragEnd = (eve: React.DragEvent) => {
    //eve.preventDefault();
    //console.log("drag ended " + eve.target.id);
    /* setIsDragging(false);
    setIsDragOver(false); */

    setIsDragging(false);
    draggedItem = "";
  };

  const onDragOver = (eve: React.DragEvent) => {
    eve.stopPropagation();
    eve.preventDefault();
    /* console.log("data trans: " + eve.dataTransfer.getData("id"));

    console.log("firingDragId: " + firingDragId);

    console.log("drag over " + fieldId); */

    /* if (
      eve.currentTarget.dataset["cellType"] == "field" &&
      eve.currentTarget.id == fieldId &&
      eve.currentTarget.id != firingDragId
    ) {
      console.log("indeed");

      if (!isDragOver) setIsDragOver(true);
    }

    firingDragId = ""; */
  };

  const onDrop = (eve: React.DragEvent) => {
    //eve.preventDefault();

    //console.log(eve.currentTarget.id);
    console.log("target id: ", fieldId);

    console.log("origin: " + eve.dataTransfer.getData("draggedId"));

    onChangeFieldsOrder(eve.dataTransfer.getData("draggedId"), fieldId);

    /* console.log("dropped");
    

    console.log("drag ended " + fieldId);
    setIsDragging(false);
    setIsDragOver(false); */
  };

  const onDragEnter = (eve: React.DragEvent) => {
    eve.stopPropagation();
    eve.preventDefault();
    setIsDragEnter(true);
  };

  const onDragLeave = (eve: React.DragEvent) => {
    eve.dataTransfer.setData("lastDestination", fieldId);
    eve.stopPropagation();
    eve.preventDefault();

    setIsDragEnter(false);

    /* if (eve.currentTarget.dataset["cellType"] == "field") setIsDragEnter(false); */
  };

  return (
    <div
      id={`${fieldId}`}
      data-cell-type="field"
      draggable={true}
      onDragStart={(eve) => onDragStart(eve)}
      onDragEnter={(eve) => onDragEnter(eve)}
      onDragEnd={(eve) => onDragEnd(eve)}
      onDragLeave={(eve) => onDragLeave(eve)}
      onDrop={(eve) => onDrop(eve)}
      onDragOver={(eve) => onDragOver(eve)}
      //onDragExit={(eve) => onDragEnd(eve)}
      className={`${classes["cell-container"]} ${
        isDragEnter ? classes["drag-over"] : ""
      }`}
      ref={callingItem}
      onContextMenu={(eve: any) =>
        onOpenContext("Delete Field", eve, onDeleteField, { targetId: fieldId })
      }>
      <div className={`${classes.cell}`} ref={inputRef}>
        {isShowForm ? (
          <SingleFieldForm
            onSubmitHandler={onNameChange}
            placeHolderText={fieldName}
            toolTipText=""
            isToolTipAvailable={false}
            isButtonAvailable={false}
          />
        ) : (
          <p className={classes["cell__name"]} onClick={onNameClickHandler}>
            {fieldName}
          </p>
        )}
      </div>
      {renderContextMenu ? <ContextMenuInstance /> : ""}
    </div>
  );
};

export default FieldCell;
