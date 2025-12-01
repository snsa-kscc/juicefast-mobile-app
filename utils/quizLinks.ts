const LINK_RULES = [
  {
    condition: (answers: Record<string, string | string[] | number>) => {
      const movementAnswer = answers.movement;
      return movementAnswer === "daily" || movementAnswer === "few_times";
    },
    link: "https://juicefast.com/functional-juices/",
    productInfo: {
      title: "Functional Juices",
      description:
        "Based on your active lifestyle, we think these functional juices will perfectly complement your wellness journey.",
    },
  },
  {
    condition: (answers: Record<string, string | string[] | number>) => {
      const activitiesAnswer = answers.activities;
      return (
        Array.isArray(activitiesAnswer) &&
        (activitiesAnswer.includes("yoga") ||
          activitiesAnswer.includes("pilates"))
      );
    },
    link: "https://juicefast.com/proteins-adaptogens/",
    productInfo: {
      title: "Proteins & Adaptogens",
      description:
        "Based on your interest in yoga and pilates, we think these proteins and adaptogens will support your practice.",
    },
  },
  {
    condition: (answers: Record<string, string | string[] | number>) => {
      const eatingHabitsAnswer = answers.eating_habits;
      return (
        Array.isArray(eatingHabitsAnswer) &&
        (eatingHabitsAnswer.includes("chaotic") ||
          eatingHabitsAnswer.includes("emotional_eater"))
      );
    },
    link: "https://juicefast.com/fasting/",
    productInfo: {
      title: "Fasting Support",
      description:
        "Based on your eating patterns, we think our fasting products will help you build healthier routines.",
    },
  },
];

export function getSelectedLink(
  answers: Record<string, string | string[] | number>
): string {
  const matchingLinks = LINK_RULES.filter((rule) =>
    rule.condition(answers)
  ).map((rule) => rule.link);

  if (matchingLinks.length === 0) {
    return "https://juicefast.com";
  }

  if (matchingLinks.length === 1) {
    return matchingLinks[0];
  }

  const randomIndex = Math.floor(Math.random() * matchingLinks.length);
  return matchingLinks[randomIndex];
}

export function getProductRecommendation(
  answers: Record<string, string | string[] | number>
): { title: string; description: string; link: string } {
  const selectedLink = getSelectedLink(answers);

  const matchingRule = LINK_RULES.find((rule) => rule.link === selectedLink);

  if (!matchingRule) {
    return {
      title: "Recommended Products",
      description:
        "Based on your answers, we think these products best match your wellness goals.",
      link: selectedLink,
    };
  }

  return {
    title: matchingRule.productInfo.title,
    description: matchingRule.productInfo.description,
    link: matchingRule.link,
  };
}
