import React from "react";
import { AnnotationsByKey, AnnotationValue } from "../src/Annotator/types";

export const AnnotationsByKeyDummyComp = (props: AnnotationsByKey) => {
  console.log(props);
  return <></>;
};

export const AnnotationValueDummyComp = (props: AnnotationValue) => {
  console.log(props);
  return <></>;
};
