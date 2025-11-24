/**
 * Error Messages Translation Map
 * Maps backend error codes to Vietnamese messages
 */

// ============= AUTH ERRORS =============
const AUTH_ERRORS_VI = {
  EMAIL_ALREADY_REGISTERED: "Email đã được đăng ký",
  ACCOUNT_NOT_FOUND: "Không tìm thấy thông tin tài khoản",
  INVALID_CREDENTIALS: "Mật khẩu không đúng",
  GOOGLE_AUTH_FAILED: "Xác thực Google thất bại",
  INVALID_TOKEN: "Token không hợp lệ",
  INVALID_PHONE_NUMBER: "Số điện thoại không hợp lệ",
  TOKEN_EXPIRED: "Token đã hết hạn",
  TOKEN_INVALID_PHONE: "Token không chứa số điện thoại hợp lệ",
  TOKEN_TOO_OLD: "Token đã quá cũ",
  PHONE_NOT_SUPPORTED: "Số điện thoại không được hỗ trợ",
  USER_NOT_FOUND_BY_PHONE: "Không tìm thấy người dùng với số điện thoại này",
  ACCOUNT_NOT_ACTIVATED: "Tài khoản chưa được kích hoạt",
  INVALID_TOKEN_TYPE: "Loại token không hợp lệ",
  TOKEN_MISSING_EMAIL: "Token không chứa email",
  TOKEN_ALREADY_USED: "Token đã được sử dụng",
  TOKEN_MISMATCH: "Token không khớp",
  REFRESH_TOKEN_NOT_FOUND: "Không tìm thấy refresh token",
  REFRESH_TOKEN_MISMATCH: "Refresh token không khớp",
  TOKEN_MISSING_CREDENTIALS: "Token thiếu thông tin xác thực",
  TOKEN_USER_MISMATCH: "Token không khớp với người dùng",
  LOGOUT_FAILED: "Đăng xuất thất bại",
} as const;

// ============= USER ERRORS =============
const USER_ERRORS_VI = {
  USER_NOT_FOUND: "Không tìm thấy người dùng",
  NO_FILE_UPLOADED: "Chưa tải lên tệp",
  FILE_SIZE_TOO_LARGE: "Kích thước tệp quá lớn",
  INVALID_FILE_TYPE: "Loại tệp không hợp lệ",
  NO_IMAGE_UPLOADED: "Chưa tải lên hình ảnh",
  INVALID_IMAGE_TYPE: "Loại hình ảnh không hợp lệ",
  INVALID_IMAGE_BUFFER: "Dữ liệu hình ảnh không hợp lệ",
  USER_NOT_VERIFIED_FOR_ACTION: "Người dùng chưa được xác minh để thực hiện hành động này",
} as const;

// ============= WALLET ERRORS =============
const WALLET_ERRORS_VI = {
  AMOUNT_MUST_BE_POSITIVE: "Số tiền phải lớn hơn 0",
  WALLET_NOT_FOUND: "Không tìm thấy ví",
  INSUFFICIENT_BALANCE: "Số dư không đủ",
} as const;

// ============= VERIFICATION ERRORS =============
const VERIFICATION_ERRORS_VI = {
  VERIFICATION_NOT_FOUND: "Không tìm thấy thông tin xác thực",
} as const;

// ============= CCCD RECOGNITION ERRORS =============
const CCCD_ERRORS_VI = {
  FPT_AI_API_KEY_NOT_CONFIGURED: "Chưa cấu hình API key FPT AI",
  FPT_AI_ENDPOINT_NOT_CONFIGURED: "Chưa cấu hình endpoint FPT AI",
  INVALID_IMAGE_BUFFER: "Dữ liệu hình ảnh không hợp lệ",
  CCCD_RECOGNITION_FAILED: "Nhận diện CCCD thất bại",
  CCCD_RECOGNITION_TIMEOUT: "Nhận diện CCCD hết thời gian",
  CCCD_RECOGNITION_ERROR: "Lỗi nhận diện CCCD",
  FPT_AI_API_ERROR: "Lỗi API FPT AI",
  CCCD_NO_PORTRAIT: "Không tìm thấy ảnh chân dung trong CCCD",
  CCCD_NO_ID: "Không tìm thấy số CCCD",
  CCCD_NO_NAME: "Không tìm thấy họ tên trong CCCD",
} as const;

