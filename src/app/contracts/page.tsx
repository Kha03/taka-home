export default function ContractsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">
          Hợp đồng của tôi
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {/* Contract Status Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Tổng quan hợp đồng</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-gray-600">Đang hiệu lực</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="text-sm text-gray-600">Chờ ký kết</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Đã hoàn thành</div>
              </div>
            </div>
          </div>

          {/* Contract List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Danh sách hợp đồng</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Mã HĐ
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Bất động sản
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Ngày ký
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm">HD001</td>
                    <td className="px-4 py-3 text-sm">
                      Căn hộ Vinhomes Central Park
                    </td>
                    <td className="px-4 py-3 text-sm">15/09/2024</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Đang hiệu lực
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-blue-600 hover:text-blue-900">
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm">HD002</td>
                    <td className="px-4 py-3 text-sm">Nhà phố Thủ Đức</td>
                    <td className="px-4 py-3 text-sm">10/09/2024</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Chờ ký kết
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-blue-600 hover:text-blue-900">
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm">HD003</td>
                    <td className="px-4 py-3 text-sm">Đất nền Bình Dương</td>
                    <td className="px-4 py-3 text-sm">05/08/2024</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Đã hoàn thành
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-blue-600 hover:text-blue-900">
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
