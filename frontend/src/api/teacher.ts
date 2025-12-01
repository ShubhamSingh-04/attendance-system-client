import { http } from './http';

export async function getTeacherProfile() {
  const { data } = await http.get('/teacher/me');
  return data as any;
}

export async function getMyClasses() {
  const { data } = await http.get('/teacher/my-classes');
  return data as { count: number; classes: any[] };
}

export async function getMySubjects() {
  const { data } = await http.get('/teacher/my-subjects');
  return data as { count: number; subjects: any[] };
}

export async function getAllRooms() {
  const { data } = await http.get('/teacher/rooms');
  return data as { count: number; rooms: any[] };
}

export async function checkAttendance(
  classId: string,
  subjectId: string,
  roomId: string
) {
  const { data } = await http.get(
    `/teacher/check-attendance/${encodeURIComponent(
      classId
    )}/${encodeURIComponent(subjectId)}/${encodeURIComponent(roomId)}`
  );
  return data as any;
}

export async function markAttendance(
  classId: string,
  subjectId: string,
  roomId: string,
  payload: any
) {
  const { data } = await http.post(
    `/teacher/mark-attendance/${encodeURIComponent(
      classId
    )}/${encodeURIComponent(subjectId)}/${encodeURIComponent(roomId)}`,
    payload
  );
  return data as any;
}

export async function listRecords(params: {
  classId: string;
  subjectId: string;
  date: string;
}) {
  const { data } = await http.get('/teacher/records', { params });
  return data as any;
}

export async function getSummary(params: {
  classId: string;
  subjectId: string;
}) {
  const { data } = await http.get('/teacher/summary', { params });
  return data as any;
}

export async function updateRecord(
  id: string,
  payload: { status: 'Present' | 'Absent' }
) {
  const { data } = await http.put(`/teacher/record/${id}`, payload);
  return data as any;
}
