import React from "react";
import UploadAndQuery from "./UploadAndQuery";
import "./UploadAndQuery.css"
import SignUp_Page from "./components/SignUp";
const App = () => {
  return (
    <div className="app-container">
      <UploadAndQuery />
      <SignUp_Page/>
    </div>
  );
};
export default App;
