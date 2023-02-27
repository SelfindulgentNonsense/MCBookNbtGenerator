function formatBook()
{
    var content = document.getElementById('content').value;

    const CHARACTER_WIDTHS = {
      ' ': 4, '!': 2, '"': 5, '#': 6, '$': 6, '%': 6, '&': 6, '\'': 3, '(': 5, ')': 5,
      '*': 5, '+': 6, ',': 2, '-': 6, '.': 2, '/': 6, '0': 6, '1': 6, '2': 6, '3': 6,
      '4': 6, '5': 6, '6': 6, '7': 6, '8': 6, '9': 6, ':': 2, ';': 2, '<': 5, '=': 6,
      '>': 5, '?': 6, '@': 7, 'A': 6, 'B': 6, 'C': 6, 'D': 6, 'E': 6, 'F': 6, 'G': 6,
      'H': 6, 'I': 4, 'J': 6, 'K': 6, 'L': 6, 'M': 6, 'N': 6, 'O': 6, 'P': 6, 'Q': 6,
      'R': 6, 'S': 6, 'T': 6, 'U': 6, 'V': 6, 'W': 6, 'X': 6, 'Y': 6, 'Z': 6, '[': 4,
      '\\': 6, ']': 4, '^': 6, '_': 6, '`': 0, 'a': 6, 'b': 6, 'c': 6, 'd': 6, 'e': 6,
      'f': 5, 'g': 6, 'h': 6, 'i': 2, 'j': 6, 'k': 5, 'l': 3, 'm': 6, 'n': 6, 'o': 6,
      'p': 6, 'q': 6, 'r': 6, 's': 6, 't': 4, 'u': 6, 'v': 6, 'w': 6, 'x': 6, 'y': 6,
      'z': 6, '{': 5, '|': 2, '}': 5, '~': 7,
    };
  
    let formattedBook = ''; // result string
    let line = 1; // the current line we're on
    let pixels = 0; // the number of pixels we've used on the current line
  
    for (let i = 0; i < content.length; i++) {
        const char = content.charAt(i);
        const width = CHARACTER_WIDTHS[char] || 7; // assume 7 pixels for unknown characters
  
        if (char === '\n') { // handle newlines in text input
            line++;
            pixels = 0;
            formattedBook += '\\\\\\\\n'; // i know this looks wrong but it works. trust me i struggled with this for a solid hour.
            if (line === 15) {
                line = 1;
                pixels = 0;
                formattedBook += `\\"}', '{\\"text\\":\\"`;
            }
        } else if (pixels + width > 114) { // handle wrapping to new line
            while (content.charAt(i) != ' ') {
                i--;
                formattedBook = formattedBook.slice(0, -1); // remove last character
            }
            if (line === 14) {
                formattedBook += `\\"}', '{\\"text\\":\\"`; // handle wrapping to new page
                line = 1;
            } else {
                formattedBook += '\\\\\\\\n';
                line++;
            }
            pixels = 0;
        } else {
            if (char !== '{' && char !== '}' && char !== '[' && char !== ']' && char !== '\\' && char !== '"' && char !== "'") {
                formattedBook += char;
                pixels += width;
            }
        }
    }

    return formattedBook;
}

function generateLoottable()
{
    // GENERAL
    var tabletype = document.getElementById('pooltype').value;

    // BOOK INFO
    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value;
    var generation = document.getElementById('generationSelect').value;
    var content = document.getElementById('content').value;

    // LORE
    var lore = document.getElementById('lore').value;
    var lorecolor = document.getElementById('lorecolor').value;
    var lorebold = document.getElementById('lorebold').checked;
    var loreitalic = document.getElementById('loreitalic').checked;
    var loreunderlined = document.getElementById('loreunderlined').checked;
    var lorestrikethrough = document.getElementById('lorestrikethrough').checked;

    let lootTable =
    `{
        "type": "minecraft:${tabletype}",
        "pools": [
            {
                "rolls": 1,
                "entries": [
                    {
                        "type": "minecraft:item",
                        "name": "minecraft:written_book",
                        "functions": [
                            {
                                "function": "minecraft:set_nbt",
                                "tag": "{pages:['{\\"text\\":\\"${formatBook(content)}\\"}'],title:\\"${title}\\",author:\\"${author}\\",resolved:\\"1b\\",generation:${generation}}"
                            },
                            {
                                "function": "minecraft:set_lore",
                                "entity": "this",
                                "lore": [
                                    {
                                        "text": "${lore}",
                                        "color": "${lorecolor}",
                                        "bold": ${lorebold},
                                        "italic": ${loreitalic},
                                        "underlined": ${loreunderlined},
                                        "strikethrough": ${lorestrikethrough}
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }`

    navigator.clipboard.writeText(lootTable);
}
