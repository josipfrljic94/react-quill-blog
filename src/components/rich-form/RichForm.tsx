import React, { useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useQuill } from "react-quilljs";
import { storage } from "../../firebase.config.js";
import "quill/dist/quill.snow.css"; // Add css for snow theme
import axios from "axios";
const hljs = require('highlight.js');
interface IFormInput {
  name: string;
  type: string;
}

interface IFormItem extends IFormInput {
  onChange: (e: any) => void;
}

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "code-block",
];

/**
 *
 * # FORM WITH RICH EDITOR
 * #### FIELD *CONTENT* IS DEFAULT AND NAME  FOR RICH EDITOR
 *
 */
export const withRichForm =
  (postUrl: string, formSchema: IFormInput[] = []) =>
  (FormItem?: ({ name, type, onChange }: IFormItem) => JSX.Element) => {
    hljs.configure({
      languages: ["javascript", "php"],
    });
    const { quill, quillRef } = useQuill({
      modules: {
        syntax: {
          highlight: (text) => {
            const markup = hljs.highlightAuto(text).value;
            return `<code>${markup}</code>`;
          },
        },
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["image", "video"],
          [{ color: [] }, { background: [] }],
          ["code-block"],
        ],
        clipboard: {
          matchVisual: false,
        },
      },
      formats: formats,
    });

    // Insert Image(selected by user) to quill
    function insertToEditor(url: string) {
      const range = quill.getSelection();
      quill.insertEmbed(range.index, "image", url);
    }

    // Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..
    const saveToServer = async (file: File) => {
      const body = new FormData();
      body.append("file", file);
      const storageRef = ref(storage, `/myblog/${file.name}`);
      uploadBytes(storageRef, file).then((snapshot) => {
        const fileUrl = `${snapshot.ref.fullPath}`;
        getDownloadURL(ref(storage, fileUrl)).then((url) => {
          insertToEditor(url);
        });
      });
    };

    // Open Dialog to select Image File
    const selectLocalImage = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = () => {
        const file = input?.files[0];
        saveToServer(file);
      };
    };

    useEffect(() => {
      if (quill) {
        // Add custom handler for Image Upload
        quill.getModule("toolbar").addHandler("image", selectLocalImage);
      }
    }, [quill]);

    useEffect(() => {
      if (!quill) return;

      quill.on("text-change", (delta, oldDelta, source) => {
        setPostData((data) => ({
          ...data,
          content: JSON.stringify(quill.getContents()),
        }));
      });
    }, [quill]);

    const [postData, setPostData] = useState({
      title: "",
      description: "",
      posterImage: "",
      content: "",
    });

    const onChange = (e) => {
      e.preventDefault();
      const { name, value } = e.target;
      setPostData((data) => ({ ...data, [name]: value }));

      //!todo remove after fature is added
      setPostData((data) => ({ ...data, posterImage: postData.title }));
    };

    const createPost = async () => {
      const formData = new FormData();
      [{ name: "content", type: null }, ...formSchema].forEach(({ name }) =>
        formData.append(name, postData[name])
      );
      formData.append("poster_image", postData["title"]);

      await axios
        .post(postUrl, formData)
        .then(({ data }) => {
          alert(`succes,${data.message}`);
          window.history.back();
        })
        .catch(({ response }) => {
          if (response.status === 422)
            return alert(`Error is : ${response.data.message}`);
          return alert(response.data.message);
        });
    };
    const SelectedFormItem = FormItem ? FormItem : DefaultFormItem;
    return (
      <>
        {formSchema?.map(({ name, type }) => (
          <SelectedFormItem onChange={onChange} name={name} type={type} />
        ))}

        <div>
          <div ref={quillRef} />
          <button onClick={createPost}>submit</button>
        </div>
      </>
    );
  };

function DefaultFormItem({ name, type, onChange }: IFormItem) {
  return (
    <div className="form-control">
      <label htmlFor={name}>{name}</label>
      <input type={type} onChange={onChange} name={name} />
    </div>
  );
}
