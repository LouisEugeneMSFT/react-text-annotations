export type AnnotationValue = {
  start: number;
  end: number;
};

export type AnnotationsByKey = {
  key: string;
  values: AnnotationValue[];
  name?: string;
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
  fromStart: number;
  fromEnd: number;
  toStart: number;
  toEnd: number;
};

export type RelationsByKey = {
  key: string;
  values: RelationValue[];
  name?: string;
  color?: string;
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
  fontSize: number;
  defaultSvgPadding: number;
  spaceBetweenTextAndSvg: number;
  svgWidth: number;
  spaceBetweenSvgs: number;
  spaceBeforeNextLine: number;
  relationVerticalOffset: number;
  relationHorizontalOffset: number;
};

export type ComputedUIOptions = {
  charWidth: number;
  charHeight?: number;
  svgSpace?: number;
  lineHeight?: number;
};