// ============= STATISTICS ERRORS =============
const STATISTICS_ERRORS_VI = {
  LANDLORD_NOT_FOUND: "Không tìm thấy chủ nhà",
} as const;

// ============= SMARTCA ERRORS =============
const SMARTCA_ERRORS_VI = {
  INVALID_PDF_BUFFER: "Dữ liệu PDF không hợp lệ",
  INVALID_RECT_PLACEHOLDER: "Vị trí chữ ký không hợp lệ",
  MULTIPLE_PLACEHOLDERS_NOT_SUPPORTED: "Không hỗ trợ nhiều vị trí chữ ký",
  NO_BYTERANGE_FOUND: "Không tìm thấy ByteRange",
  BYTERANGE_INSUFFICIENT_GAP: "Khoảng trống ByteRange không đủ",
  SELF_CA_SIGNING_FAILED: "Ký chữ ký điện tử thất bại",
  CERTIFICATE_SERVICE_NOT_AVAILABLE: "Dịch vụ chứng thư không khả dụng",
  VNPT_CMS_FAILED: "Tạo CMS VNPT thất bại",
  INVALID_ATTRIBUTE_STRUCTURE: "Cấu trúc thuộc tính không hợp lệ",
  MISSING_MESSAGE_DIGEST: "Thiếu message digest",
  MISMATCH_MESSAGE_DIGEST_LENGTH: "Độ dài message digest không khớp",
  MISMATCH_MESSAGE_DIGEST_VALUE: "Giá trị message digest không khớp",
  MISSING_BYTE_RANGE: "Thiếu ByteRange",
  INVALID_PDF_OBJECT: "Đối tượng PDF không hợp lệ",
  INVALID_CONTENTS_HEX: "Nội dung hex không hợp lệ",
  BYTERANGE_MISMATCH: "ByteRange không khớp",
  BYTERANGE_SUM_MISMATCH: "Tổng ByteRange không khớp",
  SMARTCA_NOT_RESPONDING: "SmartCA không phản hồi",
  NO_STATUS_FROM_SMARTCA: "Không nhận được trạng thái từ SmartCA",
  NO_SIGNATURE_VALUE: "Không có giá trị chữ ký",
  CANNOT_LOCATE_SIGNATURE_DICT: "Không tìm thấy từ điển chữ ký",
  MISSING_CCCD_OR_USERID: "Thiếu CCCD hoặc User ID",
  GET_CERTIFICATE_FAILED: "Lấy chứng thư thất bại",
  NO_CERTIFICATE_AVAILABLE: "Không có chứng thư khả dụng",
  CERTIFICATE_NOT_FOUND_BY_SERIAL: "Không tìm thấy chứng thư theo số serial",
  NO_SERIAL_NUMBER: "Không có số serial",
  SIGNER_PEM_NULL: "PEM người ký rỗng",
  TRANSACTION_ID_REQUIRED: "Yêu cầu mã giao dịch",
  INVALID_HEX_CONTENTS: "Nội dung hex không hợp lệ",
  MALFORMED_CONTENTS: "Nội dung không đúng định dạng",
  BYTERANGE_NOT_FOUND: "Không tìm thấy ByteRange",
  INVALID_BYTERANGE_FORMAT: "Định dạng ByteRange không hợp lệ",
  MISSING_PDF_FILE: "Thiếu tệp PDF",
  USER_ID_REQUIRED: "Yêu cầu User ID",
  SERIAL_NUMBER_REQUIRED: "Yêu cầu số serial",
  INVALID_SIGNATURE_INDEX: "Chỉ số chữ ký không hợp lệ",
  MISSING_CMS_DATA: "Thiếu dữ liệu CMS",
  PROVIDE_ONLY_ONE_CMS_FORMAT: "Chỉ cung cấp một định dạng CMS",
  GENERATE_CMS_FAILED_SELF_CA: "Tạo CMS thất bại",
} as const;

