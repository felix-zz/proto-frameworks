import {ReactNode} from 'react';

export interface VersionInfo {
    version: string,
    description: string | ReactNode,
    url?: string,
}
