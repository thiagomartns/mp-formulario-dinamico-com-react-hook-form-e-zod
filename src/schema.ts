import { z } from "zod";

export const userRegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "O campo nome precisa ser preenchido" })
      .max(255, { message: "O nome deve ter no máximo 255 caracteres" }),
    email: z
      .string()
      .min(1, { message: "O campo email precisa ser preenchido." })
      .email({ message: "E-mail inválido" })
      .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, {
        message: "E-mail inválido",
      }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
    password_confirmation: z.string().min(8, {
      message: "A confirmação de senha deve ter no mínimo 8 caracteres",
    }),
    phone: z
      .string()
      .min(1, { message: "O campo telefone precisa ser preenchido" })
      .regex(/\(\d{2}\) \d{4,5}-\d{4}/, { message: "Telefone inválido" }),
    cpf: z
      .string()
      .min(1, { message: "O campo CPF precisa ser preenchido" })
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido" }),
    zipcode: z
      .string()
      .min(1, { message: "O campo CEP precisa ser preenchido" })
      .regex(/^\d{5}-\d{3}$/, { message: "CEP inválido" }),
    address: z
      .string()
      .min(1, { message: "O campo endereço precisa ser preenchido" }),
    city: z
      .string()
      .min(1, { message: "O campo cidade precisa ser preenchido" }),

    terms: z.literal(true, {
      errorMap: () => ({ message: "Você deve aceitar os termos e condições" }),
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não conferem",
    path: ["password_confirmation"],
  });

export type UserRegister = z.infer<typeof userRegisterSchema>;
