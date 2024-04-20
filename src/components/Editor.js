import Editor, { Monaco } from "@monaco-editor/react";
import React, { useRef } from "react";
import PrimaryButton from "./Button";

const EditorComponent = ({ language, code, onChange, onClickFunc }) => {
  return (
    <div>
      <div className="h-10 bg-bgdark p-8 flex items-center justify-center">
        <PrimaryButton text="Run" onClickFunc={onClickFunc} />
      </div>
      <Editor
        className="text-xl"
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
