/**
 * AI services layer — provider-based, switchable via AI_PROVIDER env.
 * Interfaces: transcribe, summarize, translate, aiSignal.
 * MVP: mock provider with deterministic demo outputs.
 */

export type TranscriptSegment = { start: number; end: number; text: string };

export type TranscribeResult = {
  transcript: string;
  segments: TranscriptSegment[];
};

export type SummarizeResult = {
  summary: string;
  evidence: { quote: string; timestamp: string }[];
  mappedTraits: Record<string, string>;
  risks: string[];
};

export type TranslateResult = { translatedText: string };

export type AiSignalResult = {
  band: "LOW" | "MED" | "HIGH";
  score: number;
  reasons: string[];
};

export interface AiProvider {
  transcribeAudio(file: File | Buffer): Promise<TranscribeResult>;
  summarizeTranscript(
    transcript: string,
    _roleProfileId?: string
  ): Promise<SummarizeResult>;
  translate(text: string, from: string, to: string): Promise<TranslateResult>;
  aiSignal(text: string): Promise<AiSignalResult>;
}

const mockProvider: AiProvider = {
  async transcribeAudio(): Promise<TranscribeResult> {
    return {
      transcript:
        "Interviewer: Tell me about a time you led a project.\nCandidate: I led a cross-functional team during a product launch. We had a two-week delay. I realigned priorities and we shipped on the new date.",
      segments: [
        { start: 0, end: 5, text: "Interviewer: Tell me about a time you led a project." },
        { start: 5, end: 25, text: "Candidate: I led a cross-functional team during a product launch." },
      ],
    };
  },

  async summarizeTranscript(transcript: string): Promise<SummarizeResult> {
    return {
      summary:
        "Candidate demonstrated leadership and ownership. Provided a concrete example of leading under pressure with clear outcomes.",
      evidence: [
        { quote: "I led a cross-functional team during a product launch", timestamp: "00:08" },
        { quote: "we shipped on the new date", timestamp: "00:22" },
      ],
      mappedTraits: {
        "Leadership Drive": "Led team under pressure",
        "Accountability": "Shipped on committed date",
      },
      risks: [],
    };
  },

  async translate(text: string, from: string, to: string): Promise<TranslateResult> {
    if (to === "de") {
      return {
        translatedText:
          "[DE] " +
          text.slice(0, 80) +
          (text.length > 80 ? "…" : "") +
          " — Übersetzung (Mock).",
      };
    }
    return { translatedText: text };
  },

  async aiSignal(text: string): Promise<AiSignalResult> {
    const lower = text.toLowerCase();
    const hasConclusion = lower.includes("in conclusion") || lower.includes("moving forward");
    const hasGeneric = lower.includes("comprehensive") || lower.includes("key initiatives");
    if (hasConclusion && hasGeneric) {
      return {
        band: "HIGH",
        score: 0.85,
        reasons: [
          "Conclusion-led phrasing",
          "Generic corporate vocabulary",
        ],
      };
    }
    if (lower.includes("i ") && lower.includes("about four hours")) {
      return {
        band: "LOW",
        score: 0.2,
        reasons: ["First-person narrative", "Concrete time estimate"],
      };
    }
    return {
      band: "MED",
      score: 0.5,
      reasons: ["Mixed signals — not definitive"],
    };
  },
};

let _provider: AiProvider = mockProvider;

export function getAiProvider(): AiProvider {
  return _provider;
}

export function setAiProvider(p: AiProvider): void {
  _provider = p;
}

export async function transcribeAudio(file: File | Buffer): Promise<TranscribeResult> {
  return getAiProvider().transcribeAudio(file);
}

export async function summarizeTranscript(
  transcript: string,
  roleProfileId?: string
): Promise<SummarizeResult> {
  return getAiProvider().summarizeTranscript(transcript, roleProfileId);
}

export async function translate(
  text: string,
  from: string,
  to: string
): Promise<TranslateResult> {
  return getAiProvider().translate(text, from, to);
}

export async function aiSignal(text: string): Promise<AiSignalResult> {
  return getAiProvider().aiSignal(text);
}
