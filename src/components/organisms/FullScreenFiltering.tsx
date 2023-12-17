

import { PlusMinusIcons } from "@assets/images/Icons"
import React from "react"
import { listFilter, propsForFilter } from "@customTypes/RecipeFiltersTypes";
import SectionClickableList from "@components/molecules/SectionClickableList";


type FullScreenFilteringProps = {
    tagsList: Array<string>,
    ingredientsList: Array<string>,

    filtersProps: propsForFilter,
  }

export default function FullScreenFiltering (props: FullScreenFilteringProps) {

        return(
            <SectionClickableList route={{screen: "search", tagsList: props.tagsList, ingredientsList: props.ingredientsList, filtersProps: props.filtersProps}} icon={PlusMinusIcons} useOnPress={true} />
        )
}
