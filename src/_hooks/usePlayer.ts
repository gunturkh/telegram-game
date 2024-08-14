import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../lib/axios";
import { AxiosError } from "axios";
import { usePlayerStore } from "../store/player";
import toast from "react-hot-toast";

const usePlayer = () => {
  const queryClient = useQueryClient();
  const setInitialPoints = usePlayerStore.getState().setInitialPoints;
  // queries
  const query = useQuery({
    queryKey: ["player"],
    queryFn: async () => {
      try {
        const response = await http.get("/sync");
        if (response?.data?.data?.balance)
          setInitialPoints(response.data.data.balance);
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
  // const queryPointsPreview = useQuery({
  //   queryKey: ["points-preview"],
  //   queryFn: async () => {
  //     try {
  //       const response = await http.get("/points/update/preview");
  //       return response.data?.data;
  //     } catch (error) {
  //       if (error instanceof AxiosError) {
  //         throw new Error("Axios Error");
  //       }

  //       throw new Error("Unknown Error");
  //     }
  //   },
  // });

  // mutations
  const mutationPointsUpdate = useMutation({
    mutationFn: async (data: { amount: number; timestamp: number }) => {
      try {
        const response = await http.post("/points/update", data);
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error("Axios Error");
        }

        throw new Error("Unknown Error");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player"] });
    },
  });

  const mutationTap = useMutation({
    mutationFn: async (data: { tap_count: number; timestamp: number }) => {
      try {
        const response = await http.post("/tap", data);
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error("Axios Error");
        }

        throw new Error("Unknown Error");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player"] });
    },
    onError: (error, variables, context) => {
      console.log("error", error);
      console.log("variables", variables);
      console.log("context", context);
      toast.error(error.message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    },
  });

  const mutationCardUpgrade = useMutation({
    mutationFn: async (data: { card_id: number }) => {
      try {
        const response = await http.post("/card-upgrade", data);
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error("Axios Error");
        }

        throw new Error("Unknown Error");
      }
    },
    onSuccess: () => {
      toast.success("Success upgrade card", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["player"]});
      queryClient.invalidateQueries({ queryKey: ["cards"]});
    },
    onError: (error, variables, context) => {
      console.log("error", error);
      console.log("variables", variables);
      console.log("context", context);
      toast.error(error.message);
    },
  });
  return {
    // export all queries
    query,
    queryCards,
    // queryPointsPreview,
    // export all mutations
    mutationTap,
    mutationPointsUpdate,
    mutationCardUpgrade,
  };
};
export default usePlayer;
