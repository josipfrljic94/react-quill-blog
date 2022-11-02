import React, { useState, MouseEvent, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useQuill } from "react-quilljs";
import { storage } from "../../firebase.config.js";
import "quill/dist/quill.snow.css"; // Add css for snow theme
import axios from "axios";

interface IFormInput {
  name: string;
  type: string;
}

interface IRichForm {
  formSchema: IFormInput[];
}

/**
 *
 * # FIELD *CONTENT* IS DEFAULT
 *
 */
export const RichForm = ({ formSchema }: IRichForm) => {
  const { quill, quillRef } = useQuill();

  // Insert Image(selected by user) to quill
  const insertToEditor = (url) => {
    const range = quill.getSelection();
    quill.insertEmbed(range.index, "image", url);
  };

  // Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..
  const saveToServer = async (file) => {
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
    posterImage:
      "https://firebasestorage.googleapis.com/v0/b/blogg-app-514f5.appspot.com/o/myblog%2Fcode1.png?alt=media&token=47260b45-2a59-45e3-82f2-08e1fe8dbd39",
    content: "",
  });

  const onChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setPostData((data) => ({ ...data, [name]: value }));
  };

  const createPost = async ({
    preventDefault,
  }: MouseEvent<HTMLButtonElement, MouseEvent> | MouseEvent) => {
    preventDefault();
    const formData = new FormData();
    formData.append("content", postData.content);

    await axios
      .post(`http://localhost:8000/api/posts`, formData)
      .then(({ data }) => {
        // Swal.fire({
        //   icon:"success",
        //   text:data.message
        // })
        alert(`succes,${data.message}`);
        window.history.back();
      })
      .catch(({ response }) => {
        if (response.status === 422) {
        } else {
          alert(response.data.message);
        }
      });
  };

  return (
    <>
      {formSchema?.map(({ name, type }) => (
        <div className="form-control">
          <label htmlFor={name}>{name}</label>
          <input type={type} onChange={onChange} name={name} />
        </div>
      ))}

      <div style={{ width: 500, height: 300, border: "1px solid lightgray" }}>
        <div ref={quillRef} />
        <button onClick={createPost}>submit</button>
      </div>
    </>
  );
};
