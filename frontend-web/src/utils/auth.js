// src/utils/auth.js
import { jwtDecode } from "jwt-decode";

export function getCurrentUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwtDecode(token).role?.toUpperCase() || null;
  } catch {
    return null;
  }
}
