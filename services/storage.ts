import { AttendanceRecord, User } from '../types';

const STORAGE_KEYS = {
  USERS: 'ams_users',
  ATTENDANCE: 'ams_attendance',
  CURRENT_USER: 'ams_current_user'
};

// --- Database Helper ---

export const getAttendanceRecords = (): AttendanceRecord[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  return data ? JSON.parse(data) : [];
};

export const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id' | 'timestamp'>): AttendanceRecord => {
  const records = getAttendanceRecords();
  const newRecord: AttendanceRecord = {
    ...record,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  records.push(newRecord);
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  return newRecord;
};

export const deleteAttendanceRecord = (id: string) => {
  const records = getAttendanceRecords().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
};

// --- Auth Helper ---

export const registerUser = (user: User, password: string): boolean => {
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  const users = usersStr ? JSON.parse(usersStr) : [];
  
  if (users.find((u: any) => u.username === user.username)) {
    return false; // User exists
  }

  users.push({ ...user, password }); // In a real app, hash this!
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return true;
};

export const loginUser = (username: string, password: string): User | null => {
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  const users = usersStr ? JSON.parse(usersStr) : [];
  
  const user = users.find((u: any) => u.username === username && u.password === password);
  if (user) {
    const { password: _, ...safeUser } = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    return safeUser;
  }
  return null;
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userStr ? JSON.parse(userStr) : null;
};