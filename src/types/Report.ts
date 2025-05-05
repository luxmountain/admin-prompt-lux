export interface Report {
    id: number;
    reporter_id: number;
    reported_post_id: number | null;
    reported_user_id: number | null;
    reason: string;
    details: string;
    created_at: string;
    User_Report_reporter_idToUser: {
      uid: number;
      email: string;
    };
    User_Report_reported_user_idToUser: {
      uid: number;
      email: string;
    };
    Post: {
      pid: number;
      title: string | null;
      image_url: string | null;
    } | null;
  }
  