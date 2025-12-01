import { http } from './http';

export async function getStudentProfile() {
  const { data } = await http.get('/student/me');
  return data as any;
}

export async function getMyClass() {
  const { data } = await http.get('/student/my-class');
  return data as any;
}

export async function getMySubjects() {
  const { data } = await http.get('/student/my-subjects');
  return data as { count: number; subjects: any[] };
}

export async function getMyAttendanceRecords(params: {
  subjectId: string;
  date: string;
}) {
  const { data } = await http.get('/student/my-attendance-records', { params });
  return data as any;
}

export async function getMyAttendanceSummary() {
  const { data } = await http.get('/student/my-summary');
  return data as { count: number; summary: any[] };
}
