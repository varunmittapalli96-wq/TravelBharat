'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface StateOption {
  id: string;
  name: string;
}

export function StateFilter({
  states,
  selectedStateId,
}: {
  states: StateOption[];
  selectedStateId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      sp.set('stateId', e.target.value);
    } else {
      sp.delete('stateId');
    }
    router.push(`/explore?${sp.toString()}`);
  };

  return (
    <div className="ml-auto flex items-center gap-2">
      <span className="text-xs font-semibold text-stone-400">State:</span>
      <select
        value={selectedStateId}
        onChange={handleChange}
        className="px-3 py-1.5 rounded-xl text-xs bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 focus:outline-none"
      >
        <option value="">All 36 States & UTs</option>
        {states.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
