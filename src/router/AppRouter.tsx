import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import AdminDashboard from '../pages/admin/AdminDashboard';
import RoomStream from '../pages/admin/RoomStream';
import { ProtectedRoute } from '../components/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import Teachers from '../pages/admin/Teachers';
import Rooms from '../pages/admin/Rooms';
import Classes from '../pages/admin/Classes';
import ClassDetail from '../pages/admin/ClassDetail';
import Subjects from '../pages/admin/Subjects';
import Students from '../pages/admin/Students';

// Teacher imports
import TeacherLayout from '../layouts/TeacherLayout';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import MyClasses from '../pages/teacher/MyClasses';
import MySubjects from '../pages/teacher/MySubjects';
import MarkAttendance from '../pages/teacher/MarkAttendance';
import Records from '../pages/teacher/Records';
import Summary from '../pages/teacher/Summary';

// Student imports
import StudentLayout from '../layouts/StudentLayout';
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentRecords from '../pages/student/StudentRecords';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="stream" element={<RoomStream />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="classes" element={<Classes />} />
        <Route path="classes/:id" element={<ClassDetail />} />
        <Route path="students" element={<Students />} />
      </Route>

      <Route
        path="/teacher"
        element={
          <ProtectedRoute roles={['Teacher']}>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="my-classes" element={<MyClasses />} />
        <Route path="my-subjects" element={<MySubjects />} />
        <Route path="mark-attendance" element={<MarkAttendance />} />
        <Route path="records" element={<Records />} />
        <Route path="summary" element={<Summary />} />
      </Route>

      <Route
        path="/student"
        element={
          <ProtectedRoute roles={['Student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="records" element={<StudentRecords />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
