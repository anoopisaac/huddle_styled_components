import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Task } from "./common";

export default function TodoForm(props: any) {
    // const task:Task=<Task>props.task;
    // const task: Task = props.task;
    const { task: task, updateTask: updateTask } = props;
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
        <div>
            <form onSubmit={handleSubmit(onSubmit)} >
                <div className="form-control">
                    <label>Task</label>
                    <input type="text"  {...register("taskText")} />
                </div>
                <div className="form-control">
                    <label>priority</label>
                    <input type="text"   {...register("priority")} />
                </div>
                <div className="form-control">
                    <label></label>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}