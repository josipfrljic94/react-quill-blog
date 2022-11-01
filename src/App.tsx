import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useQuill } from "react-quilljs";

// or const { useQuill } = require('react-quilljs');
import { storage } from "./firebase.config.js";
import "quill/dist/quill.snow.css"; // Add css for snow theme
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Quill from "quill";

export const App = () => {
  const [markdownContent, setMarkdownContent] = useState(null);

  const [article, setArticle] = useState({
    content: null,
    created_at: "",
    description: "",
    poster_image: "",
    id: null,
    slug: "",
    title: "",
    updated_at: "",
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/posts/testni-string").then((response) =>
      response.json().then((article)=>{
        console.log({article: article});
        document.getElementById("article").innerHTML= quillGetHTML(JSON.parse(article?.content));
      })
    );
  }, []);

  function quillGetHTML(inputDelta) {
    var tempCont = document.createElement("div");
    (new Quill(tempCont)).setContents(inputDelta);
    return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
}

  const onPost = () => console.log("tu sam", markdownContent);
  
  return (
    <div>
      <RichEditor onPost={onPost} setMarkDownContent={setMarkdownContent} />

      <h1>{article?.title}</h1>
      <div id="article"></div>
    </div>
  );
};

interface IRichEditor {
  setMarkDownContent: Dispatch<SetStateAction<any>>;
  onPost: () => void;
}

const RichEditor = ({ setMarkDownContent, onPost }: IRichEditor) => {
  const { quill, quillRef } = useQuill();
  // const navigate = useNavigate();

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
    // const res = await fetch("Your Image Server URL", { method: "POST", body });
    // insertToEditor(res.uploadedImageUrl);
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

  React.useEffect(() => {
    if (quill) {
      // Add custom handler for Image Upload
      quill.getModule("toolbar").addHandler("image", selectLocalImage);
    }
  }, [quill]);

  React.useEffect(() => {
    if (!quill) return;

    quill.on("text-change", (delta, oldDelta, source) => {
      // console.log('Text change!');
      setMarkDownContent(quill.getContents());
      setPostData((data) => ({
        ...data,
        content: JSON.stringify(quill.getContents()),
      }));
      // console.log(quill.getContents()); // Get delta contents
    });
  }, [quill]);

  const formInputs = [
    {
      name: "title",
      type: "text",
    },
    {
      name: "description",
      type: "text",
    },
  ];

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    posterImage:
      "https://firebasestorage.googleapis.com/v0/b/blogg-app-514f5.appspot.com/o/myblog%2Fcode1.png?alt=media&token=47260b45-2a59-45e3-82f2-08e1fe8dbd39",
    content: "",
  });

  console.log({ postData });

  const onChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setPostData((data) => ({ ...data, [name]: value }));
  };

  function onPostData() {
    fetch("http://localhost:8000/api/posts", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include,
      body: JSON.stringify(postData),
    });
  }

  const createPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", postData.title);
    formData.append("description", postData.description);
    formData.append("poster_image", postData.title);
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
      {formInputs.map(({ name, type }) => (
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
    // </form>
  );
};
