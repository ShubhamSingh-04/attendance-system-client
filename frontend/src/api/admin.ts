import { http, API_HOST } from './http';

export async function getAdminMe() {
  const { data } = await http.get('/admin/me');
  return data;
}

export async function getAdminStats() {
  const { data } = await http.get('/admin/stats');
  return data as { students: number; teachers: number; rooms: number };
}

// Teachers
export async function listTeachers() {
  const { data } = await http.get('/admin/teachers');
  return data;
}
export async function createTeacher(payload: any) {
  const { data } = await http.post('/admin/teachers', payload);
  return data;
}
export async function updateTeacher(id: string, payload: any) {
  const { data } = await http.put(`/admin/teachers/${id}`, payload);
  return data;
}
export async function deleteTeacher(id: string) {
  const { data } = await http.delete(`/admin/teachers/${id}`);
  return data;
}

// Rooms
export async function listRooms() {
  const { data } = await http.get('/admin/rooms');
  return data;
}
export async function createRoom(payload: any) {
  const { data } = await http.post('/admin/rooms', payload);
  return data;
}
export async function updateRoom(id: string, payload: any) {
  const { data } = await http.put(`/admin/rooms/${id}`, payload);
  return data;
}
export async function deleteRoom(id: string) {
  const { data } = await http.delete(`/admin/rooms/${id}`);
  return data;
}

// Subjects
export async function listSubjects() {
  const { data } = await http.get('/admin/subjects');
  return data;
}
export async function createSubject(payload: any) {
  const { data } = await http.post('/admin/subjects', payload);
  return data;
}
export async function deleteSubject(id: string) {
  const { data } = await http.delete(`/admin/subjects/${id}`);
  return data;
}

// Classes (router uses /class)
export async function listClasses() {
  const { data } = await http.get('/admin/class');
  return data;
}
export async function createClass(payload: any) {
  const { data } = await http.post('/admin/class', payload);
  return data;
}
export async function deleteClass(id: string) {
  const { data } = await http.delete(`/admin/class/${id}`);
  return data;
}

// Students
export async function listStudents(params?: { classCode?: string }) {
  const { data } = await http.get('/admin/students', { params });
  return data;
}
export async function createStudent(formData: FormData) {
  const { data } = await http.post('/admin/student', formData);
  return data;
}
export async function updateStudent(id: string, formData: FormData) {
  const { data } = await http.put(`/admin/student/${id}`, formData);
  return data;
}
export async function deleteStudent(id: string) {
  const { data } = await http.delete(`/admin/student/${id}`);
  return data;
}

export function roomStreamUrl(roomId: string) {
  // Return fully-qualified stream URL so players or iframes can connect
  // directly to the backend server (which exposes /api/admin/stream/:roomId).
  return `${API_HOST}/api/admin/stream/${encodeURIComponent(roomId)}`;
}
