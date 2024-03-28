import axios from "axios";
import { createContext, useCallback, useEffect } from "react";

const TestProvider = () => {
  console.log("testingProvider");

  const createTestString = useCallback(() => {
    console.log("trying to post");

    axios.post("http://localhost:3000/api/tests/create", {
      testString: "Test string",
    });
  }, []);

  useEffect(() => {
    createTestString();
  }, []);

  return <></>;
};

export default TestProvider;
