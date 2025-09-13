import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

const useDataGraficos = () => {
  const { user } = useContext(UserContext);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["graficos", user?.id],
    queryFn: async () =>
      makeRequest
        .get("/graphic")
        .then((res) => res.data)
        .catch((err) => {
          console.error(err);
          throw err;
        }),
    enabled: !!user?.id,
  });

  return { data, error, isLoading, isError };
};

export default useDataGraficos;
