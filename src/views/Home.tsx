import axios from "axios";
import { PostCard } from "components";
import { IArticle } from "interfaces";
import { useState } from "react";

export const HomeView = () => {
  const [posts, setPosts] = useState<IArticle[]>([]);
  axios
    .get("http://localhost:8000/api/posts")
    .then(({ data }) => setPosts(data));

  return (
    <div>
      title
      {posts?.map((p) => (
        <PostCard
          elementReference={null}
          title={p?.title}
          posterImage={p?.poster_image}
          content={p?.content}
        />
      ))}
    </div>
  );
};
