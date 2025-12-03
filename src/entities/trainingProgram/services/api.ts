import { useQuery } from "@tanstack/react-query";

import { primaryApi } from "@shared/config/ky/index";

import { type ProgramsResponse } from "../types/ProgramsResponse";

const PROGRAMS = "programs" as const;

export const useQueryPrograms = () =>
  useQuery<ProgramsResponse[]>({
    queryKey: [PROGRAMS],
    queryFn: () => primaryApi.get("programs").json(),
  });
