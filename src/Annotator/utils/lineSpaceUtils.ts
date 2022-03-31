import { EnrichedAnnotationValue, EnrichedRelationValue } from "../types";
import { getRelationArrowFromAndTo } from "./lineToXYSpaceUtils";

export const isAnnotationOverlapping = (
  annotation: EnrichedAnnotationValue,
  position: { line: number; charOffset: number; verticalOffset: number }
) => {
  const { line, charOffset, verticalOffset } = position;

  if (!(annotation.startLine <= line && annotation.endLine >= line)) {
    return false;
  }
  if (!(verticalOffset == annotation.verticalOffset)) {
    return false;
  }
  if (
    annotation.startLine === line &&
    !(annotation.startCharOffset <= charOffset)
  ) {
    return false;
  }
  if (
    annotation.endLine === line &&
    !(annotation.endCharOffset >= charOffset)
  ) {
    return false;
  }

  return true;
};

export const isRelationOverlapping = (
  relation: EnrichedRelationValue,
  position: { line: number; charOffset: number; verticalOffset: number },
  lineBreaks: number[]
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

  const { fromArrowLine, fromArrowChar, toArrowLine, toArrowChar } =
    getRelationArrowFromAndTo(relation, lineBreaks);

  const sameLine = fromArrowLine === toArrowLine;

  if (sameLine) {
    if (!(fromArrowChar <= charOffset && toArrowChar >= charOffset)) {
      return false;
    }
  } else {
    if (line == relation.fromStartLine) {
      if (!(charOffset <= fromArrowChar)) {
        return false;
      }
    }

    if (line == relation.toEndLine) {
      if (!(charOffset <= toArrowChar)) {
        return false;
      }
    }
  }

  return true;
};
