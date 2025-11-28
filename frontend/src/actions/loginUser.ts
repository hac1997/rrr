"use server";

import { z } from "zod";
import {
  login,
  setAuthCookies,
  LoginResponse,
} from "@/lib/services/auth.service";
import { redirect } from "next/navigation";

// ==================== SCHEMA DO ZOD ====================
const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  role: z.enum(["volunteer", "organization"], {
    message: "Selecione um tipo de conta válido",
  }),
});

// ==================== TIPOS ====================
export type LoginState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        role?: string[];
        general?: string[];
      };
      message?: string;
    }
  | undefined; // Estado inicial pode ser undefined

// ==================== SERVER ACTION ====================
// Note: Adicionado prevState como primeiro argumento para funcionar com useActionState
export async function loginUser(
  prevState: LoginState, 
  formData: FormData
): Promise<LoginState> {
  
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  const parsed = loginSchema.safeParse(rawFormData);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Erro na validação dos campos.",
    };
  }

  const { email, password, role } = parsed.data;
  let loginResponse: LoginResponse;

  try {
    loginResponse = await login({ email, password });

    const expectedType = role === "volunteer" ? "VOLUNTEER" : "ORGANIZATION";

    if (loginResponse.userType !== expectedType) {
      return {
        errors: {
          role: [
            `Esta conta é do tipo ${
              loginResponse.userType === "VOLUNTEER" ? "voluntário" : "organização"
            }. Selecione a opção correta.`,
          ],
        },
        message: "Tipo de conta incorreto.",
      };
    }

    await setAuthCookies(loginResponse);
  } catch (error) {
    // Se o erro for de redirecionamento (NEXT_REDIRECT), relança ele
    // Isso previne que o redirect seja "engolido" se algo acima redirecionar
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    return {
      errors: {
        general: [
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao fazer login",
        ],
      },
      message: "Falha ao realizar login.",
    };
  }

  // Se chegou aqui, deu tudo certo. O redirect acontece fora do try/catch.
  const redirectTo =
    loginResponse.userType === "VOLUNTEER" ? "/feed" : "/dashboard";

  redirect(redirectTo);
}