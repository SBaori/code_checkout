import { useRef, useEffect, useContext, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { Box, Divider, Stack, Typography } from "@mui/material";
import "@xterm/xterm/css/xterm.css";
import { AppContext } from "../context/AppContext";

function Output({
    progRunningState,
    termRefProp,
    fitAddonRefProp,
    width = "100%",
    height = "100%",
}) {
    const [isProgRunning, setIsProgRunning] = progRunningState;
    const { lang, socket, interactive } = useContext(AppContext);
    
    const termRef = useRef(null);
    const inputBufferRef = useRef("");
    const exitCodeRef = useRef("?");
    const peakMemory = useRef("?");
    const totalCPUTime = useRef("?");

    if(isProgRunning || socket === null) {
        exitCodeRef.current = "?";
        peakMemory.current = "?";
        totalCPUTime.current = "?";
    }

    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            fontSize: Math.max((0.8 / 100) * window.innerWidth, 15),
            theme: { background: "#171717" },
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

        if (socket !== null && termRef.current !== null) {
            socket.onmessage = (event) => {
                const output = JSON.parse(event.data);

                if (output.terminated) {

                    let runStats = output.runStats;
                    
                    if(runStats !== null) {
                        if(runStats.peakMemory?.length > 0)
                            peakMemory.current = runStats.peakMemory;
                        
                        exitCodeRef.current = runStats.exitCode.toString();
    
                        if(runStats.totalCPUTime?.length > 0)
                            totalCPUTime.current = runStats.totalCPUTime;
                    }

                    termRef.current.write("\r\n" + output.str);
                    termRef.current.write(
                        "\r\n" +
                            "=".repeat(termRef.current.cols - 1) +
                            "\r\n\n",
                    );

                    setIsProgRunning(false);
                } else {
                    if (output.str === "\n") termRef.current.write("\r\n");
                    else termRef.current.write(output.str);
                }
            };

            disposable = termRef.current.onData((data) => {
                if (!interactive) return;

                for (const char of data) {
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
        <Stack height={height} width={width}>
            <Stack 
                pl={"2%"}
                py={"0.5%"}
                bgcolor={"#262626"} 
                color={"white"}
                fontFamily={"Fira Code, Fira Mono, monospace"}
                fontSize={{xs: 10, sm: 11, md: 12}}
                divider={<Divider orientation="vertical" flexItem sx={{borderColor: "#4f4f4f"}}/>}
                direction={"row"}
                spacing={{ xs: 1.5, sm: 2 }}
            >
                <Box>
                    Exit Code - <Typography 
                                    variant={"inherit"} 
                                    component={"span"}
                                    color={exitCodeRef.current === "?" ? 
                                                "inherit" 
                                            : exitCodeRef.current === "0" ? 
                                                "#4fff69" 
                                                : "#ff3636"
                                    }
                                >
                                    {exitCodeRef.current}
                                </Typography>
                </Box>
                <Box>
                    {peakMemory.current}
                </Box>
                <Box>
                    {totalCPUTime.current}
                </Box>
                
            </Stack>
            <Box
                height={"100%"}
                overflow={"hidden"}
                bgcolor={"#171717"}
                pl={{ xs: "3%", md: "1%" }}
                pt={{ xs: "3%", md: "1%" }}
            >
                <Box id="terminal" height={"100%"} />
            </Box>
        </Stack>
    );
}

export default Output;
