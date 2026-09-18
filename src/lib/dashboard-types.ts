export interface DashboardEvent {
  id: string; title: string; slug: string; event_type: string; event_date: string; created_at: string;
  is_active: boolean; drive_folder_id: string | null; rsvp_count: number; checked_in_count: number; media_count: number;
}