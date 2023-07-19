import { useCallback, useEffect, useRef, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
// import { useParams } from "react-router-dom"

// const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image"],
    ["clean"],
]

export default function TextEditor() {

    const [quillArr, setQuillArr] = useState([]);

    const wrapperRef = useCallback(wrapper => {
        if (wrapper === null) return;
        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor)
        const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } })
        setQuillArr([...quillArr, q]);
    }, [])
    return (
        <div className="container" ref={wrapperRef}></div>
    )
}