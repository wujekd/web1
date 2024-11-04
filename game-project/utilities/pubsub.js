export const pubsub = {
  events: {},

  // Subscribe to the event and pass a callback
  subscribe: function (eventId, callback) {
    this.events[eventId] = this.events[eventId] || [];
    this.events[eventId].push(callback);
  },

  // Remove subscription
  unsubscribe: function (eventId, callback) {
    if (this.events[eventId]) {
      this.events[eventId] = this.events[eventId].filter(
        (cb) => cb !== callback
      );
    }
  },

  // Method to trigger all subscribed callback functions
  publish: function (eventId, data) {
    if (this.events[eventId]) {
      this.events[eventId].forEach((cb) => {
        cb(data);
      });
    }
  },
};
