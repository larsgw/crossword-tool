# Crossword Tool

Tool to display mini crosswords.

## File format

Crossword files are expected as JSON files with the following format:

| Property | Type | Description |
|----------|------|-------------|
|`id`      |`string`|Unique ID|
|`constructors`|`array<string>`|List of name(s) of crossword constructor(s)|
|`editor`  |`string`|If different, name of crossword editor|
|`publicationDate`|`string`|Crossword publication date (`YYYY-MM-DD`)|
|`body`    |[`array<CrosswordBody>`](#crossword-body)|Single-item list containing the specific crossword|

### Crossword body

| Property | Type | Description |
|----------|------|-------------|
|`cells`   |[`array<CrosswordCell>`](#crossword-cell)|List of cells|
|`clues`   |[`array<CrosswordClue>`](#crossword-clue)|List of clues|
|`clueLists`|[`array<CrosswordClueList>`](#crossword-clue-list)|List of clue lists (e.g. "across" and "down")|
|`dimensions`|`object`|Object with integer properties `width` and `height` specifying the dimensions of the board in number of cells|

### Crossword clue list

| Property | Type | Description |
|----------|------|-------------|
|`name`    |`string`|Name for this list of clues (e.g. "across" and "down")|
|`clues`   |`array<number>`|List of numbers corresponding to clue indices|

### Crossword clue

| Property | Type | Description |
|----------|------|-------------|
|`label`   |`string`|Short label for the clue (usually numeric)|
|`direction`|`string`|`"Across"` or `"Down"`|
|`text`|[`array<CrosswordClueText>`](#crossword-clue-text)|Single-item list containing the clue text|
|`cells`   |`array<number>`|List of numbers corresponding to cell indices|
|`relatives`|`array<number>`|Optionally, a list of numbers corresponding to indices of related clues|

### Crossword clue text

| Property | Type | Description |
|----------|------|-------------|
|`formatted`|`string`|HTML|
|`plain`   |`string`|Plain text|

### Crossword cell

| Property | Type | Description |
|----------|------|-------------|
|`label`   |`string`|Short label for the cell (if applicable; usually numeric)|
|`type`    |`number`|`0` for black cells, `1` for white cells|
|`answer`  |`string`|Letter to be filled in the cell (if applicable)|
|`clues`   |`array<number>`|List of numbers corresponding to clue indices (if applicable)|
