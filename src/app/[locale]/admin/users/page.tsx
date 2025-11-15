"use client";

import { AdminHeader } from "@/components/admin";
import { EditUserDialog } from "@/components/admin/edit-user-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usersService } from "@/lib/api/services";
import { User } from "@/types/user";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AlertCircle, Check, Edit, Users as UsersIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function UsersPage() {
  const t = useTranslations("admin");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersService.getUsers();

      if (response.code === 200 && response.data) {
        setUsers(response.data);
      } else {
        setError(response.message || "Không thể tải danh sách người dùng");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Có lỗi xảy ra khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { label: "Hoạt động", variant: "default" as const },
      INACTIVE: { label: "Không hoạt động", variant: "secondary" as const },
      BLOCKED: { label: "Bị khóa", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: { label: "Quản trị viên" },
      LANDLORD: { label: "Chủ nhà" },
      TENANT: { label: "Người thuê" },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || {
      label: role,
      variant: "secondary" as const,
    };

    return <Badge variant={"outline"}>{config.label}</Badge>;
  };

  const getInitials = (fullName: string) => {
    const words = fullName.trim().split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <AdminHeader
        title="Quản lý người dùng"
        description="Xem và quản lý thông tin người dùng trong hệ thống"
      />

      <div className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-card rounded-lg border shadow-sm bg-primary-foreground">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Danh sách người dùng</h2>
              </div>
              {!loading && (
                <Badge variant="secondary">{users.length} người dùng</Badge>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Xác thực</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-16" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-[400px] text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UsersIcon className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">{t("noUsers")}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={user.avatarUrl || undefined}
                              alt={user.fullName}
                            />
                            <AvatarFallback>
                              {getInitials(user.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            {user.CCCD && (
                              <div className="text-xs text-muted-foreground">
                                CCCD: {user.CCCD}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.account.roles.map((role) => (
                            <div key={role}>{getRoleBadge(role)}</div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.isVerified ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(user.createdAt), "dd/MM/yyyy ", {
                            locale: vi,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <EditUserDialog
          user={editingUser}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
        />
      </div>
    </div>
  );
}