// ============= ROOT CA ERRORS =============
const ROOT_CA_ERRORS_VI = {
  SYSTEM_ENC_KEY_REQUIRED: "Yêu cầu khóa mã hóa hệ thống",
  ENCRYPTED_KEY_NOT_FOUND: "Không tìm thấy khóa đã mã hóa",
  ROOT_CA_CERT_NOT_FOUND: "Không tìm thấy chứng chỉ Root CA",
  ROOT_CA_CERT_NOT_LOADED: "Chưa tải chứng chỉ Root CA",
  ROOT_CA_PRIVATE_KEY_NOT_LOADED: "Chưa tải khóa riêng Root CA",
  ROOT_CA_NOT_LOADED: "Chưa tải Root CA",
} as const;

// ============= CERTIFICATE ERRORS =============
const CERTIFICATE_ERRORS_VI = {
  USER_ID_REQUIRED: "Yêu cầu User ID",
  SYSTEM_ENC_KEY_NOT_CONFIGURED: "Chưa cấu hình khóa mã hóa hệ thống",
  SERIAL_NUMBER_REQUIRED: "Yêu cầu số serial",
  CERTIFICATE_NOT_FOUND: "Không tìm thấy chứng thư",
  USER_NOT_FOUND: "Không tìm thấy người dùng",
  GENERATE_CERTIFICATE_FAILED: "Tạo chứng thư thất bại",
  CERTIFICATE_EXPIRED: "Chứng thư đã hết hạn",
  CERTIFICATE_REVOKED: "Chứng thư đã bị thu hồi",
  INVALID_CERTIFICATE_PEM: "PEM chứng thư không hợp lệ",
  INVALID_PRIVATE_KEY_PEM: "PEM khóa riêng không hợp lệ",
  SIGNATURE_CREATION_FAILED: "Tạo chữ ký thất bại",
  CMS_CREATION_FAILED: "Tạo CMS thất bại",
  ASN1_STRUCTURE_MISSING: "Thiếu cấu trúc ASN1",
  CERTIFICATE_INFO_EXTRACTION_FAILED: "Trích xuất thông tin chứng thư thất bại",
  CERTIFICATE_PEM_CONVERSION_FAILED: "Chuyển đổi PEM chứng thư thất bại",
} as const;

// ============= S3 STORAGE ERRORS =============
const S3_ERRORS_VI = {
  S3_BUCKET_NOT_CONFIGURED: "Chưa cấu hình S3 bucket",
  S3_CREDENTIALS_NOT_CONFIGURED: "Chưa cấu hình thông tin xác thực S3",
  INVALID_FILE_BUFFER: "Dữ liệu tệp không hợp lệ",
  S3_UPLOAD_FAILED: "Tải lên S3 thất bại",
  INVALID_PDF_BUFFER: "Dữ liệu PDF không hợp lệ",
  CONTRACT_ID_REQUIRED: "Yêu cầu mã hợp đồng",
  S3_DELETE_FAILED: "Xóa tệp S3 thất bại",
  S3_GET_FAILED: "Lấy tệp S3 thất bại",
  FILE_NOT_FOUND: "Không tìm thấy tệp",
  INVALID_AVATAR_BUFFER: "Dữ liệu avatar không hợp lệ",
  USER_ID_REQUIRED: "Yêu cầu User ID",
  ORIGINAL_FILENAME_REQUIRED: "Yêu cầu tên tệp gốc",
  INVALID_IMAGE_EXTENSION: "Phần mở rộng hình ảnh không hợp lệ",
  INVALID_S3_URL_FORMAT: "Định dạng URL S3 không hợp lệ",
} as const;

// ============= REVIEW ERRORS =============
const REVIEW_ERRORS_VI = {
  REVIEW_NOT_FOUND: "Không tìm thấy đánh giá",
} as const;

