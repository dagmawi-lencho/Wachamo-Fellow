'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchableSelectProps {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  className,
}: SearchableSelectProps) {
  const [search, setSearch] = React.useState('');

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setSearch('');
  };

  return (
    <div className={cn('relative', className)}>
      <Select value={value} onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          <div className="sticky top-0 bg-white/95 backdrop-blur-2xl p-3 border-b border-primary/10 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11 bg-white/80 border-primary/20 text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {search && (
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span className="font-semibold text-primary">{filteredOptions.length}</span> 
                {filteredOptions.length === 1 ? 'result' : 'results'} found
              </p>
            )}
          </div>
          <div className="max-h-[320px] overflow-y-auto p-1.5">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <SelectItem key={option} value={option} className="cursor-pointer">
                  {option}
                </SelectItem>
              ))
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}

