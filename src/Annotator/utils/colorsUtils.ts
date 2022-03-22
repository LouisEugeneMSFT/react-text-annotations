import { Annotations, Relations } from "../types";

const sampleColors = [
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#42d4f4",
  "#f032e6",
  "#fabed4",
  "#469990",
  "#dcbeff",
  "#9A6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#000075",
  "#a9a9a9",
  "#e6194B",
  "#ffffff",
];

export const provideMissingColors = (
  annotations: Annotations,
  relations: Relations
) => {
  let colorIndex = 0;
  annotations.forEach((annotationsByKey) => {
    const sampleColor = sampleColors[colorIndex % sampleColors.length];
    annotationsByKey.color = annotationsByKey.color || sampleColor;
    colorIndex += 1;
  });
  relations.forEach((relationsByKey) => {
    const sampleColor = sampleColors[colorIndex % sampleColors.length];
    relationsByKey.color = relationsByKey.color || sampleColor;
    colorIndex += 1;
  });
};
