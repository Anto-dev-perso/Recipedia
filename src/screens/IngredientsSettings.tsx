import React, {useState} from 'react';
import {View} from 'react-native';
import {IngredientsSettingProp} from "@customTypes/ScreenTypes";
import {ingredientTableElement} from "@customTypes/DatabaseElementTypes";
import SettingsItemList from "@components/organisms/SettingsItemList";
import ItemDialog, {DialogMode} from "@components/dialogs/ItemDialog";
import RecipeDatabase from "@utils/RecipeDatabase";

export default function IngredientsSettings({}: IngredientsSettingProp) {
    const database = RecipeDatabase.getInstance();

    const [ingredients, setIngredients] = useState(database.get_ingredients().sort((a, b) => a.ingName.localeCompare(b.ingName)));


    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'delete'>('add');
    const [selectedIngredient, setSelectedIngredient] = useState<ingredientTableElement>(ingredients[0]);

    const testId = "IngredientsSettings";

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
    const handleDialogConfirm = (mode: DialogMode, newIngredient: ingredientTableElement) => {
        switch (mode) {
            case 'add':
                setIngredients([...ingredients, newIngredient]);
                break;
            case 'edit':
                if (selectedIngredient) {
                    setIngredients(ingredients.map(ing =>
                        ing.id === newIngredient.id ? newIngredient : ing
                    ));
                }
                break;
            case 'delete':
                if (selectedIngredient) {
                    setIngredients(ingredients.filter(ing => ing.id !== newIngredient.id));
                }
                break;
        }
        setIsDialogOpen(false);
    };

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
