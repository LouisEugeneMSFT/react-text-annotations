export const getTextLineBreaks = (
  text: string,
  textContainerWidth: number,
  charWidth: number
) => {
  const lineBreaks = [];

  let lineCharIndex = 0;
  let lastBreakingChar = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char == " " || char == "\n") {
      lastBreakingChar = lineCharIndex;
    }

    // New line because text says so
    if (char == "\n") {
      lineCharIndex = 0;
      lineBreaks.push(i);
    }
    // New line because overflow
    else if ((lineCharIndex + 1) * charWidth > textContainerWidth) {
      if (char == " " || char == "\n") {
        lineCharIndex = 0;
        lineBreaks.push(i);
      } else {
        lineCharIndex = lineCharIndex - lastBreakingChar;
        lineBreaks.push(i - lineCharIndex);
      }
    } else {
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
