import {
  ComputedUIOptions,
  EnrichedAnnotationValue,
  EnrichedRelationValue,
  UIOptions,
} from "../types";

const unknownColor = "black";

export const getCharOffsetToX =
  (computedUiOptions: Required<ComputedUIOptions>) => (charOffset: number) => {
    return charOffset * computedUiOptions.charWidth;
  };
export const getXToCharOffset =
  (computedUiOptions: Required<ComputedUIOptions>) => (x: number) => {
    return Math.floor(x / computedUiOptions.charWidth);
  };

export const getLineToY =
  (uiOptions: UIOptions, computedUiOptions: Required<ComputedUIOptions>) =>
  (line: number, verticalOffset: number, direction: number = 1) => {
    const { fontSize, spaceBetweenTextAndSvg } = uiOptions;
    const { charHeight, svgSpace } = computedUiOptions;

    return (
      (line + 1 / 2) * charHeight +
      direction *
        (fontSize / 2 + spaceBetweenTextAndSvg + verticalOffset * svgSpace)
    );
  };

export const getYToLine =
  (uiOptions: UIOptions, computedUiOptions: Required<ComputedUIOptions>) =>
  (y: number, direction: number = 1) => {
    const { fontSize, spaceBetweenTextAndSvg } = uiOptions;
    const { charHeight, svgSpace } = computedUiOptions;

    const temp = y - direction * (fontSize / 2 + spaceBetweenTextAndSvg);
    const line = Math.round(temp / charHeight - 1 / 2);

    const verticalOffset =
      direction * Math.floor((temp - (line + 1 / 2) * charHeight) / svgSpace);

    return [line, verticalOffset];
  };

export const getAnnotationsSVGData = (
  enrichedAnnotations: EnrichedAnnotationValue[],
  lineBreaks: number[],
  charOffsetToX: (charOffset: number) => number,
  lineToY: (line: number, verticalOffset: number, direction?: number) => number
) => {
  const annotationsLines: {
    key: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
  }[] = [];

  enrichedAnnotations.forEach((annotation, index) => {
    const {
      startLine,
      endLine,
      startCharOffset,
      endCharOffset,
      verticalOffset,
      color,
    } = annotation;

    for (let j = startLine; j < endLine + 1; j++) {
      let x1 = 0;
      let y1 = j;
      let x2 = lineBreaks[j] - (j > 0 ? lineBreaks[j - 1] : -1) - 1;
      let y2 = j;

      if (j === startLine) {
        x1 = startCharOffset;
      }

      if (j === endLine) {
        x2 = endCharOffset;
      }

      annotationsLines.push({
        key: `${index}-${j}`,
        x1: charOffsetToX(x1),
        y1: lineToY(y1, verticalOffset),
        x2: charOffsetToX(x2),
        y2: lineToY(y2, verticalOffset),
        color: color || unknownColor,
      });
    }
  });

  return annotationsLines;
};

export const getRelationArrowFromAndTo = (
  relation: EnrichedRelationValue,
  lineBreaks: number[]
) => {
  const {
    fromStartLine,
    fromEndLine,
    fromStartCharOffset,
    fromEndCharOffset,
    toStartLine,
    toEndLine,
    toStartCharOffset,
    toEndCharOffset,
  } = relation;

  const isFromSingularLine = fromStartLine === fromEndLine;

  const fromStartLineCharCount =
    lineBreaks[fromStartLine] -
    (fromStartLine > 0 ? lineBreaks[fromStartLine - 1] : 0);

  const fromArrowChar =
    (fromStartCharOffset +
      (isFromSingularLine ? fromEndCharOffset : fromStartLineCharCount)) /
    2;

  const isToSingularLine = toStartLine === toEndLine;
  const toStartLineCharCount =
    lineBreaks[toStartLine] -
    (toStartLine > 0 ? lineBreaks[toStartLine - 1] : 0);

  const toArrowChar =
    (toStartCharOffset +
      (isToSingularLine ? toEndCharOffset : toStartLineCharCount)) /
    2;

  return {
    fromArrowLine: fromStartLine,
    fromArrowChar,
    toArrowLine: toStartLine,
    toArrowChar,
  };
};

export const getRelationsSVGData = (
  enrichedRelations: EnrichedRelationValue[],
  lineBreaks: number[],
  charOffsetToX: (charOffset: number) => number,
  lineToY: (line: number, verticalOffset: number, direction?: number) => number,
  uiOptions: UIOptions,
  computedUiOptions: ComputedUIOptions
) => {
  const relationsLines: {
    points: string;
    color: string;
    key: string;
  }[] = [];

  enrichedRelations.forEach((relation, index) => {
    const { verticalOffset, color, directional } = relation;

    const { fromArrowLine, fromArrowChar, toArrowLine, toArrowChar } =
      getRelationArrowFromAndTo(relation, lineBreaks);

    const x1 = charOffsetToX(fromArrowChar);
    const y1 = lineToY(fromArrowLine, verticalOffset, -1);
    const x2 = charOffsetToX(toArrowChar);
    const y2 = lineToY(toArrowLine, verticalOffset, -1);

    const {
      spaceBetweenTextAndSvg,
      relationVerticalOffset,
      relationHorizontalOffset,
    } = uiOptions;

    const svgSpace = computedUiOptions.svgSpace || 0;

    const points: number[][] = [];

    const firstPoint = [
      x1,
      y1 + relationVerticalOffset + svgSpace * verticalOffset,
    ];

    const lastPoint = [
      x2,
      y2 + relationVerticalOffset + svgSpace * verticalOffset,
    ];

    points.push(firstPoint);
    points.push([x1, y1]);
    if (fromArrowLine !== toArrowLine) {
      points.push([-relationHorizontalOffset - svgSpace * verticalOffset, y1]);
      points.push([-relationHorizontalOffset - svgSpace * verticalOffset, y2]);
    }
    points.push([x2, y2]);
    points.push(lastPoint);

    // Draw arrow
    if (directional) {
      points.push([lastPoint[0] + 6, lastPoint[1] - 3]);
      points.push(lastPoint);
      points.push([lastPoint[0] - 6, lastPoint[1] - 3]);
      points.push(lastPoint);
    }

    relationsLines.push({
      points: points.map((p) => `${p[0]} ${p[1]}`).join(" "),
      color: color || unknownColor,
      key: `${index}`,
    });
  });

  return relationsLines;
};
