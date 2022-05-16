# nodetmp

An alternative to ejs.

## Installation

```bash
npm i nodetmp
```

## Usage

```js
import { compile } from "nodetmp";

const output = compile(pathOfInputFile, dataObje);

console.log(output.output); // compiled output

output.write(pathForOutput); // write file at given location
```

## template

```html
{:if condtion}
<!-- body -->
{/if} {:each array as item,id}
<!-- body -->
{/each}
```

## License

MIT
