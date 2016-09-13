import React from 'react';
import Task from './Task';

const TaskList = React.createClass({
    render() {
        let searchedTasks = this.props.tasks.filter(
            (task) => {
                return task.name.toLowerCase().indexOf(this.props.searched.toLowerCase()) !== -1;
            }
        );

        return (
            <div>
                <ul className="nu-list">
                    {searchedTasks.map((task, i) =>
                        <Task key={i} i={i} task={task} count={this.props.count} />
                    )}
                </ul>
            </div>
        )
    }
});

export default TaskList;
