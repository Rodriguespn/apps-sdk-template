import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { Language, Difficulty, Flashcard } from "@study-buddy/shared";

export type CreateFlashcardDeckInput = {
  studyLanguage?: Language;
  deckLength?: number;
  difficulty?: Difficulty;
};

export type StartStudySessionInput = {
  studyLanguage: Language;
  difficulty: Difficulty;
  deck: Flashcard[];
};

export async function handleCreateFlashcardDeck({
  studyLanguage,
  deckLength,
  difficulty,
}: CreateFlashcardDeckInput): Promise<CallToolResult> {
  try {
    const finalLanguage = studyLanguage ?? "spanish";
    const finalLength = deckLength ?? 10;
    const finalDifficulty = difficulty ?? "beginner";

    return {
      structuredContent: {
        studyLanguage: finalLanguage,
        deckLength: finalLength,
        difficulty: finalDifficulty,
      },
      content: [
        {
          type: "text",
          text: `Deck configuration received: ${finalLength} ${finalLanguage} flashcards at ${finalDifficulty} level. Now generate a flashcard deck with appropriate vocabulary and call startStudySession with the generated deck.`,
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
}

export async function handleStartStudySession({
  studyLanguage,
  difficulty,
  deck,
}: StartStudySessionInput): Promise<CallToolResult> {
  try {
    return {
      structuredContent: {
        studyLanguage,
        difficulty,
        deck,
      },
      content: [
        {
          type: "text",
          text: `Study session started with ${deck.length} ${studyLanguage} flashcards at ${difficulty} level. Widget shown with interactive flashcards for studying.`,
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
}
