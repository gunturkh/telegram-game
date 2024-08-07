import { useQuery } from "@tanstack/react-query";
import http from "../lib/axios";
import { AxiosError } from "axios";
import { usePlayerStore } from "../store/player";

const usePlayer = () => {
  const setPlayerData = usePlayerStore.getState().setPlayerData;
  const query = useQuery({
    queryKey: ["player"],
    queryFn: async () => {
      try {
        const response = await http.get("");
        setPlayerData(response.data?.data);
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error("Axios Error");
        }

        throw new Error("Unknown Error");
      }
    },
  });
  const queryCards = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      try {
        const response = await http.get("/cards");
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error("Axios Error");
        }

        throw new Error("Unknown Error");
      }
    },
  });
  return {
    query,
    queryCards,
  };
};
export default usePlayer;
