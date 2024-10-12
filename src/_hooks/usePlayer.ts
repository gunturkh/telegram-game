import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http, { image } from "../lib/axios";
import { AxiosError } from "axios";
import { useDailyComboStore, usePlayerStore } from "../store/player";
import toast from "react-hot-toast";
type TaskRewardByDay = {
  day_count: number;
  reward_coins: number;
  reward_coupons: number;
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
  modal_title: string;
  modal_link_button?: string;
  modal_link_url?: string;
  requires_admin_approval?: boolean;
  status: "pending_approval" | "not_completed" | "rejected" | "completed";
};
const usePlayer = () => {
  const queryClient = useQueryClient();
  const setInitialPoints = usePlayerStore.getState().setInitialPoints;
  const setInitialEnergy = usePlayerStore.getState().setInitialEnergy;
  // const dailyCombo = usePlayerStore.getState().dailyCombo;
  // console.log("dailyCombo", dailyCombo);
  const setPassiveEarning = usePlayerStore.getState().setPassiveEarning;
  const updateDailyCombo = useDailyComboStore.getState().updateNull;
  const setComboSubmitted = useDailyComboStore.getState().setComboSubmitted;
  const setDailyComboReward = useDailyComboStore.getState().setDailyComboReward;
  const setDailyComboRewardModal =
    useDailyComboStore.getState().setDailyComboRewardModal;
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
    staleTime: Infinity,
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
    staleTime: Infinity,
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
    staleTime: Infinity,
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
    staleTime: Infinity,
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
  const queryReferral = useQuery({
    staleTime: Infinity,
    queryKey: ["referral"],
    queryFn: async () => {
      try {
        const response = await http.get("/referral-stats");
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error("Axios Error");
        }

        throw new Error("Unknown Error");
      }
    },
  });
  const queryRank = useQuery({
    staleTime: Infinity,
    queryKey: ["rank"],
    queryFn: async () => {
      try {
        const response = await http.get("/rank");
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error("Axios Error");
        }

        throw new Error("Unknown Error");
      }
    },
  });
  const queryBoost = useQuery({
    staleTime: Infinity,
    queryKey: ["boost"],
    queryFn: async () => {
      try {
        const response = await http.get("/boost");
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
        queryClient?.setQueryData(["player"], response?.data?.data);
        console.log("query invalidate player", response.data.data);
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
    mutationFn: async (data: { task_id: string; image?: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ["player"] });
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
      setDailyComboReward(data);
      setDailyComboRewardModal(true);
      // toast.success(
      //   `You got ${data?.correct_combo} correct, and bonus point ${data?.bonus_coins}`,
      //   {
      //     style: {
      //       borderRadius: "10px",
      //       background: "#333",
      //       color: "#fff",
      //     },
      //   }
      // );
      queryClient.invalidateQueries({ queryKey: ["combo"] });
      queryClient.invalidateQueries({ queryKey: ["player"] });
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
  const mutationUploadImage = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (data) => {
      try {
        const response = await image.post("/media/images", data);
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.message);
        }

        throw new Error("Unknown Error");
      }
    },
    onSuccess: (_, variables) => {
      console.log("upload image success for task submission", variables);
      toast.success("Success upload image", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    },
    onError: (error, variables, context) => {
      console.log("error", error);
      console.log("variables", variables);
      console.log("context", context);
      toast.error("Failed to upload image", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    },
  });
  const mutationBoost = useMutation({
    mutationFn: async (data: { boost_id: string }) => {
      try {
        const response = await http.post("/boost", data);
        return response.data?.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.message);
        }

        throw new Error("Unknown Error");
      }
    },
    onSuccess: (data, variables) => {
      console.log("Success apply boost!", data, variables);
      toast.success(`Success apply boost`, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["boost"] });
      queryClient.invalidateQueries({ queryKey: ["player"] });
    },
    onError: () => {
      toast.error("Failed to apply boost", {
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
    queryReferral,
    queryRank,
    queryBoost,
    // queryPointsPreview,
    // export all mutations
    mutationTap,
    mutationPointsUpdate,
    mutationCardUpgrade,
    mutationCheckTask,
    mutationDailyCombo,
    mutationUploadImage,
    mutationBoost,
  };
};
export default usePlayer;
