const Notification = require('../models/Notification');

async function createNotification(userId, type, title, body = '', meta = {}) {
  try {
    await Notification.create({ user: userId, type, title, body, meta });
  } catch (e) {
    // Avoid crashing the request flow due to notification failure
    console.error('Notification error:', e.message);
  }
}

module.exports = { createNotification };
