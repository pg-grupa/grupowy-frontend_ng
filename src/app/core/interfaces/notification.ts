export type NotificationType = 'error' | 'warning' | 'info' | 'success';

export interface INotification {
  id: number;
  type: NotificationType;
  message: string;
  details?: string;
  timeout?: number;
}
