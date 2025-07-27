import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TwoColumnLayout from '../TwoColumnLayout';

describe('TwoColumnLayout', () => {
  it('renders left column content', () => {
    const leftContent = <div>Left Column Content</div>;
    const rightContent = <div>Right Column Content</div>;

    render(
      <TwoColumnLayout
        leftColumn={leftContent}
        rightColumn={rightContent}
        isDetailOpen={false}
      />
    );

    expect(screen.getByText('Left Column Content')).toBeInTheDocument();
  });

  it('does not render right column when isDetailOpen is false', () => {
    const leftContent = <div>Left Column Content</div>;
    const rightContent = <div>Right Column Content</div>;

    render(
      <TwoColumnLayout
        leftColumn={leftContent}
        rightColumn={rightContent}
        isDetailOpen={false}
      />
    );

    expect(screen.queryByText('Right Column Content')).not.toBeInTheDocument();
  });

  it('renders both columns when isDetailOpen is true', () => {
    const leftContent = <div>Left Column Content</div>;
    const rightContent = <div>Right Column Content</div>;

    render(
      <TwoColumnLayout
        leftColumn={leftContent}
        rightColumn={rightContent}
        isDetailOpen={true}
      />
    );

    expect(screen.getByText('Left Column Content')).toBeInTheDocument();
    expect(screen.getByText('Right Column Content')).toBeInTheDocument();
  });

  it('applies correct CSS classes based on isDetailOpen', () => {
    const leftContent = <div>Left Column Content</div>;
    const rightContent = <div>Right Column Content</div>;

    const { container, rerender } = render(
      <TwoColumnLayout
        leftColumn={leftContent}
        rightColumn={rightContent}
        isDetailOpen={false}
      />
    );

    expect(container.firstChild).toHaveClass('two-column-layout');
    expect(container.firstChild).not.toHaveClass('detail-open');

    rerender(
      <TwoColumnLayout
        leftColumn={leftContent}
        rightColumn={rightContent}
        isDetailOpen={true}
      />
    );

    expect(container.firstChild).toHaveClass(
      'two-column-layout',
      'detail-open'
    );
  });
});
