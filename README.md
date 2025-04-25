# Zed Turbo Console Log

A Zed editor extension that mimics the functionality of the popular VS Code extension "Turbo Console Log". This extension automates the process of writing meaningful console.log messages.

## Features

- Automatically insert console.log statements for variables/objects
- Format logs with descriptive labels including file name and line number
- Quick insertion with keyboard shortcuts
- Delete all inserted console.logs with a single command

## Installation

1. Clone this repository to your Zed extensions directory:
   \`\`\`
   git clone https://github.com/akickbush/zed-turbo-console-log ~/.config/zed/extensions/turbo-console-log
   \`\`\`

2. Restart Zed editor

## Usage

### Insert Console Log

1. Select a variable or place your cursor on a variable
2. Press `Cmd+Opt+L` (Mac) or `Ctrl+Alt+L` (Windows/Linux)
3. A formatted console.log will be inserted on the next line

Example:
\`\`\`javascript
const user = { name: 'John', age: 30 };
// After using the shortcut:
const user = { name: 'John', age: 30 };
console.log('🚀 example.js:2 - user: 🚀', user);
\`\`\`

### Delete All Console Logs

1. Press `Cmd+Opt+D` (Mac) or `Ctrl+Alt+D` (Windows/Linux)
2. All console.logs inserted by this extension will be removed

## Configuration

You can customize the extension by modifying the `config` object in the `turbo_log.js` file:

- `logMessagePrefix`: Prefix for the log message (default: '🚀 ')
- `logMessageSuffix`: Suffix for the log message (default: ' 🚀')
- `wrapLogMessage`: Whether to wrap the log message with prefix and suffix (default: true)
- `logFunction`: The logging function to use (default: 'console.log')
- `quoteStyle`: Quote style for strings ('single' or 'double', default: 'single')
- `includeFileInfo`: Whether to include file name in the log message (default: true)
- `includeLineInfo`: Whether to include line number in the log message (default: true)
- `delimiterInsideMessage`: Delimiter between variable name and its value (default: ':')
- `includeTimestamp`: Whether to include timestamp in the log message (default: false)

## License

MIT
