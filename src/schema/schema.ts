import { z } from "zod";

export const BASE_REQUIRED = "Trường này là bắt buộc";
export const VALIDATION_MESSAGES = {
  title: {
    required: "Tên bất động sản là bắt buộc",
    min: "Tên bất động sản phải có ít nhất 1 ký tự",
    max: "Tên bất động sản không được vượt quá 100 ký tự",
  },
  area: {
    required: "Diện tích là bắt buộc",
    min: "Diện tích phải lớn hơn 0",
  },
  price: {
    required: "Giá thuê là bắt buộc",
    min: "Giá thuê phải lớn hơn 0",
  },
  address: {
    province: "Vui lòng chọn tỉnh, thành phố",
    district: "Vui lòng chọn quận, huyện",
    ward: "Vui lòng chọn phường, xã",
    street: "Vui lòng nhập số nhà, tên đường",
  },
  description: {
    max: "Mô tả không được vượt quá 1500 ký tự",
  },
};

export const ListingKind = z.enum(["apartment", "boarding"], {
  error: BASE_REQUIRED,
});

export const RoomTypeSchema = z.object({
  name: z.string().min(1, BASE_REQUIRED),
  bedrooms: z.coerce.number().min(0).default(0),
  bathrooms: z.coerce.number().min(0).default(0),
  legalDoc: z.string().optional(),
  area: z.coerce.number().min(0.1, BASE_REQUIRED),
  price: z.coerce.number().min(0, BASE_REQUIRED),
  deposit: z.coerce.number().min(0).optional(),
  count: z.coerce.number().min(1, BASE_REQUIRED),
  locations: z.array(z.string()).default([]),
  images: z.array(z.string()).max(8).default([]),
});

export const FormSchema = z.object({
  title: z
    .string()
    .min(1, VALIDATION_MESSAGES.title.min)
    .max(100, VALIDATION_MESSAGES.title.max),
  kind: ListingKind,
  province: z.string().min(1, VALIDATION_MESSAGES.address.province),
  district: z.string().min(1, VALIDATION_MESSAGES.address.district),
  ward: z.string().min(1, VALIDATION_MESSAGES.address.ward),
  street: z.string().min(1, VALIDATION_MESSAGES.address.street),

  // Apartment
  block: z.string().optional(),
  floor: z.string().optional(),
  unit: z.string().optional(),

  // Boarding
  floors: z
    .array(
      z.object({
        name: z.string(),
        rooms: z.array(z.string()),
      })
    )
    .default([]),

  description: z
    .string()
    .max(1500, VALIDATION_MESSAGES.description.max)
    .optional(),

  // Details
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  furnishing: z.string().optional(),
  legalDoc: z.string().optional(),
  area: z.coerce.number().min(0.1, VALIDATION_MESSAGES.area.min),
  price: z.coerce.number().min(0, VALIDATION_MESSAGES.price.min),
  deposit: z.coerce.number().min(0).optional(),

  heroImage: z.string().optional(),
  gallery: z.array(z.string()).max(8).default([]),

  // Boarding groups
  roomTypes: z.array(RoomTypeSchema).default([]),
});

export type NewPropertyForm = z.infer<typeof FormSchema>;
