/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Phone, Star, Send, MessageCircleMore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  time: string;
  content: string;
}

interface PropertySidebarProps {
  units: string[];
  reviews: Review[];
}

export function PropertySidebar({ units, reviews }: PropertySidebarProps) {
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [reviewText, setReviewText] = useState("");
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  return (
    <div className="space-y-3">
      {/* Agent Profile */}
      <Card className="bg-primary-foreground p-5">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarImage src="/vietnamese-woman-realtor.jpg" />
                <AvatarFallback>NT</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-primary">
                  Nguyễn Thị Chú Thuê
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Đang hoạt động
                  </span>
                </div>
              </div>
            </div>
            <Button className="bg-secondary hover:bg-secondary/90">
              <MessageCircleMore className="h-4 w-4" />
              Chat ngay
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-5 ml-14">
            <div className="bg-secondary w-5 h-5 flex items-center justify-center rounded-full">
              <Phone className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm">Số điện thoại: 0987654321</span>
          </div>

          <div className="grid grid-cols-3 gap-4 border-dashed p-5 border rounded-[12px] border-[#ccc]">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl font-bold text-primary">22</span>
                <img src={"/assets/icons/house-icon.svg"} alt="Property Icon" />
              </div>
              <div className="text-xs text-primary">Bất động sản</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl font-bold text-primary">45</span>
                <img
                  src={"/assets/icons/contract-icon.svg"}
                  alt="Contract Icon"
                />
              </div>
              <div className="text-xs text-primary">Hợp đồng</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl font-bold text-primary">1</span>
                <img src={"/assets/icons/calendar-icon.svg"} alt="Year Icon" />
              </div>
              <div className="text-xs text-primary">Năm tham gia</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-primary-foreground p-5">
        <CardContent className="p-0">
          {/* Rental Inquiry */}
          <div className="space-y-4 text-center">
            <h4 className="font-bold text-lg text-primary">
              Gửi yêu cầu thuê bất động sản này?
            </h4>
            <div className="grid grid-cols-6 gap-2">
              {units.map((unit) => (
                <Button
                  key={unit}
                  size="sm"
                  onClick={() => setSelectedUnit(unit)}
                  className={`text-xs w-14 h-7 text-[#4f4f4f] bg-[#e5e5e5] border-none hover:bg-accent rounded-[30px] ${
                    selectedUnit === unit ? "bg-secondary text-white " : ""
                  }`}
                >
                  {unit}
                </Button>
              ))}
            </div>

            <Button className="w-33 bg-secondary hover:bg-secondary/90">
              <Send className="h-4 w-4 mr-2" />
              Yêu cầu thuê
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card className="bg-primary-foreground p-5">
        <CardContent className="p-0">
          <p className="font-semibold text-primary mb-4 text-center">
            Đánh giá từ người thuê (12)
          </p>

          <div className="flex items-center gap-2 mb-3 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 cursor-pointer transition-colors ${
                  star <= (hoveredStar || userRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
                onClick={() => setUserRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="Viết đánh giá của bạn ..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="flex-1"
            />
            <Button
              size="icon"
              className="bg-secondary hover:bg-secondary/90 w-9 h-9 rounded-full"
            >
              <Send className="h-4 w-4 rotate-40 transform translate-x-[-2px]" />
            </Button>
          </div>

          <ScrollArea className="max-h-[860px] h-[520px] pr-2">
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex gap-3 pb-4 border-b border-muted"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={review.avatar || "/placeholder.svg"} />
                    <AvatarFallback>NT</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-primary">
                        {review.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {review.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-3 w-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
