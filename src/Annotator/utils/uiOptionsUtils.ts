import { ComputedUIOptions, UIOptions } from "../types";

export const enrichComputedUiOptions = (
  uiOptions: UIOptions,
  computedUiOptions: ComputedUIOptions,
  annotationsStackHeight: number
) => {
  const {
    svgWidth,
    spaceBetweenSvgs,
    spaceBetweenTextAndSvg,
    spaceBeforeNextLine,
    fontSize,
  } = uiOptions;
  const svgSpace = svgWidth + spaceBetweenSvgs;
  const totalSpaceBetweenLines =
    spaceBetweenTextAndSvg +
    svgSpace * annotationsStackHeight +
    spaceBeforeNextLine;

  const lineHeight = 1 + totalSpaceBetweenLines / fontSize;
  const charHeight = fontSize * lineHeight;

  return { ...computedUiOptions, svgSpace, lineHeight, charHeight };
};
