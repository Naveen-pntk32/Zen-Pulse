import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TaskList } from '@/types';

export type DateFilterValue = 'all' | 'today' | '7' | '30' | 'custom';

export function CompletedFilters({
  lists,
  dateFilter,
  onDateFilter,
  listFilter,
  onListFilter,
  customFrom,
  customTo,
  onCustomFrom,
  onCustomTo,
}: {
  lists: TaskList[];
  dateFilter: DateFilterValue;
  onDateFilter: (v: DateFilterValue) => void;
  listFilter: string;
  onListFilter: (v: string) => void;
  customFrom: string;
  customTo: string;
  onCustomFrom: (v: string) => void;
  onCustomTo: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={dateFilter} onValueChange={(v) => onDateFilter(v as DateFilterValue)}>
        <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700 text-gray-200">
          <SelectValue placeholder="Date" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="7">Last 7 Days</SelectItem>
          <SelectItem value="30">Last 30 Days</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {dateFilter === 'custom' && (
        <>
          <Input
            type="date"
            value={customFrom}
            onChange={(e) => onCustomFrom(e.target.value)}
            className="w-auto bg-gray-800 border-gray-700 text-gray-200 text-sm [color-scheme:dark]"
          />
          <span className="text-gray-500 text-sm">to</span>
          <Input
            type="date"
            value={customTo}
            onChange={(e) => onCustomTo(e.target.value)}
            className="w-auto bg-gray-800 border-gray-700 text-gray-200 text-sm [color-scheme:dark]"
          />
        </>
      )}

      <Select value={listFilter} onValueChange={onListFilter}>
        <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700 text-gray-200">
          <SelectValue placeholder="Task List" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
          <SelectItem value="all">All Lists</SelectItem>
          {lists.map((list) => (
            <SelectItem key={list.id} value={list.id}>
              {list.icon} {list.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}