import { AdminTableSkeleton } from '../../../../app/features/admin/components/AdminSkeleton';

export default function AdminProductsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>
      <AdminTableSkeleton />
    </div>
  );
}


