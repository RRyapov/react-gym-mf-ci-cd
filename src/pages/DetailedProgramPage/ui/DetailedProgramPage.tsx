import { useState, type FC } from "react";
import { useParams } from "react-router-dom";

import { useQueryPrograms } from "@entities/trainingProgram";

import { BuyItemLinks, BuyItemType } from "@shared/types/types";
import { BuyItemFrame } from "@shared/ui/BuyItemFrame";
import { type ProgramType } from "@shared/types/ProgramType";

export const DetailedProgramPage: FC = () => {
  const { data: requestedPrograms, isLoading, isError } = useQueryPrograms();
  const { id } = useParams();
  const [activeModal, setActiveModal] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading programs</div>;
  }

  const programList = requestedPrograms[0]?.programs || [];
  const programInfo: Partial<ProgramType> = programList[Number(id) - 1] || {};

  if (!programInfo) {
    return <></>;
  }

  const {
    id: selectedProgramId,
    imageUrl,
    name,
    longText,
    price,
  } = programInfo;
  const itemType = BuyItemType.program;
  const itemBackLink = BuyItemLinks.programs;
  return (
    <>
      {programList.map((item) =>
        item.id === selectedProgramId ? (
          <BuyItemFrame
            key={item.id}
            itemType={itemType}
            title={name}
            longRead={longText}
            price={`${price} руб.`}
            imageUrl={imageUrl}
            activeModal={activeModal}
            setActiveModal={setActiveModal}
            backLink={`/${itemBackLink}`}
          />
        ) : (
          <></>
        ),
      ) ?? []}
    </>
  );
};
