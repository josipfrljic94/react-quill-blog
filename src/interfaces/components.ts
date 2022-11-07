export interface IArticle {
  content: any;
  created_at: string;
  description: string;
  poster_image: string;
  id: string;
  slug: string;
  title: string;
  updated_at: string;
}

export interface IArticleResponse {
  config: any;
  data: IArticle[];
  AxiosHeaders: any;
}
