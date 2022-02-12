# nodetemplate

An alternative to ejs.


## Installation

```bash
npm i nodetemplate
```


## Usage

```js
import { compile } from 'nodetemplate'
 
const output = compile(pathOfInputFile, dataObje)

console.log(output.output) // compiled output

output.write(pathForOutput) // write file at given location

```


## License

MIT
