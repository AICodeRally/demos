'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import clsx from 'clsx';
import type { Role } from '@/lib/swic/types/commission';

interface RoleSelectorProps {
  currentRole: Role;
}

const ROLE_OPTIONS: Array<{ value: Role; label: string }> = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'sales-rep', label: 'Sales Rep' },
];

export function RoleSelector({ currentRole }: RoleSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Create updated URL with new role while preserving other params
  const buildUrlWithRole = useCallback((role: Role): string => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('role', role);
    const queryString = params.toString();
    return queryString ? `/?${queryString}` : '/';
  }, [searchParams]);

  const handleRoleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value as Role;
    const newUrl = buildUrlWithRole(newRole);
    router.push(newUrl);
  }, [router, buildUrlWithRole]);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="role-selector" className="text-sm font-medium text-gray-700">
        Role
      </label>
      <select
        id="role-selector"
        value={currentRole}
        onChange={handleRoleChange}
        className={clsx(
          'px-3 py-2 rounded-md border border-gray-300',
          'bg-white text-gray-900 text-sm',
          'hover:border-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500',
          'transition-colors duration-200',
          'cursor-pointer'
        )}
      >
        {ROLE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
