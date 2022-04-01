# react-text-annotate

[![NPM](https://img.shields.io/npm/v/react-text-annotations)](https://www.npmjs.com/package/react-text-annotations)

A React component for viewing and editing annotations and relations on text.

## Usage

React is required as a peer dependency of this package.

```
npm install react-text-annotations
yarn add react-text-annotations
```

## Example

![alt text](./example/example.png)

## Sample code

```tsx
import React, { useState } from "react";
import { Annotator } from "react-text-annotations";

const Sample = () => {
  const sampleText = "Hello world";
  const [annotations, setAnnotations] = useState([
    {
      key: "sample_label",
      name: "Sample label",
      values: [{ start: 0, end: 5 }],
    },
  ]);
  return (
    <Annotator
      text={sampleText}
      annotations={annotations}
      relations={[]}
      onChangeAnnotations={setAnnotations}
    />
  );
};
```
