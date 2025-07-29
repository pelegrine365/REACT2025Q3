import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

vi.mock('react-dom/client', () => ({
  createRoot: (el: HTMLElement) => ({
    render: () => {
      el.innerHTML = '<div>AppMock</div>';
    },
  }),
}));

describe('main.tsx', () => {
  let root: HTMLDivElement;
  beforeEach(() => {
    root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
  });
  afterEach(() => {
    document.body.innerHTML = '';
    vi.resetModules();
  });

  it('renders App inside root element', async () => {
    await import('./main');
    expect(document.body.innerHTML).toContain('AppMock');
  });

  it('throws if root element not found', async () => {
    const originalGetElementById = document.getElementById;
    document.getElementById = () => null;
    vi.resetModules();
    await expect(import('./main')).rejects.toThrow('Root element not found');
    document.getElementById = originalGetElementById;
  });
});
