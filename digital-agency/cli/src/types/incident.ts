export interface Comment {
  text: string;
  author: string;
  timestamp: Date;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedTo: string;
  createdAt: Date;
  updatedAt?: Date;
  resolvedAt?: Date;
  impact: string;
  urgency: string;
  affectedServices: string[];
  resolutionTime: number;
  comments?: Comment[];
  attachments?: string[];
} 