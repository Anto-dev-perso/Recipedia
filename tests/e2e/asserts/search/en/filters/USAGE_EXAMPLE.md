# Filter Accordion Assert Files - Usage Guide

## Overview

Each accordion has a **proxy file** that routes to the appropriate
implementation based on the filter state. These files support **3 distinct
states** to cover all filtering scenarios.

## Architecture

Each accordion has:

- **Main proxy file**: `{accordion}.yaml` - Routes to correct implementation
  based on STATE
- **All items file**: `{accordion}-all.yaml` - Tests all items visible
- **Filtered file**: `{accordion}-filtered.yaml` - Tests specific items
  visible/hidden
- **Hidden file**: `{accordion}-hidden.yaml` - Tests accordion not displayed
- **Item files directory**: `{accordion}-items/` - Individual item assertions
  (for filtered state)

## The 3 States

### 1. **STATE="all"** (Default - No Filtering)

All items in the accordion are visible. This is the default when no filters are
applied.

### 2. **STATE="filtered"** (Active Filtering)

Only specific items are visible. You explicitly list which items should be
visible in `VISIBLE_ITEMS`.

### 3. **STATE="hidden"** (Empty Accordion)

The accordion itself is not displayed because no items match the current
filters.

## Parameters

- `STATE`: `"all"` (default), `"filtered"`, or `"hidden"`
- `VISIBLE_ITEMS`: Comma-separated list of visible items (only used when
  `STATE="filtered"`)
- `ACCORDION_INDEX`: The accordion's position (0-18) - has default value per
  file

## Usage Examples

### Example 1: All Items Visible (No Filter Active)

**Scenario**: User opens filter page with no active filters.

```yaml
- runFlow:
    file: 'accordions/grainOrCereal.yaml'
    label: 'Assert Cereal accordion with all items visible'
```

**What happens**:

1. Proxy routes to `grainOrCereal-all.yaml`
2. Asserts accordion IS displayed
3. Expands the accordion
4. Asserts ALL items are visible (Spaghetti, Taco Shells, Flour, Croutons, Pizza
   Dough, Pasta, Sushi Rice)
5. Collapses the accordion

### Example 2: Some Items Visible (Filter Active)

**Scenario**: User filters recipes by "15-20 min" prep time, hiding some
ingredients.

```yaml
- runFlow:
    file: 'accordions/grainOrCereal.yaml'
    env:
      STATE: 'filtered'
      VISIBLE_ITEMS: 'Taco Shells,Croutons,Pizza Dough,Pasta'
    label: 'Assert Cereal accordion shows only items matching 15-20 min filter'
```

**What happens**:

1. Proxy routes to `grainOrCereal-filtered.yaml`
2. Asserts accordion IS displayed
3. Expands the accordion
4. For each item, conditionally asserts visible or hidden based on VISIBLE_ITEMS
5. Collapses the accordion

### Example 3: Accordion Hidden (No Matching Items)

**Scenario**: User filters recipes and NO items in this category match.

```yaml
- runFlow:
    file: 'accordions/grainOrCereal.yaml'
    env:
      STATE: 'hidden'
    label: 'Assert Cereal accordion is not displayed'
```

**What happens**:

1. Proxy routes to `grainOrCereal-hidden.yaml`
2. Asserts accordion is NOT displayed at all

### Example 4: Vegetable Accordion with One Item

**Scenario**: Filter shows only "Romaine Lettuce" in vegetables.

```yaml
- runFlow:
    file: 'accordions/vegetable.yaml'
    env:
      STATE: 'filtered'
      VISIBLE_ITEMS: 'Romaine Lettuce'
    label: 'Assert only Romaine Lettuce is visible in Vegetable accordion'
```

### Example 5: Complete Filter Test - Multiple Accordions

**Scenario**: Test filter page with mixed states across accordions.

