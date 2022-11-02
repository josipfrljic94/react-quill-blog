import { useRef } from "react";
import "quill/dist/quill.snow.css"; // Add css for snow theme
import { PostCard, RichForm } from "components";
import { useDeltaToView } from "lib/hooks";

export const App = () => {
  const articleRef = useRef(null);

  const { title, poster_image } = useDeltaToView(
    "http://localhost:8000/api/posts/testni-string",
    articleRef
  );

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

  return (
    <div>
      <RichForm formSchema={formInputs} />
      <PostCard
        title={title}
        posterImage={poster_image}
        elementReference={articleRef}
      />
    </div>
  );
};