// ============= REPORT ERRORS =============
const REPORT_ERRORS_VI = {
  REPORT_NOT_FOUND: "Không tìm thấy báo cáo",
  REPORTER_NO_RENTED_PROPERTY: "Người báo cáo không thuê bất động sản này",
  REPORT_ALREADY_EXISTS: "Báo cáo đã tồn tại",
} as const;

// ============= PROPERTY ERRORS =============
const PROPERTY_ERRORS_VI = {
  ENTITY_ID_REQUIRED: "Yêu cầu mã thực thể",
  ROOM_TYPE_NOT_FOUND: "Không tìm thấy loại phòng",
  PROPERTY_NOT_FOUND: "Không tìm thấy bất động sản",
  PROPERTY_CREATE_FAILED: "Tạo bất động sản thất bại",
  ROOM_NOT_FOUND: "Không tìm thấy phòng",
  ROOM_NOT_OWNED_BY_USER: "Phòng không thuộc sở hữu của bạn",
  PARENT_PROPERTY_NOT_FOUND: "Không tìm thấy bất động sản cha",
  PROPERTY_NOT_OWNED_BY_USER: "Bất động sản không thuộc sở hữu của bạn",
  FORBIDDEN_NOT_OWNER: "Không có quyền truy cập - bạn không phải chủ sở hữu",
  NEW_ROOM_TYPE_NOT_FOUND: "Không tìm thấy loại phòng mới",
  TARGET_PROPERTY_NOT_FOUND: "Không tìm thấy bất động sản đích",
  TARGET_PROPERTY_NOT_BOARDING: "Bất động sản đích không phải nhà trọ",
  TARGET_PROPERTY_DIFFERENT_OWNER: "Bất động sản đích thuộc chủ sở hữu khác",
  ROOM_TYPE_REQUIRED_FIELDS_MISSING: "Thiếu thông tin bắt buộc của loại phòng",
  TARGET_ROOM_TYPE_ID_REQUIRED: "Yêu cầu mã loại phòng đích",
  TARGET_ROOM_TYPE_NOT_FOUND: "Không tìm thấy loại phòng đích",
  TARGET_ROOM_TYPE_NOT_IN_PROPERTY:
    "Loại phòng đích không thuộc bất động sản này",
  INVALID_MOVE_TARGET: "Đích chuyển không hợp lệ",
  CANNOT_MOVE_TO_SELF: "Không thể chuyển về chính nó",
  ROOM_MOVE_FAILED: "Chuyển phòng thất bại",
  PROPERTY_UPDATE_FAILED: "Cập nhật bất động sản thất bại",
  PROPERTY_APPROVE_FAILED: "Phê duyệt bất động sản thất bại",
  PROPERTIES_APPROVE_FAILED: "Phê duyệt nhiều bất động sản thất bại",
  ROOM_TYPE_NOT_FOUND_FOR_PROPERTY:
    "Không tìm thấy loại phòng cho bất động sản",
  ADDRESS_REQUIRED: "Yêu cầu địa chỉ",
  PROPERTY_HAS_ACTIVE_BOOKINGS: "Bất động sản có đặt phòng đang hoạt động",
} as const;

