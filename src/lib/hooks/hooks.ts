import { IArticle } from "interfaces";
import { useEffect, useState } from "react";
import { quillGetHTML } from "../modules/hendler";

export function useDeltaToView(
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
