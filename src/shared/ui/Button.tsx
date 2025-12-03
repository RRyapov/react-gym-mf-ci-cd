import { type FC } from "react";

import { StyledGeneralButton } from "@assets/styles";

type ButtonProps = {
  onClick?: () => void;
  title: string;
};

export const Button: FC<ButtonProps> = ({ onClick, title }) => (
  <StyledGeneralButton onClick={onClick}>{title}</StyledGeneralButton>
);
