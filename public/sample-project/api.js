// API endpoints — Sample Project for QA Workshop
// This file contains INTENTIONAL bugs for practice

const express = require("express");

/**
 * Search products
 * @param {string} query — search term
 * @param {number} page — page number
 * @param {number} limit — items per page
 */
function searchProducts(query, page, limit) {
  // BUG #1: SQL injection vulnerability — query is inserted directly
  const sql = `SELECT * FROM products WHERE name LIKE '%${query}%' LIMIT ${limit} OFFSET ${
    page * limit
  }`;

  // BUG #2: No input validation on page and limit — negative numbers, strings accepted
  // BUG #3: limit could be 999999 — no max cap, potential DoS

  return { sql, page, limit };
}

/**
 * Update user profile
 * @param {object} userData
 */
function updateProfile(userData) {
  const allowedFields = ["name", "email", "bio"];

  // BUG #4: Uses spread operator — allows ANY field to be updated including role/admin
  const updated = { ...userData };

  // BUG #5: XSS vulnerability — bio is stored without sanitization
  // If bio contains <script>alert('xss')</script>, it will execute

  // BUG #6: No length validation — name could be 10,000 characters
  // BUG #7: Email format not validated on update

  return { success: true, user: updated };
}

/**
 * Process payment
 * @param {number} amount
 * @param {string} currency
 * @param {string} cardNumber
 */
function processPayment(amount, currency, cardNumber) {
  // BUG #8: Floating point arithmetic — 0.1 + 0.2 !== 0.3
  const tax = amount * 0.1;
  const total = amount + tax;

  // BUG #9: Card number logged in plain text
  console.log(`Processing payment: ${cardNumber} for ${total} ${currency}`);

  // BUG #10: No currency validation — accepts "FAKECOIN"
  // BUG #11: Negative amount not checked — could process refund as payment
  // BUG #12: No idempotency key — double-click = double charge

  return {
    success: true,
    transactionId: Math.random().toString(36).slice(2),
    amount: total,
    currency,
  };
}

/**
 * Upload file
 * @param {object} file — uploaded file
 */
function uploadFile(file) {
  // BUG #13: No file type validation — .exe, .sh files accepted
  // BUG #14: No file size limit — 10GB file would be accepted
  // BUG #15: Filename not sanitized — "../../../etc/passwd" as filename = path traversal

  const filePath = `/uploads/${file.name}`;

  return { success: true, path: filePath };
}

module.exports = { searchProducts, updateProfile, processPayment, uploadFile };
