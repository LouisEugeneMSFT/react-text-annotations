import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Annotations,
  EnrichedAnnotationValue,
  EnrichedRelationValue,
  Label,
  Relations,
  Token,
  UIOptions,
} from "../types";
import { provideMissingColors } from "../utils/colorsUtils";
import { InfoIcon, TrashIcon } from "./Icons";
import { Legend } from "./Legend";
import { TextView } from "./TextView";

type AnnotatorProps = {
  text: string;
  annotations: Annotations;
  relations: Relations;
  onChangeAnnotations: (newAnnotations: Annotations) => void;
  onChangeRelations: (newRelations: Relations) => void;
  renderContextualMenu?: (token: Token) => () => JSX.Element;
  uiOptions?: Partial<UIOptions>;
};
export const Annotator = (props: AnnotatorProps) => {
  const {
    text,
    annotations,
    relations,
    onChangeAnnotations,
    onChangeRelations,
    renderContextualMenu,
    uiOptions,
  } = props;

  provideMissingColors(annotations, relations);

  const [annotationsFiltered, setAnnotationsFiltered] = useState(annotations);
  const [relationsFiltered, setRelationsFiltered] = useState(relations);

  const hiddenAnnotations = useRef<Set<string>>(new Set());
  const hiddenRelations = useRef<Set<string>>(new Set());

  const newRelationFirstTokenRef = useRef<number[] | null>(null);

  let defaultSelectedLabel: Label = null;
  if (annotations[0]) {
    defaultSelectedLabel = {
      key: annotations[0].key,
      type: "annotation",
    };
  } else if (relations[0]) {
    defaultSelectedLabel = {
      key: relations[0].key,
      type: "relation",
    };
  }
  const [selectedLabel, setSelectedLabel] =
    useState<Label>(defaultSelectedLabel);

  const onAnnotate = ([start, end]: number[]) => {
    if (!selectedLabel) {
      return;
    } else if (selectedLabel.type === "annotation") {
      const newAnnotations = [...annotations];

      const annotationsForLabelIndex = annotations.findIndex(
        (annotation) => annotation.key === selectedLabel.key
      );
      const annotationsForLabel = { ...annotations[annotationsForLabelIndex] };

      annotationsForLabel?.values.push({ start, end });

      newAnnotations[annotationsForLabelIndex] = annotationsForLabel;
      onChangeAnnotations(newAnnotations);
    } else if (selectedLabel.type === "relation") {
      const firstToken = newRelationFirstTokenRef.current;

      if (!firstToken) {
        newRelationFirstTokenRef.current = [start, end];
      } else {
        const newRelations = [...relations];

        const relationsForLabelIndex = relations.findIndex(
          (relation) => relation.key === selectedLabel.key
        );

        const relationsForLabel = { ...relations[relationsForLabelIndex] };

        relationsForLabel?.values.push({
          fromStart: firstToken[0],
          fromEnd: firstToken[1],
          toStart: start,
          toEnd: end,
        });

        newRelations[relationsForLabelIndex] = relationsForLabel;
        newRelationFirstTokenRef.current = null;
        onChangeRelations(newRelations);
      }
    }
  };

  const onDelete = (token: Token) => {
    if (token.type === "annotation") {
      const annotation = token as EnrichedAnnotationValue;

      const newAnnotations = [...annotations];
      const annotationsIndex = newAnnotations.findIndex(
        (a) => a.key === annotation.key
      );
      const annotationsByKey = { ...annotations[annotationsIndex] };
      annotationsByKey.values = annotationsByKey.values.filter(
        (a) => !(a.start == annotation.start && a.end == annotation.end)
      );
      newAnnotations[annotationsIndex] = annotationsByKey;

      onChangeAnnotations(newAnnotations);
    } else if (token.type === "relation") {
      const relation = token as EnrichedRelationValue;

      const newRelations = [...relations];
      const relationsIndex = relations.findIndex((r) => r.key === relation.key);
      const relationsByKey = { ...relations[relationsIndex] };
      relationsByKey.values = relationsByKey.values.filter(
        (a) =>
          !(
            a.fromStart == relation.fromStart &&
            a.fromEnd == relation.fromEnd &&
            a.toStart == relation.toStart &&
            a.toEnd == relation.toEnd
          )
      );
      newRelations[relationsIndex] = relationsByKey;

      onChangeRelations(newRelations);
    }
  };

  const defaultRenderContextualMenu = useCallback(
    (token: Token) => () => {
      return (
        <div className="rta-default-contextual-menu-container">
          {token.key}
          <span className="rta-default-contextual-menu-icon-container">
            <InfoIcon
              size={15}
              onClick={() => window.alert(JSON.stringify(token))}
            />
          </span>
          <span className="rta-default-contextual-menu-icon-container">
            <TrashIcon size={15} onClick={() => onDelete(token)} />
          </span>
        </div>
      );
    },
    [onDelete]
  );

  const updateAnnotationsFiltered = useCallback(() => {
    const newAnnotationsFiltered = annotations.filter(
      (annotation) => !hiddenAnnotations.current.has(annotation.key)
    );
    setAnnotationsFiltered(newAnnotationsFiltered);
  }, [annotations, setAnnotationsFiltered]);

  const updateRelationsFiltered = useCallback(() => {
    const newRelationsFiltered = relations.filter(
      (relation) => !hiddenRelations.current.has(relation.key)
    );
    setRelationsFiltered(newRelationsFiltered);
  }, [relations, setRelationsFiltered]);

  useEffect(() => {
    updateAnnotationsFiltered();
  }, [annotations]);

  useEffect(() => {
    updateRelationsFiltered();
  }, [relations]);

  return (
    <div className="rta-annotator-container">
      <Legend
        annotations={annotations}
        relations={relations}
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
        hiddenAnnotations={hiddenAnnotations}
        hiddenRelations={hiddenRelations}
        updateAnnotationsFiltered={updateAnnotationsFiltered}
        updateRelationsFiltered={updateRelationsFiltered}
      />
      <TextView
        text={text}
        annotations={annotationsFiltered}
        relations={relationsFiltered}
        onAnnotate={onAnnotate}
        renderContextualMenu={
          renderContextualMenu || defaultRenderContextualMenu
        }
        uiOptions={uiOptions}
      />
    </div>
  );
};
