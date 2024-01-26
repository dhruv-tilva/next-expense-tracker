"use client";

import * as z from "zod";

export const signUpFormSchema = z.object({
  first_name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .refine((data) => data.trim() !== "", {
      message: "Name is required",
    }),
  last_name: z
    .string()
    .min(1, {
      message: "Surname is required",
    })
    .refine((data) => data.trim() !== "", {
      message: "Surname is required",
    }),
  email: z
    .string()
    .min(6, {
      message: "Please enter a valid email",
    })
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, {
      message: "Password is required",
    })
    .refine((data) => data.trim() !== "", {
      message: "Password is required",
    }),
});

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(6, {
      message: "Please enter a valid email",
    })
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, {
      message: "Password is required",
    })
    .refine((data) => data.trim() !== "", {
      message: "Password is required",
    }),
});

export const addExpenseFormSchema = z.object({
  location_name: z
    .string()
    .min(1, {
      message: "Location Name is required",
    })
    .refine((data) => data.trim() !== "", {
      message: "Location Name is required",
    }),
  location_address: z
    .string()
    .min(1, {
      message: "Location Address is required",
    })
    .refine((data) => data.trim() !== "", {
      message: "Location Address is required",
    }),
  items: z
    .string()
    .min(1, {
      message: "Items is required",
    })
    .refine((data) => data.trim() !== "", {
      message: "Items is required",
    }),
  amount: z.preprocess(
    (a) => +a,
    z.number().min(1, {
      message: "Amount is required",
    })
  ),
});
