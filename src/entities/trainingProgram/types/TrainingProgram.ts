import { type ProgramType } from "@shared/types/ProgramType";

export type TrainingProgramType = ProgramType & {
  position: number;
  name?: string;
};
