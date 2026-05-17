export type Recipe = {
  title: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  steps: string[];
  nutrition: {
    calories: number;
    proteins: number;
    carbs: number;
    fat: number;
  };
};