// ============= PAYMENT ERRORS =============
const PAYMENT_ERRORS_VI = {
  INVOICE_NOT_FOUND: "Không tìm thấy hóa đơn",
  INVOICE_NOT_PENDING: "Hóa đơn không ở trạng thái chờ thanh toán",
  INVOICE_ALREADY_HAS_PAYMENT: "Hóa đơn đã có giao dịch thanh toán",
  INVALID_PAYMENT_METHOD: "Phương thức thanh toán không hợp lệ",
  WALLET_PAYMENT_FAILED: "Thanh toán qua ví thất bại",
  VNPAY_PAYMENT_FAILED: "Thanh toán VNPay thất bại",
  UNSUPPORTED_PAYMENT_METHOD: "Phương thức thanh toán không được hỗ trợ",
  PAYMENT_NOT_FOUND: "Không tìm thấy giao dịch thanh toán",
  PAYMENT_URL_GENERATION_FAILED: "Tạo URL thanh toán thất bại",
  VNPAY_HASH_SECRET_MISSING: "Thiếu secret key VNPay",
  USER_NOT_FOUND: "Không tìm thấy người dùng",
  CONTRACT_NOT_FOUND: "Không tìm thấy hợp đồng",
  TENANT_NOT_IN_CONTRACT: "Người thuê không thuộc hợp đồng này",
  BOOKING_NOT_FOUND: "Không tìm thấy đặt phòng",
  BOOKING_NOT_OWNED_BY_USER: "Đặt phòng không thuộc sở hữu của bạn",
  INVALID_BOOKING_STATUS: "Trạng thái đặt phòng không hợp lệ",
  BOOKING_NOT_APPROVED: "Đặt phòng chưa được phê duyệt",
  INVOICE_ALREADY_EXISTS: "Hóa đơn đã tồn tại",
  PROPERTY_NOT_FOUND: "Không tìm thấy bất động sản",
  PROPERTY_PRICING_NOT_FOUND: "Không tìm thấy thông tin giá bất động sản",
  CONTRACT_ID_REQUIRED: "Yêu cầu mã hợp đồng",
  NO_ACTIVE_EXTENSION: "Không có yêu cầu gia hạn đang hoạt động",
  ONLY_TENANT_CAN_PAY: "Chỉ người thuê mới có thể thanh toán",
  TENANT_ESCROW_ALREADY_PAID: "Người thuê đã thanh toán tiền ký quỹ",
  ONLY_LANDLORD_CAN_PAY: "Chỉ chủ nhà mới có thể thanh toán",
  LANDLORD_ESCROW_ALREADY_PAID: "Chủ nhà đã thanh toán tiền ký quỹ",
  MISSING_USER_INFO_WALLET_TOPUP: "Thiếu thông tin người dùng để nạp ví",
} as const;

// ============= NOTIFICATION ERRORS =============
const NOTIFICATION_ERRORS_VI = {
  NOTIFICATION_NOT_FOUND: "Không tìm thấy thông báo",
} as const;

// ============= INVOICE ERRORS =============
const INVOICE_ERRORS_VI = {
  CONTRACT_NOT_FOUND: "Không tìm thấy hợp đồng",
  NOT_AUTHORIZED_FOR_CONTRACT: "Không có quyền truy cập hợp đồng",
  SERVICE_LIST_EMPTY: "Danh sách dịch vụ trống",
  INVALID_SERVICE_TYPE: "Loại dịch vụ không hợp lệ",
  KWH_NO_REQUIRED: "Yêu cầu số điện",
  M3_NO_REQUIRED: "Yêu cầu số nước",
  INVALID_ELECTRIC_WATER_VALUES: "Giá trị điện nước không hợp lệ",
  CONTRACT_NO_PROPERTY: "Hợp đồng không có bất động sản",
  PAYMENT_DETAILS_MISSING: "Thiếu chi tiết thanh toán",
  INVALID_KWNO_OR_M3NO: "Số điện hoặc số nước không hợp lệ",
  PREVIOUS_READING_HIGHER_THAN_CURRENT: "Chỉ số cũ cao hơn chỉ số mới",
  INVALID_READING_VALUES: "Giá trị chỉ số không hợp lệ",
  INVOICE_NOT_FOUND: "Không tìm thấy hóa đơn",
  NOT_AUTHORIZED_TO_VIEW_INVOICE: "Không có quyền xem hóa đơn",
  DAMAGE_COMPENSATION_TIMING_INVALID:
    "Thời gian bồi thường thiệt hại không hợp lệ",
  DUPLICATE_SERVICE_TYPE: "Loại dịch vụ bị trùng",
  FILE_UPLOAD_REQUIRED: "Yêu cầu tải lên tệp",
  UNSUPPORTED_FILE_TYPE: "Loại tệp không được hỗ trợ",
  FILE_SIZE_EXCEEDED: "Kích thước tệp vượt quá giới hạn",
} as const;

