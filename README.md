# Gamelist Query

Search and filter your game collection from gamelist.xml files (used by [Batocera](https://batocera.org/), [ES-DE](https://es-de.org/), [Rocknix](https://rocknix.org/), and similar frontends based on [EmulationStation](https://github.com/Aloshi/EmulationStation)).  
Gamelist Query helps you find games by name, genre, developer, and any other property found in the gamelist.xml.

https://raohmaru.github.io/gamelist-query/

## Getting Started

### Prerequisites

- **Node.js** (version 22 or higher) for the command-line tool
- A modern web browser for the visual interface

### Installation

1. Clone or download this repository
2. Open the `gamelist-query` folder
3. No build step required — everything works out of the box

## Usage Guide

### Using the Web Interface

1. Open a terminal in the project folder and run `npm run serve`
2. Open http://localhost:8080/ in your web browser
3. Drag and drop your `gamelist.xml` file onto the drop zone, or click to select it
4. Type your search query in the editor (see query examples below)
5. Press the **▶** button or `Enter` to run the search
6. Browse the filtered results in the table
7. Use the column filter to hide/show specific fields
8. Export your results as XML or CSV using the Export button

### Using the Command Line

Open a terminal in the project folder and run:

```bash
npm run query <path/to/gamelist.xml> "<query>"
```

Example:

```bash
npm run query data/gamelist.xml "name ~ Troncho"
```

The command outputs the paths of matching games and a summary count.

### Query Syntax

Queries use a simple format similar to SQL. It defines on or several **conditions** that match game properties with values:

```
<property operator value> [logical_operator <condition2>...]
```

Where `property` is any game property found in the file gamelist.xml.

`operator` is used to compare the property with the value, and is one of the following:

| Operator | Meaning | Example |
|----------|---------|---------|
| `=` | Equals | `genre = Adventure` |
| `!=` | Not equal to | `players != 1` |
| `>` | Greater than | `rating > 0.8` |
| `<` | Less than | `rating < 0.5` |
| `>=` | Greater or equal | `players >= 2` |
| `<=` | Less or equal | `players <= 4` |
| `~` | Contains (text search) | `name ~ Sonic` |
| `!~` | Does not contain | `name !~ Demo` |

To search for missing properties, prefix the property with `!`

Conditions can be joined using **Logical Operators:**:
- `AND` – Both conditions must match
- `OR` – Either condition can match

You can create subqueries by enclosing a query in parentheses `(...)`.

#### Examples

Games with "Sonic" in the title and rating is greater than 0.5.
```
name ~ Sonic AND rating > 0.5
```

Games with number of players greater than 2 and which genre is "Adventure" or games released on 1990 and before.
```
players > 2 AND genre = Adventure OR releasedate <= 1990
```

Games without a region assigned which genre is either "Soccer" or "Basketball".
```
!region AND (genre = Soccer OR genre = Basketball)
```

**Note:** Dates should be in `YYYY-MM-DD` format (e.g., `1996-03-28`).

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

Distributed under the [MIT license](https://github.com/raohmaru/rtkjs/blob/main/LICENSE).
