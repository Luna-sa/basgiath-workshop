// Authentication module — Sample Project for QA Workshop
// This file contains INTENTIONAL bugs for practice

const users = [];

/**
 * Register a new user
 * @param {string} email
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {object} result
 */
function registerUser(email, password, confirmPassword) {
  // BUG #1: No email format validation — accepts anything as email
  if (!email) {
    return { success: false, error: "Email is required" };
  }

  // BUG #2: Password length check uses > instead of <
  // Should reject passwords shorter than 8 chars, but rejects LONG ones instead
  if (password.length > 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  // BUG #3: Compares password with email instead of confirmPassword
  if (password !== email) {
    return { success: false, error: "Passwords do not match" };
  }

  // BUG #4: Stores password as plain text, no hashing
  const user = {
    id: users.length + 1,
    email: email,
    password: password,
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  // BUG #5: Returns password in response — security vulnerability
  return {
    success: true,
    user: user,
    message: "User registered successfully",
  };
}

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {object} result
 */
function loginUser(email, password) {
  // BUG #6: Case-sensitive email comparison — "User@email.com" !== "user@email.com"
  const user = users.find((u) => u.email === email);

  if (!user) {
    // BUG #7: Reveals whether the email exists — information disclosure
    return { success: false, error: "No account found with this email" };
  }

  if (user.password !== password) {
    // BUG #8: No brute-force protection — can try unlimited passwords
    return { success: false, error: "Incorrect password" };
  }

  // BUG #9: Token is just the user ID encoded — easily guessable
  const token = btoa(user.id.toString());

  return {
    success: true,
    token: token,
    user: { id: user.id, email: user.email },
  };
}

/**
 * Reset password
 * @param {string} email
 * @param {string} newPassword
 * @returns {object} result
 */
function resetPassword(email, newPassword) {
  const user = users.find((u) => u.email === email);

  if (!user) {
    return { success: false, error: "User not found" };
  }

  // BUG #10: No old password verification — anyone with email can reset
  // BUG #11: No minimum password requirements on reset
  user.password = newPassword;

  // BUG #12: No audit log — password changes are not tracked
  return { success: true, message: "Password updated" };
}

/**
 * Get user profile
 * @param {string} token
 * @returns {object} result
 */
function getUserProfile(token) {
  // BUG #13: Decodes token without signature verification
  const userId = parseInt(atob(token));

  // BUG #14: No NaN check — atob("garbage") → NaN → finds nothing silently
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return { success: false, error: "User not found" };
  }

  // BUG #15: Returns full user object including password
  return { success: true, user: user };
}

module.exports = { registerUser, loginUser, resetPassword, getUserProfile };