// ============= BOOKING ERRORS =============
const BOOKING_ERRORS_VI = {
  BOOKING_NOT_FOUND: "Không tìm thấy đặt phòng",
  BOOKING_NOT_OWNED_BY_USER: "Đặt phòng không thuộc sở hữu của bạn",
  BOOKING_NOT_APPROVED: "Đặt phòng chưa được phê duyệt",
  BOOKING_ALREADY_HAS_CONTRACT: "Đặt phòng đã có hợp đồng",
  PROPERTY_NOT_FOUND: "Không tìm thấy bất động sản",
  INVALID_BOOKING_STATUS: "Trạng thái đặt phòng không hợp lệ",
  PROPERTY_ID_OR_ROOM_ID_REQUIRED: "Yêu cầu mã bất động sản hoặc mã phòng",
  CANNOT_PROVIDE_BOTH_PROPERTY_AND_ROOM:
    "Không thể cung cấp cả mã bất động sản và mã phòng",
  PROPERTY_ALREADY_BOOKED: "Bất động sản đã được đặt",
  BOARDING_PROPERTY_USE_ROOM_ID: "Nhà trọ cần sử dụng mã phòng",
  ROOM_ALREADY_BOOKED: "Phòng đã được đặt",
  ROOM_ID_ONLY_FOR_BOARDING: "Mã phòng chỉ dành cho nhà trọ",
  CONTRACT_CREATION_FAILED: "Tạo hợp đồng thất bại",
  PDF_UPLOAD_FAILED: "Tải lên PDF thất bại",
  USER_NOT_FOUND: "Không tìm thấy người dùng",
  INVALID_DATE_INPUT: "Dữ liệu ngày tháng không hợp lệ",
} as const;

// ============= CONTRACT ERRORS =============
const CONTRACT_ERRORS_VI = {
  CONTRACT_NOT_FOUND: "Không tìm thấy hợp đồng",
  CONTRACT_NOT_OWNED_BY_USER: "Hợp đồng không thuộc sở hữu của bạn",
  CONTRACT_ALREADY_SIGNED: "Hợp đồng đã được ký",
  CONTRACT_NOT_ACTIVE: "Hợp đồng không hoạt động",
  CONTRACT_EXPIRED: "Hợp đồng đã hết hạn",
  BOOKING_NOT_FOUND: "Không tìm thấy đặt phòng",
  PROPERTY_NOT_FOUND: "Không tìm thấy bất động sản",
  TENANT_NOT_FOUND: "Không tìm thấy người thuê",
  LANDLORD_NOT_FOUND: "Không tìm thấy chủ nhà",
  CONTRACT_FILE_NOT_FOUND: "Không tìm thấy tệp hợp đồng",
  ACCESS_DENIED: "Không có quyền truy cập",
  PRESIGNED_URL_GENERATION_FAILED: "Tạo URL tải xuống thất bại",
  INVALID_DATE_PROVIDED: "Ngày tháng không hợp lệ",
  EXTENSION_NOT_FOUND: "Không tìm thấy yêu cầu gia hạn",
  EXTENSION_REQUEST_NOT_PENDING: "Yêu cầu gia hạn không ở trạng thái chờ",
  ONLY_TENANT_CAN_CANCEL: "Chỉ người thuê mới có thể hủy",
  ONLY_TENANT_CAN_RESPOND: "Chỉ người thuê mới có thể phản hồi",
  ONLY_LANDLORD_CAN_SIGN: "Chỉ chủ nhà mới có thể ký",
  ONLY_TENANT_CAN_SIGN: "Chỉ người thuê mới có thể ký",
  TERMINATION_REQUEST_NOT_FOUND: "Không tìm thấy yêu cầu chấm dứt hợp đồng",
  TERMINATION_FORBIDDEN_NOT_PARTY:
    "Không có quyền - bạn không phải bên tham gia hợp đồng",
  TERMINATION_CONTRACT_NOT_ACTIVE: "Hợp đồng không hoạt động để chấm dứt",
  TERMINATION_REQUEST_ALREADY_PENDING: "Đã có yêu cầu chấm dứt đang chờ xử lý",
  TERMINATION_INVALID_END_MONTH_FORMAT: "Định dạng tháng kết thúc không hợp lệ",
  TERMINATION_END_MONTH_EXCEEDS_CONTRACT:
    "Tháng kết thúc vượt quá thời hạn hợp đồng",
  TERMINATION_MINIMUM_TWO_MONTHS_REQUIRED:
    "Yêu cầu tối thiểu hai tháng trước khi chấm dứt",
  TERMINATION_REQUEST_ALREADY_PROCESSED: "Yêu cầu chấm dứt đã được xử lý",
  TERMINATION_FORBIDDEN_NOT_OTHER_PARTY:
    "Không có quyền - bạn không phải bên kia của hợp đồng",
  TERMINATION_FORBIDDEN_CANNOT_RESPOND_OWN:
    "Không thể phản hồi yêu cầu của chính mình",
  TERMINATION_CANCEL_FORBIDDEN_NOT_CREATOR:
    "Không thể hủy - bạn không phải người tạo yêu cầu",
  TERMINATION_CANCEL_ONLY_PENDING: "Chỉ có thể hủy yêu cầu đang chờ xử lý",
} as const;

