'use client';

import { useEffect, useRef, useState } from 'react';
import { Table } from '@tanstack/react-table';
import { parseAsString, useQueryState } from 'nuqs';
import { ChevronDownIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

export type SearchByOptions = {
  label: string;
  value: string;
};

interface SearchByProps<TData> {
  table: Table<TData>;
  options: SearchByOptions[];
  reset?: number;
}

function SearchBy<TData>({ options, table, reset }: SearchByProps<TData>) {
  const [searchQuery, setSearchQuery] = useQueryState(
    'searchQuery',
    parseAsString.withDefault(''),
  );
  const [searchBy, setSearchBy] = useQueryState(
    'searchBy',
    parseAsString.withDefault(''),
  );

  const [searchValue, setSearchValue] = useState(searchQuery);

  const filteredOptions = options.filter((option) => option.value === searchBy);
  const [selectedOption, setSelectedOption] = useState<SearchByOptions>(
    filteredOptions[0] ?? options[0],
  );

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const tableRef = useRef(table);
  const optionsRef = useRef(options);
  const searchQueryRef = useRef(searchQuery);
  const searchByRef = useRef(searchBy);
  const prevResetRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    tableRef.current = table;
  }, [table]);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  useEffect(() => {
    searchByRef.current = searchBy;
  }, [searchBy]);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      const trimmed = searchValue.trim();

      const filterId =
        selectedOption.value === 'name' ? 'search_name' : selectedOption.value;

      if (!trimmed) {
        if (searchQuery !== '') void setSearchQuery('');
        if (searchBy !== '') void setSearchBy('');

        tableRef.current.setColumnFilters((prevFilters) => {
          const existingIndex = prevFilters.findIndex((f) => f.id === filterId);
          if (existingIndex === -1) return prevFilters;
          return prevFilters.filter((f) => f.id !== filterId);
        });
        return;
      }

      if (searchQuery !== searchValue) {
        void setSearchQuery(searchValue);
      }
      if (searchBy !== selectedOption.value) {
        void setSearchBy(selectedOption.value);
      }

      tableRef.current.setColumnFilters((prevFilters) => {
        const existingIndex = prevFilters.findIndex((f) => f.id === filterId);

        if (existingIndex !== -1) {
          const existing = prevFilters[existingIndex];
          if (existing?.value === searchValue) return prevFilters;
          const next = prevFilters.slice();
          next[existingIndex] = { id: filterId, value: searchValue };
          return next;
        }

        return [...prevFilters, { id: filterId, value: searchValue }];
      });
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [
    searchValue,
    selectedOption,
    searchQuery,
    searchBy,
    setSearchQuery,
    setSearchBy,
  ]);

  useEffect(() => {
    if (reset === undefined) return;
    if (prevResetRef.current === reset) return;
    prevResetRef.current = reset;

    const timer = window.setTimeout(() => {
      setSearchValue('');
      setSelectedOption(optionsRef.current[0]);
      if (searchQueryRef.current !== '') void setSearchQuery('');
      if (searchByRef.current !== '') void setSearchBy('');
    }, 0);

    return () => window.clearTimeout(timer);
  }, [reset, setSearchBy, setSearchQuery]);

  const handleSelect = (option: SearchByOptions) => {
    setSelectedOption(option);
    setSearchValue('');
  };

  return (
    <InputGroup className='w-56'>
      <InputGroupInput
        placeholder='Search'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <InputGroupAddon align='inline-end'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton variant='ghost' className='pr-1.5! text-xs'>
              {selectedOption.label} <ChevronDownIcon className='size-3' />
            </InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
    </InputGroup>
  );
}

export default SearchBy;
