import React, { createContext, FC, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Newline, Text, useInput } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import _ from 'lodash';
import Background from './components/Background';
import Node, { getNodeDrawElements } from './components/Node';
import Line from './components/Line';

const App: FC = () => {

	const [columns, rows] = useStdoutDimensions();

	const [offset, setOffset] = useState<[number, number]>([0, 0]);
	const [chars, setChars] = useState<{ char: string, color?: string, backgroundColor?: string }[][]>([]);

	useInput((input, key) => {
		if (key.rightArrow) {
			setOffset(offset => [offset[0] + 2, offset[1]]);
		} else if (key.leftArrow) {
			setOffset(offset => [offset[0] - 2, offset[1]]);
		} else if (key.upArrow) {
			setOffset(offset => [offset[0], offset[1] - 1]);
		} else if (key.downArrow) {
			setOffset(offset => [offset[0], offset[1] + 1]);
		}
	});

	const width = columns;
	const height = rows;


	const aliveRef = useRef(true);
	useEffect(() => () => { aliveRef.current = false; }, [])

	const drawFuncsRef = useRef<{
		func: (x: number, y: number) => { char: string, position: number, color?: string, backgroundColor?: string } | undefined,
		id: string
	}[]>([]);

	const drawRef = useRef(() => { });
	drawRef.current = () => {
		if (!aliveRef.current) return;

		const chars: { char: string, color?: string, backgroundColor?: string }[][] = [];

		for (let y = 0; y < height; y++) {
			chars[y] = [];

			for (let x = 0; x < width; x++) {
				let char = " ";
				let color: string | undefined = undefined;
				let position = -Infinity;
				let backgroundColor: string | undefined = undefined;
				let bgPosition = -Infinity;

				drawFuncsRef.current.forEach(({ func }) => {
					const funcRes = func(x + offset[0], y + offset[1]);

					if (funcRes?.position !== undefined && funcRes.position >= position) {
						position = funcRes.position;
						char = funcRes.char || " ";
						color = funcRes.color;
					}

					if (funcRes?.backgroundColor && funcRes?.position !== undefined && funcRes.position >= bgPosition) {
						bgPosition = funcRes.position;
						backgroundColor = funcRes.backgroundColor;
					}
				});

				chars[y]![x] = { char, color, backgroundColor };
			}
		}

		setChars(chars);
	};

	useEffect(() => {
		drawRef.current();
	}, [width, height, offset]);

	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

	const registerChar = useCallback((
		func: (x: number, y: number) => { char: string, position: number, color?: string, backgroundColor?: string } | undefined,
		id: string
	) => {
		const index = drawFuncsRef.current.findIndex(funcData => funcData.id === id);
		if (index >= 0) {
			drawFuncsRef.current.splice(index, 1);
		}
		drawFuncsRef.current.push({ func, id });

		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			drawRef.current();
		}, 0);

		return null;
	}, []);

	const unregisterChar = useCallback((id: string) => {
		const index = drawFuncsRef.current.findIndex(funcData => funcData.id === id);
		if (index >= 0) {
			drawFuncsRef.current.splice(index, 1);
		}

		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			drawRef.current();
		}, 0)
	}, []);

	const nodeDraw = nodes.map(node => ({ node, draw: getNodeDrawElements(node) }))

	return (
		<>
			<RegisterContext.Provider value={{ registerChar, unregisterChar }}>
				<Background />
				{
					nodeDraw.map(({ node, draw }) => {
						return <Node key={node.id} node={node} draw={draw} />
					})
				}
				{/* Hard coded line from node 1 to node 2 */}
				<Line x1={25} y1={4} x2={37} y2={13} zIndex={2} />
			</RegisterContext.Provider>
			<Box width={width} height={height} flexDirection="column">
				{
					chars.map((row, rowIndex) => {

						return (
							<Box key={rowIndex}>
								{
									row.map((col, colIndex) => {
										return (
											<Text color={col.color} backgroundColor={col.backgroundColor} key={colIndex}>
												{col.char}
											</Text>
										)
									})
								}
								<Newline />
							</Box>
						)
					})
				}
			</Box>
		</>
	)
};

module.exports = App;
export default App;

export const RegisterContext = createContext<{
	registerChar: (func: (x: number, y: number) => { char: string, position: number, color?: string, backgroundColor?: string } | undefined, id: string) => null;
	unregisterChar: (id: string) => void;
}>({
	registerChar: () => null,
	unregisterChar: () => { },
});

const nodes: NodeType[] = [
	{
		id: '1',
		label: "Node 1",
		description: "Foo bar",
		position: { x: 3, y: 0 },
		input: [{ label: "input1" }],
		output: [{ label: "output1" }, { label: "output2" }],
	},
	{
		id: '2',
		label: "Node 2",
		position: { x: 39, y: 9 },
		input: [{ label: "input1" }, { label: "input2" }],
		output: [{ label: "output1" }],
	},
];

export type NodeType = {
	id: string;
	label?: string;
	description?: string;
	position: { x: number, y: number };
	input?: { label?: string }[];
	output?: { label?: string }[];
}