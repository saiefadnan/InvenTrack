import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
const VITE_SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5159/inventory";
export const useInventorySocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(VITE_SOCKET_URL)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => console.log("connected to SignalR InventoryHub"))
      .catch((err) => console.error("Failed to connect", err));

    connection.on("ReceiveOrderPlace", (data) => {
      console.log("Real-time Order Placed:", data);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    });

    connection.on("ReceiveProductUpdate", (data) => {
      console.log("⚡ Real-time stock update:", data);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    });
    return () => {
      connection.stop();
    };
  }, [queryClient]);
};
