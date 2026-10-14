import React from 'react';
import { Card, CardContent } from '../../components/ui';

export function ComingSoon({ title, description }: { title: string, description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        <p className="text-slate-500">{description}</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
          <p>Fitur ini sedang dalam pengembangan.</p>
        </CardContent>
      </Card>
    </div>
  );
}
