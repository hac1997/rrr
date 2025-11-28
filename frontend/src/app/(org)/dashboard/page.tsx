'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import OrganizationHome from '@/features/organization/components/OrganizationHome';

export default function OrgDashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return <OrganizationHome onLogout={handleLogout} />;
}
