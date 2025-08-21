import { Editor } from "@monaco-editor/react";
import "../resources/monaco_cdn_to_local";
import { Stack } from "@mui/material";
import { useState } from "react";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

function InputEditor({ inputRef, width = "100%", height = "100%" }) {
    const [input, setInput] = useState("");
    const { theme } = useContext(AppContext);

    function updateInput(input) {
        setInput(input);
        inputRef.current = input;
    }

    return (
        <Stack width={width} height={height}>
            <Editor
                onChange={(input, event) => updateInput(input)}
                value={input}
                theme={theme ? "vs-dark" : "light"}
            />
        </Stack>
    );
}

export default InputEditor;
