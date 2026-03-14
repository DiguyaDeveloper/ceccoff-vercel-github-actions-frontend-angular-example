import { Injectable, signal, computed } from '@angular/core';

import { environment } from '../../environments/environment';

export type EnvName = 'development' | 'staging' | 'production';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  private readonly _env = signal(environment);

  readonly name    = computed((): EnvName => this._env().name as EnvName);
  readonly apiUrl  = computed(() => this._env().apiUrl);
  readonly version = computed(() => this._env().version);

  readonly label = computed(() => {
    const map: Record<EnvName, string> = {
      development: 'DEV',
      staging:     'HML',
      production:  'PRD',
    };
    return map[this.name()] ?? this.name();
  });
}
