import React from 'react';
import { LuPaperclip } from 'react-icons/lu';
import moment from 'moment';

const TaskCard = ({
  title,
  description,
  priority,
  status,
  createdAt,
  dueDate,
  assignedTo = [],
  attachmentCount = 0,
  completedTodoCount = 0,
  todoChecklist = [],
  onClick
}) => {
  // Status and priority styling configurations
  const statusStyles = {
    "In Progress": {
      container: "text-cyan-500 bg-cyan-50 border  border-cyan-500/10",
      border: "border-cyan-500"
    },
    "Completed": {
      container: "text-lime-500 bg-lime-50 border border-lime-500/10",
      border: "border-indigo-500"
    },
    "Pending": {
      container: "text-violet-500 bg-violet-50 border border-violet-500/10",
      border: "border-violet-500"
    }
  };

  const priorityStyles = {
    "Low": "text-emerald-500 bg-emerald-50 border border-emerald-500/10",
    "Medium": "text-amber-500 bg-amber-50 border border-amber-500/10",
    "High": "text-rose-500 bg-rose-50 border border-rose-500/10"
  };

  // Get the appropriate styles based on status and priority
  const currentStatusStyle = statusStyles[status] || statusStyles["Pending"];
  const currentPriorityStyle = priorityStyles[priority] || priorityStyles["High"];

  return (
    <div 
      className="bg-white rounded-xl p-4 dark:bg-teal-950 dark:text-gray-50 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      {/* Status and Priority Tags */}
      <div className="flex items-center gap-2 mb-3 ">
        <span className={`text-xs font-medium px-3 py-1  rounded-full ${currentStatusStyle.container}`}>
          {status}
        </span>
        <span className={`text-xs  font-medium px-3 py-1 rounded-full ${currentPriorityStyle}`}>
          {priority} Priority
        </span>
      </div>

      {/* Task Content with Left Border */}
      <div className={`pl-3 border-l-2 ${currentStatusStyle.border}`}>
        <h3 className="text-base dark:text-gray-50 font-medium text-gray-800 line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-sm dark:text-gray-50 text-gray-500 line-clamp-2 mb-3">
          {description}
        </p>
        
        {/* Progress Indicator */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span>Task Done: </span>
          <span className="font-semibold ml-1">
            {completedTodoCount} / {todoChecklist.length}
          </span>
        </div>
      </div>

      {/* Dates and Assignees */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div>
            <label className="text-xs dark:text-gray-50 text-gray-400">Start Date</label>
            <p className="text-sm font-medium">
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>
          <div>
            <label className="text-xs dark:text-gray-50 text-gray-400">Due Date</label>
            <p className="text-sm font-medium">
              {moment(dueDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Assignees Avatars */}
          <div className="flex -space-x-2">
            {assignedTo.map((avatar, index) => (
              <img 
                key={index}
                className="w-8 h-8 rounded-full border-2 border-white"
                src={avatar}
                alt={`Assignee ${index}`}
              />
            ))}
          </div>

          {/* Attachment Indicator */}
          {attachmentCount > 0 && (
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
              <LuPaperclip className="text-blue-500 text-sm" />
              <span className="text-xs text-gray-700">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskCard);