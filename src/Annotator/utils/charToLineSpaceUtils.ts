import {
  Annotations,
  EnrichedAnnotationValue,
  EnrichedRelationValue,
  Relations,
} from "../types";
import { getRelationArrowFromAndTo } from "./lineToXYSpaceUtils";

const areOverlapping = ([start1, end1]: number[], [start2, end2]: number[]) => {
  if (end1 < start2 || start1 > end2) {
    return false;
  }
  return true;
};

export const getTokenLinePosition = (
  start: number,
  end: number,
  lineBreaks: number[]
) => {
  let startLine = 0;
  let endLine = 0;

  let startLineCharOffset = 0;
  let endLineCharOffset = 0;

  for (let i = 0; i < lineBreaks.length; i++) {
    startLine = i;
    if (start < lineBreaks[i]) {
      if (i > 0) {
        startLineCharOffset = lineBreaks[i - 1] + 1;
      }
      break;
    }
  }
  for (let i = 0; i < lineBreaks.length; i++) {
    endLine = i;
    if (end <= lineBreaks[i]) {
      if (i > 0) {
        endLineCharOffset = lineBreaks[i - 1] + 1;
      }
      break;
    }
  }

  const startCharOffset = start - startLineCharOffset;
  const endCharOffset = end - endLineCharOffset;

  return { startLine, endLine, startCharOffset, endCharOffset };
};

export const enrichAnnotations = (
  annotations: Annotations,
  getTextTokenLinePosition: (
    start: number,
    end: number
  ) => {
    startLine: number;
    endLine: number;
    startCharOffset: number;
    endCharOffset: number;
  }
) => {
  const verticalOffsetRanges: number[][][] = [];
  const enrichedAnnotations: EnrichedAnnotationValue[] = [];

  annotations.forEach((annotationsByKey) => {
    const { color } = annotationsByKey;
    const values = annotationsByKey.values;
    return values.forEach((annotationValue) => {
      const { start, end } = annotationValue;

      const { startLine, endLine, startCharOffset, endCharOffset } =
        getTextTokenLinePosition(start, end);

      let verticalOffset = 0;

      while (verticalOffset < verticalOffsetRanges.length) {
        const currentOffsetRanges = verticalOffsetRanges[verticalOffset];
        const lineOverlaps = currentOffsetRanges.map((range) => {
          return areOverlapping([start, end], range);
        });

        if (!lineOverlaps.some((e) => e)) {
          break;
        }
        verticalOffset += 1;
      }
      verticalOffsetRanges[verticalOffset] =
        verticalOffsetRanges[verticalOffset] || [];
      verticalOffsetRanges[verticalOffset].push([start, end]);

      enrichedAnnotations.push({
        ...annotationValue,
        key: annotationsByKey.key,
        name: annotationsByKey.name,
        type: "annotation",
        color,
        startLine,
        endLine,
        startCharOffset,
        endCharOffset,
        verticalOffset,
      });
    });
  });

  const annotationsStackHeight = verticalOffsetRanges.length;

  return { enrichedAnnotations, annotationsStackHeight };
};

export const enrichRelations = (
  relations: Relations,
  getTextTokenLinePosition: (
    start: number,
    end: number
  ) => {
    startLine: number;
    endLine: number;
    startCharOffset: number;
    endCharOffset: number;
  },
  lineBreaks: number[]
) => {
  const verticalOffsetRanges: number[][][] = [];
  const enrichedRelations: EnrichedRelationValue[] = [];

  relations.forEach((relationByKey) => {
    const values = relationByKey.values;

    const { color, directional } = relationByKey;
    return values.forEach((relationValue) => {
      const { fromStart, fromEnd, toStart, toEnd } = relationValue;

      const {
        startLine: fromStartLine,
        endLine: fromEndLine,
        startCharOffset: fromStartCharOffset,
        endCharOffset: fromEndCharOffset,
      } = getTextTokenLinePosition(fromStart, fromEnd);

      const {
        startLine: toStartLine,
        endLine: toEndLine,
        startCharOffset: toStartCharOffset,
        endCharOffset: toEndCharOffset,
      } = getTextTokenLinePosition(toStart, toEnd);

      let verticalOffset = 0;

      const enrichedRelation = {
        ...relationValue,
        key: relationByKey.key,
        name: relationByKey.name,
        type: "relation",
        color,
        directional,
        fromStartLine,
        fromEndLine,
        fromStartCharOffset,
        fromEndCharOffset,
        toStartLine,
        toEndLine,
        toStartCharOffset,
        toEndCharOffset,
        verticalOffset,
      };

      // Everything bellow is to compute "verticalOffset"

      const { fromArrowLine, fromArrowChar, toArrowLine, toArrowChar } =
        getRelationArrowFromAndTo(enrichedRelation, lineBreaks);

      const adjustedFromArrowChar =
        fromArrowLine > 0
          ? fromArrowChar + lineBreaks[fromArrowLine - 1]
          : fromArrowChar;

      const adjustedToArrowChar =
        toArrowLine > 0
          ? toArrowChar + lineBreaks[toArrowLine - 1]
          : toArrowChar;

      const lines =
        fromArrowLine === toArrowLine
          ? [
              [
                Math.min(adjustedFromArrowChar, adjustedToArrowChar),
                Math.max(adjustedFromArrowChar, adjustedToArrowChar),
              ],
            ]
          : [
              [
                fromArrowLine > 0 ? lineBreaks[fromArrowLine - 1] : 0,
                adjustedFromArrowChar,
              ],
              [lineBreaks[toArrowLine - 1], adjustedToArrowChar],
            ];

      while (verticalOffset < verticalOffsetRanges.length) {
        const currentOffsetRanges = verticalOffsetRanges[verticalOffset];
        const lineOverlaps = currentOffsetRanges.map((range) => {
          return lines.some((line) => areOverlapping(line, range));
        });

        if (!lineOverlaps.some((e) => e)) {
          break;
        }
        verticalOffset += 1;
      }
      verticalOffsetRanges[verticalOffset] =
        verticalOffsetRanges[verticalOffset] || [];
      verticalOffsetRanges[verticalOffset] =
        verticalOffsetRanges[verticalOffset].concat(lines);

      enrichedRelation["verticalOffset"] = verticalOffset;

      enrichedRelations.push(enrichedRelation);
    });
  });

  const relationsStackHeight = verticalOffsetRanges.length;

  return { enrichedRelations, relationsStackHeight };
};
