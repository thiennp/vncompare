import { AdminTableSkeleton } from '../../../../app/features/admin/components/AdminSkeleton';

export default function AdminSuppliersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý nhà cung cấp</h1>
      <AdminTableSkeleton />
    </div>
  );
}


