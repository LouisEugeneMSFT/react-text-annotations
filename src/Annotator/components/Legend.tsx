import React, { RefObject } from "react";
import { Annotations, Label, Relations } from "../types";
import { NotVisibleIcon, VisibleIcon } from "./Icons";

const visibilityIconSize = 20;

type LegendProps = {
  annotations: Annotations;
  relations: Relations;
  selectedLabel: Label;
  setSelectedLabel: (newLabel: Label) => void;
  hiddenAnnotations: RefObject<Set<string>>;
  hiddenRelations: RefObject<Set<string>>;
  updateAnnotationsFiltered: () => void;
  updateRelationsFiltered: () => void;
  readOnly?: boolean;
};
export const Legend = (props: LegendProps) => {
  const {
    annotations,
    relations,
    selectedLabel,
    setSelectedLabel,
    hiddenAnnotations,
    hiddenRelations,
    updateAnnotationsFiltered,
    updateRelationsFiltered,
    readOnly,
  } = props;

  return (
    <div className="rta-legend-container">
      {annotations.map((a) => (
        <div key={a.key} className="rta-legend-option-container">
          {readOnly ? null : (
            <input
              type="radio"
              value="label"
              className="rta-legend-option-input"
              checked={selectedLabel?.key === a.key}
              onChange={() =>
                setSelectedLabel({ key: a.key, type: "annotation" })
              }
            />
          )}
          <div
            className="rta-legend-option-color-line"
            style={{ backgroundColor: a.color }}
          />
          {a.name || a.key}
          <button
            className="rta-legend-option-visibility-button "
            onClick={() => {
              if (hiddenAnnotations.current?.has(a.key)) {
                hiddenAnnotations.current.delete(a.key);
              } else {
                hiddenAnnotations.current?.add(a.key);
              }
              updateAnnotationsFiltered();
            }}
          >
            {hiddenAnnotations.current?.has(a.key) ? (
              <NotVisibleIcon size={visibilityIconSize} />
            ) : (
              <VisibleIcon size={visibilityIconSize} />
            )}
          </button>
        </div>
      ))}
      {relations.map((r) => (
        <div key={r.key} className="rta-legend-option-container">
          {readOnly ? null : (
            <input
              type="radio"
              value="label"
              checked={selectedLabel?.key === r.key}
              onChange={() =>
                setSelectedLabel({ key: r.key, type: "relation" })
              }
            />
          )}
          <div
            className="rta-legend-option-color-line"
            style={{ backgroundColor: r.color }}
          />
          {r.name || r.key}
          <button
            className="rta-legend-option-visibility-button "
            onClick={() => {
              if (hiddenRelations.current?.has(r.key)) {
                hiddenRelations.current.delete(r.key);
              } else {
                hiddenRelations.current?.add(r.key);
              }
              updateRelationsFiltered();
            }}
          >
            {hiddenRelations.current?.has(r.key) ? (
              <NotVisibleIcon size={visibilityIconSize} />
            ) : (
              <VisibleIcon size={visibilityIconSize} />
            )}
          </button>
        </div>
      ))}
    </div>
  );
};
