  import React, { useEffect, useState } from "react";
  import { v4 as uuidV4 } from "uuid";

  const Console = () => {
    const [consoleFeed, setConsoleFeed] = useState([]);

    useEffect(() => {
      window.addEventListener("message", (e) => {
        const data = e.data;
        if (data.type === "log") {
          setConsoleFeed((prev) => [
            ...prev,
            { type: "log", msg: data.args },
          ]);
        } else if (data.type === "error") {
          setConsoleFeed((prev) => [
            ...prev,
            { type: "error", msg: `${data.args}` },
          ]);
        }
      });
    }, []);

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
              <p
                className={
                  feed.type === "error" ? "text-red" : "text-white"
                }
              >
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
