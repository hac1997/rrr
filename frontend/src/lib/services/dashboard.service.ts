import { UserStatsDTO, MonthlyData, Certificate } from '@/lib/types';

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function transformMonthlyActivities(atividadesMensais: { [key: string]: { eventos: number; horas: number } }): MonthlyData[] {
  const currentYear = new Date().getFullYear();
  const monthlyData: MonthlyData[] = [];

  for (let i = 0; i < 12; i++) {
    const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
    const activity = atividadesMensais[monthKey];

    monthlyData.push({
      month: MONTH_NAMES[i],
      events: activity?.eventos || 0,
      hours: activity?.horas || 0,
    });
  }

  return monthlyData;
}

export function transformCertificates(certificados: UserStatsDTO['certificados']): Certificate[] {
  return certificados.map(cert => ({
    id: cert.id,
    eventName: cert.nomeEvento,
    organization: cert.organizacao,
    date: formatDate(cert.dataCertificacao),
    hours: cert.horasCertificadas,
    status: 'available' as const,
    code: `CERT-${new Date().getFullYear()}-${String(cert.id).padStart(6, '0')}`,
  }));
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
