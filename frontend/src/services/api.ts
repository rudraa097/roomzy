// ─────────────────────────────────────────────────────────────────────────────
//  Roomzy API Service Layer
//  All backend calls go through this file.
//  Set VITE_API_URL in your .env (frontend) to point at the backend.
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Generic fetch wrapper ────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({ error: res.statusText }));

  if (!res.ok) {
    throw new Error(data?.error || `Request failed: ${res.status}`);
  }

  return data as T;
}

// ── Payments ─────────────────────────────────────────────────────────────────
export interface CheckoutSessionRequest {
  roomId: number;
  roomTitle: string;
  amount: number;
  type: "Deposit" | "Rent";
}

export interface CheckoutSessionResponse {
  id: string;
  url: string;
}

export async function createCheckoutSession(
  payload: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  return apiFetch<CheckoutSessionResponse>("/api/create-checkout-session", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Contact ───────────────────────────────────────────────────────────────────
export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function submitContactForm(
  payload: ContactPayload
): Promise<{ success: boolean; message: string }> {
  return apiFetch("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Health ────────────────────────────────────────────────────────────────────
export async function checkHealth(): Promise<{ status: string }> {
  return apiFetch("/health");
}
