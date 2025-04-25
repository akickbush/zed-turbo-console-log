const zed = require("zed")

// Configuration options
const config = {
  logMessagePrefix: "🚀 ",
  logMessageSuffix: " 🚀",
  wrapLogMessage: true,
  logFunction: "console.log",
  quoteStyle: "single", // 'single' or 'double'
  includeFileInfo: true,
  includeLineInfo: true,
  delimiterInsideMessage: ":", // The delimiter between variable name and its value
  includeTimestamp: false,
}

// Regex patterns for detecting commented lines
const commentPatterns = {
  javascript: /^\s*(\/\/|\/\*|\*)/,
  python: /^\s*#/,
  ruby: /^\s*#/,
  php: /^\s*(\/\/|\/\*|\*|#)/,
  // Add more languages as needed
}

// Function to get the appropriate comment pattern based on file extension
function getCommentPattern(filePath) {
  const extension = filePath.split(".").pop().toLowerCase()

  switch (extension) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
      return commentPatterns.javascript
    case "py":
      return commentPatterns.python
    case "rb":
      return commentPatterns.ruby
    case "php":
      return commentPatterns.php
    default:
      return commentPatterns.javascript // Default to JavaScript
  }
}

// Function to get the appropriate indentation from the current line
function getIndentation(line) {
  const match = line.match(/^(\s*)/)
  return match ? match[1] : ""
}

// Function to create a console.log statement
function createLogStatement(variableName, filePath, lineNumber, indentation) {
  const quote = config.quoteStyle === "single" ? "'" : '"'

  let logMessage = `${variableName}${config.delimiterInsideMessage} `

  // Add file and line info if configured
  let fileInfo = ""
  if (config.includeFileInfo) {
    const fileName = filePath.split("/").pop()
    fileInfo += `${fileName}`
  }

  if (config.includeLineInfo) {
    fileInfo += fileInfo ? `:${lineNumber}` : `line:${lineNumber}`
  }

  if (fileInfo) {
    logMessage = `${fileInfo} - ${logMessage}`
  }

  // Add timestamp if configured
  if (config.includeTimestamp) {
    logMessage = `[${new Date().toISOString()}] ${logMessage}`
  }

  // Wrap the message if configured
  if (config.wrapLogMessage) {
    logMessage = `${config.logMessagePrefix}${logMessage}${config.logMessageSuffix}`
  }

  return `${indentation}${config.logFunction}(${quote}${logMessage}${quote}, ${variableName});`
}

// Function to detect if a line is commented
function isCommentedLine(line, filePath) {
  const commentPattern = getCommentPattern(filePath)
  return commentPattern.test(line)
}

// Main function to insert console.log
async function insertTurboLog() {
  try {
    const editor = zed.activeTextEditor
    if (!editor) {
      return
    }

    const document = editor.document
    const filePath = document.fileName
    const selection = editor.selection
    const position = selection.active
    const lineNumber = position.line
    const line = document.lineAt(lineNumber).text

    // Skip if the line is commented
    if (isCommentedLine(line, filePath)) {
      zed.window.showInformationMessage("Cannot insert console.log in a commented line")
      return
    }

    // Get the selected text or the word at cursor
    let selectedText = ""
    if (!selection.isEmpty) {
      selectedText = document.getText(selection)
    } else {
      // Get the word at cursor position
      const wordRange = document.getWordRangeAtPosition(position)
      if (wordRange) {
        selectedText = document.getText(wordRange)
      }
    }

    if (!selectedText) {
      zed.window.showInformationMessage("No variable selected")
      return
    }

    const indentation = getIndentation(line)
    const logStatement = createLogStatement(selectedText, filePath, lineNumber + 1, indentation)

    // Insert the log statement after the current line
    await editor.edit((editBuilder) => {
      editBuilder.insert(new zed.Position(lineNumber + 1, 0), logStatement + "\n")
    })
  } catch (error) {
    zed.window.showErrorMessage(`Error: ${error.message}`)
  }
}

// Function to delete all console.logs
async function deleteTurboLogs() {
  try {
    const editor = zed.activeTextEditor
    if (!editor) {
      return
    }

    const document = editor.document
    const text = document.getText()

    // Regex to match console.log statements with our prefix/suffix
    const logPattern = new RegExp(
      `${config.logFunction}\$$(['"]).*?${config.logMessagePrefix}.*?${config.logMessageSuffix}.*?\\1,.*?\$$;?`,
      "g",
    )

    // Replace all matching console.logs with empty string
    const newText = text.replace(logPattern, "")

    // Replace the entire document text
    const fullRange = new zed.Range(
      new zed.Position(0, 0),
      new zed.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length),
    )

    await editor.edit((editBuilder) => {
      editBuilder.replace(fullRange, newText)
    })

    // Clean up empty lines
    await editor.edit((editBuilder) => {
      for (let i = document.lineCount - 1; i >= 0; i--) {
        const line = document.lineAt(i)
        if (line.text.trim() === "") {
          editBuilder.delete(new zed.Range(new zed.Position(i, 0), new zed.Position(i + 1, 0)))
        }
      }
    })

    zed.window.showInformationMessage("All turbo console.logs deleted")
  } catch (error) {
    zed.window.showErrorMessage(`Error: ${error.message}`)
  }
}

// Register commands
zed.commands.registerCommand("turbo_log", insertTurboLog)
zed.commands.registerCommand("turbo_log_delete", deleteTurboLogs)

// Export for testing
module.exports = {
  insertTurboLog,
  deleteTurboLogs,
  createLogStatement,
}
