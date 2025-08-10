import { Editor } from "@monaco-editor/react";
import '../resources/monaco_cdn_to_local'
import { Stack,} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import getLangTemplate from "../resources/LangTemplates";

function CodeEditor({codeRef, width="100%",height="100%"}) {
    const {lang} = useContext(AppContext);
    const [code, setCode] = useState('');
    const [init, setInit] = useState(true);
    
    function updateCode(code) {
        if(init) {
            setCode(codeRef.current);
            setInit(false);
        }
        else {
            setCode(code);
            codeRef.current = code;
        }
    }
    
    useEffect(() => {
        updateCode(getLangTemplate(lang));
    }, [lang]);

    return (
        <Stack width={width} height={height}>
            <Editor
                language={lang}
                onChange={(code, event) => updateCode(code)}
                value={code}
            />
        </Stack>
    )
}

export default CodeEditor;