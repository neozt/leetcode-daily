export const DAILY_QUESTION_QUERY = `
query getDailyProblem {
  activeDailyCodingChallengeQuestion {
      date
      link
  }
}
`;
