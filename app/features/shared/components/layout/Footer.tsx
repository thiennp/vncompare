import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-4">VNCompare Sơn</h3>
          <p className="text-sm text-muted-foreground">
            Nền tảng so sánh sơn hàng đầu Việt Nam. Hơn 1 triệu đề xuất,
            thương hiệu hàng đầu & thi công tiện lợi tại hơn 1.000 đối tác.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Sơn theo loại</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                className="hover:text-primary"
                to="/products?category=interior"
              >
                Sơn nội thất
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary"
                to="/products?category=exterior"
              >
                Sơn ngoại thất
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary"
                to="/products?category=specialty"
              >
                Sơn chuyên dụng
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary"
                to="/coverage-calculator"
              >
                Máy tính độ phủ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Dịch vụ</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-primary" to="/help">
                Trợ giúp và liên hệ
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary"
                to="/shipping-calculator"
              >
                Tính phí vận chuyển
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/about">
                Về VNCompare
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Pháp lý</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-primary" to="/privacy">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/terms">
                Điều khoản
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/imprint">
                Thông tin công ty
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>
          © 2025 VNCompare Nền tảng so sánh Sơn. Tất cả nội dung thuộc bản
          quyền của chúng tôi.
        </p>
      </div>
    </div>
  </footer>
  );
}