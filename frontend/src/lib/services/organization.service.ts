import { OrganizationProfile } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getOrganizationById(id: string): Promise<OrganizationProfile | null> {
    try {
        const res = await fetch(`${API_URL}/organizations/${id}`);
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch organization');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching organization:', error);
        return null;
    }
}
