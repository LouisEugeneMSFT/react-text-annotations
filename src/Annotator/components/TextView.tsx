import React, { useEffect, useMemo, useRef, useState } from "react";
import { Annotations, Relations, Token, UIOptions } from "../types";
import { SvgView } from "./SvgView";

export const textContainerId = "react-annotate-text-container";

const defaultUiOptions = {
  fontSize: 20,
  defaultSvgPadding: 10,
  spaceBetweenTextAndSvg: 6,
  svgWidth: 3,
  spaceBetweenSvgs: 2,
  spaceBeforeNextLine: 10,
  relationVerticalOffset: 7,
  relationHorizontalOffset: 5,
};

type TextViewProps = {
  text: string;
  annotations: Annotations;
  relations: Relations;
  onAnnotate: ([start, end]: number[]) => void;
  renderContextualMenu: (token: Token) => () => JSX.Element;
  uiOptions?: Partial<UIOptions>;
  readOnly?: boolean;
  initialScrollToChar?: number;
};

export const TextView = (props: TextViewProps) => {
  const {
    text,
    annotations,
    relations,
    onAnnotate,
    renderContextualMenu,
    uiOptions: propsUiOptions,
    readOnly,
    initialScrollToChar,
  } = props;

  const uiOptions = useMemo(
    () => ({ ...defaultUiOptions, ...propsUiOptions }),
    [propsUiOptions]
  );

  const textContainerRef = useRef<HTMLDivElement>(null);
  const [textContainerHeight, setTextContainerHeight] = useState<number>(null);
  const [textContainerWidth, setTextContainerWidth] = useState<number>(null);

  const [lineHeight, setLineHeight] = useState(1);

  useEffect(() => {
    setTextContainerHeight(textContainerRef.current?.offsetHeight || 100);
    setTextContainerWidth(textContainerRef.current?.offsetWidth || 100);
  }, [text, lineHeight]);

  useEffect(() => {
    function handleResize() {
      setTextContainerHeight(textContainerRef.current?.offsetHeight || 100);
      setTextContainerWidth(textContainerRef.current?.offsetWidth || 100);
    }
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={textContainerRef}
        div-identifier={textContainerId}
        className="rta-text-container"
        style={{
          fontSize: uiOptions.fontSize,
          lineHeight: lineHeight,
        }}
      >
        {text}
      </div>

      {textContainerHeight && textContainerWidth ? (
        <SvgView
          text={text}
          annotations={annotations}
          relations={relations}
          onAnnotate={onAnnotate}
          renderContextualMenu={renderContextualMenu}
          uiOptions={uiOptions}
          readOnly={readOnly}
          initialScrollToChar={initialScrollToChar}
          textContainerHeight={textContainerHeight}
          textContainerWidth={textContainerWidth}
          setLineHeight={setLineHeight}
        />
      ) : null}
    </div>
  );
};
