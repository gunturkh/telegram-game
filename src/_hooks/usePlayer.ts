import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../lib/axios";
import { AxiosError } from "axios";
import { usePlayerStore } from "../store/player";
import toast from "react-hot-toast";
type TaskRewardByDay = {
  day_count: number;
  reward_coins: number;
};
export type Task = {
  id: string;
  image: string;
  name: string;
  description: string | null;
  total_reward_coins: number;
  rewards_by_day?: TaskRewardByDay[];
  reward_coins: number;
  remain_seconds: number;
  days: number;
  is_completed: boolean;
  reward_delay_seconds?: number;
  type?: string;
  link?: string;
};
const usePlayer = () => {
  const queryClient = useQueryClient();
  const setInitialPoints = usePlayerStore.getState().setInitialPoints;
  const setInitialEnergy = usePlayerStore.getState().setInitialEnergy;
  // const dailyCombo = usePlayerStore.getState().dailyCombo;
  // console.log("dailyCombo", dailyCombo);
  const updateDailyCombo = usePlayerStore.getState().updateNull;
  const setPassiveEarning = usePlayerStore.getState().setPassiveEarning;
  const setComboSubmitted = usePlayerStore.getState().setComboSubmitted;
  // queries
  const query = useQuery({
    staleTime: Infinity,
    queryKey: ["player"],
    queryFn: async () => {
      try {
        const response = await http.get("/sync");
        if (response?.data?.data?.balance)
          setInitialPoints(response.data.data.balance);
        setPassiveEarning(response.data.data.passive_earnings.last_earned);
        if (
          response?.data?.data?.tap_earnings &&
          response?.data?.data?.tap_earnings?.available_taps
        )
          setInitialEnergy(response?.data?.data?.tap_earnings?.available_taps);
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error("Axios Error");
        }

        throw new Error("Unknown Error");
      }
    },
  });
  const queryInfo = useQuery({
    queryKey: ["info"],
    queryFn: async () => {
      try {
        const response = await http.get("/auth/whoami");
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
        const response = await http.get("/cards-v2");
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error("Axios Error");
        }

        throw new Error("Unknown Error");
      }
    },
  });
  const queryTasks = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      try {
        const response = await http.get("/tasks");
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error("Axios Error");
        }

        throw new Error("Unknown Error");
      }
    },
  });
  const queryDailyCombo = useQuery({
    queryKey: ["combo"],
    queryFn: async () => {
      try {
        const response = await http.get("/cards/combo");
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
      // queryClient.invalidateQueries({ queryKey: ["player"] });
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
          throw new Error(error.message);
        }

        throw new Error("Unknown Error");
      }
    },
    onSuccess: (_, variables) => {
      console.log("card upgrade success variables", variables);
      updateDailyCombo(variables?.card_id);
      toast.success("Success upgrade card", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: (error, variables, context) => {
      console.log("error", error);
      console.log("variables", variables);
      console.log("context", context);
      toast.error("Failed to buy/upgrade card", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    },
  });

  const mutationCheckTask = useMutation({
    mutationFn: async (data: { task_id: string }) => {
      try {
        const response = await http.post("/check-task", data);
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.message);
        }

        throw new Error("Unknown Error");
      }
    },
    onSuccess: (_, variables) => {
      console.log("task update success variables", variables);
      toast.success("Success", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to complete task", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    },
  });

  const mutationDailyCombo = useMutation({
    mutationFn: async (data: { combo: number[] }) => {
      try {
        const response = await http.post("/cards/combo", data);
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.message);
        }

        throw new Error("Unknown Error");
      }
    },
    onSuccess: (data, variables) => {
      console.log("Daily Combo Submitted", data, variables);
      setComboSubmitted(true);
      toast.success(
        `You got ${data?.correct_combo} correct, and bonus point ${data?.bonus_coins}`,
        {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }
      );
      queryClient.invalidateQueries({ queryKey: ["combo"] });
    },
    onError: () => {
      toast.error("Failed to submit Daily Combo", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    },
  });
  return {
    // export all queries
    query,
    queryInfo,
    queryCards,
    queryTasks,
    queryDailyCombo,
    // queryPointsPreview,
    // export all mutations
    mutationTap,
    mutationPointsUpdate,
    mutationCardUpgrade,
    mutationCheckTask,
    mutationDailyCombo,
  };
};
export default usePlayer;
