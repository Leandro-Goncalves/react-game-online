import PubSub from "pubsub-js";

export const publish = (message: string, data?: any) => {
  PubSub.publish(message, data);
};
