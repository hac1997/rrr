"use client";

import { useState, useEffect, useActionState } from "react";
import { loginUser } from "@/actions/loginUser";
import { InputField } from "@/components/ui/InputField";
import { SocialButton } from "@/components/ui/SocialButton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Estado inicial para o useActionState
const initialState = {
  message: "",
  errors: {},
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<"volunteer" | "organization">("volunteer");

  // Hook oficial do React/Next.js 15 para Server Actions
  const [state, formAction, isPending] = useActionState(loginUser, initialState);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      toast.success('Usuário cadastrado com sucesso!');
    }
  }, [searchParams]);

  // Exibe erros retornados pelo servidor via Toast ou Log
  useEffect(() => {
    if (state?.errors?.general) {
      toast.error(state.errors.general[0]);
    } else if (state?.errors?.role) {
      toast.error(state.errors.role[0]);
    } else if (state?.message) {
      // Se houver mensagem genérica de erro
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Entrar na REVO
        </h2>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole("volunteer")}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedRole === "volunteer"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Voluntário
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("organization")}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedRole === "organization"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Organização
          </button>
        </div>

        {/* Action ligada diretamente ao formAction do hook */}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="role" value={selectedRole} />

          <InputField 
            type="email" 
            name="email" 
            placeholder="Seu e-mail" 
            required 
            // Exemplo de como mostrar erro específico do campo (opcional)
            // error={state?.errors?.email?.[0]} 
          />
          
          <InputField
            type="password"
            name="password"
            placeholder="Sua senha"
            required
            // error={state?.errors?.password?.[0]}
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-semibold disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-sm text-gray-500">ou</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <SocialButton
          provider="Google"
          logoUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
        />
        <div className="mt-3">
          <SocialButton
            provider="Facebook"
            logoUrl="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg"
          />
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-primary hover:brightness-90 font-semibold"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}