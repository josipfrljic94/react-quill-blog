import React from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useQuill } from "react-quilljs";
// or const { useQuill } = require('react-quilljs');
import { storage } from "./firebase.config.js";
import "quill/dist/quill.snow.css"; // Add css for snow theme
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme

export default () => {
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

  return (
    <div style={{ width: 500, height: 300, border: "1px solid lightgray" }}>
      <div ref={quillRef} />
      <button
        onClick={() => {
          console.log(quill.getContents());
          console.log(quill.getText());
          console.log(quill.root.innerHTML); 
        }}
      >
        submit
      </button>
    </div>
  );
};
