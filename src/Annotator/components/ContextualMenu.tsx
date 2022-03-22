import React from "react";
import { Token } from "../types";

type ContextualMenuProps = {
  contextualToken: Token | null;
  contextualMenuAnchor: {
    x: number;
    y: number;
  } | null;
  renderContextualMenu: (token: Token) => () => JSX.Element;
};
export const ContextualMenu = (props: ContextualMenuProps) => {
  const { contextualToken, contextualMenuAnchor, renderContextualMenu } = props;

  if (!contextualToken || !contextualMenuAnchor) {
    return null;
  }

  const Inner = renderContextualMenu(contextualToken);

  return (
    <ul
      className="rta-contextual-menu"
      style={{ top: contextualMenuAnchor.y, left: contextualMenuAnchor.x }}
    >
      <Inner />
    </ul>
  );
};
