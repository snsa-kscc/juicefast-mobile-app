export type QuizQuestionType = {
  id: string;
  type: "single" | "multiple" | "text" | "input" | "slider";
  title: string;
  description?: string;
  options?: { value: string; label: string; icon?: string }[];
  placeholder?: string;
  nextButtonText?: string;
  min?: number;
  max?: number;
  unit?: string;
  step?: number;
  maxSelections?: number;
  questionNumber?: number;
  totalQuestions?: number;
};

export const quizQuestions: QuizQuestionType[] = [
  {
    id: "goal",
    type: "multiple",
    title: "What's your goal right now?",
    description: "I want to...",
    questionNumber: 1,
    totalQuestions: 13,
    maxSelections: 3,
    options: [
      { value: "lose_weight", label: "Lose weight" },
      { value: "support_digestion", label: "Support digestion" },
      { value: "sleep_better", label: "Sleep better" },
      { value: "boost_energy", label: "Boost energy" },
      { value: "improve_skin_hair", label: "Improve skin & hair" },
      { value: "balance_hormones", label: "Balance hormones" },
      { value: "build_healthy_habits", label: "Build healthy habits" },
    ],
    nextButtonText: "Next question",
  },
  {
    id: "current_weight",
    type: "slider",
    title: "What is your current weight?",
    description: "It's okay to estimate. You can always change your weight later",
    questionNumber: 2,
    totalQuestions: 13,
    min: 40,
    max: 150,
    unit: "kg",
    step: 1,
    nextButtonText: "Next question",
  },
  {
    id: "target_weight",
    type: "slider",
    title: "What is your target weight?",
    questionNumber: 3,
    totalQuestions: 13,
    min: 40,
    max: 150,
    unit: "kg",
    step: 1,
    nextButtonText: "Next question",
  },
  {
    id: "feeling",
    type: "multiple",
    title: "How do you feel lately?",
    questionNumber: 4,
    totalQuestions: 13,
    maxSelections: 2,
    options: [
      { value: "energized", label: "Energized 😊" },
      { value: "tired", label: "A bit tired 😊" },
      { value: "bloated", label: "Bloated 🙂" },
      { value: "on_fire", label: "On fire 🔥" },
      { value: "sluggish", label: "Sluggish 😴" },
      { value: "anxious", label: "😊 Anxious / stressed" },
    ],
    nextButtonText: "Next question",
  },
  {
    id: "eating_habits",
    type: "multiple",
    title: "And, your eating habits?",
    questionNumber: 5,
    totalQuestions: 13,
    maxSelections: 2,
    options: [
      { value: "balanced", label: "Pretty balanced" },
      { value: "chaotic", label: "Bit chaotic" },
      { value: "snack_a_lot", label: "I snack a lot" },
      { value: "skip_meals", label: "I skip meals" },
      { value: "emotional_eater", label: "Emotional eater" },
    ],
    nextButtonText: "Next question",
  },
  {
    id: "water_intake",
    type: "single",
    title: "How much water you drink daily?",
    questionNumber: 6,
    totalQuestions: 13,
    options: [
      { value: "less_than_1l", label: "Less than 1L" },
      { value: "1_2l", label: "1-2L" },
      { value: "2_3l", label: "2-3L" },
      { value: "3l_plus", label: "3L+" },
    ],
    nextButtonText: "Next question",
  },
  {
    id: "self_time",
    type: "single",
    title: "How much time you get for yourself daily?",
    questionNumber: 7,
    totalQuestions: 13,
    options: [
      { value: "none", label: "None" },
      { value: "less_than_10", label: "Less than 10 minutes" },
      { value: "10_30", label: "10-30 minutes" },
      { value: "more_than_30", label: "More than 30 minutes" },
    ],
    nextButtonText: "Next question",
  },
  {
    id: "supplements",
    type: "single",
    title: "Do you use any supplements?",
    questionNumber: 8,
    totalQuestions: 13,
    options: [
      { value: "regularly", label: "Yes, regularly" },
      { value: "sometimes", label: "Sometimes" },
      { value: "not_yet", label: "Not yet, but to it" },
      { value: "no", label: "Nope" },
    ],
    nextButtonText: "Next question",
  },
  {
    id: "motivation",
    type: "multiple",
    title: "What's driving you?",
    description: "Give us your 'why' it helps us guide you better",
    questionNumber: 9,
    totalQuestions: 13,
    maxSelections: 2,
    options: [
      { value: "for_myself", label: "For myself" },
      { value: "for_family", label: "For my kids or family" },
      { value: "confidence", label: "To feel confident again" },
      { value: "health", label: "To stay healthy long term" },
    ],
    nextButtonText: "Next question",
  },
  {
    id: "timeline",
    type: "single",
    title: "How long are you in for?",
    description: "We work with your timeline, not against it",
    questionNumber: 10,
    totalQuestions: 13,
    options: [
      { value: "quick_reset", label: "Just a quick reset" },
      { value: "1_month", label: "1 months+" },
      { value: "6_months", label: "6 months+" },
      { value: "long_term", label: "Long term transformation" },
      { value: "figuring_out", label: "Still figuring it out" },
    ],
    nextButtonText: "Next question",
  },
  {
    id: "movement",
    type: "single",
    title: "How often do you move?",
    questionNumber: 11,
    totalQuestions: 13,
    options: [
      { value: "daily", label: "Every day" },
      { value: "few_times", label: "Few times a week" },
      { value: "rarely", label: "Rarely" },
      { value: "never", label: "Never" },
    ],
    nextButtonText: "Next question",
  },
  {
    id: "activities",
    type: "multiple",
    title: "Do you do any of these activities?",
    questionNumber: 12,
    totalQuestions: 13,
    maxSelections: 2,
    options: [
      { value: "meditation", label: "Meditation" },
      { value: "yoga", label: "Yoga" },
      { value: "pilates", label: "Pilates" },
      { value: "home_workouts", label: "Home workouts" },
      { value: "gym", label: "Gym" },
      { value: "none", label: "None of the above" },
    ],
    nextButtonText: "Next question",
  },
  {
    id: "allergies",
    type: "multiple",
    title: "Any allergies or dietary preferences?",
    questionNumber: 13,
    totalQuestions: 13,
    maxSelections: 2,
    options: [
      { value: "nuts", label: "Nuts" },
      { value: "gluten", label: "Gluten" },
      { value: "lactose", label: "Lactose" },
      { value: "vegan", label: "Vegan" },
      { value: "vegetarian", label: "Vegetarian" },
      { value: "none", label: "None" },
    ],
    nextButtonText: "Finish onboarding",
  },
];