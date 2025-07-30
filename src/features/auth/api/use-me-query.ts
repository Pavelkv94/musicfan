import { useQuery } from "@tanstack/react-query";
import client from "../../../shared/api/client";

export const useMeQuery = () => {
    const query = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await client.GET('/auth/me');
            return response.data;
        },
        retry: false,
    });

    return query;
}

