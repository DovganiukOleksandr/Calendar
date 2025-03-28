import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents} from "store/events/eventsSelectors";
import { changeEvents } from "store/events/eventsSlice";
import {
    Container,
    Box,
    Header,
    Text,
    IconClose,
    Label,
    Input,
    Textarea,
    InputDate,
    InputTime,
    BoxData,
    ButtonSave,
    LabelData,
    IconDelete,
} from "./Form.styled";

export default function Form({ toggleDropdown, event, edit }) {
    const [isTitle, setIsTitle] = useState(edit ? " " : "");
    const events = useSelector(getEvents);
    const dispatch = useDispatch();

    function handleSubmit(e) {
        e.preventDefault();
        toggleDropdown();
        const { title, description, date, time } = e.target;
        const year = date.value.slice(0, 4);
        const month = date.value.slice(5, 7);
        const day = date.value.slice(8, 10);

        const newEvents = [...events];
        edit
            ? newEvents.forEach((newEvent, index) => {
                  if (JSON.stringify(newEvent) === JSON.stringify(event)) {
                      newEvents.splice(index, 1, {
                          title: title.value,
                          description: description.value,
                          date: { year, month, day },
                          time: time.value,
                          currentDate: new Date().toLocaleString(),
                          updated: true,
                      });
                  }
              })
            : newEvents.push({
                  title: title.value,
                  description: description.value,
                  date: { year, month, day },
                  time: time.value,
                  currentDate: new Date().toLocaleString(),
              });
        dispatch(changeEvents(newEvents));
    }

    function deleteEvent(e) {
        e.preventDefault();
        toggleDropdown();
        const newEvents = [...events];
        newEvents.forEach(
            (newEvent, index) =>
                JSON.stringify(newEvent) === JSON.stringify(event) &&
                newEvents.splice(index, 1)
        );
        dispatch(changeEvents(newEvents));
    }

    function correctDate(date) {
        return date.slice(0, 10) + date.slice(11, 17);
    }

    return (
        <Container onSubmit={handleSubmit} edit={edit}>
            <Box>
                <Header>{edit ? "Edit idea item" : "Add new idea item"}</Header>
                <IconClose onClick={toggleDropdown} />
            </Box>
            {edit && (
                <Text>
                    {event.updated ? "Updated" : "Created"} at&nbsp;
                    {correctDate(event.currentDate)}
                </Text>
            )}
            <Label>
                Title*
                <Input
                    type="text"
                    name="title"
                    placeholder="Title goes here"
                    defaultValue={edit && event.title}
                    onChange={(e) => setIsTitle(e.target.value)}
                    required
                />
            </Label>
            <Label>
                Description
                <Textarea
                    name="description"
                    defaultValue={edit && event.description}
                    rows="7"
                />
            </Label>
            <BoxData>
                <LabelData>
                    Date
                    <InputDate
                        type="date"
                        name="date"
                        defaultValue={
                            edit
                                ? `${event.date.year}-${event.date.month}-${event.date.day}`
                                : new Date().toLocaleDateString("en-CA")
                        }
                        required
                        pattern="[0-9]{2}.[0-9]{2}.[0-9]{4}"
                    />
                </LabelData>
                <Label>
                    Begin<br></br>time
                    <InputTime
                        type="time"
                        name="time"
                        defaultValue={edit && event.time}
                    />
                </Label>
            </BoxData>
            <Box>
                {edit && <IconDelete onClick={deleteEvent} />}
                <ButtonSave edit={edit} isTitle={isTitle}>
                    SAVE
                </ButtonSave>
            </Box>
        </Container>
    );
}
