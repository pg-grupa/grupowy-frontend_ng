export interface IReview {
  id: number | null;
  user: string;
  text: string;
  rating: number;
  created: Date;
}
