import _ from "lodash";
import React from "react";
import { useMemo } from "react";
import { NodeType } from "../ui";
import Rectangle from "./Rectangle";
import TextDisplay from "./TextDisplay";

const SPACING = 8;

type NodeProps = {
  node: NodeType;
  draw: ReturnType<typeof getNodeDrawElements>;
  zIndex?: number;
}

const Node = ({ draw }: NodeProps) => {

  return (
    <>
      <Rectangle {...draw.rectangle} />
      <TextDisplay {...draw.divider} />
      <TextDisplay {...draw.label} />
      {
        draw.input.map((input, index) => {

          return (
            <React.Fragment key={index}>
              <TextDisplay {...input.handle} />
              <TextDisplay {...input.label} />
            </React.Fragment>
          )
        })
      }
      {
        draw.output.map((output, index) => {

          return (
            <React.Fragment key={index}>
              <TextDisplay {...output.handle} />
              <TextDisplay {...output.label} />
            </React.Fragment>
          )
        })
      }
    </>
  );
}

export default Node;

export const getNodeDrawElements = (node: NodeType) => {
  const width = (() => {
    const labelWidth = node.label?.length ?? 0;

    const inputWidth = _.max(node.input?.map(input => input.label?.length ?? 0) || []) || 0;

    const outputWidth = _.max(node.output?.map(output => output.label?.length ?? 0) || []) || 0;

    return Math.max(
      labelWidth,
      inputWidth + SPACING + outputWidth
    );
  })();

  const height = (() => {
    const labelHeight = 2;
    const inputHeight = (node.input?.length ?? 0) * 2;
    const outputHeight = (node.output?.length ?? 0) * 2;

    return labelHeight + Math.max(inputHeight, outputHeight);
  })();

  return {
    rectangle: { x: node.position.x - 1, y: node.position.y - 1, width: width + 1, height: height + 1 },
    divider: { x: node.position.x - 1, y: node.position.y + 1, text: `├${(Array.from({ length: width }, () => "─")).join("")}┤` },
    label: { x: node.position.x, y: node.position.y, text: node.label || "" },
    input: (node.input || []).map((input, index) => {

      const y = node.position.y + 2 + index * 2;

      return {
        handle: { x: node.position.x - 1, y, text: `○` },
        label: { x: node.position.x + 1, y, text: input.label || "" }
      }
    }),
    output: (node.output || []).map((output, index) => {

      const y = node.position.y + 2 + index * 2;

      return {
        handle: { x: node.position.x + width, y, text: `○` },
        label: { x: node.position.x + width - 1 - (output.label?.length ?? 0), y, text: output.label || "" }
      }
    }),
  }
}