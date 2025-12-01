export function getRecommendations(
  answers: Record<string, string | string[] | number>
): { title: string; description: string; icon: string }[] {
  const recommendations: {
    title: string;
    description: string;
    icon: string;
  }[] = [];

  // Goal-based recommendation
  const goalAnswer = answers.goal;
  if (Array.isArray(goalAnswer) && goalAnswer.length > 0) {
    if (goalAnswer.includes("lose_weight")) {
      recommendations.push({
        title: "Weight Loss Journey",
        description:
          "Focus on creating a sustainable calorie deficit through balanced nutrition and regular exercise. Track your meals to stay on target.",
        icon: "⬇️",
      });
    } else if (goalAnswer.includes("boost_energy")) {
      recommendations.push({
        title: "Energy Boost",
        description:
          "Prioritize nutrient-dense foods, stay hydrated, and maintain consistent sleep patterns to naturally increase your energy levels.",
        icon: "⚡",
      });
    } else if (goalAnswer.includes("build_healthy_habits")) {
      recommendations.push({
        title: "Healthy Habits",
        description:
          "Start small and build consistency. We'll help you track daily habits that compound into lasting wellness transformation.",
        icon: "🌱",
      });
    } else {
      recommendations.push({
        title: "Wellness Optimization",
        description:
          "Focus on balanced nutrition, regular exercise, and consistent healthy habits to improve your overall well-being.",
        icon: "❤️",
      });
    }
  }

  // Water intake recommendation
  const waterAnswer = answers.water_intake;
  if (waterAnswer === "less_than_1l" || waterAnswer === "1_2l") {
    recommendations.push({
      title: "Hydration Boost",
      description:
        "Aim for 2-3L of water daily. Set reminders or use our water tracking feature to build this healthy habit.",
      icon: "💧",
    });
  } else if (waterAnswer === "2_3l" || waterAnswer === "3l_plus") {
    recommendations.push({
      title: "Great Hydration",
      description:
        "You're maintaining excellent hydration levels! Keep up this healthy habit for optimal body function.",
      icon: "✨",
    });
  }

  // Movement recommendation
  const movementAnswer = answers.movement;
  if (movementAnswer === "rarely" || movementAnswer === "never") {
    recommendations.push({
      title: "Movement Matters",
      description:
        "Start with 150 minutes of moderate exercise per week. Even a 10-minute daily walk can make a significant difference!",
      icon: "🚶",
    });
  } else if (movementAnswer === "daily" || movementAnswer === "few_times") {
    recommendations.push({
      title: "Active Lifestyle",
      description:
        "You're maintaining an excellent activity level! Continue your current routine and consider varying your workouts.",
      icon: "🏃",
    });
  }

  // Eating habits recommendation
  const eatingHabitsAnswer = answers.eating_habits;
  if (
    Array.isArray(eatingHabitsAnswer) &&
    (eatingHabitsAnswer.includes("chaotic") ||
      eatingHabitsAnswer.includes("emotional_eater"))
  ) {
    recommendations.push({
      title: "Mindful Eating",
      description:
        "We'll help you develop a more structured eating routine and track your meals to build healthier patterns.",
      icon: "🥗",
    });
  }

  return recommendations;
}
