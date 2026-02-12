export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  thumb_2x: string;
  author: string;
  news_site: string;
  created_at: number;
  updated_at: number;
}

export interface NewsApiResponse {
  data: NewsArticle[];
  count: number;
}
