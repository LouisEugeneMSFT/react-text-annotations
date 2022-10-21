export type AnnotationValue = {
  /**
   * Text character offset for the start of the annotation.
   */
  start: number;
  /**
   * Text character offset for the end of the annotation
   */
  end: number;
};

export type AnnotationsByKey = {
  /**
   * Unique identifier for the group of annotations (same "label").
   */
  key: string;
  /**
   * List of start / end pairs for each annotation in the group.
   */
  values: AnnotationValue[];
  /**
   * User friendly name for the group. If not provided the key will be used.
   */
  name?: string;
  /**
   * Color for the group. If not provided a default color will be used.
   */
  color?: string;
};

export type Annotations = AnnotationsByKey[];

type AnnotationLinePlacement = {
  startLine: number;
  endLine: number;
  startCharOffset: number;
  endCharOffset: number;
  verticalOffset: number;
};

export type EnrichedAnnotationValue = {
  key: string;
  type: string;
  name?: string;
  color?: string;
} & AnnotationValue &
  AnnotationLinePlacement;

export type RelationValue = {
  /**
   * Text character offset for the start of the "from" piece of the relation.
   */
  fromStart: number;
  /**
   * Text character offset for the end of the "from" piece of the relation.
   */
  fromEnd: number;
  /**
   * Text character offset for the start of the "to" piece of the relation.
   */
  toStart: number;
  /**
   * Text character offset for the end of the "to" piece of the relation.
   */
  toEnd: number;
};

export type RelationsByKey = {
  /**
   * Unique identifier for the group of relations (same "label").
   */
  key: string;
  /**
   * List of start / end pairs for "from" & "to" for each relation in the group.
   */
  values: RelationValue[];
  /**
   * User friendly name for the group. If not provided the key will be used.
   */
  name?: string;
  /**
   * Color for the group. If not provided a default color will be used.
   */
  color?: string;
  /**
   * Boolean indicating whether the relation is directed (if so, an arrow will indicate the direction).
   */
  directional?: boolean;
};

export type Relations = RelationsByKey[];

type RelationLinePlacement = {
  fromStartLine: number;
  fromEndLine: number;
  fromStartCharOffset: number;
  fromEndCharOffset: number;
  toStartLine: number;
  toEndLine: number;
  toStartCharOffset: number;
  toEndCharOffset: number;
  verticalOffset: number;
};

export type EnrichedRelationValue = {
  key: string;
  type: string;
  name?: string;
  color?: string;
  directional?: boolean;
} & RelationValue &
  RelationLinePlacement;

export type Token = EnrichedAnnotationValue | EnrichedRelationValue;

export type Label = { key: string; type: "annotation" | "relation" } | null;

export type UIOptions = {
  /**
   * Font size for the text.
   */
  fontSize: number;
  /**
   * Dictates how much more space the svg layer is taking outside of the text box.
   */
  defaultSvgPadding: number;
  /**
   * Vertical distance (px) between the text lines and their first first annotation / relation lines.
   */
  spaceBetweenTextAndSvg: number;
  /**
   * Svg line width (px) for the annotations / relations.
   */
  svgWidth: number;
  /**
   * Distance (px) between each annotation / relation lines when they are overlapping.
   */
  spaceBetweenSvgs: number;
  /**
   * Distance (px) between a text line with its annotations / relations and the next line.
   */
  spaceBeforeNextLine: number;
  /**
   * Height for the vertical line going from the relation line to the text line.
   */
  relationVerticalOffset: number;
  /**
   * When a relation spans multiple lines of text, offset between the vertical relation line on the left border and the text box. It is best to keep the default value.
   */
  relationHorizontalOffset: number;
};

export type ComputedUIOptions = {
  charWidth: number;
  charHeight?: number;
  svgSpace?: number;
  lineHeight?: number;
};

export type AnnotationOperation = {
  /**
   * Whether an annotation has been added or deleted.
   */
  type: "add" | "delete";
  /**
   * Unique identifier of the group the edited annotation belongs to.
   */
  labelKey: string;
  /**
   * Character start & end offsets for the new or deleted annotation.
   */
  range: {
    start: number;
    end: number;
  };
};

export type RelationOperation = {
  /**
   * Whether a relation has been added or deleted.
   */
  type: "add" | "delete";
  /**
   * Unique identifier of the group the edited relation belongs to.
   */
  labelKey: string;
  /**
   * Character start & end offsets for the "from" & "to" tokens of the new or deleted relation.
   */
  range: {
    fromStart: number;
    fromEnd: number;
    toStart: number;
    toEnd: number;
  };
};
