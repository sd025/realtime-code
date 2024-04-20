import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import { initSocket } from "../socket";
import { dummyFilesData } from "../helpers/data";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import EditorComponent from "../components/Editor";
import Console from "../components/Console";

const EditorPage = () => {
  const [html, setHtml] = useState("<h1>Hello World</h1>");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("console.log('Hello world')");

  const fileNameBarClasses =
    "flex items-center cursor-pointer hover:bg-black justify-start w-full p-2 ";


  const [activeFile, setActiveFile] = useState("index.html");
  const [srcDoc, setSrcDoc] = useState("");
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.error("Socket error:", e.message || e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            socketId,
            html,
            css,
            js,
          });
        }
      );

      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ html, css, js }) => {
        setHtml(html);
        setCss(css);
        setJs(js);
      });

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  const changeCode = () => {
    setSrcDoc(`
    <html>
      <style>
      ${css}</style>
      <body>${html}</body>
      <script>
      const originalLog = console.log;
      console.log = (...args) => {
        
        parent.window.postMessage({ type: 'log', args: args }, '*')
        originalLog(...args)
      };
      const originalWarn = console.warn;
      console.warn = (...args) => {
        
        parent.window.postMessage({ type: 'warn', args: args }, '*')
        originalWarn(...args)
      };
      const originalError= console.error;
      console.error = (...args) => {
        
        parent.window.postMessage({ type: 'error', args: args }, '*')
        originalError(...args)
      };
      window.onerror = function(msg, url, line){
        parent.window.postMessage({ type: 'error', args: msg, line: line}, '*')
      }
      ${js}</script>
    </html>
    `);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      changeCode();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const getCodeByFileName = (fileName) => {
    let code = "";
    switch (fileName) {
      case "index.html":
        code = html;
        break;

      case "style.css":
        code = css;
        break;

      case "script.js":
        code = js;
        break;

      default:
        break;
    }
    return code;
  };
  const ChangeCodeByFileName = (fileName, value) => {
    switch (fileName) {
      case "index.html":
        setHtml(value);
        break;

      case "style.css":
        setCss(value);

        break;

      case "script.js":
        setJs(value);

        break;

      default:
        break;
    }
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      js: fileName === "script.js" ? value : js,
      css: fileName === "style.css" ? value : css,
      html: fileName === "index.html" ? value : html,
    });
  };

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <h1>&lt; Multiplayer code &gt; </h1>
          </div>
          <h3>Connected</h3>
          <div className="flex-col  my-4 w-full ">
            {Object.keys(dummyFilesData).map((keyName, i) => {
              // @ts-ignore
              let fileData = dummyFilesData[keyName];

              return (
                <div
                  key={fileData.language}
                  onClick={() => {
                    setActiveFile(fileData.name);
                  }}
                  className={
                    fileData.name === activeFile
                      ? fileNameBarClasses + "bg-black"
                      : fileNameBarClasses
                  }
                >
                  {/* <FontAwesomeIcon
                    color={fileData.iconColor}
                    icon={["fab", fileData.iconName as IconName]}
                  /> */}
                  <img width="20px" height="20px" src={fileData.iconName} />
                  <p className="mx-4">{fileData.name}</p>
                </div>
              );
            })}
          </div>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <EditorComponent
          onClickFunc={() => {
            changeCode();
          }}
          onChange={(value) => {
            ChangeCodeByFileName(activeFile, value);
          }}
          code={getCodeByFileName(activeFile)}
          language={
            // @ts-ignore
            dummyFilesData[activeFile]?.language
          }
        />
        <div className="grid grid-rows-[65vh_225px]">
          <iframe
            srcDoc={srcDoc}
            className="flex w-full h-full bg-white"
          ></iframe>
          <div className="bg-bgdark">
            <Console />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
