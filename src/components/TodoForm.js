import React from "react";
import { useForm } from "react-hook-form";

export default function TodoForm(props) {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            task: props.task.task,
            priority: props.task.priority,
        }
    });

    const onSubmit = (data) => {
        // console.log(register);
        props.task.task = data.task;
        props.task.priority = data.priority;
        props.updateTask(props.task);

    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} >
                <div className="form-control">
                    <label>Task</label>
                    <input type="text"  {...register("task")} />
                </div>
                <div className="form-control">
                    <label>priority</label>
                    <input type="text"   {...register("priority")} />
                </div>
                <div className="form-control">
                    <label></label>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
}