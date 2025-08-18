// Hash password using SHA-256
export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Verify password against stored hash
export const verifyPassword = async (password, storedHash) => {
  const passwordHash = await hashPassword(password);
  return passwordHash === storedHash;
}; 