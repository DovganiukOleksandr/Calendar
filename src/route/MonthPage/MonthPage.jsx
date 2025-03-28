import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Cell from "component/Cell";
import { getEvents} from "store/events/eventsSelectors";
import { WEEK_DAYS } from "constants";
import { Container} from "./MonthPage.styled";

export default function MonthPage() {
    const { year, month } = useParams();
    const events = useSelector(getEvents);
    const date = new Date();
    const currentYear = year ? year : date.getFullYear();
    const currentMonth = month ? month : date.getMonth() + 1;

    const currentDay =
        ((Number(year) === date.getFullYear() || !year) &&
            Number(month) === date.getMonth() + 1) ||
        !month
            ? date.getDate()
            : null;

    const previousMonthDays = new Date(
        currentYear,
        month ? month - 1 : date.getMonth(),
        0
    ).getDate();

    const monthDays = new Date(
        currentYear,
        month ? month : date.getMonth() + 1,
        0
    ).getDate();

    const weekDayFirst = new Date(
        currentYear,
        month ? month - 1 : date.getMonth(),
        1
    ).getDay();

    const previousMonthFirstDay =
        previousMonthDays -
        (weekDayFirst === 0 ? WEEK_DAYS.length : weekDayFirst) +
        2;

    const quantityCells =
        Math.ceil(
            ((weekDayFirst === 0 ? WEEK_DAYS.length : weekDayFirst) +
                monthDays -
                1) /
                WEEK_DAYS.length
        ) * WEEK_DAYS.length;

    const cells = [];

    function cell(day, anotherMonth) {
        return {
            day,
            weekDay:
                WEEK_DAYS[
                    new Date(
                        currentYear,
                        month ? month - 1 + anotherMonth : date.getMonth(),
                        day
                    ).getDay()
                ],
            anotherMonth,
            events: events.filter(
                ({ date }) =>
                    date.year === currentYear.toString() &&
                    Number(date.month).toString() ===
                        (Number(currentMonth) + anotherMonth).toString() &&
                    Number(date.day) === day
            ),
        };
    }

    for (let i = 1; i <= quantityCells; i += 1) {
        if (weekDayFirst === 1 && i <= monthDays) {
            cells.push(cell(i, 0));
        }

        if (
            weekDayFirst !== 1 &&
            i + previousMonthFirstDay - 1 <= previousMonthDays
        ) {
            cells.push(cell(i + previousMonthFirstDay - 1, -1));
        } else if (weekDayFirst === 0 && i <= monthDays + 6) {
            cells.push(cell(i - 6, 0));
        } else if (weekDayFirst !== 1 && i <= monthDays + weekDayFirst - 1) {
            cells.push(cell(i - weekDayFirst + 1, 0));
        } else if (weekDayFirst === 0 && i > monthDays + 6) {
            cells.push(cell(i - monthDays - 6, 1));
        } else if (i > monthDays) {
            cells.push(cell(i - monthDays - weekDayFirst + 1, 1));
        }
    }

    return (
        <>
            <Container quantityCells={quantityCells}>
                {cells.map(({ day, weekDay, anotherMonth, events }, index) => (
                    <Cell
                        key={index}
                        day={day}
                        weekDay={weekDay}
                        anotherMonth={anotherMonth}
                        currentDay={currentDay}
                        events={events}
                    />
                ))}
            </Container>
        </>
    );
}
