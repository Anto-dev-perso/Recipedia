

import React, { useState, useMemo } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Calendar, Agenda } from "react-native-calendars";
import {presentEventCreatingDialog} from 'react-native-add-calendar-event';

// Consider Modal from react-native for popup

const eventConfig = {
    title: 'Test title',
    //          YYYY-MM-DDTHH:mm:ss.SSSZ in GMT+0 (+2 for paris)
    startDate: '2023-05-15T5:00:00.000Z',
    endDate: '2023-05-15T6:00:00.000Z',
    location: 'Test location',
    notes: 'Test notes'
}

export const addToCalendar = async () => {
    console.log("Try to add to calendar");
    try{
        const result = await presentEventCreatingDialog(eventConfig);
        if(result.action == "SAVED") {
            console.log("Successfully added event to calendar");
        }else if(result.action == "CANCELED"){
            console.log("User canceled event");
        }
    }catch (error){
        console.log("ERROR: ", error);
    }
}

export default function CalendarComponent () {
    
    function CustomCalendar(props) {
        const initDate = '2023-05-13';
        const [selected, setSelected] = useState(initDate);

        const marked = useMemo(() => ({
            [selected]: {
                // '2023-05-01': {marked: true},
                // '2023-05-08': {marked: true},
                // '2023-05-18': {marked: true}

                selected: true,
                selectedColor: 'yellow',
                selectedTextColor: '#222222'
            } 
        }), [selected]);

        return(
            // CalendarList for scrolling calendar
            <Calendar 
            initialDate={initDate}
            firstDay={1}
            showWeekNumbers={true}
            markedTypes="custom"
            markedDates={marked}
            onDayPress={(day) => {
                setSelected(day.dateString);
                props.onDaySelect && props.onDaySelect(day);
            }}
            style={{
                borderRadius: 5,
                margin: 12,
                elevation: 5,
                borderWidth: 4,
                borderColor: 'rgba(100, 100, 100, 0.2)'
            }}
            theme={{
                calendarBackground: '#222',
                dayTextColor: '#FFF',
                textDisabledColor: '#444',
                monthTextColor: '#888',
                'stylesheet.calendar.header': {
                    dayTextAtIndex6: {
                        color: 'red'
                    },
                    dayTextAtIndex5: {
                        color: 'green'
                    }
                }
            }}
            {... props}/>
        )

        
    }

    return(
        <View>
            <CustomCalendar onDaySelect={(day) => {
                    console.log(`Date selected: ${day.dateString}`);
                    addToCalendar();
                }
            }/>
            {/* <Agenda 
                selected="2023-05-13"
                items={{
                    '2023-05-14': [{name: 'Cycling'}, {name: 'Walking'}, {name: 'Running'}],
                    '2023-05-15': [{name: 'Writing'}]
                }}
                renderItem={(item) => (
                    <TouchableOpacity style={{backgroundColor: 'white', flex: 1, borderRadius: 5, padding: 10, marginRight: 10, marginTop: 17}}>
                        <Text style={{color: '#888', fontSize: 16}}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                refreshControl={null}
                refreshing={false}
            /> */}
        </View>
    )

}