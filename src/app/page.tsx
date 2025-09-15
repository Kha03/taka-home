import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans px-8 pb-20 gap-16 sm:px-20">
      <div className="w-full max-w-[1518px] mx-auto space-y-8 pt-8">
        <div className="text-center space-y-4">
          <Image
            className="dark:invert mx-auto"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Taka Home
          </h1>
          <p className="text-muted-foreground">
            Project được tích hợp với shadcn/ui components và dark mode
          </p>
        </div>

        {/* Demo shadcn/ui components */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Button Components</CardTitle>
              <CardDescription>
                Các loại button khác nhau từ shadcn/ui
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>Input và Label components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <Button className="w-full">Submit</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>🌙 Dark Mode Theme</CardTitle>
            <CardDescription>
              Demo dark mode với shadcn/ui theme system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Background Colors</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-background border rounded"></div>
                    <span>Background</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-card border rounded"></div>
                    <span>Card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted border rounded"></div>
                    <span>Muted</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Text Colors</h4>
                <div className="space-y-1">
                  <div className="text-foreground">Foreground text</div>
                  <div className="text-muted-foreground">Muted text</div>
                  <div className="text-primary">Primary text</div>
                  <div className="text-destructive">Destructive text</div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Sử dụng theme toggle ở góc trên bên
                phải để chuyển đổi giữa light/dark mode
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Hướng dẫn sử dụng shadcn/ui và dark mode trong project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Thêm components mới:{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  npx shadcn@latest add [component-name]
                </code>
              </li>
              <li>Import và sử dụng components trong code của bạn</li>
              <li>
                Customize theme trong file{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  globals.css
                </code>
              </li>
              <li>
                Sử dụng{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  next-themes
                </code>{" "}
                để quản lý dark mode
              </li>
            </ol>
          </CardContent>
        </Card>

        <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
          <Button asChild>
            <a
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="dark:invert mr-2"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Deploy now
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read our docs
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
