export type LeetcodeResponse<T> = {
  data: T;
};

export type ActiveDailyCodingChallengeQuestionResponse =
  LeetcodeResponse<ActiveDailyCodingChallengeQuestion>;

export type ActiveDailyCodingChallengeQuestion = {
  activeDailyCodingChallengeQuestion: {
    link: string;
    date: string;
  };
};