// ============= ESCROW ERRORS =============
const ESCROW_ERRORS_VI = {
  ESCROW_NOT_FOUND: "Không tìm thấy tài khoản ký quỹ",
  INSUFFICIENT_ESCROW_BALANCE: "Số dư ký quỹ không đủ",
  ESCROW_RELEASE_FAILED: "Giải ngân ký quỹ thất bại",
  ESCROW_UNAUTHORIZED_ACCESS: "Không có quyền truy cập tài khoản ký quỹ",
} as const;

// ============= CHATROOM ERRORS =============
const CHATROOM_ERRORS_VI = {
  CHATROOM_NOT_FOUND: "Không tìm thấy phòng chat",
  PROPERTY_NOT_FOUND: "Không tìm thấy bất động sản",
  PROPERTY_NO_LANDLORD: "Bất động sản không có chủ nhà",
  CANNOT_CHAT_WITH_SELF: "Không thể chat với chính mình",
  CHATROOM_RETRIEVE_FAILED: "Lấy thông tin phòng chat thất bại",
} as const;

// ============= BLOCKCHAIN ERRORS =============
const BLOCKCHAIN_ERRORS_VI = {
  USER_NOT_ENROLLED: "Người dùng chưa được đăng ký vào blockchain",
  RESOURCE_ALREADY_EXISTS: "Tài nguyên đã tồn tại",
  RESOURCE_NOT_FOUND: "Không tìm thấy tài nguyên",
  INVALID_INPUT_DATA: "Dữ liệu đầu vào không hợp lệ",
  NETWORK_ERROR: "Lỗi kết nối mạng",
  MISSING_ORG_HEADER: "Thiếu thông tin tổ chức",
  INVALID_ORGANIZATION: "Tổ chức không hợp lệ",
  NO_DEFAULT_USER: "Không có người dùng mặc định",
  NO_USER_IDENTITY: "Không có định danh người dùng",
} as const;

// ============= AUTH GUARD ERRORS =============
const AUTH_GUARD_ERRORS_VI = {
  TOKEN_EXPIRED: "Token đã hết hạn",
  INVALID_TOKEN: "Token không hợp lệ",
  UNAUTHORIZED: "Không có quyền truy cập",
} as const;

// ============= PENALTY ERRORS =============
const PENALTY_ERRORS_VI = {
  PENALTY_NOT_FOUND: "Không tìm thấy phạt",
  PENALTY_ALREADY_PAID: "Phạt đã được thanh toán",
} as const;

// ============= MAINTENANCE ERRORS =============
const MAINTENANCE_ERRORS_VI = {
  MAINTENANCE_NOT_FOUND: "Không tìm thấy yêu cầu bảo trì",
  MAINTENANCE_NOT_OWNED_BY_USER: "Yêu cầu bảo trì không thuộc sở hữu của bạn",
} as const;

