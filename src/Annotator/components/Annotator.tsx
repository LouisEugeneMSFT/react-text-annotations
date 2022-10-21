import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AnnotationOperation,
  Annotations,
  EnrichedAnnotationValue,
  EnrichedRelationValue,
  Label,
  Options,
  RelationOperation,
  Relations,
  Token,
  UIOptions,
} from "../types";
import { provideMissingColors } from "../utils/colorsUtils";
import { formatText } from "../utils/textUtils";
import { InfoIcon, TrashIcon } from "./Icons";
import { Legend } from "./Legend";
import { TextView } from "./TextView";

type AnnotatorProps = {
  /**
   * The text being annotated.
   */
  text: string;
  /**
   * The list of annotations, grouped by key.
   * Annotations = AnnotationsByKey[].
   * See the AnnotationsByKey type.
   */
  annotations: Annotations;
  /**
   * The list of relations, grouped by key.
   * Relations = RelationsByKey[].
   * See the RelationsByKey type.
   */
  relations: Relations;
  /**
   * Callback for when an annotation has been added or deleted.
   * See the AnnotationOperation type.
   */
  onChangeAnnotations?: (
    newAnnotations: Annotations,
    operation: AnnotationOperation
  ) => void;
  /**
   * Callback for when a relation has been added or deleted.
   * See the RelationOperation type.
   */
  onChangeRelations?: (
    newRelations: Relations,
    operation: RelationOperation
  ) => void;
  /**
   * Custom component for when a user right clicks on an annotation or relation.
   */
  renderContextualMenu?: (token: Token) => () => JSX.Element;
  /**
   * Boolean indicating whether annotations & relations can be added / deleted.
   */
  readOnly?: boolean;
  /**
   * Set of options to customize the behavior of the component.
   */
  options?: Options;
  /**
   * Set of options to customize how the component looks. See UIOptions type.
   */
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
    options,
    uiOptions,
    readOnly,
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
  const [selectedLabel, setSelectedLabel] = useState<Label>(
    defaultSelectedLabel
  );

  const onAnnotate = useCallback(
    ([start, end]: number[]) => {
      if (!selectedLabel) {
        return;
      } else if (selectedLabel.type === "annotation") {
        if (!onChangeAnnotations) {
          return;
        }

        const newAnnotations = [...annotations];

        const annotationsForLabelIndex = annotations.findIndex(
          (annotation) => annotation.key === selectedLabel.key
        );
        const annotationsForLabel = {
          ...annotations[annotationsForLabelIndex],
        };

        annotationsForLabel?.values.push({ start, end });

        newAnnotations[annotationsForLabelIndex] = annotationsForLabel;
        onChangeAnnotations(newAnnotations, {
          type: "add",
          labelKey: selectedLabel.key,
          range: { start, end },
        });
      } else if (selectedLabel.type === "relation") {
        if (!onChangeRelations) {
          return;
        }

        const firstToken = newRelationFirstTokenRef.current;

        if (!firstToken) {
          newRelationFirstTokenRef.current = [start, end];
        } else {
          const newRelations = [...relations];

          const relationsForLabelIndex = relations.findIndex(
            (relation) => relation.key === selectedLabel.key
          );

          const relationsForLabel = { ...relations[relationsForLabelIndex] };

          const value = {
            fromStart: firstToken[0],
            fromEnd: firstToken[1],
            toStart: start,
            toEnd: end,
          };

          relationsForLabel?.values.push(value);

          newRelations[relationsForLabelIndex] = relationsForLabel;
          newRelationFirstTokenRef.current = null;
          onChangeRelations(newRelations, {
            type: "add",
            labelKey: selectedLabel.key,
            range: { ...value },
          });
        }
      }
    },
    [
      selectedLabel,
      onChangeAnnotations,
      onChangeRelations,
      annotations,
      relations,
    ]
  );

  const onDelete = useCallback(
    (token: Token) => {
      if (token.type === "annotation") {
        if (!onChangeAnnotations) {
          return;
        }
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

        onChangeAnnotations(newAnnotations, {
          type: "delete",
          labelKey: annotation.key,
          range: { start: annotation.start, end: annotation.end },
        });
      } else if (token.type === "relation") {
        if (!onChangeRelations) {
          return;
        }
        const relation = token as EnrichedRelationValue;

        const newRelations = [...relations];
        const relationsIndex = relations.findIndex(
          (r) => r.key === relation.key
        );
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

        onChangeRelations(newRelations, {
          type: "delete",
          labelKey: relation.key,
          range: {
            fromStart: relation.fromStart,
            fromEnd: relation.fromEnd,
            toStart: relation.toStart,
            toEnd: relation.toEnd,
          },
        });
      }
    },
    [onChangeAnnotations, onChangeRelations, annotations, relations]
  );

  const defaultRenderContextualMenu = useCallback(
    (token: Token) => () => {
      return (
        <div className="rta-default-contextual-menu-container">
          {token.name || token.key}
          <div
            className="rta-default-contextual-menu-line"
            onClick={() => {
              window.alert(JSON.stringify(token));
            }}
          >
            <span className="rta-default-contextual-menu-icon-container">
              <InfoIcon size={15} color="rgba(0, 120, 212,1)" />
            </span>
            {"Info"}
          </div>

          {readOnly ? null : (
            <div
              className="rta-default-contextual-menu-line"
              onClick={() => onDelete(token)}
            >
              <span className="rta-default-contextual-menu-icon-container">
                <TrashIcon size={15} color="rgba(234, 47, 71, 1)" />
              </span>
              {"Delete"}
            </div>
          )}
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
        readOnly={readOnly}
      />
      <TextView
        text={formatText(text)}
        annotations={annotationsFiltered}
        relations={relationsFiltered}
        onAnnotate={onAnnotate}
        renderContextualMenu={
          renderContextualMenu || defaultRenderContextualMenu
        }
        options={options}
        uiOptions={uiOptions}
        readOnly={readOnly}
      />
    </div>
  );
};
