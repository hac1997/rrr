import { Event, OrgEventSummary, FeedItem } from '../types';
import { DUMMY_EVENTS } from './getDataseService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getUpcomingEvents(): Promise<Event[]> {
    try {
        const response = await fetch(`${API_URL}/events`, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.map((item: any) => ({
            id: item.id,
            name: item.title || item.name,
            date: item.date,
            description: item.description,
            isEmergency: item.isEmergency || false,
            organizationId: item.organizationId,
        }));

    } catch (error) {
        console.error('Error fetching events:', error);
        return DUMMY_EVENTS;
    }
}

export async function createEvent(eventData: any): Promise<any> {
    const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    });

    if (!response.ok) {
        throw new Error('Failed to create event');
    }

    return response.json();
}

export async function updateEvent(id: number, eventData: any): Promise<any> {
    const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    });

    if (!response.ok) {
        throw new Error('Failed to update event');
    }

    return response.json();
}

export async function cancelEvent(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/events/${id}/deactivate`, {
        method: 'PATCH',
    });

    if (!response.ok) {
        throw new Error('Failed to cancel event');
    }
}

export async function closeEvent(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/events/${id}/complete`, {
        method: 'PATCH',
    });

    if (!response.ok) {
        throw new Error('Failed to close event');
    }
}

export async function searchEvents(filters: { title?: string; category?: string; uf?: string }): Promise<Event[]> {
    const params = new URLSearchParams();
    if (filters.title) params.append('title', filters.title);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.uf && filters.uf !== 'all') params.append('uf', filters.uf);

    try {
        const response = await fetch(`${API_URL}/events?${params.toString()}`, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error('Failed to search events');
        }

        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.map((item: any) => ({
            id: item.id,
            name: item.title || item.name,
            date: item.date,
            description: item.description,
            isEmergency: item.isEmergency || false,
            location: item.location, // Ensure location is mapped if available
            organization: item.organizationName || 'Organização', // Map organization name
            organizationId: item.organizationId,
            volunteers: item.volunteers || 0,
            maxVolunteers: item.maxVolunteers || 0,
            category: item.category || 'Geral',
        }));
    } catch (error) {
        console.error('Error searching events:', error);
        return [];
    }
}

export async function getFeed(): Promise<FeedItem[]> {
    try {
        const events = await searchEvents({});
        return events.map(event => ({
            id: event.id,
            type: 'event',
            title: event.name,
            content: event.description,
            author: typeof event.organization === 'string' ? event.organization : 'Organização',
            date: 'Recentemente',
            likes: 0,
            comments: 0,
            category: event.category,
            location: event.location,
            eventDate: event.date,
            organizationId: event.organizationId,
            organizationDescription: 'Organização dedicada a transformar a comunidade através de ações voluntárias impactantes e sustentáveis.', // Placeholder
            organizationMission: 'Promover o bem-estar social e ambiental.', // Placeholder
            image: '/bg1.jpeg' // Placeholder
        }));
    } catch (error) {
        console.error('Error fetching feed:', error);
        return [];
    }
}
