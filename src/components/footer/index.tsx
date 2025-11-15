/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { Dancing_Script } from "next/font/google";
import { Phone, Mail, Printer } from "lucide-react";
import { useTranslations } from "next-intl";

const dancing = Dancing_Script({ subsets: ["latin"] });
export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="w-full bg-[#FFEED3] border-t">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Logo và Social Media */}
          <div className="lg:col-span-4 flex flex-col gap-3 items-center">
            <img src="/assets/logos/logoFooter.svg" alt="TakaHome Logo" />
            <div className="flex gap-10 items-center">
              <a
                href="#"
                className="w-7.5 h-7.5 flex items-center justify-center"
              >
                <img src="/assets/icons/facebook.svg" alt="Facebook" />
              </a>
              <a
                href="#"
                className="w-7.5 h-7.5 flex items-center justify-center"
              >
                <img src="/assets/icons/instargram.svg" alt="Instagram" />
              </a>
              <a
                href="#"
                className="w-7.5 h-7.5 flex items-center justify-center"
              >
                <img src="/assets/icons/Youtube.svg" alt="YouTube" />
              </a>
              <a
                href="#"
                className="w-7.5 h-7.5 flex items-center justify-center"
              >
                <img src="/assets/icons/twitter.svg" alt="Twitter" />
              </a>
            </div>

            <div className="text-primary text-center">
              <p className=" font-bold">Contact With Us</p>
              <p className={`${dancing.className} text-xl`}>
                Thank you for believing
              </p>
            </div>
          </div>

          {/* Liên kết */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-lg text-primary mb-4 border-l-4 border-accent pl-3">
              {t("links")}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-accent transition-colors flex items-center"
                >
                  • Danh sách bất động sản
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-accent transition-colors flex items-center"
                >
                  • Hỗ trợ đăng ký đại lý
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-accent transition-colors flex items-center"
                >
                  • Thông tin cá nhân
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-accent transition-colors flex items-center"
                >
                  • Về chúng tôi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-accent transition-colors flex items-center"
                >
                  • {t("policies")}
                </a>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-lg text-primary mb-4 border-l-4 border-orange-400 pl-3">
              {t("contact")}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-7 h-7 bg-orange-400 rounded-full flex items-center justify-center mr-2">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="text-[#4f4f4f] text-sm flex gap-1">
                  <p className="font-bold">Hotline:</p>
                  <p>0987654321</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-7 h-7 bg-orange-400 rounded-full flex items-center justify-center mr-2">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="text-[#4f4f4f] text-sm flex gap-1">
                  <p className=" font-bold">Email:</p>
                  <p>example@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-7 h-7 bg-orange-400 rounded-full flex items-center justify-center mr-2">
                  <Printer className="w-4 h-4 text-white" />
                </div>
                <div className="text-[#4f4f4f] text-sm flex gap-1">
                  <p className="font-bold">Fax:</p>
                  <p>09876543 - 12345678</p>
                </div>
              </div>
            </div>
          </div>

          {/* Download App */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              <a href="#" className="block hover:opacity-80 transition-opacity">
                <Image
                  src="/assets/icons/appstore.svg"
                  alt="Download on App Store"
                  width={227}
                  height={67}
                />
              </a>

              <a href="#" className="block hover:opacity-80 transition-opacity">
                <Image
                  src="/assets/icons/googleplay.svg"
                  alt="Get it on Google Play"
                  width={227}
                  height={67}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
