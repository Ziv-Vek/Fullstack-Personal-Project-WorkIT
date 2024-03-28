import { useCallback, useEffect, useMemo, useState } from "react";
import classes from "./tasksPanel.module.scss";
import { axiosClient } from "../../utils/apiClient";
import { FolderData } from "../../contexts/FoldersProvider";
import AddTaskButton from "../addTaskButton/AddTaskButton";
//import SingleFieldForm from "../singleFieldForm/SingleFieldForm";
import FieldCell from "../fieldCell/FieldCell";
import InlineAddFieldButton from "../inlineAddFieldButton/InlineAddFieldButton";
import TaskRow from "../taskRow/TaskRow";
import TaskCell from "../taskCell/TaskCell";
import TaskCellFactory from "../taskCellFactory/TaskCellFactory";

/* enum TaskPriority {
  Low = "Low",
  Normal = "Normal",
  High = "High",
  Urgent = "Urgent",
}

enum TaskStatus {
  NotStarted = "Not Started",
  Open = "Open",
  Done = "Done",
  Cancelled = "Cancelled",
} */

export enum FieldDataType {
  String = "String",
  Number = "Number",
  Date = "Date",
}

export type FieldType = {
  _id: string;
  fieldType: FieldDataType;
  name: string;
  nextNode: string | null;
  isHead: boolean;
};

type TasksPanelProps = {
  currentFolder: FolderData | null;
};

type TaskDataType = {
  dataNode: string;
  value: string;
};

export type TaskFieldsData = {
  [key: string]: string;
};

export type TaskType = {
  _id: string;
  order: number;
  fieldsData: TaskFieldsData;
  creationDate: Date;
};

const TasksPanel = ({ currentFolder }: TasksPanelProps) => {
  const [fields, setFields] = useState<FieldType[]>(
    currentFolder?.fields as FieldType[]
  );
  const [tasks, setTasks] = useState<TaskType[]>(
    (currentFolder?.tasks as TaskType[]) ?? null
  );

  const addTask = async () => {
    if (currentFolder != null) {
      const tasks = await axiosClient.post("api/folder/add-task", {
        folderId: currentFolder._id,
      });

      if (tasks.status == 201) {
        setTasks(tasks.data);
      }
    }
  };

  const updateFieldName = async (name: string, fieldId: string) => {
    if (name != null) {
      const field = await axiosClient.patch("/api/folder/update-field-name", {
        folderId: currentFolder?._id,
        fieldId,
        name,
      });

      if (field && field.status == 200) {
        setFields(field.data);
      }
    }
  };

  const updateTaskCellValue = async (
    value: string | number | Date,
    taskId: string,
    fieldId: string
  ) => {
    if (value != null && taskId != null && fieldId != null) {
      const tasks = await axiosClient.patch("/api/folder/update-cell-value", {
        value,
        taskId,
        fieldId,
        folderId: currentFolder?._id,
      });

      if (tasks) {
        setTasks(tasks.data);
      }
    }
  };

  const addField = async (fieldType: string) => {
    if (currentFolder != null) {
      const fields = await axiosClient.post("api/folder/add-field", {
        folderId: currentFolder._id,
        fieldType,
        name: `${fieldType}`,
      });

      switch (fields.status) {
        case 201:
          setFields(fields.data);
          break;
        case 401:
          alert(fields.data?.message);
          break;

        case 500:
          alert(fields.data?.message);
          break;

        default:
          break;
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    const bodyPayload = { taskId, folderId: currentFolder?._id };
    const updatedTasks = await axiosClient.delete("api/folder/delete-task", {
      data: {
        bodyPayload,
      },
    });

    if (updatedTasks.data) {
      setTasks(updatedTasks.data);
    }
  };

  const deleteField = async (fieldId: string) => {
    const bodyPayload = { fieldId, folderId: currentFolder?._id };
    const updatedFields = await axiosClient.delete("api/folder/delete-field", {
      data: {
        bodyPayload,
      },
    });

    if (updatedFields.data) {
      setFields(updatedFields.data);
    }
  };

  useEffect(() => {
    if (currentFolder?.fields) {
      setFields(currentFolder.fields as FieldType[]);
    }

    if (currentFolder?.tasks) {
      setTasks(currentFolder.tasks as TaskType[]);
    }
  }, [currentFolder]);

  const handleChangeFieldsOrder = (
    draggedFieldId: string,
    destinationFieldId: string
  ) => {};

  const arrangeFields = useCallback(() => {
    if (Array.isArray(fields) && fields.length > 0) {
      return fields.map((field) => {
        return (
          <FieldCell
            //onClick={folderClickedHandler}
            //folderId={folder["folderId"]}
            fieldName={field["name"]}
            key={field["_id"]}
            fieldId={field["_id"]}
            onNameUpdate={updateFieldName}
            onDeleteField={deleteField}
            onChangeFieldsOrder={handleChangeFieldsOrder}
          />
        );
      });
    }
  }, [fields, updateFieldName]);

  const arrangeTaskRows = useCallback(() => {
    const taskRows: JSX.Element[] = [];

    if (Array.isArray(tasks) && tasks.length > 0) {
      for (let i = 0; i < tasks.length; i++) {
        const cells = arrangeTaskCells(tasks[i]._id, tasks[i].fieldsData);

        taskRows.push(
          <TaskRow
            taskId={tasks[i]._id}
            taskOrder={tasks[i].order}
            key={`${tasks[i]._id}`}>
            {cells ?? ""}
          </TaskRow>
        );
      }
    }

    return taskRows;
  }, [tasks, fields]);

  function arrangeTaskCells(
    taskId: string,
    taskData: TaskFieldsData
  ): JSX.Element[] | string {
    if (Array.isArray(fields) && fields.length > 0) {
      return fields.map((field) => {
        const TaskCellInstance = TaskCellFactory(
          field.fieldType.toLocaleLowerCase() as "string" | "number" | "date"
        );

        // eslint-disable-next-line no-prototype-builtins
        /* const cellValue = taskData.hasOwnProperty(field._id) ? taskData[field._id]
          : "";

         let typedValue: string | number | Date = cellValue;

        if (field.fieldType === "Number") {
          typedValue = Number(cellValue);
        } else if (field.fieldType === "Date") {
          typedValue = new Date(cellValue);
        } */

        return (
          <TaskCellInstance
            taskId={taskId}
            cellValue={taskData[field._id]}
            fieldId={field._id}
            key={`${taskId}_${field._id}`}
            //inputType={field.fieldType}
            onValueUpdate={updateTaskCellValue}
            onDeleteTask={deleteTask}
          />
        );
      });
    }
    return "";
  }

  const fieldCells = useMemo(() => {
    return arrangeFields();
  }, [fields, arrangeFields]);

  const taskCells = useMemo(() => arrangeTaskRows(), [tasks, arrangeTaskRows]);

  const handleFieldDrag = (eve: React.DragEvent, elementType: string) => {
    //console.log(eve.dataTransfer);
  };

  return (
    <div className={classes["panel-container"]}>
      <AddTaskButton onClickHandler={addTask} />
      <div className={classes.table}>
        <div className={classes["fields-row"]}>
          {fieldCells}
          <InlineAddFieldButton onNewFieldClick={addField} />
        </div>
        <div className={classes["task-rows"]}>{taskCells}</div>
      </div>
    </div>
  );
};

export default TasksPanel;
