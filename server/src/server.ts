import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { McpServer } from "skybridge/server";

const server = new McpServer(
  {
    name: "flashcard-app",
    version: "0.0.1",
  },
  { capabilities: {} },
);

// Widget for creating a new flashcard deck
server.widget(
  "createFlashcardDeck",
  {
    description: "Create a new flashcard deck with customizable language, difficulty, and length",
  },
  {
    description:
      "Use this tool to help the user configure and create a new flashcard deck. The user can specify the language they want to study, the difficulty level, and how many cards they want in their deck.",
    inputSchema: {
      studyLanguage: z
        .enum(["spanish", "french", "german", "italian", "portuguese"])
        .optional()
        .describe("Language for the flashcard deck. Options: spanish, french, german, italian, portuguese"),
      deckLength: z
        .number()
        .int()
        .min(1)
        .max(200)
        .optional()
        .describe("Number of flashcards to include in the deck. Common options: 5, 10, 15, 20, 25, 30, 40, 50. Range: 1-200"),
      difficulty: z
        .enum(["beginner", "intermediate", "advanced"])
        .optional()
        .describe("Difficulty level of the flashcards. Options: beginner, intermediate, advanced"),
    },
  },
  async ({ studyLanguage, deckLength, difficulty }): Promise<CallToolResult> => {
    try {
      return {
        structuredContent: {
          studyLanguage: studyLanguage ?? "spanish",
          deckLength: deckLength ?? 10,
          difficulty: difficulty ?? "beginner",
        },
        content: [
          {
            type: "text",
            text: `Widget shown to configure flashcard deck settings. User can select language, difficulty level, and number of cards.`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error}` }],
        isError: true,
      };
    }
  },
);

// Widget for starting a study session
server.widget(
  "startStudySession",
  {
    description: "Start a language flashcard study session",
  },
  {
    description:
      "Use this tool to start a study session with flashcards. This should be called after the user has configured their deck preferences or when they want to begin studying. If studyLanguage, deckLength, or difficulty are not provided, call createFlashcardDeck first to help the user configure their deck.",
    inputSchema: {
      studyLanguage: z
        .enum(["spanish", "french", "german", "italian", "portuguese"])
        .describe("Language for the study session. Options: spanish, french, german, italian, portuguese"),
      deckLength: z
        .number()
        .int()
        .min(1)
        .max(200)
        .describe("Number of flashcards in the study session. Common options: 5, 10, 15, 20, 25, 30, 40, 50. Range: 1-200"),
      difficulty: z
        .enum(["beginner", "intermediate", "advanced"])
        .describe("Difficulty level of the flashcards. Options: beginner, intermediate, advanced"),
    },
  },
  async ({ studyLanguage, deckLength, difficulty }): Promise<CallToolResult> => {
    try {
      return {
        structuredContent: {
          studyLanguage,
          deckLength,
          difficulty,
        },
        content: [
          {
            type: "text",
            text: `Study session started with ${deckLength} ${studyLanguage} flashcards at ${difficulty} level. Widget shown with interactive flashcards for studying.`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error}` }],
        isError: true,
      };
    }
  },
);

export default server;
