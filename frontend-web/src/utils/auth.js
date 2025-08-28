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

  export function getCurrentUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwtDecode(token).id || null; // assumes JWT has "userId" claim
  } catch {
    return null;
  }
}

