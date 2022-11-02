import { useEffect, useState } from "react";
import { quillGetHTML } from "../modules/hendler";

interface IArticle {
  content: any;
  created_at: string;
  description: string;
  poster_image: string;
  id: string;
  slug: string;
  title: string;
  updated_at: string;
}

function useDeltaToView(
  url: string,
  containerRef?: React.MutableRefObject<any>
) {
  const [articleNoContent, setArticleNoContent] = useState<
    Omit<IArticle, "content">
  >({
    created_at: "",
    description: "",
    poster_image: "",
    id: null,
    slug: "",
    title: "",
    updated_at: "",
  });
  useEffect(() => {
    const containerElement = containerRef?.current;
    fetch(url).then((response) =>
      response.json().then(({ content, ...rest }: IArticle) => {
        setArticleNoContent(rest);
        if (!containerElement) return;
        containerRef.current.innerHTML = quillGetHTML(JSON.parse(content));
      })
    );
  }, [containerRef, url]);
  return articleNoContent;
}

export { useDeltaToView };
