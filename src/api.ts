import { auth } from "./firebase";

const BASE = import.meta.env.VITE_API_URL;

async function authHeaders() {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Request failed");
  }
  return res.json();
}

export async function getCurrentRound() {
  return request("/round/current");
}

export async function getMe() {
  return request("/me", { headers: await authHeaders() });
}

export async function getMyPredictions() {
  return request("/me/predictions", { headers: await authHeaders() });
}

export async function placePrediction(questionId, answer) {
  return request("/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify({ questionId, answer }),
  });
}
