import React from "react";
import TagButton from "@components/atomic/TagButton";
import {Icons} from "@assets/Icons";
import {useI18n} from "@utils/i18n";
import {FlatList} from "react-native";
import {padding} from "@styles/spacing";
import {Button} from "react-native-paper";

export type FiltersSelectionProps = {
    testId: string;
    filters: Array<string>,
    addingFilterMode: boolean,
    setAddingAFilter: React.Dispatch<React.SetStateAction<boolean>>,
    onRemoveFilter: (filter: string) => void,
}

export default function FiltersSelection({
                                             testId,
                                             filters,
                                             addingFilterMode,
                                             setAddingAFilter,
                                             onRemoveFilter
                                         }: FiltersSelectionProps) {
    const {t} = useI18n();

    const selectionTestID = testId + "::FiltersSelection";

    return (
        <>
            <FlatList horizontal={true} data={filters} scrollEnabled={true} showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          padding: padding.verySmall,
                          marginLeft: padding.small,
                      }}
                      renderItem={({item, index}) => (
                          <TagButton key={index} text={item} testID={selectionTestID + "::" + index}
                                     rightIcon={Icons.crossIcon}
                                     onPressFunction={() => onRemoveFilter(item)}/>)}/>

            <Button testID={testId + "::FiltersToggleButtons"} mode={"contained"}
                    onPress={() => setAddingAFilter(!addingFilterMode)}
                    icon={addingFilterMode ? Icons.removeFilterIcon : Icons.addFilterIcon}
                    style={{margin: padding.medium, alignSelf: 'flex-start', borderRadius: 20}}>
                {t(addingFilterMode ? 'seeFilterResult' : 'addFilter')}
            </Button>
        </>
    )
}
