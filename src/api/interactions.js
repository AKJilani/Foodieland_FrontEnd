import api from './client'

// Send a message to another user
export async function sendContactMessage(payload) {
    const { data } = await api.post('/interactions/contact-messages/', payload)
    return data
}

// Get user's messages (inbox)
export async function listMyMessages() {
    const { data } = await api.get('/interactions/contact-messages/')
    return data
}

// Reply to a specific message
export async function replyToMessage(messageId, replyText) {
    const { data } = await api.post(`/interactions/contact-messages/${messageId}/reply/`, {
        message: replyText
    })
    return data
}

// Get list of users to send messages to
export async function listUsers() {
    const { data } = await api.get('/interactions/users/')
    return data
}

// Mark message as read
export async function markMessageAsRead(messageId) {
    const { data } = await api.patch(`/interactions/contact-messages/${messageId}/`, {
        is_read: true
    })
    return data
}

// Get conversation thread (if you implement threading)
export async function getConversationThread(messageId) {
    const { data } = await api.get(`/interactions/contact-messages/${messageId}/thread/`)
    return data
}

// Follow/Unfollow functions (keeping your existing ones)
export async function followUser(following) {
    const { data } = await api.post('/interactions/follows/', { following })
    return data
}

export async function unfollowUser(following) {
    const { data } = await api.post('/interactions/follows/unfollow/', { following })
    return data
}

// Send a message via Contact Us form
export async function sendContactUsMessage(payload) {
    const { data } = await api.post('/interactions/contact-us/', payload)
    return data
}

// Fetch all newsletters
export const fetchNewsletters = async () => {
  const response = await api.get("/interactions/newsletter/");
  return response.data;
};

// Subscribe to newsletter
export const subscribeNewsletter = async (email) => {
  const response = await api.post("/interactions/newsletter/", { email });
  return response.data;
};

// Delete a subscription (if required)
export const deleteNewsletter = async (id) => {
  const response = await api.delete(`/interactions/newsletter/${id}/`);
  return response.data;
};
