import Dexie, { Table } from "dexie";
import {
  dexieIngredientSchema,
  Ingredient,
  IngredientInterface,
} from "./models/ingredient";
import {
  dexieIngredientInRecipeSchema,
  IngredientInRecipe,
  IngredientInRecipeInterface,
} from "./models/ingredient-in-recipe";
import { dexieRecipeSchema, Recipe, RecipeInterface } from "./models/recipe";

export interface QueryParameters {
  limit: number;
  offset: number;
}

export class Database extends Dexie {
  private static database: Database;

  public static shared(): Database {
    if (!Database.database) {
      Database.database = new Database();
    }

    return Database.database;
  }

  constructor(
    private ingredientsTable?: Table<IngredientInterface, string>,
    private recipesTable?: Table<RecipeInterface, string>,
    private ingredientInRecipesTable?: Table<
      IngredientInRecipeInterface,
      string
    >
  ) {
    super("MealPlannerDatabase");

    this.version(13).stores({
      ingredientsTable: dexieIngredientSchema,
      recipesTable: dexieRecipeSchema,
      ingredientInRecipesTable: dexieIngredientInRecipeSchema,
    });

    this.ingredientsTable?.mapToClass(Ingredient);
    this.recipesTable?.mapToClass(Recipe);
    this.ingredientInRecipesTable?.mapToClass(IngredientInRecipe);
  }

  /* Ingredients CRUD */

  async putIngredient(ingredient: IngredientInterface) {
    return await this.ingredientsTable?.put(ingredient);
  }

  async getIngredient(ingredientId: string) {
    return await this.ingredientsTable?.get(ingredientId);
  }

  async countOfIngredients() {
    return (await this.ingredientsTable?.count()) ?? 0;
  }

  async arrayOfIngredients(parameters: QueryParameters) {
    console.log(parameters);
    return await this.ingredientsTable
      ?.offset(parameters.offset)
      .limit(parameters.limit)
      .toArray();
  }

  async filteredIngredients(query: string) {
    return this.ingredientsTable
      ?.filter((obj) => {
        return new RegExp(".*" + query.split("").join(".*") + ".*").test(
          obj.name
        );
      })
      .toArray();
  }

  async updateIngredient(ingredient: IngredientInterface) {
    return await this.ingredientsTable?.update(ingredient.id, ingredient);
  }

  async deleteIngredient(ingredientId: string) {
    await this.ingredientsTable?.delete(ingredientId);
    await this.ingredientInRecipesTable
      ?.where("ingredientId")
      .equals(ingredientId)
      .delete();
  }

  /* Recipes CRUD */

  async putRecipe(recipe: RecipeInterface) {
    return await this.recipesTable?.put(recipe);
  }

  async getRecipe(recipeId: string) {
    return await this.recipesTable?.get(recipeId);
  }

  async arrayOfRecipes() {
    return await this.recipesTable?.toArray();
  }

  async updateRecipe(recipe: RecipeInterface) {
    return await this.recipesTable?.update(recipe.id, recipe);
  }

  async deleteRecipe(recipeId: string) {
    await Database.shared().recipesTable?.delete(recipeId);
    await Database.shared()
      .ingredientInRecipesTable?.where("recipeId")
      .equals(recipeId)
      .delete();
  }

  /* Ingredient in recipe CRUD */

  async putIngredientInRecipe(ingredientInRecipe: IngredientInRecipeInterface) {
    return await this.ingredientInRecipesTable?.put(ingredientInRecipe);
  }

  async ingredientsInRecipeArray(recipeId: string) {
    return await this.ingredientInRecipesTable?.where({ recipeId }).toArray();
  }
}

// async getRecipeMacronutrients(
//   recipeId: string
// ): Promise<MacronutrientInterface> {
//   const ingredientsInRecipe = await this.ingredientsInRecipeArray(recipeId);
//   const ingredients = (await this.ingredientsTable?.bulkGet(
//     ingredientsInRecipe.map((value) => {
//       return value.ingredientId;
//     })
//   )) as Array<Ingredient>;

//   const macros = ingredients.reduce(
//     (previousValue, currentValue) => {
//       return {
//         massGrams: previousValue.massGrams + currentValue.servingMassGrams,
//         energyKilocalorie:
//           previousValue.energyKilocalorie +
//           currentValue.servingEnergyKilocalorie,
//         fatGrams: previousValue.fatGrams + currentValue.servingFatGrams,
//         carbohydrateGrams:
//           previousValue.carbohydrateGrams +
//           currentValue.servingCarbohydrateGrams,
//         proteinGrams:
//           previousValue.proteinGrams + currentValue.servingProteinGrams,
//       };
//     },
//     {
//       massGrams: 0,
//       energyKilocalorie: 0,
//       fatGrams: 0,
//       carbohydrateGrams: 0,
//       proteinGrams: 0,
//     } as MacronutrientInterface
//   );

//   return macros;
// }
