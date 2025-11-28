import { z } from "zod";
import { McpServer } from "skybridge/server";
import { LanguageSchema, DifficultySchema, LANGUAGES, DIFFICULTIES } from "@study-buddy/shared";
import {
  handleSelectDeck,
  handleSaveDeck,
  handleStartStudySessionFromDeck,
  handleStartStudySessionFromScratch,
} from "./handlers.js";

const server = new McpServer(
  {
    name: "flashcard-app",
    version: "0.0.1",
  },
  { capabilities: {} }
);

// Widget for selecting an existing deck or creating a new one
server.widget(
  "selectDeck",
  {
    description: "Display user's flashcard decks with option to create new ones",
  },
  {
    description:
      "Use this tool when the user wants to study flashcards. It displays all their saved decks and a button to create a new deck. When the user selects a deck, call startStudySessionFromDeck with that deck's ID. When the user clicks 'Create New Deck', generate flashcards based on user preferences and call saveDeck to save the deck.",
    inputSchema: {
      userId: z.string().optional().describe("User ID (optional, uses default if not provided)"),
    },
  },
  handleSelectDeck
);

// Tool for saving a deck to the database
server.tool(
  "saveDeck",
  "Use this tool to save a flashcard deck to the database",
  {
    name: z.string().describe("Name for the deck (e.g., 'French Beginner - Food & Drinks')"),
    language: LanguageSchema.describe(`Language of the deck. Options: ${LANGUAGES.join(", ")}`),
    difficulty: DifficultySchema.describe(`Difficulty level. Options: ${DIFFICULTIES.join(", ")}`),
    cards: z
      .array(
        z.object({
          word: z.string().describe("The word or phrase in the target language"),
          translation: z.string().describe("The translation in English"),
        })
      )
      .describe("Array of flashcards to save"),
  },
  handleSaveDeck
);

// Widget for starting a study session from a saved deck
server.widget(
  "startStudySessionFromDeck",
  {
    description: "Start a language flashcard study session from a saved deck",
  },
  {
    description:
      "Use this tool to start a study session by loading a saved deck from the database. Requires the deck ID.",
    inputSchema: {
      deckId: z.string().uuid().describe("ID of a saved deck to load from the database"),
    },
  },
  handleStartStudySessionFromDeck
);

// Widget for starting a study session with deck data provided directly
server.widget(
  "startStudySessionFromScratch",
  {
    description: "Start a language flashcard study session with provided deck data",
  },
  {
    description:
      "Use this tool to start a study session with flashcard data provided directly. Use this after generating flashcards and saving the deck.",
    inputSchema: {
      studyLanguage: LanguageSchema.describe(
        `Language for the study session. Options: ${LANGUAGES.join(", ")}`
      ),
      difficulty: DifficultySchema.describe(
        `Difficulty level. Options: ${DIFFICULTIES.join(", ")}`
      ),
      deck: z
        .array(
          z.object({
            word: z.string().describe("The word or phrase in the target language"),
            translation: z.string().describe("The translation of the word in English"),
          })
        )
        .describe("Array of flashcards to study"),
    },
  },
  handleStartStudySessionFromScratch
);

// Prompt for creating a new French study session
server.prompt(
  "study-french-beginner",
  "Create a new study session to study french with a deck with 10 cards and difficulty beginner",
  () => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "Create a new study session to study french with a deck with 10 cards and difficulty beginner",
        },
      },
    ],
  })
);

export default server;
