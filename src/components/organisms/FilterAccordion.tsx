import React from 'react';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import {Checkbox, Divider, List, useTheme} from 'react-native-paper';
import {ingredientTableElement} from '@customTypes/DatabaseElementTypes';
import {FiltersAppliedToDatabase, TListFilter} from '@customTypes/RecipeFiltersTypes';
import {useI18n} from '@utils/i18n';
import {padding} from "@styles/spacing";
import {selectFilterCategoriesValuesToDisplay} from "@utils/FilterFunctions";

export type FilterAccordionProps = {
    testId: string;
    tagsList: string[];
    ingredientsList: ingredientTableElement[];
    filtersState: Map<TListFilter, string[]>;
    addFilter: (filterTitle: TListFilter, value: string) => void;
    removeFilter: (filterTitle: TListFilter, value: string) => void;
};

export default function FilterAccordion({
                                            testId,
                                            tagsList,
                                            ingredientsList,
                                            filtersState,
                                            addFilter,
                                            removeFilter,
                                        }: FilterAccordionProps) {
    const {t} = useI18n();
    const {colors} = useTheme();

    const ingredientSections = selectFilterCategoriesValuesToDisplay(tagsList, ingredientsList, t)
        .filter(section => section.data.length > 0);


    const handlePress = (filterType: TListFilter, value: string) => {
        const currentFilters = filtersState.get(filterType) || [];
        if (currentFilters.includes(value)) {
            removeFilter(filterType, value);
        } else {
            addFilter(filterType, value);
        }
    };

    const isSelected = (filterType: TListFilter, value: string) => {
        return filtersState.get(filterType)?.includes(value) ?? false;
    };


    const accordionId = testId + "::FilterAccordion";


    const renderAccordion = ({item, index}: ListRenderItemInfo<FiltersAppliedToDatabase>) => {
        const filterId = accordionId + `Accordion::${index}`;
        const filter = item.title;

        const renderItems = ({item, index}: ListRenderItemInfo<string>) => (
            <View key={item} style={{width: '50%'}}>
                <List.Item testID={filterId + `::Item::${index}`} title={item} titleNumberOfLines={2}
                           style={{paddingHorizontal: padding.verySmall}} onPress={() => handlePress(filter, item)}
                           left={props => <Checkbox {...props}
                                                    status={isSelected(filter, item) ? 'checked' : 'unchecked'}/>}/>
            </View>
        );

        return (<View key={item.title}>
            <List.Accordion testID={filterId} title={t(item.title)} id={`${item.title}`}
                            style={{backgroundColor: colors.primaryContainer}}>
                <FlatList data={item.data} scrollEnabled={false} showsHorizontalScrollIndicator={false}
                          numColumns={2} renderItem={renderItems}/>
            </List.Accordion>
            <Divider/>
        </View>)
    };

    return (
        <List.AccordionGroup>
            <FlatList data={ingredientSections} scrollEnabled={false} showsHorizontalScrollIndicator={false}
                      renderItem={renderAccordion}/>
        </List.AccordionGroup>
    );
}
