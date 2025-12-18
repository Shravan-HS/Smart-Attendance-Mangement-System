export type ViewState = 'login' | 'signup' | 'dashboard';

export interface User {
  username: string;
  role: 'teacher';
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface AttendanceRecord {
  id: string;
  studentName: string;
  date: string;
  status: AttendanceStatus;
  timestamp: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export type Route = ViewState | 'home' | 'about' | 'contact';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}