import { Editor } from "@monaco-editor/react";
import "../resources/monaco_cdn_to_local";
import { Stack } from "@mui/material";
import { useState } from "react";

function InputEditor({ inputRef, width = "100%", height = "100%" }) {
    const [input, setInput] = useState("");

    function updateInput(input) {
        setInput(input);
        inputRef.current = input;
    }

    return (
        <Stack width={width} height={height}>
            <Editor
                onChange={(input, event) => updateInput(input)}
                value={input}
            />
        </Stack>
    );
}

export default InputEditor;
