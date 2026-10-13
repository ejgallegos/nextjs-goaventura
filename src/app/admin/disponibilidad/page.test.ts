import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../lib/auth/availability-server', () => ({ getAvailabilitySession: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('./availability-dashboard', () => ({ AvailabilityDashboard: () => null }));

import { getAvailabilitySession } from '../../../lib/auth/availability-server';
import { redirect } from 'next/navigation';
import AvailabilityPage from './page';

describe('availability page authorization boundary', () => {
  it('redirects an unauthenticated or invalid session before rendering protected UI', async () => {
    vi.mocked(getAvailabilitySession).mockResolvedValue(null);
    await AvailabilityPage();
    expect(redirect).toHaveBeenCalledWith('/admin/disponibilidad/login');
  });
});
