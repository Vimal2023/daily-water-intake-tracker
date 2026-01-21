export type Reminder = {
  id: string;
  amount: number;
  time: string;
  status: 'upcoming' | 'completed' | 'skipped';
};
