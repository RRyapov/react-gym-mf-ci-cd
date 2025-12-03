import { type FC } from "react";

import { ProgramBlock } from "@assets/styles";

import { BuyItemGeneralDescription } from "@entities/trainingProgram";
import { type TrainingProgramType } from "@entities/trainingProgram";

import { BuyItemImage } from "@shared/ui/BuyItemImage";

export const TrainingProgram: FC<TrainingProgramType> = (props) => (
  <ProgramBlock>
    {props.position === 0 ? (
      <>
        <BuyItemGeneralDescription {...props} />
        <BuyItemImage {...props} />
      </>
    ) : (
      <>
        <BuyItemImage {...props} />
        <BuyItemGeneralDescription {...props} />
      </>
    )}
  </ProgramBlock>
);
