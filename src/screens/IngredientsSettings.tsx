import React, {useState} from 'react';
import {View} from 'react-native';
import {IngredientsSettingProp} from "@customTypes/ScreenTypes";
import {ingredientTableElement} from "@customTypes/DatabaseElementTypes";
import SettingsItemList from "@components/organisms/SettingsItemList";
import ItemDialog, {DialogMode} from "@components/dialogs/ItemDialog";
import RecipeDatabase from "@utils/RecipeDatabase";

export default function IngredientsSettings({}: IngredientsSettingProp) {
    const database = RecipeDatabase.getInstance();

    const [ingredients, setIngredients] = useState(database.get_ingredients().sort((a, b) => a.name.localeCompare(b.name)));
    // TODO database could return a sorted array directly


    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'delete'>('add');
    const [selectedIngredient, setSelectedIngredient] = useState<ingredientTableElement>(ingredients[0]);

    const testId = "IngredientsSettings";


    const handleAddIngredient = async (newIngredient: ingredientTableElement) => {
        const insertedIngredient = await database.addIngredient(newIngredient);
        if (insertedIngredient) {
            setIngredients([...ingredients, newIngredient]);
        } else {
            console.warn("Something went wrong while adding ingredient");
        }
    };

    const handleEditIngredient = async (ingredient: ingredientTableElement) => {
        // TODO edit ingredient in the database
        setIngredients(ingredients.map(ing =>
            ing.id === ingredient.id ? ingredient : ing
        ));
    };

    const handleDeleteIngredient = async (ingredient: ingredientTableElement) => {
        if (await database.deleteIngredient(ingredient)) {
            setIngredients(ingredients.filter(ing => ing.id !== ingredient.id));
        } else {
            console.log(`Ingredient ${ingredient} not found`);
        }
    };

    // Open dialog handlers
    const openAddDialog = () => {
        setDialogMode('add');
        setIsDialogOpen(true);
    };

    const openEditDialog = (ingredient: ingredientTableElement) => {
        setSelectedIngredient(ingredient);
        setDialogMode('edit');
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (ingredient: ingredientTableElement) => {
        setSelectedIngredient(ingredient);
        setDialogMode('delete');
        setIsDialogOpen(true);
    };

    // Close dialog handler
    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    // Dialog action handlers
    const handleDialogConfirm = async (mode: DialogMode, newIngredient: ingredientTableElement) => {
        switch (mode) {
            case 'add':
                await handleAddIngredient(newIngredient);
                break;
            case 'edit':
                if (selectedIngredient) {
                    await handleEditIngredient(newIngredient);
                }
                break;
            case 'delete':
                if (selectedIngredient) {
                    await handleDeleteIngredient(newIngredient);

                }
                break;
        }
        setIsDialogOpen(false);
    };

    // TODO add a counter of how many recipes use this element before deleting it
    return (
        <View>
            <SettingsItemList items={ingredients} testIdPrefix={testId}
                              onAddPress={openAddDialog} onEdit={openEditDialog}
                              onDelete={openDeleteDialog} type="ingredient"/>

            {/* Dialog for add/edit/delete operations */}
            {isDialogOpen ?
                <ItemDialog onClose={closeDialog} testId={testId} mode={dialogMode}
                            item={{
                                type: "ingredient",
                                value: selectedIngredient,
                                onConfirmIngredient: handleDialogConfirm
                            }}/>
                : null}
        </View>
    );
}
