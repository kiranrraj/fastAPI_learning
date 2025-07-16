// \gbeex-v3.2\app\types\settings.types.ts

export type AppSettings = {
    profile: {
        name: string;
    };
    security: {
        password: '';
        confirm: '';
    };
    notifications: {
        silentMode: boolean;
        emailNotification: boolean;
        retentionDays: number;
        maxCount: number;
    };
    preferences: {
        reportFormat: 'PDF' | 'CSV' | 'Excel';
        maxFav: number;
        maxTabs: number;
        maxHidden: number;
    };
    accessibility: {
        theme: 'light' | 'dark';
        fontSize: 'small' | 'medium' | 'large' | 'extra-large';
        animations: boolean;
        highContrast: boolean;
    };
};

export type SettingsCategory = keyof AppSettings;
