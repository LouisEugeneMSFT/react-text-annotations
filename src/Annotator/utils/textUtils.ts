const newLine = "NEWLINE";
const space = "SPACE";
const dash = "DASH";

export const getTextLineBreaks = (
  text: string,
  textContainerWidth: number,
  charWidth: number
) => {
  const lineBreaks = [];

  let lineCharIndex = 0;
  let lastBreakingCharIndex = 0;
  let lastBreakingChar: string;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    // If we have multiple spaces at the end of the previous line and breaking was not caused by new line char, skip them
    const lbLength = lineBreaks.length;
    if (
      lbLength > 0 &&
      lineCharIndex == 0 &&
      char == " " &&
      lastBreakingChar !== newLine
    ) {
      lineCharIndex = -1;
      lineBreaks[lbLength - 1] = lineBreaks[lbLength - 1] + 1;
    }

    const shouldGoToNewLine =
      char == "\n" || (lineCharIndex + 1) * charWidth > textContainerWidth;

    if (shouldGoToNewLine) {
      if (char == "\n" || char == " ") {
        lineCharIndex = 0;
        lineBreaks.push(i);
      } else {
        lineCharIndex = lineCharIndex - lastBreakingCharIndex;
        lineBreaks.push(i - lineCharIndex);
      }
    }

    if (char == "\n") {
      lastBreakingChar = newLine;
      lastBreakingCharIndex = lineCharIndex;
    } else if (char == " ") {
      lastBreakingChar = space;
      lastBreakingCharIndex = lineCharIndex;
    } else if (char == "-") {
      lastBreakingChar = dash;
      lastBreakingCharIndex = lineCharIndex;
    }

    if (!shouldGoToNewLine) {
      lineCharIndex += 1;
    }

    // End of text
    if (i === text.length - 1 && lineBreaks[lineBreaks.length] !== i) {
      lineBreaks.push(i);
    }
  }

  return lineBreaks;
};

export const getSelectionCharOffsets = () => {
  const selection: Selection | any = window.getSelection();

  const baseOffset = Number(
    selection.baseNode.parentElement.getAttribute("data-offset")
  );
  const basePosition = selection.baseOffset;
  const extentOffset = Number(
    selection.extentNode.parentElement.getAttribute("data-offset")
  );
  const extentPosition = selection.extentOffset;

  let from = Number(baseOffset) + Number(basePosition);
  let to = Number(extentOffset) + Number(extentPosition);

  [from, to] = [Math.min(from, to), Math.max(from, to)];

  return [from, to];
};
