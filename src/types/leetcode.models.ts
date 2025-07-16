export type LeetcodeGraphqlWrapper<T> = {
  data: T;
  errors: Array<{ message: string }>;
};

export type ActiveDailyCodingChallengeQuestion = {
  activeDailyCodingChallengeQuestion: {
    link: string;
    date: string;
  };
};
