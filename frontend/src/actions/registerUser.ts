'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
  fullName: z.string().min(3, 'Nome completo é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido'),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data deve ser DD/MM/AAAA'),
  phone: z.string().min(10, 'Telefone inválido'),
  interests: z
    .string()
    .transform((val) => JSON.parse(val))
    .pipe(z.array(z.string()).min(1, 'Selecione pelo menos uma causa')),
  acceptTerms: z.coerce.boolean().refine((val) => val === true, 'Você deve aceitar os termos'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

const registerOrgSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
  orgName: z.string().min(3, 'Nome da organização é obrigatório'),
  orgCnpj: z.string().min(1, 'CNPJ é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  orgCauses: z
    .string()
    .transform((val) => JSON.parse(val))
    .pipe(z.array(z.string()).min(1, 'Selecione pelo menos uma causa')),
  acceptTerms: z.coerce.boolean().refine((val) => val === true, 'Você deve aceitar os termos'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});


export async function registerUser(prevState: unknown, formData: FormData) {
  console.log('\n--- SERVER ACTION: registerUser INICIADA ---');

  try {
    const data = Object.fromEntries(formData);
    const registerType = data.registerType as 'volunteer' | 'organization';

    console.log('SERVER: Tipo de Registro:', registerType);
    console.log('SERVER: Dados Recebidos (Raw):', data);

    if (registerType === 'organization') {
      console.log('SERVER: Validando como ORGANIZAÇÃO...');
      const parsed = registerOrgSchema.safeParse(data);

      if (!parsed.success) {
        console.error('SERVER ERROR: Falha na validação (Org). Erros:', parsed.error.flatten().fieldErrors);
        return {
          success: false,
          message: 'Erro de validação da Organização',
          errors: parsed.error.flatten().fieldErrors,
        };
      }
    } else {
      console.log('SERVER: Validando como VOLUNTÁRIO...');
      const parsed = registerSchema.safeParse(data);

      if (!parsed.success) {
        console.error('SERVER ERROR: Falha na validação (Vol). Erros:', parsed.error.flatten().fieldErrors);
        return {
          success: false,
          message: 'Erro de validação do Voluntário',
          errors: parsed.error.flatten().fieldErrors,
        };
      }
    }



    console.log('SERVER: Validação BEM SUCEDIDA.');

    let response;

    if (registerType === 'organization') {
      const payload = {
        CNPJ: data.orgCnpj,
        passwordHash: data.password,
        name: data.orgName,
        description: "Descrição pendente", // Campo obrigatório no DTO mas não no form? Verifiquei DTO, não é @NotBlank.
        email: data.email,
        phone: (data.phone as string).replace(/\D/g, ''),
        website: "",
        logoImageUrl: "",
        address: {
          street: "Rua Exemplo", // Backend exige @Valid Address, talvez precise de campos dummy ou o form precisa evoluir
          city: data.city,
          state: data.state,
          zipCode: "00000-000", // Dummy
          label: "Principal"
        }
      };

      console.log('SERVER: Enviando payload para /organizations:', payload);

      response = await fetch('http://localhost:8080/api/v1/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

    } else {
      const fullName = data.fullName as string;
      const [firstname, ...lastnameParts] = fullName.split(' ');
      const lastname = lastnameParts.join(' ') || '.';

      const [day, month, year] = (data.birthDate as string).split('/');
      const formattedDate = `${year}-${month}-${day}`;

      const payload = {
        CPF: (data.cpf as string).replace(/\D/g, ''), // Strip formatting
        firstname: firstname,
        lastname: lastname,
        email: data.email,
        phone: (data.phone as string).replace(/\D/g, ''),
        passwordHash: data.password,
        userType: 'VOLUNTEER',
        birthDate: formattedDate
      };

      console.log('SERVER: Enviando payload para /users:', payload);

      response = await fetch('http://localhost:8080/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      let errorMessage = `Erro na API: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If not JSON, use status message
      }
      console.error('SERVER ERROR: API respondeu com erro:', response.status, errorMessage);
      return {
        success: false,
        message: errorMessage,
        errors: { api: [errorMessage] }
      };
    }

    const resultData = await response.json();
    console.log('SERVER: API respondeu com sucesso:', resultData);

    // Auto-login removed as per requirement to redirect to login page
    // if (resultData.token) { ... }

    revalidatePath('/dashboard');
    revalidatePath('/feed');

    return {
      success: true,
      message: 'Cadastro realizado com sucesso! Faça login para continuar.',
      redirectTo: '/login?registered=true',
    };

  } catch (error) {
    console.error('SERVER ERROR: Bloco CATCH principal atingido:', error);
    return {
      success: false,
      message: 'Erro ao realizar cadastro',
    };
  }
}