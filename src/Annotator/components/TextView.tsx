import React, { useEffect, useMemo, useRef, useState } from "react";
import { Annotations, Options, Relations, Token, UIOptions } from "../types";
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
  options?: Options;
  uiOptions?: Partial<UIOptions>;
  readOnly?: boolean;
};

export const TextView = (props: TextViewProps) => {
  const {
    text,
    annotations,
    relations,
    onAnnotate,
    renderContextualMenu,
    options,
    uiOptions: propsUiOptions,
    readOnly,
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
  }, [text, lineHeight, uiOptions.fontSize]);

  useEffect(() => {
    function handleResize() {
      setTextContainerHeight(textContainerRef.current?.offsetHeight || 100);
      setTextContainerWidth(textContainerRef.current?.offsetWidth || 100);
    }
    window.addEventListener("resize", handleResize);
  }, []);

  // Loading the (monospace) font can take time and delay accurate offsetHeight / offsetWidth
  document.fonts.ready.then(function() {
    setTextContainerHeight(textContainerRef.current?.offsetHeight || 100);
    setTextContainerWidth(textContainerRef.current?.offsetWidth || 100);
  });

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
          options={options}
          uiOptions={uiOptions}
          readOnly={readOnly}
          textContainerHeight={textContainerHeight}
          textContainerWidth={textContainerWidth}
          setLineHeight={setLineHeight}
        />
      ) : null}
    </div>
  );
};
