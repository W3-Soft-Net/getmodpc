export interface CreateCommentDTO {
  content: string;
  blog_id?: string;
  post_id?: string;
  author: string;
}
