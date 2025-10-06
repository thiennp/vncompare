import { AdminTableSkeleton } from '../../../../app/features/admin/components/AdminSkeleton';

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
      <AdminTableSkeleton />
    </div>
  );
}


