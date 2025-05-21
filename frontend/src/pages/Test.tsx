'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { DatePicker } from '../components/ui/date-picker';

export function Test() {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="flex flex-col space-y-4 items-start p-8">
      <h1 className="text-2xl font-bold mb-4">Date Picker Test</h1>

      <DatePicker date={date} setDate={setDate} className="w-[240px]" />

      {date && <p className="text-sm">Selected date: {format(date, 'PPP')}</p>}
    </div>
  );
}
