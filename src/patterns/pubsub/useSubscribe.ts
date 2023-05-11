import PubSub from "pubsub-js";
import { useEffect } from "react";

export const useSubscribe = (
  message: string,
  callback: (data?: any) => void
) => {
  useEffect(() => {
    PubSub.subscribe(message, (_, data) => {
      callback(data);
    });
  }, []);
};
