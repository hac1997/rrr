import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OrgEventSummary } from '@/lib/types';

interface VolunteerData {
  name: string;
  email: string;
  hours: number;
  role: string;
  status: 'Presente' | 'Ausente';
}

export const generateEventReport = (
  event: OrgEventSummary,
  organizationName: string,
  volunteers: VolunteerData[]
) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(76, 175, 80);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Evento', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(organizationName, pageWidth / 2, 30, { align: 'center' });

  doc.setTextColor(0, 0, 0);

  let yPos = 55;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(event.title, 15, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);

  const infoLines = [
    `Data: ${event.date}`,
    `Local: ${event.location}`,
    `Categoria: ${event.category || 'Geral'}`,
    `Duração: ${event.hours} horas`
  ];

  infoLines.forEach(line => {
    doc.text(line, 15, yPos);
    yPos += 5;
  });

  yPos += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Estatísticas do Evento', 15, yPos);
  yPos += 10;

  const stats = [
    { label: 'Participantes', value: event.volunteers.toString() },
    { label: 'Vagas Totais', value: event.maxVolunteers.toString() },
    { label: 'Taxa de Ocupação', value: `${((event.volunteers / event.maxVolunteers) * 100).toFixed(0)}%` },
    { label: 'Horas Geradas', value: `${event.volunteers * event.hours}h` }
  ];

  const statsData = stats.map(stat => [stat.label, stat.value]);

  autoTable(doc, {
    startY: yPos,
    head: [['Métrica', 'Valor']],
    body: statsData,
    theme: 'grid',
    headStyles: {
      fillColor: [76, 175, 80],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    margin: { left: 15, right: 15 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  if (volunteers.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Lista de Voluntários', 15, yPos);
    yPos += 10;

    const volunteerData = volunteers.map((v, index) => [
      (index + 1).toString(),
      v.name,
      v.email,
      v.role,
      v.hours.toString() + 'h',
      v.status
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Nome', 'Email', 'Função', 'Horas', 'Status']],
      body: volunteerData,
      theme: 'striped',
      headStyles: {
        fillColor: [76, 175, 80],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 50 },
        3: { cellWidth: 30 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 }
      },
      margin: { left: 15, right: 15 }
    });
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
      15,
      pageHeight - 10
    );
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth - 15,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  const fileName = `relatorio-${event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.pdf`;
  doc.save(fileName);
};

export const generateVolunteerSummaryReport = (
  events: OrgEventSummary[],
  organizationName: string
) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(76, 175, 80);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Eventos', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(organizationName, pageWidth / 2, 30, { align: 'center' });

  doc.setTextColor(0, 0, 0);

  let yPos = 55;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo Geral', 15, yPos);
  yPos += 10;

  const totalParticipants = events.reduce((sum, e) => sum + e.volunteers, 0);
  const totalHours = events.reduce((sum, e) => sum + (e.volunteers * e.hours), 0);

  const summaryStats = [
    { label: 'Total de Eventos', value: events.length.toString() },
    { label: 'Total de Participantes', value: totalParticipants.toString() },
    { label: 'Horas Totais Geradas', value: `${totalHours}h` },
    { label: 'Média de Participantes', value: Math.round(totalParticipants / events.length).toString() }
  ];

  const summaryData = summaryStats.map(stat => [stat.label, stat.value]);

  autoTable(doc, {
    startY: yPos,
    head: [['Métrica', 'Valor']],
    body: summaryData,
    theme: 'grid',
    headStyles: {
      fillColor: [76, 175, 80],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    margin: { left: 15, right: 15 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Eventos Realizados', 15, yPos);
  yPos += 10;

  const eventData = events.map((event, index) => [
    (index + 1).toString(),
    event.title,
    event.date,
    event.volunteers.toString(),
    `${event.hours}h`,
    `${(event.volunteers * event.hours)}h`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Evento', 'Data', 'Participantes', 'Duração', 'Horas Geradas']],
    body: eventData,
    theme: 'striped',
    headStyles: {
      fillColor: [76, 175, 80],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 4
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 60 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 30 }
    },
    margin: { left: 15, right: 15 }
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
      15,
      pageHeight - 10
    );
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth - 15,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  const fileName = `relatorio-eventos-${organizationName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.pdf`;
  doc.save(fileName);
};
