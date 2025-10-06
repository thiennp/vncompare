import { AdminTableSkeleton } from '../../../../app/features/admin/components/AdminSkeleton';

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
      <AdminTableSkeleton />
    </div>
  );
}


