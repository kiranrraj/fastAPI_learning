// \gbeex-v3.2\app\types\company.types.ts

import { Protocol } from './protocol.types';
export * from './subject.types';
export * from './site.types';
export * from './protocol.types';

export interface Company {
    companyId: string;
    companyName: string;
    protocols: Protocol[];
}
