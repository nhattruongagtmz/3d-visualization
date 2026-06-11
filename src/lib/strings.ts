// All UI text in Vietnamese. Edit this file to update any displayed text.
export const strings = {
  meta: {
    title: 'PrintForge — Mô hình In 3D',
    description:
      'Khám phá 14 mô hình in 3D độc đáo được làm trên phần cứng Bambu Lab. Trang trí hình học, linh kiện chức năng, đồ chơi và nhiều hơn nữa. Giao hàng trong 2 ngày làm việc.',
    ogTitle: 'PrintForge — Mô hình In 3D',
    ogDescription:
      'Các mô hình in 3D độc đáo được in tươi trên phần cứng Bambu Lab. Miễn phí vận chuyển cho đơn hàng trên 1.200.000đ.',
  },

  nav: {
    home: 'Trang chủ',
    shop: 'Cửa hàng',
    about: 'Giới thiệu',
    dashboard: 'Bảng điều khiển',
    openCartAriaLabel: 'Mở giỏ hàng',
  },

  hero: {
    badge: 'Tương thích Bambu Lab',
    headline1: 'In Chính Xác.',
    headline2: 'Sẵn Sàng Giao Hàng.',
    description:
      'Khám phá các mô hình in 3D độc đáo — từ đồ trang trí nội thất đến linh kiện chức năng. Mỗi sản phẩm được in tươi trên phần cứng Bambu Lab với sợi chất lượng cao.',
    ctaBrowse: 'Khám phá cửa hàng',
    ctaHowItWorks: 'Cách hoạt động',
    ratingLabel: 'Đánh giá TB',
    featuredProductName: 'Bình Hoa Hình Học Gợn Sóng',
    featuredProductSub: 'PLA · Còn hàng · $18.99',
    featuredProductAlt: 'Bình Hoa Hình Học Gợn Sóng — mô hình in 3D nổi bật',
    shippingCardTitle: 'In mới',
    shippingCardSub: 'Giao hàng trong 2 ngày làm việc',
  },

  featured: {
    eyebrow: 'Tuyển chọn',
    heading: 'Sản phẩm nổi bật',
    viewAll: 'Xem tất cả',
  },

  categories: {
    heading: 'Mua theo danh mục',
    shopNow: 'Mua ngay',
    homeCategoryAlt: 'Danh mục trang trí nội thất',
    descriptions: {
      'home-decor': 'Bình hoa, chậu cây, tranh tường, khay đựng',
      toys: 'Đồ chơi fidget, mô hình, quân cờ, câu đố',
      tools: 'Giá đỡ, dưỡng, phụ kiện xưởng',
      art: 'Điêu khắc, in trang trí, quà tặng',
      'functional-parts': 'Giá gắn, kẹp, bộ lắp ráp, bộ chuyển đổi',
    } as Record<string, string>,
  },

  trust: {
    badges: [
      {
        title: 'Được chứng nhận Bambu Lab',
        description:
          'In trên các máy X1C, P1S và A1 cho chất lượng đồng nhất mọi lúc.',
        stat: 'X1C · P1S · A1',
      },
      {
        title: 'Đảm bảo chất lượng',
        description:
          'Mỗi bản in được kiểm tra trước khi giao. Không hài lòng? Chúng tôi in lại hoặc hoàn tiền.',
        stat: '100% hài lòng',
      },
      {
        title: 'Giao hàng nhanh',
        description:
          'Giao hàng trong 2 ngày làm việc. Miễn phí cho đơn hàng trên 1.200.000đ.',
        stat: 'Giao trong 2 ngày',
      },
    ],
  },

  footer: {
    tagline:
      'Các mô hình in 3D độc đáo, in tươi trên phần cứng Bambu Lab và giao đến tận nhà bạn.',
    shopHeading: 'Cửa hàng',
    allProducts: 'Tất cả sản phẩm',
    homeDecor: 'Trang trí nội thất',
    functionalParts: 'Linh kiện chức năng',
    companyHeading: 'Công ty',
    about: 'Giới thiệu',
    cart: 'Giỏ hàng',
    privacy: 'Chính sách bảo mật',
    terms: 'Điều khoản dịch vụ',
    copyright: (year: number) => `© ${year} PrintForge. Đã đăng ký bản quyền.`,
    madeWith: 'In tỉ mỉ trên Bambu Lab',
  },

  cart: {
    pageTitle: 'Giỏ hàng của bạn',
    drawerTitle: 'Giỏ hàng của bạn',
    empty: 'Giỏ hàng của bạn trống',
    browseShop: 'Duyệt cửa hàng',
    orderSummary: 'Tóm tắt đơn hàng',
    subtotal: (count: number) => `Tạm tính (${count} sản phẩm)`,
    shipping: 'Vận chuyển',
    free: 'Miễn phí',
    freeShippingPromo: (amount: string) =>
      `Thêm ${amount} để được miễn phí vận chuyển`,
    total: 'Tổng cộng',
    proceedToCheckout: 'Tiến hành thanh toán',
    clearCart: 'Xóa giỏ hàng',
    decreaseQty: 'Giảm số lượng',
    increaseQty: 'Tăng số lượng',
    removeItem: 'Xóa sản phẩm',
  },

  orderSummary: {
    title: 'Tóm tắt đơn hàng',
    subtotal: (n: number) => `Tạm tính (${n} sản phẩm)`,
    shipping: 'Vận chuyển',
    free: 'Miễn phí',
    total: 'Tổng cộng',
  },

  product: {
    featuredBadge: 'Nổi bật',
    outOfStock: 'Hết hàng',
    addToCart: 'Thêm vào giỏ',
    allPrinters: 'Tất cả máy in',
  },

  shop: {
    eyebrow: 'Bộ sưu tập PrintForge',
    heading: 'Tất cả sản phẩm',
    productCount: (n: number) => `${n} sản phẩm · in theo yêu cầu`,
    sortPlaceholder: 'Sắp xếp theo',
    sortFeatured: 'Nổi bật',
    sortPriceAsc: 'Giá: Thấp đến cao',
    sortPriceDesc: 'Giá: Cao đến thấp',
    sortRating: 'Đánh giá cao nhất',
    sortNewest: 'Mới nhất',
    noResults:
      'Không có sản phẩm nào phù hợp với bộ lọc của bạn. Hãy xóa một số bộ lọc.',
  },

  filters: {
    title: 'Bộ lọc',
    clearAll: 'Xóa tất cả',
    categoryAccordion: 'Danh mục',
    priceRangeAccordion: 'Khoảng giá',
    printerAccordion: 'Model máy in',
    materialAccordion: 'Vật liệu',
    categories: [
      { value: 'home-decor', label: 'Trang trí nội thất' },
      { value: 'toys', label: 'Đồ chơi & Sưu tập' },
      { value: 'tools', label: 'Công cụ & Lưu trữ' },
      { value: 'art', label: 'Nghệ thuật & Điêu khắc' },
      { value: 'functional-parts', label: 'Linh kiện chức năng' },
    ],
    printers: [
      { value: 'X1C', label: 'X1 Carbon' },
      { value: 'X1E', label: 'X1 Extreme' },
      { value: 'P1S', label: 'P1S' },
      { value: 'P1P', label: 'P1P' },
      { value: 'A1', label: 'A1' },
      { value: 'A1 Mini', label: 'A1 Mini' },
    ],
    materials: [
      { value: 'PLA', label: 'PLA' },
      { value: 'PETG', label: 'PETG' },
      { value: 'ABS', label: 'ABS' },
      { value: 'ASA', label: 'ASA' },
      { value: 'TPU', label: 'TPU' },
      { value: 'PA', label: 'Nylon (PA)' },
    ],
  },

  productDetail: {
    breadcrumbHome: 'Trang chủ',
    breadcrumbShop: 'Cửa hàng',
    tabPhotos: 'Ảnh',
    tab3D: 'Xem 3D',
    materialLabel: 'Vật liệu',
    addToCart: 'Thêm vào giỏ',
    outOfStock: 'Hết hàng',
    printSpecs: 'Thông số in',
    layerHeight: (n: number) => `Độ dày lớp: ${n} mm`,
    printTime: (t: string) => `Thời gian in: ${t}`,
    requiresSupports: 'Cần đế đỡ',
    printerCompat: 'Tương thích máy in',
    allBambu: 'Tất cả Bambu Lab',
    relatedProducts: 'Sản phẩm liên quan',
    notFoundTitle: 'Không tìm thấy sản phẩm',
    notFoundDesc: 'Sản phẩm này không tồn tại hoặc đã bị xóa.',
    backToShop: 'Quay lại cửa hàng',
    categoryLabels: {
      'home-decor': 'Trang trí nội thất',
      toys: 'Đồ chơi & Sưu tập',
      tools: 'Công cụ & Lưu trữ',
      art: 'Nghệ thuật & Điêu khắc',
      'functional-parts': 'Linh kiện chức năng',
    } as Record<string, string>,
  },

  checkout: {
    title: 'Thanh toán',
    emptyCart: 'Giỏ hàng của bạn trống',
    browseShop: 'Duyệt cửa hàng',
    orderConfirmedTitle: 'Đơn hàng đã được xác nhận!',
    orderThankYouPrefix: 'Cảm ơn bạn đã đặt hàng. Mã xác nhận của bạn là ',
    orderThankYouSuffix: '.',
    orderEmailPrefix: 'Bạn sẽ nhận được email tại ',
    orderEmailSuffix: ' khi đơn hàng được giao.',
    continueShopping: 'Tiếp tục mua sắm',
    paymentTitle: 'Thanh toán',
    paymentDemoNote:
      'Xử lý thanh toán không có trong bản demo này. Nhấn "Đặt hàng" để mô phỏng thanh toán thành công.',
    placeOrder: 'Đặt hàng',
    fieldRequired: 'Trường này là bắt buộc',
    invalidEmail: 'Nhập địa chỉ email hợp lệ',
  },

  shipping: {
    sectionTitle: 'Thông tin giao hàng',
    firstName: 'Họ',
    lastName: 'Tên',
    email: 'Email',
    address: 'Địa chỉ',
    city: 'Thành phố',
    state: 'Tỉnh/Bang',
    zip: 'Mã bưu điện',
    country: 'Quốc gia',
    placeholders: {
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      email: 'nguyen@example.com',
      address: '123 Đường Lý Thường Kiệt',
      city: 'Hà Nội',
      state: 'HN',
      zip: '10000',
      country: 'Việt Nam',
    },
  },

  about: {
    eyebrow: 'Giới thiệu',
    heading: 'Một khởi đầu nhỏ với nhiều tiềm năng.',
    body: 'TanStack Start cung cấp định tuyến an toàn kiểu dữ liệu, server functions và các mặc định SSR hiện đại. Dùng đây làm nền tảng sạch, sau đó thêm các routes, styling và add-on của riêng bạn.',
  },

  preview: {
    pageTitle: 'Xem Trước Mô Hình 3D',
    pageSubtitle: 'Tải lên tệp GLB, GLTF hoặc STL để xem trước ngay trong trình duyệt',
    dropzoneIdle: 'Kéo & thả tệp vào đây',
    dropzoneOr: 'hoặc',
    dropzoneBrowse: 'Chọn tệp',
    dropzoneDragging: 'Thả tệp vào đây…',
    dropzoneFormats: 'Hỗ trợ: GLB · GLTF · STL',
    dropzoneSizeLimit: 'Tối đa 50 MB',
    errorInvalidType: 'Định dạng không hỗ trợ. Chỉ chấp nhận .glb, .gltf, .stl',
    errorFileTooLarge: 'Tệp quá lớn. Giới hạn tối đa là 50 MB',
    uploadAnother: 'Tải tệp khác lên',
    loadingModel: 'Đang tải mô hình…',
    zoomIn: 'Phóng to',
    zoomOut: 'Thu nhỏ',
    frontView: 'Mặt trước',
    backView: 'Mặt sau',
    leftView: 'Mặt trái',
    rightView: 'Mặt phải',
    fileName: (name: string) => `Tệp: ${name}`,
    fileSize: (kb: number) => kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`,
  },

  dashboard: {
    pageEyebrow: 'Phân tích cửa hàng',
    pageTitle: 'Bảng điều khiển',
    pageSubtitle: 'Dữ liệu tổng quan từ danh mục sản phẩm PrintForge.',

    tabOverview: 'Tổng quan',
    tabProducts: 'Sản phẩm',
    tabCategories: 'Danh mục',

    kpiTotalProducts: 'Tổng sản phẩm',
    kpiTotalReviews: 'Tổng đánh giá',
    kpiAvgRating: 'Đánh giá trung bình',
    kpiPrintHours: 'Giờ in tích lũy',
    kpiFeaturedBadge: (n: number) => `${n} nổi bật`,
    kpiInStockBadge: 'Tất cả còn hàng',
    kpiReviewsUnit: 'lượt',
    kpiHoursUnit: 'giờ',

    sectionCategoryDist: 'Phân bổ danh mục',
    sectionMaterials: 'Vật liệu phổ biến',
    sectionFeatured: 'Sản phẩm nổi bật',
    sectionPriceStats: 'Thống kê giá',
    sectionTechSpecs: 'Đặc điểm kỹ thuật',

    priceMin: 'Giá thấp nhất',
    priceMax: 'Giá cao nhất',
    priceAvg: 'Giá trung bình',

    specNoSupport: 'Không cần đế đỡ',
    specAvgPrintTime: 'Thời gian in TB',
    specUniversalCompat: 'Tương thích tất cả máy',
    specLayerHeights: 'Độ dày lớp in',

    tableTitle: 'Tất cả sản phẩm',
    tableSearch: 'Tìm sản phẩm...',
    tableColProduct: 'Sản phẩm',
    tableColPrice: 'Giá',
    tableColRating: 'Đánh giá',
    tableColReviews: 'Lượt đánh giá',
    tableColMaterials: 'Vật liệu',
    tableColFeatured: 'Nổi bật',
    tableColPrintTime: 'Thời gian in',
    tableFooter: (shown: number, total: number) => `${shown} / ${total} sản phẩm`,
    tableFeaturedYes: 'Nổi bật',
    tableFeaturedNo: '—',

    catAvgPrice: 'Giá TB',
    catAvgRating: 'Đánh giá TB',
    catTotalReviews: 'Lượt đánh giá',
    catProductCount: (n: number) => `${n} sản phẩm`,
    catViewProducts: 'Xem sản phẩm',
    catOf: (n: number) => `/ ${n}`,
  },
}
