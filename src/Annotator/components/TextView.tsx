import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Annotations,
  ComputedUIOptions,
  EnrichedAnnotationValue,
  EnrichedRelationValue,
  Relations,
  Token,
  UIOptions,
} from "../types";
import {
  enrichAnnotations,
  enrichRelations,
  getTokenLinePosition,
} from "../utils/charToLineSpaceUtils";
import {
  isAnnotationOverlapping,
  isRelationOverlapping,
} from "../utils/lineSpaceUtils";
import {
  getAnnotationsSVGData,
  getCharOffsetToX,
  getLineToY,
  getRelationsSVGData,
  getXToCharOffset,
  getYToLine,
} from "../utils/lineToXYSpaceUtils";
import { getSelectionCharOffsets, getTextLineBreaks } from "../utils/textUtils";
import { enrichComputedUiOptions } from "../utils/uiOptionsUtils";
import { ContextualMenu } from "./ContextualMenu";

const textContainerId = "react-annotate-text-container";

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
};

export const TextView = (props: TextViewProps) => {
  const {
    text,
    annotations,
    relations,
    onAnnotate,
    renderContextualMenu,
    uiOptions: propsUiOptions,
  } = props;

  const uiOptions = { ...defaultUiOptions, ...propsUiOptions };

  const computedUiOptions: ComputedUIOptions = {
    charWidth: uiOptions.fontSize / 2,
  };

  const textContainerRef = useRef<HTMLDivElement>(null);
  const [textContainerHeight, setTextContainerHeight] = useState(0);
  const [textContainerWidth, setTextContainerWidth] = useState(0);

  const [contextualMenuAnchor, setContextualMenuAnchor] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [contextualToken, setContextualToken] = useState<Token | null>(null);

  const lineBreaks = useMemo(
    () =>
      getTextLineBreaks(text, textContainerWidth, computedUiOptions.charWidth),
    [text, textContainerWidth, computedUiOptions.charWidth]
  );

  const getTextTokenLinePosition = useCallback(
    (start: number, end: number) =>
      getTokenLinePosition(start, end, lineBreaks),
    [lineBreaks]
  );

  const { enrichedAnnotations, annotationsStackHeight } = enrichAnnotations(
    annotations,
    getTextTokenLinePosition
  );

  const { enrichedRelations, relationsStackHeight } = enrichRelations(
    relations,
    getTextTokenLinePosition,
    lineBreaks
  );

  const enrichedComputedUiOptions = enrichComputedUiOptions(
    uiOptions,
    computedUiOptions,
    Math.max(annotationsStackHeight, relationsStackHeight)
  );

  const charOffsetToX = getCharOffsetToX(enrichedComputedUiOptions);
  const xToCharOffset = getXToCharOffset(enrichedComputedUiOptions);
  const lineToY = getLineToY(uiOptions, enrichedComputedUiOptions);
  const yToLine = getYToLine(uiOptions, enrichedComputedUiOptions);

  const annotationsSvgData = getAnnotationsSVGData(
    enrichedAnnotations,
    lineBreaks,
    charOffsetToX,
    lineToY
  );

  const relationsSvgData = getRelationsSVGData(
    enrichedRelations,
    lineBreaks,
    charOffsetToX,
    lineToY,
    uiOptions,
    enrichedComputedUiOptions
  );

  const handleContextMenu = useCallback(
    (e) => {
      const isWithinTextContainer =
        e.target.getAttribute("div-identifier") === textContainerId;

      if (!isWithinTextContainer) {
        setContextualMenuAnchor(null);
        return;
      }

      e.preventDefault();

      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top; //y position within the element.

      let result: EnrichedAnnotationValue | EnrichedRelationValue | undefined;

      const charOffset = xToCharOffset(x);
      let [line, verticalOffset] = yToLine(y);
      result = enrichedAnnotations.find((annotation) =>
        isAnnotationOverlapping(annotation, {
          line,
          charOffset,
          verticalOffset,
        })
      );

      if (!result) {
        [line, verticalOffset] = yToLine(y, -1);
        result = enrichedRelations.find((relation) =>
          isRelationOverlapping(relation, {
            line,
            charOffset,
            verticalOffset,
          })
        );
      }

      if (result) {
        setContextualToken(result);
        setContextualMenuAnchor({ x: x, y: y });
      } else {
        setContextualToken(null);
        setContextualMenuAnchor(null);
      }
    },
    [setContextualMenuAnchor, setContextualToken, enrichedAnnotations]
  );

  const handleClick = useCallback((e) => {
    setContextualMenuAnchor(null);
  }, []);

  const annotate = useCallback(() => {
    const [from, to] = getSelectionCharOffsets();
    onAnnotate([from, to]);
  }, [onAnnotate]);

  useEffect(() => {
    setTextContainerHeight(textContainerRef.current?.offsetHeight || 100);
    setTextContainerWidth(textContainerRef.current?.offsetWidth || 100);
  }, [text, enrichedComputedUiOptions.charHeight]);

  useEffect(() => {
    function handleResize() {
      setTextContainerHeight(textContainerRef.current?.offsetHeight || 100);
      setTextContainerWidth(textContainerRef.current?.offsetWidth || 100);
    }
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  useEffect(() => {
    const keyUpHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          annotate();
      }
    };
    document.body.addEventListener("keyup", keyUpHandler);
    return () => document.body.removeEventListener("keyup", keyUpHandler);
  }, [annotate]);

  const padding =
    uiOptions.defaultSvgPadding +
    relationsStackHeight * enrichedComputedUiOptions.svgSpace;

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={textContainerRef}
        div-identifier={textContainerId}
        className="rta-text-container"
        style={{
          fontSize: uiOptions.fontSize,
          lineHeight: enrichedComputedUiOptions.lineHeight,
        }}
      >
        {text}
      </div>
      <svg
        className="rta-svg"
        style={{
          top: -padding,
          left: -padding,
        }}
        width={textContainerWidth + 2 * padding}
        height={textContainerHeight + 2 * padding}
        viewBox={`${-padding} ${-padding} ${textContainerWidth + 2 * padding} ${
          textContainerHeight + 2 * padding
        }`}
      >
        {annotationsSvgData.map((data, index) => (
          <line
            key={index}
            x1={data.x1}
            y1={data.y1}
            x2={data.x2}
            y2={data.y2}
            stroke={data.color}
            strokeWidth={uiOptions.svgWidth}
          />
        ))}
        {relationsSvgData.map((data, index) => (
          <polyline
            points={data.points}
            stroke={data.color}
            strokeWidth={uiOptions.svgWidth}
            strokeLinejoin="round"
            fill="transparent"
            key={index}
          />
        ))}
      </svg>

      <ContextualMenu
        contextualToken={contextualToken}
        contextualMenuAnchor={contextualMenuAnchor}
        renderContextualMenu={renderContextualMenu}
      />
    </div>
  );
};
