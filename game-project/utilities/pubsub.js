export const pubsub = {

    events: {},

    //subscribe to the event and pass a callback
    subscribe: function(evName, fn) {
      this.events[evName] = this.events[evName] || [];
      this.events[evName].push(fn);
    },

    //remove subscription
    unsubscribe: function(evName, fn) {
      if (this.events[evName]) {
        this.events[evName] = this.events[evName].filter(f => f !== fn);
      }
    },

    //method to trigger all subscribed callback functions
    publish: function(evName, data) {
      if (this.events[evName]) {
        this.events[evName].forEach(f => {
          f(data);
        });
      }
    }
  };