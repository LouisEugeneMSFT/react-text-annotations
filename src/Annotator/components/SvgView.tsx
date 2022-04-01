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
import { textContainerId } from "./TextView";

type TextViewProps = {
  text: string;
  annotations: Annotations;
  relations: Relations;
  onAnnotate: ([start, end]: number[]) => void;
  renderContextualMenu: (token: Token) => () => JSX.Element;
  uiOptions?: UIOptions;
  readOnly?: boolean;
  initialScrollToChar?: number;
  textContainerWidth: number;
  textContainerHeight: number;
  setLineHeight: (newLineHeight: number) => void;
};

export const SvgView = (props: TextViewProps) => {
  const {
    text,
    annotations,
    relations,
    onAnnotate,
    renderContextualMenu,
    uiOptions,
    readOnly,
    initialScrollToChar,
    textContainerWidth,
    textContainerHeight,
    setLineHeight,
  } = props;

  const computedUiOptions: ComputedUIOptions = {
    charWidth: uiOptions.fontSize / 2,
  };

  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

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
          isRelationOverlapping(
            relation,
            {
              line,
              charOffset,
              verticalOffset,
            },
            lineBreaks
          )
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
    [
      setContextualMenuAnchor,
      setContextualToken,
      enrichedAnnotations,
      lineBreaks,
    ]
  );

  const handleClick = useCallback((e) => {
    setContextualMenuAnchor(null);
  }, []);

  const annotate = useCallback(() => {
    const [from, to] = getSelectionCharOffsets();
    onAnnotate([from, to]);
  }, [onAnnotate]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  useEffect(() => {
    if (readOnly) {
      return;
    }
    const keyUpHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          annotate();
      }
    };
    document.body.addEventListener("keyup", keyUpHandler);
    return () => document.body.removeEventListener("keyup", keyUpHandler);
  }, [readOnly, annotate]);

  const padding =
    uiOptions.defaultSvgPadding +
    relationsStackHeight * enrichedComputedUiOptions.svgSpace;

  const scrollY = useMemo(() => {
    if (!initialScrollToChar) {
      return null;
    }
    const scrollLine = getTextTokenLinePosition(
      initialScrollToChar,
      initialScrollToChar
    );

    return lineToY(scrollLine.startLine - 1, 0);
  }, [initialScrollToChar, getTextTokenLinePosition, lineToY]);

  useEffect(() => {
    setLineHeight(enrichedComputedUiOptions.lineHeight);
  }, [enrichedComputedUiOptions.lineHeight]);

  useEffect(() => {
    if (scrollY && scrollAnchorRef.current && !hasScrolledRef.current) {
      scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
      hasScrolledRef.current = true;
    }
  }, [scrollAnchorRef, hasScrolledRef, scrollY]);

  return (
    <>
      {scrollY ? (
        <div
          ref={scrollAnchorRef}
          style={{ position: "absolute", top: scrollY, opacity: 0 }}
        >
          __
        </div>
      ) : null}
      <svg
        className="rta-svg"
        style={{
          top: -padding,
          left: -padding,
        }}
        width={textContainerWidth + 2 * padding}
        height={textContainerHeight + 2 * padding}
        viewBox={`${-padding} ${-padding} ${textContainerWidth +
          2 * padding} ${textContainerHeight + 2 * padding}`}
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
    </>
  );
};
