import { describe, it, expect } from "vitest";
import { handleCreateFlashcardDeck, handleStartStudySession } from "../handlers.js";

describe("createFlashcardDeck handler", () => {
  it("returns default values when no input provided", async () => {
    const result = await handleCreateFlashcardDeck({});

    expect(result.isError).toBe(false);
    expect(result.structuredContent).toEqual({
      studyLanguage: "spanish",
      deckLength: 10,
      difficulty: "beginner",
    });
  });

  it("returns provided values when input is given", async () => {
    const result = await handleCreateFlashcardDeck({
      studyLanguage: "french",
      deckLength: 25,
      difficulty: "advanced",
    });

    expect(result.isError).toBe(false);
    expect(result.structuredContent).toEqual({
      studyLanguage: "french",
      deckLength: 25,
      difficulty: "advanced",
    });
    expect(result.content).toEqual([
      {
        type: "text",
        text: "Deck configuration received: 25 french flashcards at advanced level. Now generate a flashcard deck with appropriate vocabulary and call startStudySession with the generated deck.",
      },
    ]);
  });
});

describe("startStudySession handler", () => {
  it("returns provided values with empty deck", async () => {
    const result = await handleStartStudySession({
      studyLanguage: "german",
      difficulty: "intermediate",
      deck: [],
    });

    expect(result.isError).toBe(false);
    expect(result.structuredContent).toEqual({
      studyLanguage: "german",
      difficulty: "intermediate",
      deck: [],
    });
    expect(result.content).toEqual([
      {
        type: "text",
        text: "Study session started with 0 german flashcards at intermediate level. Widget shown with interactive flashcards for studying.",
      },
    ]);
  });

  it("returns provided values with flashcards", async () => {
    const deck = [
      { word: "bonjour", translation: "hello" },
      { word: "merci", translation: "thank you" },
    ];

    const result = await handleStartStudySession({
      studyLanguage: "french",
      difficulty: "beginner",
      deck,
    });

    expect(result.isError).toBe(false);
    expect(result.structuredContent).toEqual({
      studyLanguage: "french",
      difficulty: "beginner",
      deck,
    });
    expect(result.content).toEqual([
      {
        type: "text",
        text: "Study session started with 2 french flashcards at beginner level. Widget shown with interactive flashcards for studying.",
      },
    ]);
  });
});
