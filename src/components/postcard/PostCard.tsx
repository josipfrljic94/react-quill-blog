import { quillGetHTML } from "lib/modules/hendler";
// import { QuillDeltaToHtm7g+9f9' tuonhimj6u-0zunm6t75y2 lConverter } from "quill-delta-to-html";
import React, { FC, MutableRefObject, useEffect, useRef } from "react";

interface IPostCard {
  elementReference: React.MutableRefObject<any>;
  title: string;
  posterImage: string;
  content: any;
}

export const PostCard: FC<IPostCard> = ({
  title,
  content,
  elementReference,
  posterImage,
}) => {
  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    const el: Element = containerRef?.current;
    if (!el || !content) return;
    // var converter = new QuillDeltaToHtmlConverter(content);
    // var html = converter.convert();
    // console.log("html",html)
    // const html=render(content);
    // el.innerHTML = html;
  }, [containerRef, content]);

  return (
    <div className="card-post">
      <h1>{title}</h1>
      <img src={posterImage} alt={posterImage} loading="lazy" />
      <div className="content" ref={containerRef}></div>
      <div className="content-container" />
    </div>
  );
};
