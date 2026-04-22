const fields = [
  { nr: 0, color: "green" },
  { nr: 1, color: "red" },
  { nr: 2, color: "black" },
  { nr: 3, color: "red" },
  { nr: 4, color: "black" },
  { nr: 5, color: "red" },
  { nr: 6, color: "black" },
  { nr: 7, color: "red" },
  { nr: 8, color: "black" },
  { nr: 9, color: "red" },
  { nr: 10, color: "black" },
  { nr: 11, color: "black" },
  { nr: 12, color: "red" },
  { nr: 13, color: "black" },
  { nr: 14, color: "red" },
  { nr: 15, color: "black" },
  { nr: 16, color: "red" },
  { nr: 17, color: "black" },
  { nr: 18, color: "red" },
  { nr: 19, color: "red" },
  { nr: 20, color: "black" },
  { nr: 21, color: "red" },
  { nr: 22, color: "black" },
  { nr: 23, color: "red" },
  { nr: 24, color: "black" },
  { nr: 25, color: "red" },
  { nr: 26, color: "black" },
  { nr: 27, color: "red" },
  { nr: 28, color: "black" },
  { nr: 29, color: "black" },
  { nr: 30, color: "red" },
  { nr: 31, color: "black" },
  { nr: 32, color: "red" },
  { nr: 33, color: "black" },
  { nr: 34, color: "red" },
  { nr: 35, color: "black" },
  { nr: 36, color: "red" },
];

const bets = {
  even: {
    payout: 1,
    winningRolls: fields
      .filter((field) => field.nr % 2 == 0 && field.nr != 0)
      .map((field) => field.nr),
  },
  odd: {
    payout: 1,
    winningRolls: fields
      .filter((field) => field.nr % 2 == 1)
      .map((field) => field.nr),
  },
  red: {
    payout: 1,
    winningRolls: fields
      .filter((field) => field.color == "red")
      .map((field) => field.nr),
  },
  black: {
    payout: 1,
    winningRolls: fields
      .filter((field) => field.color == "black")
      .map((field) => field.nr),
  },
  low: {
    payout: 1,
    winningRolls: fields
      .filter((field) => field.nr >= 1 && field.nr <= 18)
      .map((field) => field.nr),
  },
  high: {
    payout: 1,
    winningRolls: fields
      .filter((field) => field.nr >= 19 && field.nr <= 36)
      .map((field) => field.nr),
  },
  dozen1: {
    payout: 2,
    winningRolls: fields
      .filter((field) => field.nr >= 1 && field.nr <= 12)
      .map((field) => field.nr),
  },
  dozen2: {
    payout: 2,
    winningRolls: fields
      .filter((field) => field.nr >= 13 && field.nr <= 24)
      .map((field) => field.nr),
  },
  dozen3: {
    payout: 2,
    winningRolls: fields
      .filter((field) => field.nr >= 25 && field.nr <= 36)
      .map((field) => field.nr),
  },
  ...fields.map((field) => {
    return { payout: 35, winningRolls: [field.nr] };
  }),
};
