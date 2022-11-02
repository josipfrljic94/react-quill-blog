import React, { FC } from "react";

interface IPostCard {
  elementReference: React.MutableRefObject<any>;
  title: string;
  posterImage: string;
}

export const PostCard: FC<IPostCard> = ({
  title,
  elementReference,
  posterImage,
}) => (
  <div className="card-post">
    <h1>{title}</h1>
    <img src={posterImage} alt={posterImage} loading="lazy" />
    <div className="content-container" ref={elementReference} />
  </div>
);
