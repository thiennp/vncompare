import { Outlet } from 'react-router-dom';
import Footer from './features/shared/components/layout/Footer';

export default function Root() {
  return (
    <html lang="vi">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>VNCompare - So sánh sơn và vật liệu xây dựng tại Việt Nam</title>
        <meta
          name="description"
          content="Nền tảng so sánh sơn hàng đầu Việt Nam. Tìm kiếm, so sánh giá và mua sơn chất lượng cao từ các nhà cung cấp uy tín."
        />
        <meta
          name="keywords"
          content="sơn, so sánh giá, vật liệu xây dựng, Việt Nam, mua sơn, giá sơn"
        />
        <link rel="stylesheet" href="/app/styles/tailwind.css" />
      </head>
      <body data-new-gr-c-s-check-loaded="14.1255.0" data-gr-ext-installed="">
        <div id="root">
          <div className="min-h-screen bg-background">
            <Outlet />
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
