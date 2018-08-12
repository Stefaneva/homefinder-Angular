import { TestBed, inject } from '@angular/core/testing';

import { GuardRoleService } from './guard-role.service';

describe('GuardRoleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardRoleService]
    });
  });

  it('should be created', inject([GuardRoleService], (service: GuardRoleService) => {
    expect(service).toBeTruthy();
  }));
});
