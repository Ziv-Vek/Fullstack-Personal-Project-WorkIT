import classes from "./workspacePanel.module.scss";
import { WorkspaceContext } from "../../contexts/WorkspaceProvider";
import { AuthContext, getUserDataFromToken } from "../../contexts/AuthProvider";
import { FormEvent, useContext } from "react";
import SingleFieldForm from "../singleFieldForm/SingleFieldForm";
import { axiosClient } from "../../utils/apiClient";

const WorkspacePanel = () => {
  const { state: spaceState, dispatch: dispatchSpace } =
    useContext(WorkspaceContext);

  const { state: authState, dispatch: dispatchAuth } = useContext(AuthContext);

  const addWorkspace = async (name: string) => {
    try {
      const res = await axiosClient.post("/api/workspace/add-workspace", {
        userId: authState.userId,
        name,
      });
      console.log("workspace created successfuly");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes["panel"]}>
      {spaceState.name && (
        <p className={classes["panel__name"]}>{spaceState.name}</p>
      )}

      <SingleFieldForm
        placeHolderText={"Enter Workspace name"}
        toolTipText="Add a Workspace"
        onSubmitHandler={addWorkspace}
      />
    </div>
  );
};

export default WorkspacePanel;
