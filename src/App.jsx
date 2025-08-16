import { memo, useCallback, useEffect, useRef, useState } from "react";
import CodeEditor from "./components/CodeEditor";
import Output from "./components/Output";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import "./App.css";
import { vertSplitModel2 } from "./layouts/vertSplitModel2";
import { horizontalSplitModel } from "./layouts/horizontalSplitModel";
import { Layout } from "flexlayout-react";
import { AppContext } from "./context/AppContext";
import "flexlayout-react/style/light.css";
import InputEditor from "./components/InputEditor";
import ConfigModal from "./components/ConfigModal";
import Header from "./components/Header";

const LayoutMemo = memo(function LayoutMemo(props) {
    return <Layout {...props} />;
});

function Advice() {
    const [lang, setLang] = useState("");
    const [langs, setLangs] = useState({});
    const [socket, setSocket] = useState(null);
    const [isProgRunning, setIsProgRunning] = useState(false);
    const [killSent, setKillSent] = useState(false);
    const [termReset, setTermReset] = useState(false);
    const [termResetOnRun, setTermResetOnRun] = useState(true);
    const [interactive, setInteractive] = useState(true);

    const codeRef = useRef("");
    const inputRef = useRef("");
    const termRef = useRef(null);
    const fitAddonRef = useRef(null);

    function openSocket() {
        const socket = new WebSocket(
            import.meta.env.DEV
                ? `ws://${import.meta.env.VITE_HOST}`
                : `wss://${import.meta.env.VITE_HOST}`,
        );

        socket.onopen = () => {
            setSocket(socket);
            setTermReset(true);
        };

        socket.onclose = () => {
            setSocket(null);
            setIsProgRunning(false);
        };

        socket.onerror = () => {
            setSocket(null);
            setIsProgRunning(false);
        };
    }

    async function fetchLangs() {
        const res = await fetch(
            import.meta.env.DEV
                ? `http://${import.meta.env.VITE_HOST}/langrunner/info/`
                : `https://${import.meta.env.VITE_HOST}/langrunner/info/`,
            {
                headers: { "ngrok-skip-browser-warning": "true" },
            },
        );

        const langs = await res.json();
        setLangs(langs);
    }

    async function initialize() {
        openSocket();

        if (Object.entries(langs).length == 0) fetchLangs();
    }

    function resetTerm() {
        if (termRef.current !== null) termRef.current.reset();
    }

    function handleKill() {
        if (socket !== null && isProgRunning) {
            let data = {
                code: "",
                language: lang,
                codeInput: "",
                messageType: 3,
            };

            setKillSent(true);
            socket.send(JSON.stringify(data));
        }
    }

    function handleRun() {
        if (socket !== null) {
            let data = {
                code: codeRef.current,
                language: lang,
                codeInput: interactive ? "" : inputRef.current,
                messageType: interactive ? 0 : 1,
            };

            if (termResetOnRun) resetTerm();

            socket.send(JSON.stringify(data));
            setIsProgRunning(true);
        }
    }

    function handleLangChange(event) {
        setLang(event.target.value);
        setTermReset(true);
        handleKill();
    }

    const nodeFactory = useCallback(
        (node) => {
            let component = node.getComponent();

            if (component === "Editor") {
                return <CodeEditor codeRef={codeRef} />;
            }

            if (component === "Output") {
                return (
                    <Output
                        setIsProgRunning={setIsProgRunning}
                        termRefProp={termRef}
                        fitAddonRefProp={fitAddonRef}
                    />
                );
            }

            if (component === "Input") {
                return <InputEditor inputRef={inputRef} />;
            }
        },
        [lang, socket],
    );
    console.log(interactive, termResetOnRun);
    useEffect(() => {
        initialize();
    }, []);

    if (!isProgRunning && killSent) {
        setKillSent(false);
    }

    if (termReset && !isProgRunning) {
        resetTerm();
        setTermReset(false);
    }

    return (
        <Stack direction={"column"} height={"100dvh"} width={"100vw"}>
            <Header
                brand={
                    <Typography
                        fontFamily={"Fira Mono"}
                        color={"#003c52"}
                        fontWeight={500}
                        sx={{
                            fontSize: "clamp(1rem, 1.5vw, 2rem)",
                        }}
                    >
                        code_checkout
                    </Typography>
                }
                item1={
                    <FormControl
                        size="small"
                        fullWidth
                        disabled={isProgRunning}
                    >
                        <InputLabel id="language-selected">language</InputLabel>
                        <Select
                            labelId="language-selected"
                            id="demo-simple-select"
                            value={lang}
                            label="language"
                            onChange={handleLangChange}
                        >
                            {Object.entries(langs)
                                .sort()
                                .map(([l, [runner, version]]) => {
                                    return (
                                        <MenuItem value={l} key={l}>
                                            {l} ({runner} {version})
                                        </MenuItem>
                                    );
                                })}
                        </Select>
                    </FormControl>
                }
                item2={
                    <Button
                        size={"small"}
                        variant="contained"
                        sx={{
                            fontSize: "clamp(0.6rem, 1.5vw, 0.8rem)",
                        }}
                        onClick={
                            socket === null
                                ? initialize
                                : isProgRunning
                                  ? handleKill
                                  : handleRun
                        }
                        color={
                            socket === null
                                ? "error"
                                : isProgRunning
                                  ? "error"
                                  : "info"
                        }
                        disabled={killSent}
                    >
                        {socket === null
                            ? "Connect"
                            : isProgRunning
                              ? "Kill"
                              : "Run"}
                    </Button>
                }
                item3={
                    <Button
                        size={"small"}
                        variant="outlined"
                        onClick={(e) => termRef.current.reset()}
                        color="inherit"
                        sx={{
                            fontSize: "clamp(0.6rem, 1.5vw, 0.8rem)",
                        }}
                    >
                        Clear
                    </Button>
                }
                item4={
                    <ConfigModal
                        isProgRunning={false}
                        termResetOnRunState={[
                            termResetOnRun,
                            setTermResetOnRun,
                        ]}
                        interactiveState={[interactive, setInteractive]}
                    />
                }
            />
            <Box height={"100%"} position={"relative"}>
                <AppContext.Provider
                    value={{
                        lang: lang,
                        socket: socket,
                        theme: "",
                        interactive: interactive,
                    }}
                >
                    <LayoutMemo
                        model={
                            window.innerWidth > 1050
                                ? vertSplitModel2
                                : horizontalSplitModel
                        }
                        factory={nodeFactory}
                        onModelChange={(model, action) => {
                            fitAddonRef.current.fit();
                        }}
                    />
                </AppContext.Provider>
            </Box>
        </Stack>
    );
}

export default Advice;
