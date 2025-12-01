import { quizQuestions } from "@/data/onboarding/quizQuestions";

export function getQuestionTitle(questionId: string): string {
  const question = quizQuestions.find((q) => q.id === questionId);
  return question?.title || questionId;
}

export function formatAnswer(
  answer: string | string[] | number,
  questionId: string
): string {
  const question = quizQuestions.find((q) => q.id === questionId);
  if (!question) return String(answer);

  if (question.type === "slider" && typeof answer === "number") {
    return `${answer} ${question.unit || ""}`;
  }

  if (Array.isArray(answer)) {
    if (question.type === "multiple" && question.options) {
      return answer
        .map((a) => {
          const option = question.options?.find((o) => o.value === a);
          return option?.label || a;
        })
        .join(", ");
    }
    return answer.join(", ");
  }

  if (question.type === "single" && question.options) {
    const option = question.options.find((o) => o.value === answer);
    return option?.label || String(answer);
  }

  return String(answer);
}