```yaml
# Cereal: Some items visible
- runFlow:
    file: 'accordions/grainOrCereal.yaml'
    env:
      STATE: 'filtered'
      VISIBLE_ITEMS: 'Pasta,Croutons'
    label: 'Assert Cereal filtered state'

# Vegetable: All items visible (default)
- runFlow:
    file: 'accordions/vegetable.yaml'
    label: 'Assert Vegetable has all items visible'

# Tags: Accordion completely hidden
- runFlow:
    file: 'accordions/tags.yaml'
    env:
      STATE: 'hidden'
    label: 'Assert Tags accordion is not displayed'
```

## Accordion Index Reference

| Index | Accordion Name             | File Name            | Status |
| ----- | -------------------------- | -------------------- | ------ |
| 0     | Cereal                     | grainOrCereal.yaml   | ✅     |
| 1     | Legumes                    | legumes.yaml         | 📝     |
| 2     | Vegetable                  | vegetable.yaml       | ✅     |
| 3     | Plant Protein              | plantProtein.yaml    | 📝     |
| 4     | Condiment                  | condiment.yaml       | 📝     |
| 5     | Sauce                      | sauce.yaml           | 📝     |
| 6     | Meat                       | meat.yaml            | 📝     |
| 7     | Poultry                    | poultry.yaml         | 📝     |
| 8     | Fish                       | fish.yaml            | 📝     |
| 9     | Dairy                      | dairy.yaml           | 📝     |
| 10    | Cheese                     | cheese.yaml          | 📝     |
| 11    | Sugar                      | sugar.yaml           | 📝     |
| 12    | Spice                      | spice.yaml           | 📝     |
| 13    | Fruit                      | fruit.yaml           | 📝     |
| 14    | Oil and Fat                | oilAndFat.yaml       | 📝     |
| 15    | Nuts and Seeds             | nutsAndSeeds.yaml    | 📝     |
| 16    | Preparation Time           | preparationTime.yaml | 📝     |
| 17    | Only in-season ingredients | inSeason.yaml        | 📝     |
| 18    | Tags                       | tags.yaml            | 📝     |

✅ = Completed | 📝 = To be created

## Real-World Test Case Example

Here's how to use these files in an actual test case:

```yaml
# tests/e2e/asserts/Search/en/Filters/filtersViewFilteredOn1520Min.yaml
appId: 'com.recipedia'
---
# Basic UI checks
- assertVisible:
    id: 'SearchScreen::FiltersToggleButtons'
    label: 'Filter toggle button is displayed'

# Check Cereal accordion (filtered)
- runFlow:
    file: 'accordions/grainOrCereal.yaml'
    env:
      STATE: 'some'
      VISIBLE_ITEMS: 'Taco Shells,Croutons,Pizza Dough,Pasta'
    label: 'Assert filtered Cereal accordion'

# Check Vegetable accordion (filtered)
- runFlow:
    file: 'accordions/vegetable.yaml'
    env:
      STATE: 'some'
      VISIBLE_ITEMS: 'Lettuce,Romaine Lettuce'
    label: 'Assert filtered Vegetable accordion'

# Scroll to Tags
- scrollUntilVisible:
    element:
      id: 'SearchScreen::FilterAccordion::Accordion::18'
    direction: DOWN
    label: 'Scroll to Tags accordion'

# Check Tags accordion (filtered)
- runFlow:
    file: 'accordions/tags.yaml'
    env:
      STATE: 'some'
      VISIBLE_ITEMS: 'Italian,Lunch,Mexican,Quick Meal,Salad,Healthy'
    label: 'Assert filtered Tags accordion'
```

## Benefits

1. **Crystal Clear Intent**: State explicitly declares what you're testing
2. **No Duplication**: Write each accordion once, use everywhere
3. **Easy Maintenance**: Update ingredient lists in one place
4. **Flexible**: Handles all filtering scenarios
5. **Auto-management**: Expand/collapse handled automatically
6. **Type-safe**: Uses testIDs for reliability

## Creating New Accordion Files

To create a new accordion file:

1. Copy `grainOrCereal.yaml` as a template
2. Update `ACCORDION_INDEX` default value
3. Update accordion name in all comments and labels
4. List all items for that accordion category
5. For each item:
   - Add `assertVisible` for `STATE="all"`
   - Add `assertVisible` + `assertNotVisible` pair for `STATE="some"`
6. Test all 3 states work correctly
