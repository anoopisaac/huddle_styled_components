// import { Paper } from "@mui/material";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Task } from "../common";
import { Styler } from "./styles/Grid.styled";

export default function TodoForm(props: any) {
    // const task:Task=<Task>props.task;
    // const task: Task = props.task;
    const { task, updateTask } = props;
    const { register, handleSubmit } = useForm({
        defaultValues: {
            taskText: props.task.taskText,
            priority: props.task.priority,
        }
    });

    useEffect(() => {
        console.log("new one", task)
    }, [props.task]);

    const onSubmit = (newData: Task) => {
        // console.log(register);
        task.taskText = newData.taskText;
        task.priority = newData.priority;
        updateTask(task);

    };

    return (
        <Styler gar="30px">
            <Styler as="form" onSubmit={handleSubmit(onSubmit)} gar="max-content" rg="10px" >
                <Styler mt="10px">
                    {/* <input className="form-control" type="text"  /> */}
                    <TextField id="standard-basic" label="Task" variant="outlined" {...register("taskText")} sx={{ width: '100%' }} size="small" />
                </Styler>
                <div>
                    <ToggleButtonGroup
                        color="primary"
                        value={'android'}
                        exclusive
                        onChange={() => { }}
                        size="small"
                    >
                        <ToggleButton value="web">High</ToggleButton>
                        <ToggleButton value="android">Medium</ToggleButton>
                        <ToggleButton value="ios">Low</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div>
                    <Button variant="contained">Outlined</Button>
                </div>
            </Styler>
        </Styler>
    );
}