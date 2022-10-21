import React from "react";
import {
  AnnotationOperation,
  AnnotationsByKey,
  AnnotationValue,
  RelationOperation,
  RelationsByKey,
  RelationValue,
  UIOptions,
} from "../src/Annotator/types";

export const AnnotationsByKeyDummyComp = (props: AnnotationsByKey) => {
  console.log(props);
  return <></>;
};

export const AnnotationValueDummyComp = (props: AnnotationValue) => {
  console.log(props);
  return <></>;
};

export const RelationsByKeyDummyComp = (props: RelationsByKey) => {
  console.log(props);
  return <></>;
};

export const RelationValueDummyComp = (props: RelationValue) => {
  console.log(props);
  return <></>;
};

export const AnnotationOperationDummyComp = (props: AnnotationOperation) => {
  console.log(props);
  return <></>;
};

export const RelationOperationDummyComp = (props: RelationOperation) => {
  console.log(props);
  return <></>;
};

export const UIOptionsDummyComp = (props: UIOptions) => {
  console.log(props);
  return <></>;
};
