'use client';

import { useState, useMemo } from 'react';
import { Plus, GripVertical, Check, Circle, Loader } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWorkboard, useDecisions } from '../store';
import type { TaskPriority, TaskStatus, WorkTask } from '../types';

const COLUMNS: { id: TaskPriority; label: string; color: string }[] = [
  { id: 'P0', label: 'P0 — Must Have', color: 'red' },
  { id: 'P1', label: 'P1 — Should Have', color: 'amber' },
  { id: 'P2', label: 'P2 — Nice to Have', color: 'blue' },
];

const STATUS_ICONS: Record<TaskStatus, typeof Circle> = {
  'todo': Circle,
  'in-progress': Loader,
  'done': Check,
};

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  'todo': 'in-progress',
  'in-progress': 'done',
  'done': 'todo',
};

function SortableCard({ task, onStatusChange, onRemove, decisionText }: {
  task: WorkTask;
  onStatusChange: () => void;
  onRemove: () => void;
  decisionText?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const StatusIcon = STATUS_ICONS[task.status];

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-start gap-2 rounded border border-[var(--sem-border-default)] bg-[var(--sem-bg-primary)] p-3 ${isDragging ? 'opacity-50' : ''}`}
    >
      <button {...attributes} {...listeners} className="mt-0.5 shrink-0 cursor-grab text-[var(--sem-text-muted)]">
        <GripVertical className="h-4 w-4" />
      </button>
      <button onClick={onStatusChange} className="mt-0.5 shrink-0 text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
        <StatusIcon className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0">
        <div className={`text-sm ${task.status === 'done' ? 'line-through text-[var(--sem-text-muted)]' : 'text-[var(--sem-text-primary)]'}`}>
          {task.title}
        </div>
        {decisionText && (
          <div className="mt-1 truncate text-xs text-[var(--sem-text-muted)]">&darr; {decisionText}</div>
        )}
      </div>
      <button onClick={onRemove} className="shrink-0 text-xs text-[var(--sem-text-muted)] hover:text-red-400">&times;</button>
    </div>
  );
}

export function WorkboardTab() {
  const { tasks, addTask, moveTask, updateStatus, removeTask } = useWorkboard();
  const { items: decisions } = useDecisions();
  const [addingTo, setAddingTo] = useState<TaskPriority | null>(null);
  const [draftTitle, setDraftTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const decisionMap = useMemo(() => new Map(decisions.map(d => [d.id, d.text])), [decisions]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    // Check if dropped on a column header
    const targetCol = COLUMNS.find(c => c.id === overId);
    if (targetCol) {
      moveTask(active.id as string, targetCol.id);
    }
  };

  const handleAdd = (priority: TaskPriority) => {
    if (draftTitle.trim()) {
      addTask(draftTitle.trim(), priority);
      setDraftTitle('');
      setAddingTo(null);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map(col => {
          const colTasks = tasks
            .filter(t => t.priority === col.id)
            .sort((a, b) => {
              const statusOrder: Record<TaskStatus, number> = { 'todo': 0, 'in-progress': 1, 'done': 2 };
              return statusOrder[a.status] - statusOrder[b.status];
            });

          return (
            <div key={col.id} className="flex flex-col rounded-lg border border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)]">
              <div className="flex items-center justify-between border-b border-[var(--sem-border-default)] px-3 py-2">
                <span className="text-sm font-bold text-[var(--sem-text-primary)]">{col.label}</span>
                <span className="rounded-full bg-[var(--sem-bg-primary)] px-2 py-0.5 text-xs text-[var(--sem-text-muted)]">
                  {colTasks.length}
                </span>
              </div>

              <SortableContext items={colTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 space-y-2 p-2" style={{ minHeight: 120 }}>
                  {colTasks.map(task => (
                    <SortableCard
                      key={task.id}
                      task={task}
                      onStatusChange={() => updateStatus(task.id, NEXT_STATUS[task.status])}
                      onRemove={() => removeTask(task.id)}
                      decisionText={task.linkedDecisionId ? decisionMap.get(task.linkedDecisionId) : undefined}
                    />
                  ))}

                  {colTasks.length === 0 && !addingTo && (
                    <div className="flex h-20 items-center justify-center text-xs text-[var(--sem-text-muted)]">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </SortableContext>

              <div className="border-t border-[var(--sem-border-default)] p-2">
                {addingTo === col.id ? (
                  <div className="flex gap-1">
                    <input
                      value={draftTitle}
                      onChange={e => setDraftTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAdd(col.id)}
                      placeholder="Task title..."
                      className="flex-1 rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-xs text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]"
                      autoFocus
                    />
                    <button onClick={() => handleAdd(col.id)} className="rounded bg-[var(--palette-primary-500)] px-2 py-1 text-xs text-white">Add</button>
                    <button onClick={() => setAddingTo(null)} className="text-xs text-[var(--sem-text-muted)]">&times;</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingTo(col.id)}
                    className="flex w-full items-center justify-center gap-1 py-1 text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]"
                  >
                    <Plus className="h-3 w-3" /> Add Task
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