// ============= GENERIC ERRORS =============
const GENERIC_ERRORS_VI = {
  INTERNAL_SERVER_ERROR: "Lỗi máy chủ nội bộ",
  BAD_REQUEST: "Yêu cầu không hợp lệ",
  UNAUTHORIZED: "Không có quyền truy cập",
  FORBIDDEN: "Truy cập bị cấm",
  NOT_FOUND: "Không tìm thấy",
  CONFLICT: "Xung đột dữ liệu",
  VALIDATION_ERROR: "Lỗi xác thực dữ liệu",
  NETWORK_ERROR: "Không thể kết nối đến server",
  UNKNOWN_ERROR: "Có lỗi xảy ra",
} as const;

// ============= FAVORITE ERRORS =============
const FAVORITE_ERRORS_VI = {
  FAVORITE_NOT_FOUND: "Không tìm thấy mục yêu thích",
  JUST_ONE_OF_PROPERTY_ROOMTYPE_REQUIRED:
    "Phải là bất động sản hoặc loại phòng",
} as const;

// ============= COMBINED ERROR MAP =============
export const ERROR_MESSAGES_VI = {
  ...AUTH_ERRORS_VI,
  ...USER_ERRORS_VI,
  ...WALLET_ERRORS_VI,
  ...VERIFICATION_ERRORS_VI,
  ...CCCD_ERRORS_VI,
  ...STATISTICS_ERRORS_VI,
  ...SMARTCA_ERRORS_VI,
  ...ROOT_CA_ERRORS_VI,
  ...CERTIFICATE_ERRORS_VI,
  ...S3_ERRORS_VI,
  ...REVIEW_ERRORS_VI,
  ...REPORT_ERRORS_VI,
  ...PROPERTY_ERRORS_VI,
  ...PAYMENT_ERRORS_VI,
  ...NOTIFICATION_ERRORS_VI,
  ...INVOICE_ERRORS_VI,
  ...BOOKING_ERRORS_VI,
  ...CONTRACT_ERRORS_VI,
  ...ESCROW_ERRORS_VI,
  ...CHATROOM_ERRORS_VI,
  ...BLOCKCHAIN_ERRORS_VI,
  ...AUTH_GUARD_ERRORS_VI,
  ...PENALTY_ERRORS_VI,
  ...MAINTENANCE_ERRORS_VI,
  ...GENERIC_ERRORS_VI,
  ...FAVORITE_ERRORS_VI,
} as const;

// Type for error codes
export type ErrorCode = keyof typeof ERROR_MESSAGES_VI;

/**
 * Get Vietnamese error message from error code
 * @param errorCode - Error code from backend
 * @param defaultMessage - Default message if error code not found
 * @returns Vietnamese error message
 */
export function getErrorMessage(
  errorCode: string | undefined,
  defaultMessage: string = "Đã có lỗi xảy ra. Vui lòng thử lại."
): string {
  if (!errorCode) return defaultMessage;

  // Check if errorCode is in our map
  if (errorCode in ERROR_MESSAGES_VI) {
    return ERROR_MESSAGES_VI[errorCode as ErrorCode];
  }

  // Return default message if not found
  return defaultMessage;
}

/**
 * Translate error from API response
 * @param error - Error object from API or catch block
 * @param defaultMessage - Default message if translation not found
 * @returns Vietnamese error message
 */
export function translateError(
  error: unknown,
  defaultMessage: string = "Đã có lỗi xảy ra. Vui lòng thử lại."
): string {
  // If error has message property, try to translate it
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: string }).message;
    return getErrorMessage(message, defaultMessage);
  }

  // If error is a string, try to translate it directly
  if (typeof error === "string") {
    return getErrorMessage(error, defaultMessage);
  }

  return defaultMessage;
}

/**
 * Translate response message from API
 * Useful for handling response.message directly
 * @param responseMessage - Message from API response
 * @param defaultMessage - Default message if translation not found
 * @returns Vietnamese error message
 */
export function translateResponseMessage(
  responseMessage: string | undefined,
  defaultMessage: string = "Có lỗi xảy ra"
): string {
  if (!responseMessage) return defaultMessage;
  return getErrorMessage(responseMessage, defaultMessage);
}
