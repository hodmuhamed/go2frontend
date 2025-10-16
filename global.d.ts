/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any */
import React from "react";

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<unknown, any> {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
