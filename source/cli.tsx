#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
// import meow from 'meow';
import App from './ui';

// const cli = meow(`
// 	Usage
// 	  $ terminal-node-scripting

// 	Options
// 		--name  Your name

// 	Examples
// 	  $ terminal-node-scripting --name=Jane
// 	  Hello, Jane
// `, {
// 	flags: {
// 		name: {
// 			type: 'string'
// 		}
// 	}
// });

render(<App/>);
