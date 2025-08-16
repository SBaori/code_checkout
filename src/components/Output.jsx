import { useState, useRef, useEffect, useCallback, useContext } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { Box } from "@mui/material";
import "@xterm/xterm/css/xterm.css";
import { AppContext } from "../context/AppContext";

function Output({
    setIsProgRunning,
    termRefProp,
    fitAddonRefProp,
    width = "100%",
    height = "100%",
}) {
    const { lang, socket, interactive } = useContext(AppContext);
    const termRef = useRef(null);
    const inputBufferRef = useRef("");

    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            fontSize: Math.max((0.8 / 100) * window.innerWidth, 15),
            theme: { background: "#333333" },
        });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(document.getElementById("terminal"));
        fitAddon.fit();
        term.focus();

        window.addEventListener("resize", () => {
            fitAddon.fit();
        });

        termRef.current = term;
        termRefProp.current = term;
        fitAddonRefProp.current = fitAddon;

        return () => {
            term.dispose();
            window.removeEventListener("resize", () => fitAddon.fit());
        };
    }, []);

    useEffect(() => {
        let disposable = null;

        if (socket === null && termRef.current !== null) {
            termRef.current.write("Connection to Server failed!\r\n");
        } else if (termRef.current !== null) {
            socket.onmessage = (event) => {
                const output = JSON.parse(event.data);

                if (output.terminated) {
                    // if(lang !== prevLang) {
                    //     setPrevLang(lang);
                    //     termRef.current.reset();
                    // }
                    // else {
                    if (Number.isInteger(Number(output.str))) {
                        termRef.current.write("\r\nExit Code: " + output.str);
                    } else {
                        termRef.current.write("\r\n" + output.str);
                    }
                    termRef.current.write(
                        "\r\n" +
                            "=".repeat(termRef.current.cols - 1) +
                            "\r\n\n",
                    );
                    // }

                    setIsProgRunning(false);
                } else {
                    if (output.str === "\n") termRef.current.write("\r\n");
                    else termRef.current.write(output.str);
                }
            };

            disposable = termRef.current.onData((data) => {
                if (!interactive) return;

                for (const char of data) {
                    console.log(char === "\r");

                    if (char === "\r") {
                        // User pressed Enter
                        // const toSend = inputBufferRef.current + '\n'; // Add newline
                        if (inputBufferRef.current.length != 0) {
                            let data = {
                                code: "",
                                language: lang,
                                codeInput: inputBufferRef.current + "\n",
                                messageType: 2,
                            };

                            socket.send(JSON.stringify(data));
                            inputBufferRef.current = ""; // Clear buffer
                        }

                        termRef.current.write("\r\n");
                    } else if (char === "\u007f") {
                        // Handle Backspace
                        if (inputBufferRef.current.length > 0) {
                            inputBufferRef.current =
                                inputBufferRef.current.slice(0, -1);
                            termRef.current.write("\b \b"); // Delete character visually
                        }
                    } else {
                        inputBufferRef.current += char; // Accumulate user typing
                        termRef.current.write(char); // Echo on terminal
                    }
                }
            });
        }
        return () => {
            if (disposable !== null) disposable.dispose();

            if (socket !== null) socket.onmessage = undefined;
        };
    }, [socket, lang, interactive]);

    return (
        <Box
            height={height}
            width={width}
            bgcolor={"#333333"}
            pl={{ xs: "3%", md: "1%" }}
            pt={{ xs: "3%", md: "1%" }}
        >
            <Box id="terminal" height={"100%"} overflow={"hidden"} />
        </Box>
    );
}

export default Output;
