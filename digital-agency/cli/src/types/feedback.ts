export interface CreateFeedbackDto {
  ratingSpeed: number;
  ratingSolutionQuality: number;
  ratingClarity: number;
  generalSatisfaction: number;
  comment?: string;
  linkedEntityId: string; // ID инцидента, задачи или проекта
}

export interface Feedback {
  id: string;
  ratingSpeed: number;
  ratingSolutionQuality: number;
  ratingClarity: number;
  generalSatisfaction: number;
  comment?: string;
  linkedEntityId: string;
  linkedEntityType: 'incident' | 'task' | 'project';
  createdAt: Date;
  userId: string;
}

export interface FeedbackSummary {
  averageRatingSpeed: number;
  averageRatingSolutionQuality: number;
  averageRatingClarity: number;
  averageGeneralSatisfaction: number;
  totalFeedbacks: number;
  responseRate: number;
} 