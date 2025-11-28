// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { logout } from '@/lib/services/auth.service';

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no logout:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    );
  }
}