import Image from "next/image";
import { Waterfall } from "next/font/google";
const waterfall = Waterfall({
  subsets: ["latin"],
  weight: ["400"],
});
export function AboutUs() {
  return (
    <section className="relative h-[600px] lg:h-[650px] overflow-hidden mt-9">
      {/* Background Image - Full Width */}
      <div className="absolute inset-0">
        <Image
          src="/assets/imgs/abou-us.png"
          alt="About TakaHome - Modern bathroom interior"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Overlay - Positioned on the left */}
      <div className="relative w-[calc(50%+12px)] z-10 h-full flex items-center bg-primary/25 pl-28 pr-12">
        <div className="space-y-6 text-white">
          <h2 className={`${waterfall.className} text-[150px] leading-none `}>
            About Us
          </h2>

          <div className="text-primary-foreground leading-relaxed lg:text-base">
            <p>
              <span className="text-xl font-black">TakaHome</span> là nền tảng
              công nghệ hiện đại, cung cấp giải pháp quản lý cho thuê nhà ở toàn
              diện và tối ưu. Ứng dụng được thiết kế dành riêng cho các chủ nhà
              và đối tác quản lý, giúp tự động hóa và đơn giản hóa mọi công
              đoạn: từ đăng tin, quảng bá bất động sản, kết nối với khách hàng
              tiềm năng, soạn thảo hợp đồng số đến quản lý thu chi, thanh toán
              online và bảo trì tài sản. TakaHome hướng đến mục tiêu mang lại
              trải nghiệm minh bạch, hiệu quả, tiết kiệm thời gian và công sức,
              biến quá trình quản lý cho thuê phức tạp trở nên thật đơn giản và
              an tâm.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
