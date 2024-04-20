import Editor from "@monaco-editor/react";
import React from "react";
import PrimaryButton from "./Button";

const EditorComponent = ({ language, code, onChange, onClickFunc }) => {
  return (
    <div>
      <div className="editor-header">
        <PrimaryButton text="Run" onClickFunc={onClickFunc} />
      </div>
      <Editor
        className="editor-content"
        height="91vh"
        onChange={onChange}
        language={language}
        value={code}
        theme="vs-dark"
        options={{ fontSize: 20 }}
      />
    </div>
  );
};

export default EditorComponent;
