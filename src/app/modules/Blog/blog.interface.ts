export interface IBlog {
  id?: string;
  title: string;
  content: string;
  image?: string;
  tags?: string[];
  authorId: string;
}
