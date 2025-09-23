import { Filter, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ContractFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  category?: string;
  setCategory?: (category: string) => void;
  paymentStatus?: string;
  setPaymentStatus?: (status: string) => void;
}
export default function ContractFilter({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  paymentStatus,
  setPaymentStatus,
}: ContractFilterProps) {
  return (
    <div className="flex gap-3 items-center">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
        <Input
          placeholder="Tìm kiếm tên bất động sản, tên người thuê"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
    pl-10 h-11 w-full rounded-full
    bg-primary-foreground border border-secondary/50
    shadow-secondary
    focus-visible:border-secondary focus-visible:ring-2 focus-visible:ring-secondary/20
    focus:outline-none transition-colors
    placeholder:text-sm placeholder:text-primary
    text-sm text-primary
  "
        />
      </div>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="bg-primary-foreground text-secondary font-bold border-secondary rounded-full px-6 h-11 shadow-secondary min-w-[160px]  data-[placeholder]:text-secondary">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent className="bg-primary-foreground">
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="nha-dat">Nhà đất</SelectItem>
          <SelectItem value="can-ho">Căn hộ</SelectItem>
          <SelectItem value="dat-nen">Đất nền</SelectItem>
          <SelectItem value="nha-rieng">Nhà riêng</SelectItem>
        </SelectContent>
      </Select>
      <Select value={paymentStatus} onValueChange={setPaymentStatus}>
        <SelectTrigger className="bg-primary-foreground text-secondary font-bold border-secondary rounded-full px-6 h-11 shadow-secondary min-w-[200px] data-[placeholder]:text-secondary">
          <SelectValue placeholder="Trạng thái thanh toán" />
        </SelectTrigger>
        <SelectContent className="bg-primary-foreground">
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="paid">Đã thanh toán</SelectItem>
          <SelectItem value="pending">Chờ thanh toán</SelectItem>
          <SelectItem value="overdue">Quá hạn</SelectItem>
        </SelectContent>
      </Select>
      <Button
        className="bg-secondary text-primary-foreground font-bold border-secondary rounded-full px-6 h-11 w-[100px] shadow-secondary hover:bg-secondary/90 transition-colors
"
      >
        <Filter className="w-4 h-4" />
        Lọc
      </Button>
    </div>
  );
}
