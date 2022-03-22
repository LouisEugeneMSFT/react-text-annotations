import { EnrichedAnnotationValue, EnrichedRelationValue } from "../types";

export const isAnnotationOverlapping = (
  annotation: EnrichedAnnotationValue,
  position: { line: number; charOffset: number; verticalOffset: number }
) => {
  const { line, charOffset, verticalOffset } = position;
  return (
    annotation.startLine <= line &&
    annotation.endLine >= line &&
    annotation.startCharOffset <= charOffset &&
    annotation.endCharOffset >= charOffset &&
    verticalOffset == annotation.verticalOffset
  );
};

export const isRelationOverlapping = (
  relation: EnrichedRelationValue,
  position: { line: number; charOffset: number; verticalOffset: number }
) => {
  const { line, charOffset, verticalOffset } = position;

  if (!(relation.fromStartLine <= line)) {
    return false;
  }
  if (!(relation.toEndLine >= line)) {
    return false;
  }

  if (!(verticalOffset === relation.verticalOffset)) {
    return false;
  }

  const sameLine = relation.fromStartLine === relation.toEndLine;

  const startMid =
    (relation.fromStartCharOffset + relation.fromEndCharOffset) / 2;

  const endMid = (relation.toStartCharOffset + relation.toEndCharOffset) / 2;

  if (sameLine) {
    if (!(startMid <= charOffset && endMid >= charOffset)) {
      return false;
    }
  } else {
    if (line == relation.fromStartLine) {
      if (!(charOffset <= startMid)) {
        return false;
      }
    }

    if (line == relation.toEndLine) {
      if (!(charOffset <= endMid)) {
        return false;
      }
    }
  }

  return true;
};
