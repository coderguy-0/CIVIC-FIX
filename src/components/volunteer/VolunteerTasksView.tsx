import React, { useState } from 'react';
import {
  ClipboardList,
  CheckSquare,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  Filter,
  Plus
} from 'lucide-react';
import { VolunteerTask } from '../../types';

export interface VolunteerTasksViewProps {
  tasks: VolunteerTask[];
  onToggleChecklist: (taskId: string, checklistId: string) => void;
  onNavigate: (view: string) => void;
}

export const VolunteerTasksView: React.FC<VolunteerTasksViewProps> = ({
  tasks,
  onToggleChecklist,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* View Header */}
      <div className="bg-white rounded-2xl border border-[#c8d9d2] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#17201d] tracking-tight flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#1864ab]" />
            <span>Volunteer Follow-Up & Verification Tasks</span>
          </h1>
          <p className="text-xs text-[#66736e] mt-1">
            Site inspections and department follow-up tasks assigned to your volunteer coverage area.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex rounded-xl bg-[#f2f6f4] p-1 border border-[#e1eae5]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white text-[#1864ab] shadow-xs'
                : 'text-[#66736e] hover:text-[#17201d]'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filter === 'pending'
                ? 'bg-white text-[#1864ab] shadow-xs'
                : 'text-[#66736e] hover:text-[#17201d]'
            }`}
          >
            Open ({tasks.filter(t => t.status !== 'completed').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filter === 'completed'
                ? 'bg-white text-[#1864ab] shadow-xs'
                : 'text-[#66736e] hover:text-[#17201d]'
            }`}
          >
            Done ({tasks.filter(t => t.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#dce5e1] p-10 text-center text-xs text-[#66736e]">
            No tasks found for this filter.
          </div>
        ) : (
          filteredTasks.map(task => {
            const completedCount = task.checklist.filter(c => c.completed).length;
            const totalCount = task.checklist.length;
            const isAllDone = completedCount === totalCount;

            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-[#c8d9d2] p-5 shadow-xs space-y-4 hover:border-[#1864ab] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#1864ab] bg-[#e7f5ff] px-2 py-0.5 rounded-md">
                        {task.id.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize bg-[#eef3f1] text-[#2c3833]">
                        {task.category.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAllDone
                            ? 'bg-[#e7f7f1] text-[#087f5b]'
                            : 'bg-[#e7f5ff] text-[#1864ab]'
                        }`}
                      >
                        {isAllDone ? 'Verified Complete' : 'In Progress'}
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-[#17201d]">
                      {task.title}
                    </h2>
                    <p className="text-xs text-[#4a5853] mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-end gap-1 text-[11px] text-[#66736e] shrink-0">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1864ab]" />
                      {task.location}
                    </span>
                    {task.due_date && (
                      <span className="flex items-center gap-1 text-[#a96f16] font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Checklist Section */}
                <div className="pt-3 border-t border-[#eef3f1] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#17201d]">Field Action Checklist</span>
                    <span className="text-[11px] font-bold text-[#1864ab]">
                      {completedCount} / {totalCount} completed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {task.checklist.map(item => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#f8faf9] hover:bg-[#eef3f1] border border-[#dce5e1] text-xs text-[#2c3833] cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => onToggleChecklist(task.id, item.id)}
                          className="rounded border-[#dce5e1] text-[#1864ab] focus:ring-[#1864ab]"
                        />
                        <span className={item.completed ? 'line-through text-[#8a9993]' : 'font-medium'}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
