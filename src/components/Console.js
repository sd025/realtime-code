import React, { useEffect, useState } from "react";
import { v4 } from "uuid";

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
      <div className=" bg-black flex items-center pl-8">
        <p>Console</p>
        <span
          onClick={() => {
            setConsoleFeed([]);
          }}
          className="cursor-pointer ml-5"
        >
          Clear Console
        </span>
      </div>
      <div className="h-full text-black px-3 pt-3">
        {consoleFeed.map((feed) => (
          <div key={v4()}>
            <p
              className={
                feed.type === "error" ? "text-red-600" : "text-white"
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
