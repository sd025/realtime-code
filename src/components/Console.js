import React, { useEffect, useState, useCallback } from "react";
import { v4 as uuidV4 } from "uuid";

const Console = () => {
  const [consoleFeed, setConsoleFeed] = useState([]);

  const handleConsoleFeed = useCallback((e) => {
    const data = e.data;
    if (data.type === "log") {
      setConsoleFeed((prev) => [...prev, { type: "log", msg: data.args }]);
    } else if (data.type === "error") {
      setConsoleFeed((prev) => [...prev, { type: "error", msg: `${data.args}` }]);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleConsoleFeed);
    return () => {
      window.removeEventListener("message", handleConsoleFeed);
    };
  }, [handleConsoleFeed]);

  return (
    <>
      <div className="console-header">
        <p>Console</p>
        <span
          onClick={() => {
            setConsoleFeed([]);
          }}
          className="console-clear"
        >
          Clear Console
        </span>
      </div>
      <div className="console-content">
        {consoleFeed.map((feed) => (
          <div key={uuidV4()}>
            <p className={feed.type === "error" ? "text-red" : "text-white"}>
              {feed.msg}
            </p>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
};

export default Console;
