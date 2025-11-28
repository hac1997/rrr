import { apiGet, apiPost, apiPut, apiPatch } from "./api-client";
import { Event, FeedItem } from "../types";

export async function getUpcomingEvents(): Promise<Event[]> {
  const data = await apiGet<Event[]>("/events", false);

  return data.map((item: any) => ({
    id: item.id,
    name: item.title || item.name,
    date: item.date,
    description: item.description,
    isEmergency: item.isEmergency || false,
    organizationId: item.organizationId,
  }));
}

export async function createEvent(eventData: any): Promise<any> {
  return apiPost("/events", eventData, true);
}

export async function updateEvent(id: number, eventData: any): Promise<any> {
  return apiPut(`/events/${id}`, eventData, true);
}

export async function cancelEvent(id: number): Promise<void> {
  await apiPatch(`/events/${id}/deactivate`, {}, true);
}

export async function closeEvent(id: number): Promise<void> {
  await apiPatch(`/events/${id}/complete`, {}, true);
}

export async function searchEvents(filters: {
  title?: string;
  category?: string;
  uf?: string;
}): Promise<Event[]> {
  const params = new URLSearchParams();

  if (filters.title) params.append("title", filters.title);
  if (filters.category && filters.category !== "all")
    params.append("category", filters.category);
  if (filters.uf && filters.uf !== "all") params.append("uf", filters.uf);

  const query = params.toString() ? `?${params.toString()}` : "";

  const data = await apiGet<any[]>(`/events${query}`, false);

  return data.map((item: any) => ({
    id: item.id,
    name: item.title || item.name,
    date: item.date,
    description: item.description,
    isEmergency: item.isEmergency || false,
    location: item.location,
    organization: item.organizationName || "Organização",
    organizationId: item.organizationId,
    volunteers: item.volunteers || 0,
    maxVolunteers: item.maxVolunteers || 0,
    category: item.category || "Geral",
  }));
}

export async function getFeed(): Promise<FeedItem[]> {
  const events = await searchEvents({});

  return events.map((event) => ({
    id: event.id,
    type: "event",
    title: event.name,
    content: event.description,
    author:
      typeof event.organization === "string"
        ? event.organization
        : "Organização",
    date: "Recentemente",
    likes: 0,
    comments: 0,
    category: event.category,
    location: event.location,
    eventDate: event.date,
    organizationId: event.organizationId,
    organizationDescription:
      "Organização dedicada a transformar a comunidade através de ações voluntárias impactantes e sustentáveis.",
    organizationMission: "Promover o bem-estar social e ambiental.",
    image: "/bg1.jpeg",
  }));
}
