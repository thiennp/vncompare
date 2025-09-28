/* eslint-disable react-refresh/only-export-components */
import { Link, useLoaderData } from 'react-router-dom';
import {
  Package,
  Star,
  Truck,
  Paintbrush,
  Search,
  ArrowRight,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Product, Supplier } from '../../shared/types';
import { homeLoader } from '../loaders/homeLoader';
import { HomePageSkeleton } from '../components/HomePageSkeleton';
import styles from './HomePage.module.css';

export default function HomePage() {
  const loaderData = useLoaderData() as {
    featuredProducts: Product[];
    suppliers: Supplier[];
    reviews: unknown[];
  };

  const data = {
    featuredProducts: loaderData?.featuredProducts || [],
    suppliers: loaderData?.suppliers || [],
    reviews: loaderData?.reviews || [],
  };

  // Validate data with generated Guardz type guards
  // TODO: Fix type validation to work with MongoDB ObjectIds
  /*
  if (
    !isHomePageData(data, {
      identifier: 'HomePageData',
      callbackOnError: console.error,
      errorMode: 'json',
    })
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Data Loading Error
          </h1>
          <p className="text-gray-600">
            Unable to load homepage data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }
  */

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero} role="banner" aria-labelledby="hero-heading">
        <div className={styles.heroContent}>
          <div className="mb-12">
            <h1 id="hero-heading" className={styles.heroTitle}>
              Sơn chất lượng cao
            </h1>
            <p className={styles.heroSubtitle}>
              Tìm sơn phù hợp với không gian của bạn
            </p>
          </div>
          
          <div className={styles.savingsBadge} role="banner" aria-label="Tiết kiệm đến 50%">
            <TrendingUp className="w-4 h-4 mr-2" aria-hidden="true" />
            Tiết kiệm đến <span className="font-bold text-lg mx-1">50%</span>
          </div>
          
          <div className={styles.searchCard} role="search" aria-labelledby="search-title">
            <div className="p-6">
              <h3 className={styles.searchTitle} id="search-title">
                Tìm sơn phù hợp
              </h3>
            </div>
            <div className="p-6 pt-0">
              <div className={styles.searchForm}>
                <div className={styles.searchRow}>
                  <div className={styles.searchField}>
                    <label className={styles.searchLabel} htmlFor="room-size">
                      Diện tích cần sơn (m²)
                    </label>
                    <input
                      className={styles.searchInput}
                      id="room-size"
                      placeholder="Ví dụ: 25 m²"
                      aria-describedby="room-size-help"
                    />
                  </div>
                  <div className={styles.searchField}>
                    <label className={styles.searchLabel} htmlFor="paint-type">
                      Loại sơn
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className={styles.searchSelect}
                        id="paint-type"
                        aria-describedby="paint-type-help"
                      >
                        <span className="block truncate">Chọn loại sơn...</span>
                        <ArrowRight className="h-4 w-4 opacity-50" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className={styles.searchRow}>
                  <div className={styles.searchField}>
                    <label className={styles.searchLabel} htmlFor="address">
                      Địa chỉ
                    </label>
                    <input
                      className={styles.searchInput}
                      id="address"
                      placeholder="Ví dụ: Quận 1, TP.HCM"
                      aria-describedby="address-help"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <button className={styles.searchButton} aria-label="Tìm kiếm sơn phù hợp">
                      <Search className="mr-2 h-5 w-5" aria-hidden="true" />
                      Tìm sơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.heroActions}>
            <Link to="/products" data-discover="true">
              <button className={styles.primaryButton} aria-label="Xem tất cả sản phẩm sơn">
                <Package className="mr-2 h-5 w-5" aria-hidden="true" />
                Xem sản phẩm
              </button>
            </Link>
            <Link to="/register" data-discover="true">
              <button className={styles.secondaryButton} aria-label="Đăng ký tài khoản mới">
                <Users className="mr-2 h-5 w-5" aria-hidden="true" />
                Đăng ký
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className={`${styles.section} ${styles['section--gradient']}`} role="region" aria-labelledby="brands-heading">
        <div className="container">
          <div className="text-center mb-12">
            <h2 id="brands-heading" className={styles.sectionTitle}>
              Thương hiệu phổ biến
            </h2>
          </div>
          <div className={styles.brandsGrid}>
            {data.suppliers.slice(0, 6).map((supplier: Supplier, index: number) => (
              <div
                key={supplier._id?.toString() || index}
                className={styles.brandCard}
                role="button"
                tabIndex={0}
                aria-label={`Xem sản phẩm từ ${supplier.name}`}
              >
                <div className="p-6">
                  <div className={`${styles.brandIcon} ${styles['brandIcon--blue']}`}>
                    <Paintbrush className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={styles.brandName}>{supplier.name}</h3>
                  <p className={styles.brandType}>Hersteller</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className={styles.showAllButton} aria-label="Xem tất cả thương hiệu sơn">
              hiển thị tất cả thương hiệu
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${styles.section} ${styles['section--gray']}`}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className={styles.sectionTitle}>Tại sao chọn VNCompare?</h2>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className="p-6">
                <div className={`${styles.featureIcon} ${styles['featureIcon--blue']}`}>
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className={styles.featureTitle}>Lựa chọn lớn nhất</h3>
              </div>
              <div className="p-6 pt-0">
                <p className={styles.featureDescription}>
                  Tìm sơn & bộ hoàn chỉnh từ hơn 10 triệu tùy chọn.
                </p>
              </div>
            </div>
            <div className={styles.featureCard}>
              <div className="p-6">
                <div className={`${styles.featureIcon} ${styles['featureIcon--green']}`}>
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className={styles.featureTitle}>Giá cả hợp lý</h3>
              </div>
              <div className="p-6 pt-0">
                <p className={styles.featureDescription}>
                  So sánh sơn & bộ hoàn chỉnh và tiết kiệm.
                </p>
              </div>
            </div>
            <div className={styles.featureCard}>
              <div className="p-6">
                <div className={`${styles.featureIcon} ${styles['featureIcon--orange']}`}>
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className={styles.featureTitle}>Dịch vụ trọn gói</h3>
              </div>
              <div className="p-6 pt-0">
                <p className={styles.featureDescription}>
                  Đặt dịch vụ thi công với giá cố định dễ dàng online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={`${styles.section} ${styles['section--gray']}`}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className={styles.sectionTitle}>Sản phẩm nổi bật</h2>
          </div>
          <div className={styles.productsGrid}>
            {data.featuredProducts.map((product: Product, index: number) => (
              <div key={product._id?.toString() || index} className={styles.productCard}>
                <div className="p-6">
                  <div className={styles.productImage}>
                    <Paintbrush className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productBrand}>{product.brand}</div>
                </div>
                <div className="p-6 pt-0">
                  <div>
                    <p className={styles.productPrice}>{product.price.toLocaleString()} VNĐ</p>
                    <p className={styles.productDescription}>{product.description}</p>
                    <Link to={`/products/${product._id}`} data-discover="true">
                      <button className={styles.productButton}>Xem chi tiết</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/products" data-discover="true">
              <button className={styles.viewAllButton}>Xem tất cả sản phẩm</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Suppliers Section */}
      <section className={`${styles.section} ${styles['section--white']}`}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className={styles.sectionTitle}>Nhà cung cấp tin cậy</h2>
            <p className={styles.sectionSubtitle}>Đối tác với các nhà cung cấp uy tín trên toàn quốc</p>
          </div>
          <div className={styles.suppliersGrid}>
            {data.suppliers.map((supplier: Supplier, index: number) => (
              <div key={supplier._id?.toString() || index} className={styles.supplierCard}>
                <div className="p-6">
                  <div className={styles.supplierHeader}>
                    <h3 className={styles.supplierName}>{supplier.name}</h3>
                    <div className={styles.verifiedBadge}>
                      <Star className="h-3 w-3 mr-1" />
                      Đã xác minh
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <div className={styles.supplierInfo}>
                    <p className={styles.supplierDetail}>{supplier.email}</p>
                    <p className={styles.supplierDetail}>{supplier.phone}</p>
                    <p className={styles.supplierDetail}>{supplier.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export const loader = homeLoader;
export const hydrateFallbackElement = <HomePageSkeleton />;