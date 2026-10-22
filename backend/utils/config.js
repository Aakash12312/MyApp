"use strict";

// Centralized access to JWT secret. Enforce presence via environment variable.
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret is not configured. Set JWT_SECRET environment variable.');
  }
  return secret;
}

module.exports = { getJwtSecret };
