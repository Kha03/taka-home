"use client";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroSearch() {
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget as HTMLFormElement);
        router.push(
          `/search?kw=${form.get("kw")}&cat=${form.get("cat")}&loc=${form.get(
            "loc"
          )}`
        );
      }}
      className="mx-auto flex w-full items-center gap-2 rounded-[12px] bg-background p-3.5 shadow-md"
    >
      <div className="p-3 rounded-sm bg-primary text-white">
        <Search />
      </div>
      <Input
        name="kw"
        placeholder="Tìm kiếm bất động sản..."
        className="placeholder:text-primary placeholder:font-bold text-primary font-medium"
        style={{ boxShadow: "none", border: "none" }}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="rounded-none  border-l border-gray-200 bg-transparent  pl-4 pr-[200px] py-2 hover:bg-primary/5 font-bold text-primary"
          >
            Danh mục
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <Command>
            <CommandList>
              <CommandItem
                onSelect={() => {
                  /* set value */
                }}
              >
                Nhà ở
              </CommandItem>
              <CommandItem>Căn hộ/Chung cư</CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="rounded-none  border-l border-gray-200 bg-transparent pl-4 pr-[200px] py-2 hover:bg-primary/5 font-bold text-primary"
          >
            Toàn quốc
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <Command>
            <CommandList>
              <CommandItem
                onSelect={() => {
                  /* set value */
                }}
              >
                Hà Nội
              </CommandItem>
              <CommandItem>Hồ Chí Minh</CommandItem>
              <CommandItem>Đà Nẵng</CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button type="submit" className="bg-accent" size={"post"}>
        <Search />
        Tìm kiếm
      </Button>
    </form>
  );
}
