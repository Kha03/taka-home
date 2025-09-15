export default function PropertiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">
          Bất động sản của tôi
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {/* Property Status Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Tổng quan bất động sản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">8</div>
                <div className="text-sm text-gray-600">Đang cho thuê</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">Đang bán</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="text-sm text-gray-600">Trống</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">15</div>
                <div className="text-sm text-gray-600">Tổng số</div>
              </div>
            </div>
          </div>

          {/* Property Grid */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Danh sách bất động sản</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Thêm bất động sản
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Property Card 1 */}
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Hình ảnh</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Căn hộ Vinhomes Central Park
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Quận Bình Thạnh, TP.HCM
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    2 phòng ngủ • 80m²
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">
                      25 triệu/tháng
                    </span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Đang cho thuê
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-blue-100 text-blue-600 py-2 px-3 rounded text-sm hover:bg-blue-200">
                      Xem chi tiết
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-600 py-2 px-3 rounded text-sm hover:bg-gray-200">
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Card 2 */}
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Hình ảnh</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Nhà phố Thủ Đức
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Thành phố Thủ Đức, TP.HCM
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    4 phòng ngủ • 120m²
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">
                      8.5 tỷ
                    </span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Đang bán
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-blue-100 text-blue-600 py-2 px-3 rounded text-sm hover:bg-blue-200">
                      Xem chi tiết
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-600 py-2 px-3 rounded text-sm hover:bg-gray-200">
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Card 3 */}
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Hình ảnh</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Đất nền Bình Dương
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Thuận An, Bình Dương
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    150m² • Mặt tiền 6m
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">
                      3.2 tỷ
                    </span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      Trống
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-blue-100 text-blue-600 py-2 px-3 rounded text-sm hover:bg-blue-200">
                      Xem chi tiết
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-600 py-2 px-3 rounded text-sm hover:bg-gray-200">
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
